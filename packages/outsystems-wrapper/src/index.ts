import {
    GalleryOptions,
    MediaResult,
    EditURIPhotoOptions,
    PlayVideoOptions,
    PluginError,
    RecordVideoOptions,
    TakePhotoOptions,
    EditPhotoOptions,
    EditPhotoResult
} from "../../cordova-plugin/src/definitions";
import { checkIfPWA, isUnifiedPluginDefined, isCapacitorPluginDefined } from "./helpers";

class OSCameraPlugin {

    takePhoto(
        success: (result: MediaResult) => void,
        error: (err: PluginError) => void,
        options: TakePhotoOptions
    ): void {
        if (checkIfPWA(error)) {
            return;  // PWA implementation is outside this wrapper's scope
        }

        if (isUnifiedPluginDefined()) {
            let directionInteger: any = options.cameraDirection as any;
            if (directionInteger == 1) {
                options.cameraDirection = 'FRONT';
            } else {
                options.cameraDirection = 'REAR';
            }
            if (isCapacitorPluginDefined()) {
                // @ts-ignore
                window.CapacitorPlugins.Camera.takePhoto(options)
                    .then(success)
                    .catch(error);
            } else {
                // @ts-ignore
                cordova.plugins.Camera.takePhoto(options, success, error);
            }
        } else {
            let correctedLegacyOptions: any = options;
            correctedLegacyOptions.saveToPhotoAlbum = options.saveToGallery;
            correctedLegacyOptions.latestVersion = true;
            // @ts-ignore
            if (typeof (Camera) !== "undefined") {
                // @ts-ignore
                correctedLegacyOptions.destinationType = Camera.DestinationType.DATA_URL;
                // @ts-ignore
                correctedLegacyOptions.source = Camera.PictureSourceType.CAMERA;
            }
            // @ts-ignore
            navigator.camera.takePicture(success, error, correctedLegacyOptions);
        }
    }

    chooseFromGallery(
        success: (result: any) => void,
        error: (err: PluginError) => void,
        options: GalleryOptions
    ): void {
        if (checkIfPWA(error)) {
            return;  // PWA implementation is outside this wrapper's scope
        }
        let successCallbackWithMapping = (output: any) => {
            if (typeof output === "string") {
                let processedOutput: any = output;
                try {
                    processedOutput = JSON.parse(output);
                    // check if processedOutput is an array, if not, assume it's an object with a results field that contains the array
                    if (Array.isArray(processedOutput)) {
                        // output should already be a Media Result array, no processing required
                        success(output);
                    } else {
                        // for unified plugins, the MediaResult array comes inside an object
                        if (processedOutput.results && Array.isArray(processedOutput.results)) {
                            const unifiedOutput = JSON.stringify(processedOutput.results);
                            success(unifiedOutput);
                        } else {
                            success(output); // edge-case - not expected to land here unless output is miscontructed from native
                        }
                    }
                } catch (e) {
                    success(output); // edge-case - not expected to land here unless output is miscontructed from native
                }
            } else {
                success(output);  // edge-case - not expected to land here unless output is miscontructed from native
            }
        }

        if (isUnifiedPluginDefined()) {
            if (isCapacitorPluginDefined()) {
                // @ts-ignore
                window.CapacitorPlugins.Camera.chooseFromGallery(options)
                    .then(successCallbackWithMapping)
                    .catch(error);
            } else {
                // @ts-ignore
                cordova.plugins.Camera.chooseFromGallery(options, successCallbackWithMapping, error);
            }
        } else {
            // @ts-ignore
            navigator.camera.chooseFromGallery(successCallbackWithMapping, error, options);
        }
    }

    editPhoto(
        success: (imageData: any) => void,
        error: (err: PluginError) => void,
        input: { image: string }
    ): void {
        if (checkIfPWA(error)) {
            return;  // PWA implementation is outside this wrapper's scope
        }

        if (isUnifiedPluginDefined()) {
            let unifiedSuccessCallback = (result: EditPhotoResult) => {
                if (typeof result === "string") {
                    try {
                        const processedResult: any = JSON.parse(result);
                        if (processedResult.outputImage) {
                            success(processedResult.outputImage);
                        } else {
                            success(result); // edge-case - not expected to land here unless output is miscontructed from native
                        }
                    } catch (e) {
                        success(result);// edge-case - not expected to land here unless output is miscontructed from native
                    }
                } else {
                    success(result.outputImage); // edge-case - not expected to land here unless output is miscontructed from native
                }
            }
            let options: EditPhotoOptions = {
                inputImage: input.image
            }
            if (isCapacitorPluginDefined()) {
                // @ts-ignore
                window.CapacitorPlugins.Camera.editPhoto(options)
                    .then(unifiedSuccessCallback)
                    .catch(error);
            } else {
                // @ts-ignore
                cordova.plugins.Camera.editPhoto(options, unifiedSuccessCallback, error);
            }
        } else {
            // @ts-ignore
            navigator.camera.editPicture(success, error, input);
        }
    }

    editURIPhoto(
        success: (result: MediaResult) => void,
        error: (err: PluginError) => void,
        options: EditURIPhotoOptions
    ): void {
        if (checkIfPWA(error)) {
            return;  // PWA implementation is outside this wrapper's scope
        }

        if (isUnifiedPluginDefined()) {
            if (isCapacitorPluginDefined()) {
                // @ts-ignore
                window.CapacitorPlugins.Camera.editURIPhoto(options)
                    .then(success)
                    .catch(error);
            } else {
                // @ts-ignore
                cordova.plugins.Camera.editURIPhoto(options, success, error);
            }
        } else {
            let correctedLegacyOptions: any = options;
            correctedLegacyOptions.saveToPhotoAlbum = options.saveToGallery;
            // @ts-ignore
            navigator.camera.editURIPicture(success, error, correctedLegacyOptions);
        }
    }

    recordVideo(
        success: (result: MediaResult) => void,
        error: (err: PluginError) => void,
        options: RecordVideoOptions
    ): void {
        if (checkIfPWA(error)) {
            return;  // PWA implementation is outside this wrapper's scope
        }

        if (isUnifiedPluginDefined()) {
            if (isCapacitorPluginDefined()) {
                // @ts-ignore
                window.CapacitorPlugins.Camera.recordVideo(options)
                    .then(success)
                    .catch(error);
            } else {
                // @ts-ignore
                cordova.plugins.Camera.recordVideo(options, success, error);
            }
        } else {
            let correctedLegacyOptions: any = options;
            correctedLegacyOptions.saveToPhotoAlbum = options.saveToGallery;
            // @ts-ignore
            navigator.camera.recordVideo(success, error, correctedLegacyOptions);
        }
    }

    playVideo(
        success: () => void,
        error: (err: PluginError) => void,
        options: PlayVideoOptions
    ): void {
        if (checkIfPWA(error)) {
            return;  // PWA implementation is outside this wrapper's scope
        }

        if (isUnifiedPluginDefined()) {
            if (isCapacitorPluginDefined()) {
                // @ts-ignore
                window.CapacitorPlugins.Camera.playVideo(options)
                    .then(success)
                    .catch(error);
            } else {
                // @ts-ignore
                cordova.plugins.Camera.playVideo(options, success, error);
            }
        } else {
            // @ts-ignore
            navigator.camera.playVideo(success, error, options);
        }
    }
}

export const Instance = new OSCameraPlugin();