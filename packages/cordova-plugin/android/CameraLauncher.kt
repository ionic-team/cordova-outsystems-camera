/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
*/
package org.apache.cordova.camera

import android.Manifest
import android.app.Activity
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.database.Cursor
import android.media.MediaScannerConnection
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.provider.MediaStore
import android.util.Log
import androidx.activity.result.ActivityResult
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.content.FileProvider
import com.google.gson.GsonBuilder
import io.ionic.libs.ioncameralib.manager.OSCAMRController
import io.ionic.libs.ioncameralib.manager.CameraManager
import io.ionic.libs.ioncameralib.manager.VideoManager
import io.ionic.libs.ioncameralib.manager.GalleryManager
import io.ionic.libs.ioncameralib.manager.EditManager
import io.ionic.libs.ioncameralib.helper.IONExifHelper
import io.ionic.libs.ioncameralib.helper.IONFileHelper
import io.ionic.libs.ioncameralib.helper.IONImageHelper
import io.ionic.libs.ioncameralib.helper.IONMediaHelper
import io.ionic.libs.ioncameralib.model.IONEditParameters
import io.ionic.libs.ioncameralib.model.IONError
import io.ionic.libs.ioncameralib.model.IONMediaType
import io.ionic.libs.ioncameralib.model.IONCameraParameters
import io.ionic.libs.ioncameralib.model.IONMediaResult
import io.ionic.libs.ioncameralib.processor.IONMediaProcessor
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import org.apache.cordova.CallbackContext
import org.apache.cordova.CordovaPlugin
import org.apache.cordova.LOG
import org.apache.cordova.PermissionHelper
import org.apache.cordova.PluginResult
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject
import java.io.IOException

/**
 * This class launches the camera view, allows the user to take a picture, closes the camera view,
 * and returns the captured image.  When the camera view is closed, the screen displayed before
 * the camera view was shown is redisplayed.
 */
class CameraLauncher : CordovaPlugin() {
    private var mQuality // Compression quality hint (0-100: 0=low quality & high compression, 100=compress of max quality)
            = 0
    private var targetWidth // desired width of the image
            = 0
    private var targetHeight // desired height of the image
            = 0
    private var imageUri // Uri of captured image
            : Uri? = null
    private var imageFilePath // File where the image is stored
            : String? = null
    private var encodingType // Type of encoding to use
            = 0
    private var mediaType // What type of media to retrieve
            = 0
    private var destType // Source type (needs to be saved for the permission handling)
            = 0
    private var srcType // Destination type (needs to be saved for permission handling)
            = 0
    private var saveToPhotoAlbum // Should the picture be saved to the device's photo album
            = false
    private var correctOrientation // Should the pictures orientation be corrected
            = false
    private var allowEdit // Should we allow the user to crop the image.
            = false
    private var saveVideoToGallery =
        false // Should we allow the user to save the video in the gallery
    private var includeMetadata =
        false // Should we allow the app to obtain metadata about the media item
    private var latestVersion =
        false // Used to distinguish between the deprecated and latest version
    private var editParameters = IONEditParameters(
        editURI = "", fromUri = false, saveToGallery = false, includeMetadata = false
    )
    var callbackContext: CallbackContext? = null
    private var numPics = 0
    private var conn // Used to update gallery app with newly-written files
            : MediaScannerConnection? = null
    private var scanMe // Uri of image to be added to content store
            : Uri? = null
    private var croppedUri: Uri? = null
    private var croppedFilePath: String? = null

    private lateinit var applicationId: String
    private var pendingDeleteMediaUri: Uri? = null
    private var camController: OSCAMRController? = null
    private var cameraManager: CameraManager? = null
    private var videoManager: VideoManager? = null
    private var galleryManager: GalleryManager? = null


    private var editManager: EditManager? = null

    private var camParameters: IONCameraParameters? = null

    private var galleryMediaType: IONMediaType = IONMediaType.ALL
    private var galleryAllowMultipleSelection: Boolean = false
    private var galleryAllowEdit: Boolean = false
    private var galleryIncludeMetadata: Boolean = false

    private lateinit var cameraLauncher: ActivityResultLauncher<Intent>
    private lateinit var cameraCropLauncher: ActivityResultLauncher<Intent>
    private lateinit var galleryCropLauncher: ActivityResultLauncher<Intent>
    private lateinit var editLauncher: ActivityResultLauncher<Intent>
    private lateinit var videoLauncher: ActivityResultLauncher<Intent>
    private lateinit var galleryLauncher: ActivityResultLauncher<Intent>

    override fun pluginInitialize() {
        super.pluginInitialize()
        setupLaunchers()
        applicationId = cordova.activity.packageName

        camController = OSCAMRController(
            applicationId,
            IONExifHelper(),
            IONFileHelper(),
            IONMediaHelper(),
            IONImageHelper()
        )

        cameraManager = CameraManager(
            applicationId,
            ".camera.provider",
            IONExifHelper(),
            IONFileHelper(),
            IONMediaHelper(),
            IONImageHelper()
        )

        videoManager = VideoManager(
            ".camera.provider",
            IONFileHelper(),
        )

        galleryManager = GalleryManager(
            IONExifHelper(),
            IONFileHelper(),
            IONMediaHelper(),
            IONImageHelper()
        )

        editManager = EditManager(
            applicationId,
            ".camera.provider",
            IONExifHelper(),
            IONFileHelper(),
            IONMediaHelper(),
            IONImageHelper()
        )

        cameraManager?.deleteVideoFilesFromCache(cordova.activity)
    }

