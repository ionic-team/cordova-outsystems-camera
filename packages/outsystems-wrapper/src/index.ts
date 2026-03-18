import {
  GalleryOptions,
  MediaResult,
  PhotoEditOptions,
  PlayVideoOptions,
  PluginError,
  RecordVideoOptions,
  TakePhotoOptions
} from "../../cordova-plugin/src/definitions";
import { checkIfPWA, isUnifiedPluginDefined, isLegacyCordovaPluginDefined } from "./helpers";

class OSCameraPlugin {

  takePhoto(
    options: TakePhotoOptions,
    success: (result: MediaResult) => void,
    error: (err: PluginError) => void
  ): void {
    if (checkIfPWA(error)) {
      return;  // PWA implementation is outside this wrapper's scope
    }

    if (isUnifiedPluginDefined()) {
      // TODO call unified wrapper
    } else {
      // TODO call legacy wrapper
    }
  }

  chooseFromGallery(
    options: GalleryOptions,
    success: (result: MediaResult[]) => void,
    error: (err: PluginError) => void
  ): void {
    if (checkIfPWA(error)) {
      return;  // PWA implementation is outside this wrapper's scope
    }

    if (isUnifiedPluginDefined()) {
      // TODO call unified wrapper
    } else {
      // TODO call legacy wrapper
    }
  }

  editPhoto(
    base64: string,
    success: (result: {base64: string}) => void,
    error: (err: PluginError) => void
  ): void {

  }

  editURIPhoto(
    options: PhotoEditOptions,
    success: (result: MediaResult) => void,
    error: (err: PluginError) => void
  ): void {
    if (checkIfPWA(error)) {
      return;  // PWA implementation is outside this wrapper's scope
    }

    if (isUnifiedPluginDefined()) {
      // TODO call unified wrapper
    } else {
      // TODO call legacy wrapper
    }
  }

  /**
   * Records a video using the device's camera.
   */
  recordVideo(
    options: RecordVideoOptions,
    success: (result: MediaResult) => void,
    error: (err: PluginError) => void
  ): void {
    if (checkIfPWA(error)) {
      return;  // PWA implementation is outside this wrapper's scope
    }

    if (isUnifiedPluginDefined()) {
      // TODO call unified wrapper
    } else {
      // TODO call legacy wrapper
    }
  }

  /**
   * Plays a video from the specified URL.
   */
  playVideo(
    options: PlayVideoOptions,
    success: () => void,
    error: (err: PluginError) => void
  ): void {
    if (checkIfPWA(error)) {
      return;  // PWA implementation is outside this wrapper's scope
    }

    if (isUnifiedPluginDefined()) {
      // TODO call unified wrapper
    } else {
      // TODO call legacy wrapper
    }
  }

  deprecatedTakePicture(
    options: any,
    success: (result: any) => void,
    error: (err: PluginError) => void
  ): void {
    if (checkIfPWA(error)) {
      return;  // PWA implementation is outside this wrapper's scope
    }
    // TODO - fix inputs and outputs and call plugin
  }

  deprecatedChooseGalleryPicture(
    options: any,
    success: (result: any) => void,
    error: (err: PluginError) => void
  ): void {
    if (checkIfPWA(error)) {
      return;  // PWA implementation is outside this wrapper's scope
    }
    // TODO - fix inputs and outputs and call plugin
  }
}

export const Instance = new OSCameraPlugin();