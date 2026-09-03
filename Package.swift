// swift-tools-version:5.9
import PackageDescription

let package = Package(
    name: "com.outsystems.plugins.camera",
    platforms: [
        .iOS(.v15)
    ],
    products: [
        .library(
            name: "com.outsystems.plugins.camera",
            targets: ["OSCameraPlugin"]
        )
    ],
    dependencies: [
        .package(url: "https://github.com/apache/cordova-ios.git", from: "8.0.0"),
        .package(url: "https://github.com/ionic-team/ion-ios-camera.git", exact: "2.0.0")
    ],
    targets: [
        .target(
            name: "OSCameraPlugin",
            dependencies: [
                .product(name: "Cordova", package: "cordova-ios"),
                .product(name: "IONCameraLib", package: "ion-ios-camera")
            ],
            path: "packages/cordova-plugin/ios"
        )
    ]
)
