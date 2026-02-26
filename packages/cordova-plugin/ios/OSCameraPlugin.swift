import IONCameraLib

@objc(OSCameraPlugin)
class OSCameraPlugin: CDVPlugin {
    var cameraManager: IONCAMRCameraActionDelegate?
    var galleryManager: IONCAMRGalleryActionDelegate?
    var videoManager: IONCAMRVideoActionDelegate?
    var callbackId: String = ""
    
    override func pluginInitialize() {
        self.cameraManager = IONCAMRFactory.createCameraManagerWrapper(withDelegate: self, and: self.viewController)
        self.galleryManager = IONCAMRFactory.createGalleryManagerWrapper(withDelegate: self, and: self.viewController)
        self.videoManager = IONCAMRFactory.createVideoManagerWrapper(withDelegate: self, and: self.viewController)
    }
    
    override func onAppTerminate() {
        self.commandDelegate.run { [weak self] in
            guard let self = self else { return }
            self.cameraManager?.cleanTemporaryFiles()
        }
    }
    
    @objc(takePicture:)
    func takePicture(command: CDVInvokedUrlCommand) {
        self.callbackId = command.callbackId

        guard let parametersDictionary = command.argument(at: 0) as? [String: Any],
              let parametersData = try? JSONSerialization.data(withJSONObject: parametersDictionary),
              let parameters = try? JSONDecoder().decode(OSCAMRTakePictureParameters.self, from: parametersData)
        else { return self.callback(error: .takePictureArguments) }

        // This 🔨 is required in order not to break Android's implementation
        if parameters.sourceType == 0 {
            return self.chooseSinglePicture(allowEdit: parameters.allowEdit) 
        }
    
        guard let options = try? IONCAMRPictureOptions(from: parameters)
        else { return self.callback(error: .takePictureArguments) }

        self.commandDelegate.run { [weak self] in
            guard let self = self else { return }
            self.cameraManager?.captureMedia(with: options)
        }
    }

    @objc(editPicture:)
    func editPicture(command: CDVInvokedUrlCommand) {
        self.callbackId = command.callbackId
        guard let imageBase64 = command.argument(at: 0) as? String, let imageData = Data(base64Encoded: imageBase64), let image = UIImage(data: imageData)
        else {
            self.callback(error: .invalidImageData)
            return
        }
        
        self.commandDelegate.run { [weak self] in
            guard let self = self else { return }
            self.galleryManager?.editPicture(image)
        }
    }

    @objc(editURIPicture:)
    func editURIPicture(command: CDVInvokedUrlCommand) {
        self.callbackId = command.callbackId
        
        guard let parametersDictionary = command.argument(at: 0) as? [String: Any],
              let parametersData = try? JSONSerialization.data(withJSONObject: parametersDictionary),
              let parameters = try? JSONDecoder().decode(OSCAMREditPictureParameters.self, from: parametersData)
        else { return self.callback(error: .editPictureIssue) }
        let options = IONCAMREditOptions(from: parameters)
        
        self.commandDelegate.run { [weak self] in
            guard let self = self else { return }
            self.galleryManager?.editPicture(from: parameters.uri, with: options)
        }
    }
    
    @objc(recordVideo:)
    func recordVideo(command: CDVInvokedUrlCommand) {
        self.callbackId = command.callbackId
        
        guard let parametersDictionary = command.argument(at: 0) as? [String: Bool],
              let parametersData = try? JSONSerialization.data(withJSONObject: parametersDictionary),
              let parameters = try? JSONDecoder().decode(OSCAMRRecordVideoParameters.self, from: parametersData)
        else { return self.callback(error: .captureVideoIssue) }
        let options = IONCAMRVideoOptions(from: parameters)
        
        self.commandDelegate.run { [weak self] in
            guard let self = self else { return }
            self.cameraManager?.captureMedia(with: options)
        }
    }
    
    func chooseSinglePicture(allowEdit: Bool) {
        self.commandDelegate.run { [weak self] in
            guard let self = self else { return }
            self.galleryManager?.choosePicture(allowEdit)
        }
    }
    
    @objc(chooseFromGallery:)
    func chooseFromGallery(command: CDVInvokedUrlCommand) {
        self.callbackId = command.callbackId
        
        guard let parameterDictionary = command.argument(at: 0) as? [String: Any],
              let parameterData = try? JSONSerialization.data(withJSONObject: parameterDictionary),
              let parameters = try? JSONDecoder().decode(OSCAMRChooseGalleryParameters.self, from: parameterData)
        else { return self.callback(error: .chooseMultimediaIssue) }
                
        self.commandDelegate.run { [weak self] in
            guard let self = self else { return }
            self.galleryManager?.chooseMultimedia(parameters.mediaType, parameters.allowMultipleSelection, parameters.includeMetadata, and: parameters.allowEdit)
        }
    }
    
    @objc(playVideo:)
    func playVideo(command: CDVInvokedUrlCommand) {
        self.callbackId = command.callbackId
        
        guard let parameterDictionary = command.argument(at: 0) as? [String: Any],
              let parameterData = try? JSONSerialization.data(withJSONObject: parameterDictionary),
              let parameters = try? JSONDecoder().decode(OSCAMRPlayVideoParameters.self, from: parameterData)
        else {
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
