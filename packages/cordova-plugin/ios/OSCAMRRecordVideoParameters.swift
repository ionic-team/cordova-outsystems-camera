import IONCameraLib

struct OSCAMRRecordVideoParameters: Decodable {
    let saveToGallery: Bool
    let includeMetadata: Bool
}

extension IONCAMRVideoOptions {
    convenience init(from parameters: OSCAMRRecordVideoParameters) {
        self.init(saveToPhotoAlbum: parameters.saveToGallery, returnMetadata: parameters.includeMetadata)
    }
}