    override fun onDestroy() {
        super.onDestroy()
        cameraManager?.deleteVideoFilesFromCache(cordova.activity)
    }

    /**
     * Executes the request and returns PluginResult.
     *
     * @param action            The action to execute.
     * @param args              JSONArray of arguments for the plugin.
     * @param callbackContext   The callback id used when calling back into JavaScript.
     * @return                  A PluginResult object with a status and message.
     */
    @Throws(JSONException::class)
    override fun execute(
        action: String, args: JSONArray, callbackContext: CallbackContext
    ): Boolean {
        this.callbackContext = callbackContext

        /**
         * Fix for the OutSystems NativeShell
         * The com.outsystems.myapp.BuildConfig class from BuildHelper.getBuildConfigValue is only created when using the cordova to build our app,
         * since we do not use cordova to build our app, we must add this condition to ensure that the applicationId is not null.
         * TODO: Remove this condition when we start to use cordova build command to build our applications.
         */
        if (applicationId == null) applicationId = cordova.activity.packageName

        when (action) {
            "takePicture" -> handlePhoto(args, isLegacy = true)
            "takePhoto" -> handlePhoto(args, isLegacy = false)
            "editPicture" -> callEditImage(args)
            "editURIPicture" -> {
                editParameters = IONEditParameters(
                    args.getJSONObject(0).getString(URI),
                    true,
                    args.getJSONObject(0).getBoolean(SAVE_TO_GALLERY),
                    args.getJSONObject(0).getBoolean(INCLUDE_METADATA)
                )
                callEditUriImage(editParameters)
            }

            "recordVideo" -> {
                saveVideoToGallery = args.getJSONObject(0).getBoolean(SAVE_TO_GALLERY)
                includeMetadata = args.getJSONObject(0).getBoolean(INCLUDE_METADATA)
                callCaptureVideo(saveVideoToGallery)
            }

            "chooseFromGallery" -> callChooseFromGalleryWithPermissions(args)
            "playVideo" -> callPlayVideo(args)
            else -> return false
        }
        return true
    }// Create the cache directory if it doesn't exist

    private fun handlePhoto(args: JSONArray, isLegacy: Boolean): Boolean {
        val parameters = args.getJSONObject(0)
        //Take the values from the arguments if they're not already defined (this is tricky)
        mQuality = parameters.getInt(QUALITY)
        targetWidth = parameters.optInt(WIDTH, -1)
        targetHeight = parameters.optInt(HEIGHT, -1)
        encodingType = parameters.getInt(ENCODING_TYPE)
        allowEdit = parameters.getBoolean(ALLOW_EDIT)
        correctOrientation = parameters.getBoolean(CORRECT_ORIENTATION)
        saveToPhotoAlbum = parameters.getBoolean(SAVE_TO_ALBUM)
        destType = parameters.getInt(DEST_TYPE)
        srcType = parameters.getInt(SOURCE_TYPE)
        mediaType = parameters.getInt(MEDIA_TYPE)
        includeMetadata = parameters.optBoolean(INCLUDE_METADATA, false)
        latestVersion = parameters.optBoolean(LATEST_VERSION, false)

        // If the user specifies a 0 or smaller width/height
        // make it -1 so later comparisons succeed
        if (targetWidth < 1) {
            targetWidth = -1
        }
        if (targetHeight < 1) {
            targetHeight = -1
        }

        // We don't return full-quality PNG files. The camera outputs a JPEG
        // so requesting it as a PNG provides no actual benefit
        if (targetHeight == -1 && targetWidth == -1 && mQuality == 100 && !correctOrientation && encodingType == PNG && srcType == CAMERA) {
            encodingType = JPEG
        }

        //create CameraParameters
        camParameters = IONCameraParameters(
            mQuality,
            targetWidth,
            targetHeight,
            encodingType,
            mediaType,
            allowEdit,
            correctOrientation,
            saveToPhotoAlbum,
            includeMetadata,
            latestVersion
        )

        try {
            if (srcType == CAMERA) {
                if (isLegacy) {
                    callTakePicture(destType, encodingType)
                } else {
                    callTakePhoto(encodingType)
                }
            } else if (srcType == PHOTOLIBRARY || srcType == SAVEDPHOTOALBUM) {
                callGetImage(srcType, destType, encodingType)
            }
        } catch (e: IllegalArgumentException) {
            callbackContext?.error("Illegal Argument Exception")
            val r = PluginResult(PluginResult.Status.ERROR)
            callbackContext?.sendPluginResult(r)
            return true
        }
        val r = PluginResult(PluginResult.Status.NO_RESULT)
        r.keepCallback = true
        callbackContext?.sendPluginResult(r)
        return true
    }

    private fun setupLaunchers() {
        setupCameraLauncher()
        setupCameraCropLauncher()
        setupEditLauncher()
        setupVideoLauncher()
        setupGalleryLauncher()
        setupGalleryCropLauncher()
    }

    private fun setupCameraLauncher() {
        cameraLauncher = cordova.activity.registerForActivityResult(
            ActivityResultContracts.StartActivityForResult()
        ) { result ->
            handleCameraResult(result)
        }
    }

    private fun setupCameraCropLauncher() {
        cameraCropLauncher = cordova.activity.registerForActivityResult(
            ActivityResultContracts.StartActivityForResult()
        ) { result ->
            handleCameraCropResult(result)
        }
    }

