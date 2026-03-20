"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const cordova = require("cordova");
const exec = cordova.require("cordova/exec");
function takePhoto(options, success, error) {
  exec(success, error, "OSCameraPlugin", "takePhoto", [options]);
}
function chooseFromGallery(options, success, error) {
  exec(success, error, "OSCameraPlugin", "chooseFromGallery", [options]);
}
function pickLimitedGallery(options, success, error) {
  exec(success, error, "OSCameraPlugin", "pickLimitedGallery", [options]);
}
function chooseFromLimitedGallery(options, success, error) {
  exec(success, error, "OSCameraPlugin", "chooseFromLimitedGallery", [options]);
}
function editPhoto(options, success, error) {
  exec(success, error, "OSCameraPlugin", "editPhoto", [options]);
}
function editURIPhoto(options, success, error) {
  exec(success, error, "OSCameraPlugin", "editURIPhoto", [options]);
}
function recordVideo(options, success, error) {
  exec(success, error, "OSCameraPlugin", "recordVideo", [options]);
}
function playVideo(options, success, error) {
  exec(success, error, "OSCameraPlugin", "playVideo", [options]);
}
module.exports = {
  takePhoto,
  chooseFromGallery,
  pickLimitedGallery,
  chooseFromLimitedGallery,
  editPhoto,
  editURIPhoto,
  recordVideo,
  playVideo
};
var EncodingType = /* @__PURE__ */ ((EncodingType2) => {
  EncodingType2[EncodingType2["JPEG"] = 0] = "JPEG";
  EncodingType2[EncodingType2["PNG"] = 1] = "PNG";
  return EncodingType2;
})(EncodingType || {});
exports.EncodingType = EncodingType;
