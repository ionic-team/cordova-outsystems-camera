import {
  GalleryOptions,
  MediaResult,
  EditURIPhotoOptions,
  PlayVideoOptions,
  PluginError,
  RecordVideoOptions,
  TakePhotoOptions
} from "../../cordova-plugin/src/definitions";
import { checkIfPWA, isUnifiedPluginDefined, isCapacitorPluginDefined } from "./helpers";

/**
 * TODO for legacy clobber
 * 
 * saveToGallery -> use saveToPhotoAlbum on legacy.
 * targetWidth and targetHeight -> make sure those work
 *     destinationType: Camera.DestinationType.DATA_URL, 
 *    sourceType : Camera.PictureSourceType.CAMERA,
 * confirm media result array still is returned correctly for chooseFromGallery 
 */

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
        
      } else {
        
      }
    } else {
      let correctedLegacyOptions: any = options;
      correctedLegacyOptions.saveToPhotoAlbum = options.saveToGallery;
      // @ts-ignore
      if (typeof(Camera) !== "undefined") {
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
    success: (result: MediaResult[]) => void,
    error: (err: PluginError) => void,
    options: GalleryOptions
  ): void {
    if (checkIfPWA(error)) {
      return;  // PWA implementation is outside this wrapper's scope
    }

    if (isUnifiedPluginDefined()) {
      // TODO call unified wrapper
    } else {
      // @ts-ignore
      navigator.camera.chooseFromGallery(success, error, options);
    }
  }

  editPhoto(
    success: (imageData: any) => void,
    error: (err: PluginError) => void,
    input: {image: string}
  ): void {
    if (checkIfPWA(error)) {
      return;  // PWA implementation is outside this wrapper's scope
    }

    if (isUnifiedPluginDefined()) {
      // TODO call unified wrapper
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
      // TODO call unified wrapper
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
      // TODO call unified wrapper
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
      // TODO call unified wrapper
    } else {
      // @ts-ignore
      navigator.camera.playVideo(success, error, options);
    }
  }
}

export const Instance = new OSCameraPlugin();