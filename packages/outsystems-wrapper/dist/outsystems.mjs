function checkIfPWA(error) {
  let isPWA = !isCapacitorPluginDefined() && !isAnyCordovaPluginDefined();
  if (isPWA) {
    error({
      code: "OS-PLUG-CAMR-0022",
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
    if (isUnifiedPluginDefined()) {
      let directionInteger = options.cameraDirection;
      if (directionInteger == 1) {
        options.cameraDirection = "FRONT";
      } else {
        options.cameraDirection = "REAR";
      }
      if (isCapacitorPluginDefined()) {
        const capacitorSuccessCallback = (result) => {
          if (typeof result === "string") {
            success(result);
          } else {
            success(JSON.stringify(result));
          }
        };
        window.CapacitorPlugins.Camera.takePhoto(options).then(capacitorSuccessCallback).catch(error);
      } else {
        cordova.plugins.Camera.takePhoto(options, success, error);
      }
    } else {
      let correctedLegacyOptions = options;
      correctedLegacyOptions.saveToPhotoAlbum = options.saveToGallery;
      correctedLegacyOptions.latestVersion = true;
      if (typeof Camera !== "undefined") {
        correctedLegacyOptions.destinationType = Camera.DestinationType.DATA_URL;
        correctedLegacyOptions.source = Camera.PictureSourceType.CAMERA;
      }
      navigator.camera.takePicture(success, error, correctedLegacyOptions);
    }
  }
  chooseFromGallery(success, error, options) {
    if (checkIfPWA(error)) {
      return;
    }
    let successCallbackWithMapping = (output) => {
      if (typeof output === "string") {
        let processedOutput = output;
        try {
          processedOutput = JSON.parse(output);
          if (Array.isArray(processedOutput)) {
            success(output);
          } else {
            if (processedOutput.results && Array.isArray(processedOutput.results)) {
              const unifiedOutput = JSON.stringify(processedOutput.results);
              success(unifiedOutput);
            } else {
              success(output);
            }
          }
        } catch (e) {
          success(output);
        }
      } else {
        if (typeof output.results !== "undefined" && Array.isArray(output.results)) {
          const unifiedOutput = JSON.stringify(output.results);
          success(unifiedOutput);
        } else {
          success(output);
        }
      }
    };
    if (isUnifiedPluginDefined()) {
      if (isCapacitorPluginDefined()) {
        window.CapacitorPlugins.Camera.chooseFromGallery(options).then(successCallbackWithMapping).catch(error);
      } else {
        cordova.plugins.Camera.chooseFromGallery(options, successCallbackWithMapping, error);
      }
    } else {
      navigator.camera.chooseFromGallery(successCallbackWithMapping, error, options);
    }
  }
  editPhoto(success, error, input) {
    if (checkIfPWA(error)) {
      return;
    }
    if (isUnifiedPluginDefined()) {
      let unifiedSuccessCallback = (result) => {
        if (typeof result === "string") {
          try {
            const processedResult = JSON.parse(result);
            if (processedResult.outputImage) {
              success(processedResult.outputImage);
            } else {
              success(result);
            }
          } catch (e) {
            success(result);
          }
        } else {
          success(result.outputImage);
        }
      };
      let options = {
        inputImage: input.image
      };
      if (isCapacitorPluginDefined()) {
        window.CapacitorPlugins.Camera.editPhoto(options).then(unifiedSuccessCallback).catch(error);
      } else {
        cordova.plugins.Camera.editPhoto(options, unifiedSuccessCallback, error);
      }
    } else {
      navigator.camera.editPicture(success, error, input);
    }
  }
  editURIPhoto(success, error, options) {
    if (checkIfPWA(error)) {
      return;
    }
    if (isUnifiedPluginDefined()) {
      if (isCapacitorPluginDefined()) {
        const capacitorSuccessCallback = (result) => {
          if (typeof result === "string") {
            success(result);
          } else {
            success(JSON.stringify(result));
          }
        };
        window.CapacitorPlugins.Camera.editURIPhoto(options).then(capacitorSuccessCallback).catch(error);
      } else {
        cordova.plugins.Camera.editURIPhoto(options, success, error);
      }
    } else {
      let correctedLegacyOptions = options;
      correctedLegacyOptions.saveToPhotoAlbum = options.saveToGallery;
      navigator.camera.editURIPicture(success, error, correctedLegacyOptions);
    }
  }
  recordVideo(success, error, options) {
    if (checkIfPWA(error)) {
      return;
    }
    if (isUnifiedPluginDefined()) {
      if (isCapacitorPluginDefined()) {
        const capacitorSuccessCallback = (result) => {
          if (typeof result === "string") {
            success(result);
          } else {
            success(JSON.stringify(result));
          }
        };
        window.CapacitorPlugins.Camera.recordVideo(options).then(capacitorSuccessCallback).catch(error);
      } else {
        cordova.plugins.Camera.recordVideo(options, success, error);
      }
    } else {
      let correctedLegacyOptions = options;
      correctedLegacyOptions.saveToPhotoAlbum = options.saveToGallery;
      navigator.camera.recordVideo(success, error, correctedLegacyOptions);
    }
  }
  playVideo(success, error, options) {
    if (checkIfPWA(error)) {
      return;
    }
    if (isUnifiedPluginDefined()) {
      if (isCapacitorPluginDefined()) {
        window.CapacitorPlugins.Camera.playVideo(options).then(success).catch(error);
      } else {
        cordova.plugins.Camera.playVideo(options, success, error);
      }
    } else {
      navigator.camera.playVideo(success, error, options);
    }
  }
}
const Instance = new OSCameraPlugin();
export {
  Instance
};