    private fun setupVideoLauncher() {
        videoLauncher = cordova.activity.registerForActivityResult(
            ActivityResultContracts.StartActivityForResult()
        ) { result ->
            handleVideoResult(result)
        }
    }

    private fun setupEditLauncher() {
        editLauncher = cordova.activity.registerForActivityResult(
            ActivityResultContracts.StartActivityForResult()
        ) { result ->
            handleEditResult(result)
        }
    }

    private fun setupGalleryLauncher() {
        galleryLauncher = cordova.activity.registerForActivityResult(
            ActivityResultContracts.StartActivityForResult()
        ) { result ->
            handleGalleryResult(result)
        }
    }

    private fun setupGalleryCropLauncher() {
        galleryCropLauncher = cordova.activity.registerForActivityResult(
            ActivityResultContracts.StartActivityForResult()
        ) { result ->
            handleGalleryCropResult(result)
        }
    }

    private fun handleCameraResult(result: ActivityResult) {
        when (result.resultCode) {
            Activity.RESULT_OK -> {
                if (allowEdit) {
                    editPhoto()
                } else {
                    processResult()
                }
            }

            Activity.RESULT_CANCELED -> {
                sendError(IONError.NO_PICTURE_TAKEN_ERROR)
            }

            else -> {
                sendError(IONError.TAKE_PHOTO_ERROR)
            }
        }
    }

    private fun handleCameraCropResult(result: ActivityResult) {
        when (result.resultCode) {
            Activity.RESULT_OK -> processResult()
            Activity.RESULT_CANCELED -> sendError(IONError.EDIT_OPERATION_CANCELLED_ERROR)
            else -> sendError(IONError.EDIT_IMAGE_ERROR)
        }
    }

    private fun handleEditResult(result: ActivityResult) {
        when (result.resultCode) {
            Activity.RESULT_OK -> processResultFromEdit(result)
            Activity.RESULT_CANCELED -> sendError(IONError.EDIT_OPERATION_CANCELLED_ERROR)
            else -> sendError(IONError.EDIT_IMAGE_ERROR)
        }
    }

    private fun handleVideoResult(result: ActivityResult) {
        when (result.resultCode) {
            Activity.RESULT_OK -> {
                processResultFromVideo(result)
            }

            Activity.RESULT_CANCELED -> {
                sendError(IONError.CAPTURE_VIDEO_CANCELLED_ERROR)
            }

            else -> sendError(IONError.CAPTURE_VIDEO_ERROR)
        }
    }

    private fun handleGalleryResult(result: ActivityResult) {
        when (result.resultCode) {
            Activity.RESULT_OK -> {

                val manager = galleryManager ?: run {
                    sendError(IONError.CONTEXT_ERROR)
                    return
                }

                val uris = manager.extractUris(result.data)

                if (uris.isEmpty()) {
                    sendError(IONError.GENERIC_CHOOSE_MULTIMEDIA_ERROR)
                    return
                }

                if (galleryAllowEdit && uris.size == 1 && galleryMediaType == IONMediaType.PICTURE) {
                    manager.openCropActivity(
                        cordova.activity,
                        uris.first(),
                        galleryCropLauncher
                    )
                } else {
                    processResultFromGallery(result)
                }
            }

            Activity.RESULT_CANCELED -> {
                sendError(IONError.CHOOSE_MULTIMEDIA_CANCELLED_ERROR)
            }

            else -> sendError(IONError.GENERIC_CHOOSE_MULTIMEDIA_ERROR)
        }
    }

    private fun handleGalleryCropResult(result: ActivityResult) {
        when (result.resultCode) {
            Activity.RESULT_OK -> {
                CoroutineScope(Dispatchers.Default).launch {
                    galleryManager!!.onChooseFromGalleryEditResult(
                        cordova.activity,
                        result.resultCode,
                        result.data,
                        galleryIncludeMetadata,
                        { sendSuccessfulResult(it) },
                        { sendError(it) })
                }
            }

            Activity.RESULT_CANCELED -> sendError(IONError.EDIT_OPERATION_CANCELLED_ERROR)
            else -> sendError(IONError.EDIT_IMAGE_ERROR)
        }
    }

    private fun editPhoto() {
        val manager = cameraManager ?: run {
            sendError(IONError.CONTEXT_ERROR)
            return
        }

        val tmpFile = FileProvider.getUriForFile(
            cordova.activity, "$applicationId.camera.provider", manager.createCaptureFile(
                cordova.activity, encodingType, cordova.activity.getSharedPreferences(
                    STORE, Context.MODE_PRIVATE
                ).getString(EDIT_FILE_NAME_KEY, "") ?: ""
            )
        )
        manager.openCropActivity(
            cordova.activity, tmpFile, cameraCropLauncher
        )
    }

    private fun processResult() {
        try {
            val manager = cameraManager ?: run {
                sendError(IONError.CONTEXT_ERROR)
                return
            }

            camParameters?.let { params ->
                manager.processResultFromCamera(cordova.activity, params, {
                    handleBase64(it)
                }, { mediaResult ->
                    handleMediaResult(mediaResult)
                }, {
                    sendError(it)
                })
            }
        } catch (e: Exception) {
            sendError(IONError.PROCESS_IMAGE_ERROR)
        }
    }

