(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(require("cordova")) : typeof define === "function" && define.amd ? define(["cordova"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global.cordova));
})(this, function(cordova) {
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
    recordVideo,
    playVideo
  };
});
