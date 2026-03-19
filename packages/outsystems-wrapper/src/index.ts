import {
  GalleryOptions,
  MediaResult,
  PhotoEditOptions,
  PlayVideoOptions,
  PluginError,
  RecordVideoOptions,
  TakePhotoOptions
} from "../../cordova-plugin/src/definitions";
import { checkIfPWA, isUnifiedPluginDefined } from "./helpers";

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
      // TODO call unified wrapper
    } else {
      // @ts-ignore
      navigator.camera.takePicture(success, error, options);
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
    options: PhotoEditOptions
  ): void {
    if (checkIfPWA(error)) {
      return;  // PWA implementation is outside this wrapper's scope
    }

    if (isUnifiedPluginDefined()) {
      // TODO call unified wrapper
    } else {
      // @ts-ignore
      navigator.camera.editURIPicture(success, error, options);
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
      // @ts-ignore
      navigator.camera.recordVideo(success, error, options);
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