    private fun processResultFromEdit(result: ActivityResult) {
        try {
            val manager = editManager ?: run {
                sendError(IONError.CONTEXT_ERROR)
                return
            }

            editParameters?.let { params ->
                manager.processResultFromEdit(cordova.activity, result.data, params, {
                    handleBase64(it)
                }, { mediaResult ->
                    handleMediaResult(mediaResult)
                }, {
                    sendError(it)
                })
            }
        } catch (e: Exception) {
            sendError(IONError.PROCESS_IMAGE_ERROR)
        }
    }

    private fun handleBase64(base64: String) {
        val pluginResult = PluginResult(PluginResult.Status.OK, base64)
        this.callbackContext?.sendPluginResult(pluginResult)
        this.callbackContext = null
    }

    private fun handleMediaResult(mediaResult: IONMediaResult) {
        sendSuccessfulResult(mediaResult)
    }

    private fun processResultFromVideo(result: ActivityResult) {
        var uri = result.data?.data
        if (uri == null) {
            val fromPreferences =
                cordova.activity.getSharedPreferences(STORE, Context.MODE_PRIVATE)
                    .getString(STORE, "")
            fromPreferences.let { uri = Uri.parse(fromPreferences) }
        }
        if (cordova.activity == null) {
            sendError(IONError.CAPTURE_VIDEO_ERROR)
            return
        }

        CoroutineScope(Dispatchers.Default).launch {
            cameraManager?.processResultFromVideo(
                cordova.activity,
                uri,
                saveVideoToGallery,
                includeMetadata,
                { mediaResult ->
                    val gson = GsonBuilder().create()
                    val resultJson = gson.toJson(mediaResult)
                    val pluginResult = PluginResult(PluginResult.Status.OK, resultJson)
                    callbackContext?.sendPluginResult(pluginResult)
                },
                {
                    sendError(IONError.CAPTURE_VIDEO_ERROR)
                })
        }
    }

    private fun processResultFromGallery(result: ActivityResult) {

        val manager = galleryManager ?: run {
            sendError(IONError.CONTEXT_ERROR)
            return
        }

        CoroutineScope(Dispatchers.Default).launch {
            manager.onChooseFromGalleryResult(
                cordova.activity,
                result.resultCode,
                result.data,
                galleryIncludeMetadata,
                { sendSuccessfulResult(it) },
                { sendError(it) })
        }
    }

    //--------------------------------------------------------------------------
    // LOCAL METHODS
    //--------------------------------------------------------------------------
    private val tempDirectoryPath: String
        get() {
            val cache = cordova.activity.cacheDir
            // Create the cache directory if it doesn't exist
            cache.mkdirs()
            return cache.absolutePath
        }

    /**
     * Take a picture with the camera.
     * When an image is captured or the camera view is cancelled, the result is returned
     * in CordovaActivity.onActivityResult, which forwards the result to this.onActivityResult.
     *
     * The image can either be returned as a base64 string or a URI that points to the file.
     * To display base64 string in an img tag, set the source to:
     * img.src="data:image/jpeg;base64,"+result;
     * or to display URI in an img tag
     * img.src=result;
     *
     * @param returnType        Set the type of image to return.
     * @param encodingType           Compression quality hint (0-100: 0=low quality & high compression, 100=compress of max quality)
     */
    fun callTakePhoto(encodingType: Int) {
        // we don't want to ask for these permissions from Android 11 onwards
        val saveAlbumPermission =
            Build.VERSION.SDK_INT >= 30 || !saveToPhotoAlbum || (PermissionHelper.hasPermission(
                this, Manifest.permission.READ_EXTERNAL_STORAGE
            ) && PermissionHelper.hasPermission(
                this, Manifest.permission.WRITE_EXTERNAL_STORAGE
            ))

        val takePhotoPermission = PermissionHelper.hasPermission(
            this, Manifest.permission.CAMERA
        ) || !hasCameraPermissionDeclared()

        if (takePhotoPermission && saveAlbumPermission) { // no permissions need to be requested
            cameraManager?.takePhoto(cordova.activity, encodingType, cameraLauncher)
        } else if (saveAlbumPermission) { // we need to request camera permissions
            PermissionHelper.requestPermission(this, TAKE_PIC_SEC, Manifest.permission.CAMERA)
        } else if (takePhotoPermission) { // we need to request storage permissions
            PermissionHelper.requestPermissions(
                this, TAKE_PIC_SEC, arrayOf(
                    Manifest.permission.READ_EXTERNAL_STORAGE,
                    Manifest.permission.WRITE_EXTERNAL_STORAGE
                )
            )
        } else { // we need to request both permissions
            PermissionHelper.requestPermissions(this, TAKE_PIC_SEC, permissions)
        }
    }

