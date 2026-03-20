(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports, require("cordova")) : typeof define === "function" && define.amd ? define(["exports", "cordova"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global.OSCameraPlugin = {}, global.cordova));
})(this, function(exports2, cordova) {
  "use strict";
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
  exports2.EncodingType = EncodingType;
  Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
});
