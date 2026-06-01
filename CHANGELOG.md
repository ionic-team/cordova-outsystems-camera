## [1.0.1]

### 2026-04-27

#### Android

- Fix: gallery multiple selection returning duplicate `uri` and `webPath` when the MediaStore `_data` column is unavailable.

#### iOS

- Fix: SwiftUI crash on iOS 15/16 caused by strong-link to SwiftUICore.
- Fix: `presentationStyle` option now correctly applied in `chooseFromGallery`.

## [1.0.0]

### 2026-04-10
- Add implementation for `takePhoto`, `recordVideo`, `chooseFromGallery`, `editPhoto`, `editURIPhoto` and `playVideo` on both Android and iOS.
- Add OutSystems Wrapper of Capacitor / Cordova plugin for ODC and O11.