    /**
     * Take a picture with the camera.
     * When an image is captured or the camera view is cancelled, the result is returned
     * in CordovaActivity.onActivityResult, which forwards the result to this.onActivityResult.
     *
     * The image can either be returned as a base64 string or a URI that points to the file.
     * To display base64 string in an img tag, set the source to:
     * img.src="data:image/jpeg;base64,"+result;
     * or to display URI in an img tag
     * img.src=result;
     *
     * @param returnType        Set the type of image to return.
     * @param encodingType           Compression quality hint (0-100: 0=low quality & high compression, 100=compress of max quality)
     */
    fun callTakePicture(returnType: Int, encodingType: Int) {

        // we don't want to ask for these permissions from Android 11 onwards
        val saveAlbumPermission = Build.VERSION.SDK_INT >= 30 || !saveToPhotoAlbum ||
                (PermissionHelper.hasPermission(this, Manifest.permission.READ_EXTERNAL_STORAGE) &&
                        PermissionHelper.hasPermission(
                            this,
                            Manifest.permission.WRITE_EXTERNAL_STORAGE
                        ))

        val takePicturePermission =
            PermissionHelper.hasPermission(this, Manifest.permission.CAMERA) ||
                    !hasCameraPermissionDeclared()

        if (takePicturePermission && saveAlbumPermission) { // no permissions need to be requested
            cordova.setActivityResultCallback(this)
            camController?.takePicture(cordova.activity, returnType, encodingType)
        } else if (saveAlbumPermission) { // we need to request camera permissions
            PermissionHelper.requestPermission(this, TAKE_PIC_SEC, Manifest.permission.CAMERA)
        } else if (takePicturePermission) { // we need to request storage permissions
            PermissionHelper.requestPermissions(
                this,
                TAKE_PIC_SEC,
                arrayOf(
                    Manifest.permission.READ_EXTERNAL_STORAGE,
                    Manifest.permission.WRITE_EXTERNAL_STORAGE
                )
            )
        } else { // we need to request both permissions
            PermissionHelper.requestPermissions(this, TAKE_PIC_SEC, permissions)
        }
    }

    /**
     * Get image from photo library.
     *
     * @param srcType           The album to get image from.
     * @param returnType        Set the type of image to return.
     * @param encodingType
     */
    fun callGetImage(srcType: Int, returnType: Int, encodingType: Int) {
        // we don't want to ask for this permission from Android 11 onwards
        if (Build.VERSION.SDK_INT < 30 && !PermissionHelper.hasPermission(
                this,
                Manifest.permission.READ_EXTERNAL_STORAGE
            )
        ) {
            PermissionHelper.requestPermission(
                this,
                SAVE_TO_ALBUM_SEC,
                Manifest.permission.READ_EXTERNAL_STORAGE
            )
        }
        // we don't want to ask for this permission from Android 13 onwards
        else {
            camParameters?.let {
                cordova.setActivityResultCallback(this)
                camController?.getImage(this.cordova.activity, srcType, returnType, it)
            }
        }
    }

    fun callEditImage(args: JSONArray) {
        editParameters = IONEditParameters(
            "",
            fromUri = false,
            saveToGallery = false,
            includeMetadata = false
        )
        val imageBase64 = args.getString(0)
        editManager?.editImage(cordova.activity, imageBase64, editLauncher)
    }

    fun callEditUriImage(editParameters: IONEditParameters) {
        // we don't want to ask for these permissions from Android 11 onwards
        val galleryPermissionNeeded = Build.VERSION.SDK_INT < 30 &&
                (!PermissionHelper.hasPermission(this, Manifest.permission.READ_EXTERNAL_STORAGE) ||
                        (editParameters.saveToGallery && !PermissionHelper.hasPermission(
                            this,
                            Manifest.permission.WRITE_EXTERNAL_STORAGE
                        )))

        if (galleryPermissionNeeded) {
            var permissions = arrayOf(Manifest.permission.READ_EXTERNAL_STORAGE)
            if (editParameters.saveToGallery) {
                permissions += Manifest.permission.WRITE_EXTERNAL_STORAGE
            }
            PermissionHelper.requestPermissions(
                this,
                EDIT_PICTURE_SEC,
                permissions
            )
            return
        }

        if (editParameters.editURI.isNullOrEmpty()) {
            sendError(IONError.EDIT_PICTURE_EMPTY_URI_ERROR)
            return
        }
        editManager?.editURIPicture(cordova.activity, editParameters.editURI!!, editLauncher) {
            sendError(it)
        }
    }

    fun callCaptureVideo(saveVideoToGallery: Boolean) {

        val cameraPermissionNeeded = !PermissionHelper.hasPermission(
            this, Manifest.permission.CAMERA
        ) && hasCameraPermissionDeclared()

        // we don't want to ask for these permissions from Android 11 onwards
        val galleryPermissionNeeded =
            Build.VERSION.SDK_INT < 30 && saveVideoToGallery && !(PermissionHelper.hasPermission(
                this, Manifest.permission.READ_EXTERNAL_STORAGE
            ) && PermissionHelper.hasPermission(
                this, Manifest.permission.WRITE_EXTERNAL_STORAGE
            ))

        if (cameraPermissionNeeded && galleryPermissionNeeded) {
            PermissionHelper.requestPermissions(this, CAPTURE_VIDEO_SEC, permissions)
            return
        } else if (cameraPermissionNeeded) {
            PermissionHelper.requestPermission(
                this, CAPTURE_VIDEO_SEC, Manifest.permission.CAMERA
            )
            return
        } else if (galleryPermissionNeeded) {
            PermissionHelper.requestPermissions(
                this, CAPTURE_VIDEO_SEC, arrayOf(
                    Manifest.permission.READ_EXTERNAL_STORAGE,
                    Manifest.permission.WRITE_EXTERNAL_STORAGE
                )
            )
            return
        }

        cameraManager?.recordVideo(cordova.activity, saveVideoToGallery, videoLauncher) {
            sendError(it)
        }
    }

