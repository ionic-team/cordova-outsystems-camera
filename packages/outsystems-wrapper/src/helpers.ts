import { PluginError } from "../../cordova-plugin/src/definitions";

/**
 * Checks if the application is running as an OutSystems Progressive Web App (PWA) instead of a native app.
 * If in PWA, will also return an error in the provided callback
 * @returns true if OutSystems PWA, false otherwise
 */
export function checkIfPWA(error: (err: PluginError) => void): boolean {
  let isPWA = !isCapacitorPluginDefined() && !isAnyCordovaPluginDefined();
  if (isPWA) {
    error({
      code: "OS-PLUG-CAMR-0028",
      message: "Cordova / Capacitor is not available."
    });
  }
  return isPWA;
}

/**
 * Checks if the unified plugin exists, meaning either there's the Capacitor plugin or the new Cordova plugin.
 * @returns true if a unified plugin exists, false otherwise
 */
export function isUnifiedPluginDefined(): boolean {
  return isCapacitorPluginDefined() || isNewCordovaPluginDefined();
}

/**
 * Checks if the Capacitor plugin is defined.
 * @returns true if window.CapacitorPlugins.OSCameraPlugin exists
 */
export function isCapacitorPluginDefined(): boolean {
  // @ts-ignore
  return (typeof(window) !== "undefined" && typeof(window.CapacitorPlugins) !== "undefined" && typeof(window.CapacitorPlugins.Camera) !== "undefined")
}

/**
 * Checks if there is a Cordova plugin defined, either the new one or the legacy one.
 * @returns true if there's a cordova plugin defined, false otherwise
 */
export function isAnyCordovaPluginDefined(): boolean {
  return isNewCordovaPluginDefined() || isLegacyCordovaPluginDefined();
}

/**
 * Checks if the new Cordova plugin is defined.
 * @returns true if cordova.plugins.OSCameraPlugin exists
 */
export function isNewCordovaPluginDefined(): boolean {
  // @ts-ignore
  return (typeof(cordova) !== "undefined" && typeof(cordova.plugins) !== "undefined" && typeof(cordova.plugins.Camera) !== "undefined")
}

/**
 * Checks if the legacy Cordova plugin is defined.
 * Old Cordova Plugin repo: https://github.com/OutSystems/cordova-plugin-camera
 * @returns true if cordova and navigator.camera exists
 */
export function isLegacyCordovaPluginDefined(): boolean {
  // @ts-ignore
  return typeof(cordova) !== "undefined" && typeof(navigator)!== "undefined" && typeof(navigator.camera)!== "undefined"
}
