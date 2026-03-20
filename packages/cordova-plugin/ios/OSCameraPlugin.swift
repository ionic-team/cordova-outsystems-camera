import IONCameraLib

@objc(OSCameraPlugin)
class OSCameraPlugin: CDVPlugin {
    var cameraManager: IONCAMRCameraActionDelegate?
    var galleryManager: IONCAMRGalleryActionDelegate?
    var editManager: IONCAMREditActionDelegate?
    var videoManager: IONCAMRVideoActionDelegate?
    var callbackId: String = ""
    
    override func pluginInitialize() {
        self.cameraManager = IONCAMRFactory.createCameraManagerWrapper(withDelegate: self, and: self.viewController)
        self.galleryManager = IONCAMRFactory.createGalleryManagerWrapper(withDelegate: self, and: self.viewController)
        self.editManager = IONCAMRFactory.createEditManagerWrapper(withDelegate: self, and: self.viewController)
        self.videoManager = IONCAMRFactory.createVideoManagerWrapper(withDelegate: self, and: self.viewController)
    }
    
    override func onAppTerminate() {
        self.commandDelegate.run { [weak self] in
            guard let self = self else { return }
            self.cameraManager?.cleanTemporaryFiles()
        }
    }

    @objc(takePhoto:)
    func takePhoto(command: CDVInvokedUrlCommand) {
        self.callbackId = command.callbackId

        guard
            let parameters: OSCAMRTakePhotoParameters = decodeParameters(from: command),
            let options = try? IONCAMRTakePhotoOptions(from: parameters)
        else {
            return self.callback(error: .takePictureArguments)
        }
    
        self.commandDelegate.run { [weak self] in
            guard let self = self else { return }
            self.cameraManager?.takePhoto(with: options)
        }
    }
    
    @objc(chooseFromGallery:)
    func chooseFromGallery(command: CDVInvokedUrlCommand) {
        self.callbackId = command.callbackId
        
        guard let parameters: IONCAMRGalleryOptions = decodeParameters(from: command) else {
            return self.callback(error: .chooseMultimediaIssue)
        }
                
        self.commandDelegate.run { [weak self] in
            guard let self = self else { return }
            self.galleryManager?.chooseMultimedia(
                type: parameters.mediaType,
                allowMultipleSelection: parameters.allowMultipleSelection,
                returnMetadata: parameters.returnMetadata,
                allowEdit: parameters.allowEdit
            )
        }
    }
    
    @objc(editURIPhoto:)
    func editURIPhoto(command: CDVInvokedUrlCommand) {
        self.callbackId = command.callbackId
        
        guard let options: IONCAMRPhotoEditOptions = decodeParameters(from: command) else {
            return self.callback(error: .editPictureIssue)
        }
        
        self.commandDelegate.run { [weak self] in
            guard let self = self else { return }
            self.editManager?.editPhoto(with: options)
        }
    }

    @objc(editPhoto:)
    func editPhoto(command: CDVInvokedUrlCommand) {
        self.callbackId = command.callbackId
        
        guard
            let imageBase64 = command.argument(at: 0) as? String,
            let imageData = Data(base64Encoded: imageBase64),
            let image = UIImage(data: imageData)
        else {
            self.callback(error: .invalidImageData)
            return
        }
        
        self.commandDelegate.run { [weak self] in
            guard let self = self else { return }
            self.editManager?.editPhoto(image)
        }
    }
    
    @objc(recordVideo:)
    func recordVideo(command: CDVInvokedUrlCommand) {
        self.callbackId = command.callbackId
        
        guard let parameters: OSCAMRRecordVideoParameters = decodeParameters(from: command) else {
            return self.callback(error: .captureVideoIssue)
        }
        let options = IONCAMRRecordVideoOptions(from: parameters)
        
        self.commandDelegate.run { [weak self] in
            guard let self = self else { return }
            self.cameraManager?.recordVideo(with: options)
        }
    }
    
    @objc(playVideo:)
    func playVideo(command: CDVInvokedUrlCommand) {
        self.callbackId = command.callbackId
        
        guard let parameters: OSCAMRPlayVideoParameters = decodeParameters(from: command) else {
            return self.callback(error: .playVideoIssue)
        }
        
        self.commandDelegate.run { [weak self] in
            guard let self = self else { return }
            Task {
                do {
                    try await self.videoManager?.playVideo(parameters.url)
                    self.callbackSuccess()
                } catch let error as IONCAMRError {
                    self.callback(error: error)
                } catch {
                    self.callback(error: .playVideoIssue)
                }
            }
        }
    }
    
    private func decodeParameters<T: Decodable>(from command: CDVInvokedUrlCommand) -> T? {
        guard let dict = command.argument(at: 0) as? [String: Any],
              let data = try? JSONSerialization.data(withJSONObject: dict)
        else { return nil }
        return try? JSONDecoder().decode(T.self, from: data)
    }
    
    private func sendResult(result: String? = nil, error: NSError? = nil, callBackID: String) {
        var pluginResult = CDVPluginResult(status: CDVCommandStatus_ERROR)

        if let error = error {
            let errorDict = [
                "code": "OS-PLUG-CAMR-\(String(format: "%04d", error.code))",
                "message": error.localizedDescription
            ]
            pluginResult = CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: errorDict);
        } else if let result = result {
            pluginResult = result.isEmpty ? CDVPluginResult(status: CDVCommandStatus_OK) : CDVPluginResult(status: CDVCommandStatus_OK, messageAs: result)
        }

        self.commandDelegate.send(pluginResult, callbackId: callBackID);
    }
}

extension OSCameraPlugin: IONCAMRCallbackDelegate {
    func callback(result: String?, error: IONCAMRError?) {
        if let error = error as? NSError {
            self.sendResult(error: error, callBackID: self.callbackId)
        } else if let result = result {
            self.sendResult(result: result, callBackID: self.callbackId)
        }
    }
    
    func callback(error: IONCAMRError) {
        self.callback(result: nil, error: error)
    }
    
    func callback(_ result: String) {
        self.callback(result: result, error: nil)
    }

    func callbackSuccess() {
        self.callback("")
    }
}
