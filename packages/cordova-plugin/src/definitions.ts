export interface Resolution {
    /**
     * The width of the media file in pixels.
     * @since 1.0.0
     */
    width: number;
    /**
     * The height of the media file in pixels.
     * @since 1.0.0
     */
    height: number;
}

export interface MediaMetadata {
    /**
     * The size of the media file in bytes. This indicates how large the file is on disk, which can be useful for managing storage or determining if the file meets certain size requirements.
     * @since 1.0.0
     */
    size: number;
    /**
     * The duration of the video in milliseconds. This is only applicable for video media.
     * @since 1.0.0
     */
    duration?: number;
    /**
     * The format of the media file, e.g., 'jpeg' for images or 'mp4' for videos.
     * @since 1.0.0
     */
    format: string;
    /**
     * The resolution of the media file, represented as an object containing the width and height in pixels.
     * This is applicable for both photos and videos, indicating the dimensions of the media content.
     * @since 1.0.0
     */
    resolution: Resolution;
    /**
     * The date and time when the media file was created.
     * @since 1.0.0
     */
    creationDate: Date;
}

export interface MediaResult {
    
    /** The type of media captured or selected: 'photo' or 'video'.
     * @since 1.0.0
     */
    type: 'photo' | 'video';

    /**
     * The URI of the captured or selected media file. This is a string that represents the location of the media file on the device, which can be used to access or display the media content.
     * @since 1.0.0
     */
    uri: string

    /**
     * A base64-encoded thumbnail image representing the media, if available.
     * For photos, this may be a smaller version of the captured image. For videos, this may be a thumbnail generated from the video content.
     * @since 1.0.0
     */
    thumbnail?: string;

    /**
     * Metadata about the captured or selected media, including file size, format, resolution, and creation date.
     * @since 1.0.0
     */
    metadata: MediaMetadata;

    /**
     * Whether the media was saved to the photo album on the device (if applicable).
     * This will be true if the media was saved to the photo album, and false if it was not saved (e.g., if it is only stored in a temporary cache location).
     * @since 1.0.0
     */
    saved: boolean; // whether the media was saved to the photo album (if applicable)
}

export interface TakePhotoOptions {
    /**
     * The quality of image to return as JPEG, from 0-100. Default is 50.
     * @default 50
     * @since 1.0.0
     */
    quality?: number;
 
    /**
     * Whether to allow the user to crop or make small edits (platform specific).
     * @since 1.0.0
     */
    allowEditing?: boolean;

    /**
     * The encoding type of the returned image file. Default is 'jpeg'.
     *
     * @default 'jpeg'
     * @since 1.0.0
     */
    encodingType?: 'jpeg' | 'png';

    /**
     * The width to scale the image to, in pixels. Must be used with targetHeight. Aspect ratio remains constant.
     * @since 1.0.0
     */
    targetWidth?: number;
    
    /**
     * The height to scale the image to, in pixels. Must be used with targetWidth. Aspect ratio remains constant.
     * @since 1.0.0
     */
    targetHeight?: number;

    /**
     * The camera to use (front- or back-facing). Default is 'rear'.
     * @default 'rear'
     * @since 1.0.0
     */
    cameraDirection?: 'front' | 'rear';

    /**
     * Whether to rotate the image to correct for the orientation of the device during capture. Default is false.
     * @default false
     * @since 1.0.0
     */
    correctOrientation?: boolean;

    /**
     * Whether to save the image to the gallery on the device after capture. Default is false.
     * @default false
     * @since 1.0.0
     */
    saveToGallery?: boolean;
}

export interface GalleryOptions {

    /**
     * The type of media to select from the gallery: 'photo', 'video', or 'all'.
     * @since 1.0.0
     */
    mediaType?: 'photo' | 'video' | 'all';

    /**
      * Whether to allow the user to select multiple media files from the gallery. Default is false (only single selection allowed).
      * @default false
      * @since 1.0.0
      */
    allowMultipleSelection?: boolean;

    /**
     * Whether to include metadata in the MediaResult object for each selected media file. Default is true.
     * If false, the metadata property in MediaResult will be null or undefined, and only the result (file URI, base64 string, or data URI) will be returned.
     * @default true
     * @since 1.0.0
     */
    includeMetadata?: boolean; // whether to include metadata in the MediaResult (default: true)
}

export interface PhotoEditOptions {
    /**
     * The URI of the photo to edit. This is a string that represents the location of the photo on the device, which can be used to access or display the photo content.
     * @since 1.0.0
     */
    uri: string;
    /**
     * Whether to save the edited photo to the gallery. Default is false.
     * @default false
     * @since 1.0.0
     */
    saveToGallery?: boolean; 
    /**
     * Whether to include metadata in the MediaResult. Default is true.
     * @default true
     * @since 1.0.0
     */
    includeMetadata?: boolean;
}

export interface RecordVideoOptions {
    /**
     * Whether to save the recorded video to the gallery. Default is false.
     * @default false
     * @since 1.0.0
     */
    saveToGallery?: boolean;
    /**
     * Whether to include metadata in the MediaResult. Default is true.
     * @default true
     * @since 1.0.0
     */
    includeMetadata?: boolean;
}

export interface PlayVideoOptions {
    /**
     * The URL of the video to play. This is a string that represents the location of the video on the device.
     * @since 1.0.0
     */
    url: string;
}

export interface PluginError {
    /**
     * Code identifying the error: OS-PLUG-CAMR-XXXX
     * @since 1.0.0
     */
    code: string;

    /**
     * Message describing the error.
     * @since 1.0.0
     */
    message: string;

    /**
     * Exception message thrown on native side (if available)
     * @since 1.0.0
     */
    exception?: string;
}

/** 
 * Only available in Native Android and iOS; not available for Web / PWAs.
 */
export interface ICamera {
    
    /**
     * Captures a photo using the device's camera.
     * @param options Options to customize the photo capture process.
     * @returns A promise that resolves with the media result containing the captured photo's details.
     * @since 1.0.0
     */
    takePhoto(options: TakePhotoOptions): Promise<MediaResult>;

    /**
     * Opens the device's photo gallery to allow the user to select one or more photos.
     * @param options Options to customize the gallery selection process.
     * @returns A promise that resolves with an array of media results for the selected photos.
     * @since 1.0.0
     */
    chooseFromGallery(options: GalleryOptions): Promise<MediaResult[]>;

    /**
     * Opens the device's limited photo gallery to allow the user to select one or more photos.
     * @param options Options to customize the limited gallery selection process.
     * @returns A promise that resolves with an array of media results for the selected photos.
     * @since 1.0.0
     */
    pickLimitedGallery(options: GalleryOptions): Promise<MediaResult[]>;

    /**
     * Opens the device's limited photo gallery to allow the user to select one or more photos.
     * @param options Options to customize the limited gallery selection process.
     * @returns A promise that resolves with an array of media results for the selected photos.
     * @since 1.0.0
     */
    chooseFromLimitedGallery(options: GalleryOptions): Promise<MediaResult[]>;

    /**
     * Opens the photo editor to allow the user to edit a photo.
     * @param options Options to customize the photo editing process.
     * @returns A promise that resolves with the edited photo's details.
     * @since 1.0.0
     */
    editPhoto(options: PhotoEditOptions): Promise<MediaResult>;

    /**
     * Records a video using the device's camera.
     * @param options Options to customize the video recording process.
     * @returns A promise that resolves with the media result containing the recorded video's details.
     * @since 1.0.0
     */
    recordVideo(options: RecordVideoOptions): Promise<MediaResult>;
}