    /**
     * Calls the "Choose from gallery" method and the relevant permissions to access the gallery.
     * @param args A Json array containing the parameters for "Choose from gallery".
     */
    fun callChooseFromGalleryWithPermissions(args: JSONArray) {

        try {
            val parameters = args.getJSONObject(0)
            galleryMediaType = IONMediaType.fromValue(parameters.getInt(MEDIA_TYPE))
            galleryAllowMultipleSelection = parameters.getBoolean(ALLOW_MULTIPLE)
            galleryIncludeMetadata = parameters.getBoolean(INCLUDE_METADATA)
            galleryAllowEdit = parameters.getBoolean(ALLOW_EDIT)
        } catch (_: Exception) {
            sendError(IONError.GENERIC_CHOOSE_MULTIMEDIA_ERROR)
            return
        }

        // we don't want to ask for this permission from Android 11 onwards
        if (Build.VERSION.SDK_INT < 30
            && !PermissionHelper.hasPermission(this, Manifest.permission.READ_EXTERNAL_STORAGE)
        ) {

            PermissionHelper.requestPermission(
                this,
                CHOOSE_FROM_GALLERY_PERMISSION_CODE,
                Manifest.permission.READ_EXTERNAL_STORAGE
            )
        } else {
            callChooseFromGallery()
        }
    }

    /**
     * Calls the "Choose from gallery" method.
     */
    private fun callChooseFromGallery() {
        galleryManager?.chooseFromGallery(
            this.cordova.activity,
            galleryMediaType,
            galleryAllowMultipleSelection,
            galleryLauncher
        )
    }

    /**
     * Calls the "Play Video" method.
     * @param args A Json array containing the parameters for the feature.
     */
    private fun callPlayVideo(args: JSONArray) {
        try {
            val videoUri = args.getJSONObject(0).getString(VIDEO_URI)
            videoManager?.playVideo(cordova.activity, videoUri, {
                sendSuccessfulResult("")
            }, {
                sendError(it)
            })
        } catch (_: Exception) {
            sendError(IONError.PLAY_VIDEO_GENERAL_ERROR)
            return
        }
    }

    /**
     * Called when the camera view exits.
     *
     * @param requestCode The request code originally supplied to startActivityForResult(),
     * allowing you to identify who this result came from.
     * @param resultCode  The integer result code returned by the child activity through its setResult().
     * @param intent      An Intent, which can return result data to the caller (various data can be attached to Intent "extras").
     */
    override fun onActivityResult(requestCode: Int, resultCode: Int, intent: Intent?) {
        val srcType = requestCode / 16 - 1
        var destType = requestCode % 16 - 1
        if (requestCode == CROP_GALERY) {
            if (resultCode == Activity.RESULT_OK) {
                editParameters.fromUri = false
                camController?.processResultFromEdit(
                    cordova.activity, intent, editParameters,
                    {
                        callbackContext?.success(it)
                    },
                    {
                        // do nothing, because this callback shouldn't be called in this case
                    },
                    {
                        sendError(IONError.EDIT_IMAGE_ERROR)
                    })
            } else if (resultCode == Activity.RESULT_CANCELED) {
                sendError(IONError.NO_IMAGE_SELECTED_ERROR)
            } else {
                sendError(IONError.EDIT_IMAGE_ERROR)
            }
        } else if (requestCode >= CROP_CAMERA) {
            if (resultCode == Activity.RESULT_OK) {

                // Because of the inability to pass through multiple intents, this hack will allow us
                // to pass arcane codes back.
                destType = requestCode - CROP_CAMERA
                try {
                    camParameters?.let { it ->
                        camController?.processResultFromCamera(
                            cordova.activity,
                            intent,
                            it,
                            { image ->
                                val pluginResult = PluginResult(PluginResult.Status.OK, image)
                                this.callbackContext?.sendPluginResult(pluginResult)
                            },
                            { mediaResult ->
                                val gson = GsonBuilder().create()
                                val resultJson = gson.toJson(mediaResult)
                                val pluginResult = PluginResult(PluginResult.Status.OK, resultJson)
                                callbackContext?.sendPluginResult(pluginResult)
                            },
                            { error ->
                                sendError(error)
                            }
                        )
                    }
                } catch (e: IOException) {
                    e.printStackTrace()
                    LOG.e(LOG_TAG, "Unable to write to file")
                }
            } // If cancelled
            else if (resultCode == Activity.RESULT_CANCELED) {
                sendError(IONError.NO_PICTURE_TAKEN_ERROR)
            } else {
                sendError(IONError.EDIT_IMAGE_ERROR)
            }
        } else if (srcType == CAMERA) {
            // If image available
            if (resultCode == Activity.RESULT_OK) {
                try {
                    if (allowEdit && camController != null) {
                        val tmpFile = FileProvider.getUriForFile(
                            cordova.activity,
                            "$applicationId.camera.provider",
                            camController!!.createCaptureFile(
                                cordova.activity,
                                encodingType,
                                cordova.activity.getSharedPreferences(
                                    STORE,
                                    Context.MODE_PRIVATE
                                ).getString(EDIT_FILE_NAME_KEY, "") ?: ""
                            )
                        )
                        cordova.setActivityResultCallback(this)
                        camController?.openCropActivity(
                            cordova.activity,
                            tmpFile,
                            CROP_CAMERA,
                            destType
                        )
                    } else {
                        camParameters?.let { params ->
                            camController?.processResultFromCamera(
                                cordova.activity,
                                intent,
                                params,
                                {
                                    val pluginResult = PluginResult(PluginResult.Status.OK, it)
                                    this.callbackContext?.sendPluginResult(pluginResult)
                                },
                                { mediaResult ->
                                    val gson = GsonBuilder().create()
                                    val resultJson = gson.toJson(mediaResult)
                                    val pluginResult =
                                        PluginResult(PluginResult.Status.OK, resultJson)
                                    callbackContext?.sendPluginResult(pluginResult)
                                },
                                {
                                    val pluginResult =
                                        PluginResult(PluginResult.Status.ERROR, it.toString())
                                    this.callbackContext?.sendPluginResult(pluginResult)
                                }
                            )
                        }
                    }
                } catch (e: IOException) {
                    e.printStackTrace()
                    sendError(IONError.TAKE_PHOTO_ERROR)
                }
            } else if (resultCode == Activity.RESULT_CANCELED) {
                sendError(IONError.NO_PICTURE_TAKEN_ERROR)
            } else {
                sendError(IONError.TAKE_PHOTO_ERROR)
            }
        } else if (srcType == PHOTOLIBRARY || srcType == SAVEDPHOTOALBUM) {
            if (resultCode == Activity.RESULT_OK && intent != null) {
                if (allowEdit) {
                    cordova.setActivityResultCallback(this)
                    val uri = intent.data
                    camController?.openCropActivity(cordova.activity, uri, CROP_GALERY, destType)
                } else {
                    cordova.threadPool.execute {
                        camParameters?.let { params ->
                            camController?.processResultFromGallery(
                                this.cordova.activity,
                                intent,
                                params,
                                {
                                    val pluginResult = PluginResult(PluginResult.Status.OK, it)
                                    this.callbackContext?.sendPluginResult(pluginResult)
                                },
                                {
                                    val pluginResult =
                                        PluginResult(PluginResult.Status.ERROR, it.toString())
                                    this.callbackContext?.sendPluginResult(pluginResult)
                                })
                        }
                    }
                }
            } else if (resultCode == Activity.RESULT_CANCELED) {
                sendError(IONError.NO_IMAGE_SELECTED_ERROR)
            } else {
                sendError(IONError.GET_IMAGE_ERROR)
            }
        }
    }


