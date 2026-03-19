# Wrapper for Outsystems Camera Plugin

This a simple wrapper of the Camera Plugin, either cordova or capacitor.
Currently, it is being used by the OutSystems OML/OAP assets.

## Outsystems' Usage
1. Run npm build
```console
npm run build
```
2. Copy the resulting `./dist/outsystems.js` file to the plugin's scripts folder
3. Call the `RequireScript` client action, with the script's url
4. Call `OSCameraPluginWrapper.Instance.<method>`
