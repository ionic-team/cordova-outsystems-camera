import { require } from 'cordova';
import { GalleryOptions, MediaResult, PhotoEditOptions, PlayVideoOptions, PluginError, RecordVideoOptions, TakePhotoOptions } from './definitions';

const exec = require('cordova/exec');

function takePhoto(options: TakePhotoOptions, success: (output: MediaResult) => void, error: (error: PluginError) => void): void {
  exec(success, error, 'OSCameraPlugin', 'takePhoto', [options]);
}

function chooseFromGallery(options: GalleryOptions, success: (output: MediaResult[]) => void, error: (error: PluginError) => void): void {
  exec(success, error, 'OSCameraPlugin', 'chooseFromGallery', [options]);
}

function pickLimitedGallery(options: GalleryOptions, success: (output: MediaResult[]) => void, error: (error: PluginError) => void): void {
  exec(success, error, 'OSCameraPlugin', 'pickLimitedGallery', [options]);
}

function chooseFromLimitedGallery(options: GalleryOptions, success: (output: MediaResult[]) => void, error: (error: PluginError) => void): void {
    exec(success, error, 'OSCameraPlugin', 'chooseFromLimitedGallery', [options ]);
}

function editPhoto(options: PhotoEditOptions, success: (output: MediaResult) => void, error: (error: PluginError) => void): void {
  exec(success, error, 'OSCameraPlugin', 'editPhoto', [options]);
}

function recordVideo(options: RecordVideoOptions, success: (output: MediaResult) => void, error: (error: PluginError) => void): void {
  exec(success, error, 'OSCameraPlugin', 'recordVideo', [options]);
}

function playVideo(options: PlayVideoOptions, success: () => void, error: (error: PluginError) => void): void {
    exec(success, error, 'OSCameraPlugin', 'playVideo', [options]);
} 

module.exports = {
    takePhoto,
    chooseFromGallery,
    pickLimitedGallery,
    chooseFromLimitedGallery,
    editPhoto,
    recordVideo,
    playVideo
};
