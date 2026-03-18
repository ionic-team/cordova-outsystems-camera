(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global.OSCameraPluginWrapper = {}));
})(this, function(exports2) {
  "use strict";
  function checkIfPWA(error) {
    let isPWA = !isCapacitorPluginDefined() && !isAnyCordovaPluginDefined();
    if (isPWA) {
      error({
        code: "OS-PLUG-CAMR-0028",
        message: "Cordova / Capacitor is not available."
      });
    }
    return isPWA;
  }
  function isUnifiedPluginDefined() {
    return isCapacitorPluginDefined() || isNewCordovaPluginDefined();
  }
  function isCapacitorPluginDefined() {
    return typeof window !== "undefined" && typeof window.CapacitorPlugins !== "undefined" && typeof window.CapacitorPlugins.Camera !== "undefined";
  }
  function isAnyCordovaPluginDefined() {
    return isNewCordovaPluginDefined() || isLegacyCordovaPluginDefined();
  }
  function isNewCordovaPluginDefined() {
    return typeof cordova !== "undefined" && typeof cordova.plugins !== "undefined" && typeof cordova.plugins.Camera !== "undefined";
  }
  function isLegacyCordovaPluginDefined() {
    return typeof cordova !== "undefined" && typeof navigator !== "undefined" && typeof navigator.camera !== "undefined";
  }
  class OSCameraPlugin {
    takePhoto(success, error, options) {
      if (checkIfPWA(error)) {
        return;
      }
      if (isUnifiedPluginDefined()) ;
      else {
        navigator.camera.takePicture(success, error, options);
      }
    }
    chooseFromGallery(success, error, options) {
      if (checkIfPWA(error)) {
        return;
      }
      if (isUnifiedPluginDefined()) ;
      else {
        navigator.camera.chooseFromGallery(success, error, options);
      }
    }
    editPhoto(success, error, input) {
      if (checkIfPWA(error)) {
        return;
      }
      if (isUnifiedPluginDefined()) ;
      else {
        navigator.camera.editPicture(success, error, input);
      }
    }
    editURIPhoto(success, error, options) {
      if (checkIfPWA(error)) {
        return;
      }
      if (isUnifiedPluginDefined()) ;
      else {
        navigator.camera.editURIPicture(success, error, options);
      }
    }
    recordVideo(success, error, options) {
      if (checkIfPWA(error)) {
        return;
      }
      if (isUnifiedPluginDefined()) ;
      else {
        navigator.camera.recordVideo(success, error, options);
      }
    }
    playVideo(success, error, options) {
      if (checkIfPWA(error)) {
        return;
      }
      if (isUnifiedPluginDefined()) ;
      else {
        navigator.camera.playVideo(success, error, options);
      }
    }
  }
  const Instance = new OSCameraPlugin();
  exports2.Instance = Instance;
  Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
});
