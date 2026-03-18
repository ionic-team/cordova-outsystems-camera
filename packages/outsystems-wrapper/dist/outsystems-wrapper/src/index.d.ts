import { GalleryOptions, MediaResult, PhotoEditOptions, PlayVideoOptions, PluginError, RecordVideoOptions, TakePhotoOptions } from '../../cordova-plugin/src/definitions';
declare class OSCameraPlugin {
    takePhoto(success: (result: MediaResult) => void, error: (err: PluginError) => void, options: TakePhotoOptions): void;
    chooseFromGallery(success: (result: MediaResult[]) => void, error: (err: PluginError) => void, options: GalleryOptions): void;
    editPhoto(success: (imageData: any) => void, error: (err: PluginError) => void, input: {
        image: string;
    }): void;
    editURIPhoto(success: (result: MediaResult) => void, error: (err: PluginError) => void, options: PhotoEditOptions): void;
    recordVideo(success: (result: MediaResult) => void, error: (err: PluginError) => void, options: RecordVideoOptions): void;
    playVideo(success: () => void, error: (err: PluginError) => void, options: PlayVideoOptions): void;
}
export declare const Instance: OSCameraPlugin;
export {};