    /**
     * Creates a cursor that can be used to determine how many images we have.
     *
     * @return a cursor
     */
    private fun queryImgDB(contentStore: Uri): Cursor? {
        return cordova.activity.contentResolver.query(
            contentStore, arrayOf(MediaStore.Images.Media._ID), null, null, null
        )
    }

    override fun onRequestPermissionResult(
        requestCode: Int, permissions: Array<String>, grantResults: IntArray
    ) {
        for (i in grantResults.indices) {
            if (grantResults[i] == PackageManager.PERMISSION_DENIED && permissions[i] == Manifest.permission.CAMERA) {
                sendError(IONError.CAMERA_PERMISSION_DENIED_ERROR)
                return
            } else if (grantResults[i] == PackageManager.PERMISSION_DENIED && (Build.VERSION.SDK_INT < 33 && (permissions[i] == Manifest.permission.READ_EXTERNAL_STORAGE || permissions[i] == Manifest.permission.WRITE_EXTERNAL_STORAGE))) {
                sendError(IONError.GALLERY_PERMISSION_DENIED_ERROR)
                return
            }
        }
        when (requestCode) {
            TAKE_PIC_SEC -> {
                cameraManager?.takePhoto(this.cordova.activity, encodingType, cameraLauncher)
            }

            SAVE_TO_ALBUM_SEC -> callGetImage(srcType, destType, encodingType)
            CAPTURE_VIDEO_SEC -> callCaptureVideo(saveVideoToGallery)
            CHOOSE_FROM_GALLERY_PERMISSION_CODE -> callChooseFromGallery()
            EDIT_PICTURE_SEC -> callEditUriImage(editParameters)
        }
    }

    /**
     * Taking or choosing a picture launches another Activity, so we need to implement the
     * save/restore APIs to handle the case where the CordovaActivity is killed by the OS
     * before we get the launched Activity's result.
     */
    override fun onSaveInstanceState(): Bundle {
        val state = Bundle()
        state.putInt("destType", destType)
        state.putInt("srcType", srcType)
        state.putInt("mQuality", mQuality)
        state.putInt("targetWidth", targetWidth)
        state.putInt("targetHeight", targetHeight)
        state.putInt("encodingType", encodingType)
        state.putInt("mediaType", mediaType)
        state.putInt("numPics", numPics)
        state.putBoolean("allowEdit", allowEdit)
        state.putBoolean("correctOrientation", correctOrientation)
        state.putBoolean("saveToPhotoAlbum", saveToPhotoAlbum)
        if (croppedUri != null) {
            state.putString(CROPPED_URI_KEY, croppedFilePath)
        }
        if (imageUri != null) {
            state.putString(IMAGE_URI_KEY, imageFilePath)
        }
        if (imageFilePath != null) {
            state.putString(IMAGE_FILE_PATH_KEY, imageFilePath)
        }
        return state
    }

    override fun onRestoreStateForActivityResult(state: Bundle, callbackContext: CallbackContext) {
        destType = state.getInt("destType")
        srcType = state.getInt("srcType")
        mQuality = state.getInt("mQuality")
        targetWidth = state.getInt("targetWidth")
        targetHeight = state.getInt("targetHeight")
        encodingType = state.getInt("encodingType")
        mediaType = state.getInt("mediaType")
        numPics = state.getInt("numPics")
        allowEdit = state.getBoolean("allowEdit")
        correctOrientation = state.getBoolean("correctOrientation")
        saveToPhotoAlbum = state.getBoolean("saveToPhotoAlbum")
        if (state.containsKey(CROPPED_URI_KEY)) {
            croppedUri = Uri.parse(state.getString(CROPPED_URI_KEY))
        }
        if (state.containsKey(IMAGE_URI_KEY)) {
            //I have no idea what type of URI is being passed in
            imageUri = Uri.parse(state.getString(IMAGE_URI_KEY))
        }
        if (state.containsKey(IMAGE_FILE_PATH_KEY)) {
            imageFilePath = state.getString(IMAGE_FILE_PATH_KEY)
        }
        this.callbackContext = callbackContext
    }

