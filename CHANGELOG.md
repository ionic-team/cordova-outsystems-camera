# [2.1.0](https://github.com/ionic-team/cordova-outsystems-camera/compare/2.0.0...2.1.0) (2026-09-09)


### Features

* **ios:** add Swift Package Manager support ([#22](https://github.com/ionic-team/cordova-outsystems-camera/issues/22)) ([9768b2e](https://github.com/ionic-team/cordova-outsystems-camera/commit/9768b2ee151a084f7f68d12805e93af70de3919e))

# [2.0.0](https://github.com/ionic-team/cordova-outsystems-camera/compare/1.0.3...2.0.0) (2026-09-01)


### Features

* **ios:** bump ion-ios-camera to 2.0.0 ([#21](https://github.com/ionic-team/cordova-outsystems-camera/issues/21)) ([7e1a4f7](https://github.com/ionic-team/cordova-outsystems-camera/commit/7e1a4f7ea9a67f43ffe014553c4f7207568b1b68))


### BREAKING CHANGES

* **ios:** the minimum supported iOS version is now 15.0. Apps
with a deployment target of iOS 14 can no longer install this plugin.

## [1.0.3](https://github.com/ionic-team/cordova-outsystems-camera/compare/1.0.2...1.0.3) (2026-07-30)


### Bug Fixes

* **ios:** bump ion-ios-camera to 1.0.5 for iOS 27 UIScene compliance ([#19](https://github.com/ionic-team/cordova-outsystems-camera/issues/19)) ([8364a3e](https://github.com/ionic-team/cordova-outsystems-camera/commit/8364a3e9901d52d1b576b08250785d324a6caccb))

## [1.0.2](https://github.com/ionic-team/cordova-outsystems-camera/compare/1.0.1...1.0.2) (2026-07-08)


### Bug Fixes

* **android:** bump ioncamera-android to 1.0.2 for Android 18 URI grant fix ([#18](https://github.com/ionic-team/cordova-outsystems-camera/issues/18)) ([65c3eb6](https://github.com/ionic-team/cordova-outsystems-camera/commit/65c3eb6555a1de77308d8e838e9350ae0dbc5ad8))

## [1.0.1](https://github.com/ionic-team/cordova-outsystems-camera/compare/1.0.0...1.0.1) (2026-06-19)

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
