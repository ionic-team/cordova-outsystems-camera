import { GalleryOptions, MediaResult, EditURIPhotoOptions, PlayVideoOptions, PluginError, RecordVideoOptions, TakePhotoOptions } from '../../cordova-plugin/src/definitions';
/**
 * TODO for legacy clobber
 *
 * saveToGallery -> use saveToPhotoAlbum on legacy.
 * targetWidth and targetHeight -> make sure those work
 *     destinationType: Camera.DestinationType.DATA_URL,
 *    sourceType : Camera.PictureSourceType.CAMERA,
 * confirm media result array still is returned correctly for chooseFromGallery
 */
declare class OSCameraPlugin {
    takePhoto(success: (result: MediaResult) => void, error: (err: PluginError) => void, options: TakePhotoOptions): void;
    chooseFromGallery(success: (result: MediaResult[]) => void, error: (err: PluginError) => void, options: GalleryOptions): void;
    editPhoto(success: (imageData: any) => void, error: (err: PluginError) => void, input: {
        image: string;
    }): void;
    editURIPhoto(success: (result: MediaResult) => void, error: (err: PluginError) => void, options: EditURIPhotoOptions): void;
    recordVideo(success: (result: MediaResult) => void, error: (err: PluginError) => void, options: RecordVideoOptions): void;
    playVideo(success: () => void, error: (err: PluginError) => void, options: PlayVideoOptions): void;
}
export declare const Instance: OSCameraPlugin;
export {};