    /**
     * Sends a successful result to cordova.
     * @param result The result data to be sent to cordova.
     */
    private fun sendSuccessfulResult(result: Any) {
        val gson = GsonBuilder().create()
        val resultJson = gson.toJson(result)
        val pluginResult = PluginResult(PluginResult.Status.OK, resultJson)
        this.callbackContext?.sendPluginResult(pluginResult)
        this.callbackContext = null
    }

    private fun sendError(error: IONError) {
        val jsonResult = JSONObject()
        try {
            jsonResult.put("code", formatErrorCode(error.code))
            jsonResult.put("message", error.description)
            callbackContext?.error(jsonResult)
        } catch (e: JSONException) {
            LOG.d(LOG_TAG, "Error: JSONException occurred while preparing to send an error.")
            callbackContext?.error("There was an error performing the operation.")
        } finally {
            callbackContext = null
        }
    }

    private fun formatErrorCode(code: Int): String {
        val stringCode = Integer.toString(code)
        return ERROR_FORMAT_PREFIX + "0000$stringCode".substring(stringCode.length)
    }

    private fun hasCameraPermissionDeclared(): Boolean {
        // CB-10120: The CAMERA permission does not need to be requested unless it is declared
        // in AndroidManifest.xml -> If it's declared, Media Store intents will throw SecurityException if permission is not granted
        // This plugin does not declare it, but others may and so we must check the package info to determine if the permission is present.
        try {
            val packageManager = cordova.activity.packageManager
            val permissionsInPackage = packageManager.getPackageInfo(
                cordova.activity.packageName, PackageManager.GET_PERMISSIONS
            ).requestedPermissions ?: arrayOf()
            for (permission in permissionsInPackage) {
                if (permission == Manifest.permission.CAMERA) {
                    return true
                }
            }
        } catch (e: Exception) {
            Log.d(LOG_TAG, e.message.toString())
        }
        return false
    }

    companion object {
        private const val FILE_URI =
            1 // Return file uri (content://media/external/images/media/2 for Android)
        private const val PHOTOLIBRARY =
            0 // Choose image from picture library (same as SAVEDPHOTOALBUM for Android)
        private const val CAMERA = 1 // Take picture from camera
        private const val SAVEDPHOTOALBUM =
            2 // Choose image from picture library (same as PHOTOLIBRARY for Android)
        private const val RECOVERABLE_DELETE_REQUEST = 3 // Result of Recoverable Security Exception
        private const val PICTURE =
            0 // allow selection of still pictures only. DEFAULT. Will return format specified via DestinationType
        private const val JPEG = 0 // Take a picture of type JPEG
        private const val PNG = 1 // Take a picture of type PNG
        private const val CROPPED_URI_KEY = "croppedUri"
        private const val IMAGE_URI_KEY = "imageUri"
        private const val IMAGE_FILE_PATH_KEY = "imageFilePath"
        private const val TAKE_PIC_SEC = 0
        private const val SAVE_TO_ALBUM_SEC = 1
        private const val CAPTURE_VIDEO_SEC = 2
        private const val EDIT_PICTURE_SEC = 3

        private const val LOG_TAG = "CameraLauncher"

        //Where did this come from?
        private const val CROP_CAMERA = 100
        private const val CROP_GALERY = 666

        //for errors
        private const val ERROR_FORMAT_PREFIX = "OS-PLUG-CAMR-"
        protected val permissions = createPermissionArray()

        private const val STORE = "CameraStore"
        private const val EDIT_FILE_NAME_KEY = "EditFileName"
        private const val VIDEO_URI = "videoURI"
        private const val SAVE_TO_GALLERY = "saveToGallery"
        private const val INCLUDE_METADATA = "includeMetadata"
        private const val LATEST_VERSION = "latestVersion"
        private const val ALLOW_MULTIPLE = "allowMultipleSelection"
        private const val MEDIA_TYPE = "mediaType"
        private const val URI = "uri"

        //take picture json
        private const val QUALITY = "quality"
        private const val WIDTH = "targetWidth"
        private const val HEIGHT = "targetHeight"
        private const val ENCODING_TYPE = "encodingType"
        private const val ALLOW_EDIT = "allowEdit"
        private const val CORRECT_ORIENTATION = "correctOrientation"
        private const val SAVE_TO_ALBUM = "saveToPhotoAlbum"
        private const val SOURCE_TYPE = "sourceType"
        private const val DEST_TYPE = "destinationType"

        private const val CHOOSE_FROM_GALLERY_REQUEST_CODE = 869456849
        private const val CHOOSE_FROM_GALLERY_PERMISSION_CODE = 869454849

        private fun createPermissionArray(): Array<String> {
            return if (Build.VERSION.SDK_INT < 33) {
                arrayOf(
                    Manifest.permission.CAMERA,
                    Manifest.permission.READ_EXTERNAL_STORAGE,
                    Manifest.permission.WRITE_EXTERNAL_STORAGE
                )
            }
            // we don't want to request READ_MEDIA_IMAGES and READ_MEDIA_VIDEO for Android >= 13
            else {
                arrayOf(
                    Manifest.permission.CAMERA
                )
            }
        }
    }
}