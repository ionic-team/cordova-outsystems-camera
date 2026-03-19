import IONCameraLib

struct OSCAMRTakePhotoParameters: Decodable {
    let quality: Int
    let width: Int?
    let height: Int?
    let correctOrientation: Bool
    let encodingType: Int
    let saveToGallery: Bool
    let cameraDirection: Int
    let allowEdit: Bool
    let editInApp: Bool
    let presentationStyle: Bool
    let includeMetadata: Bool
}

private enum OSCAMRTakePhotoParametersError: Error {
    case invalid(field: String)
}

extension IONCAMRTakePhotoOptions {
    
    convenience init(from parameters: OSCAMRTakePhotoParameters) throws {
        func throwError(field: String) -> OSCAMRTakePhotoParametersError {
            OSCAMRTakePhotoParametersError.invalid(field: field)
        }

        if parameters.quality < 0 || parameters.quality > 100 { throw throwError(field: "quality") }
        guard let encodingType = IONCAMREncodingType(rawValue: parameters.encodingType) else { throw throwError(field: "encodingType") }
        guard let cameraDirection = IONCAMRDirection(rawValue: parameters.cameraDirection) else { throw throwError(field: "cameraDirection") }

        var targetSize: IONCAMRSize?
        if let targetWidth = parameters.width, let targetHeight = parameters.height {
            guard targetWidth > 0 else { throw throwError(field: "width") }
            guard targetHeight > 0 else { throw throwError(field: "height") }

            targetSize = try IONCAMRSize(width: targetWidth, height: targetHeight)
        }

        try self.init(
            quality: parameters.quality,
            size: targetSize,
            correctOrientation: parameters.correctOrientation, 
            encodingType: encodingType, 
            saveToGallery: parameters.saveToGallery,
            direction: cameraDirection,
            allowEdit: parameters.allowEdit, 
            returnMetadata: parameters.includeMetadata
        )
    }
}
