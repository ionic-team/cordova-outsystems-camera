import IONCameraLib

struct OSCAMREditPictureParameters: Decodable {
    let uri: String
    let saveToGallery: Bool
    let includeMetadata: Bool
}

extension IONCAMREditOptions {
    convenience init(from parameters: OSCAMREditPictureParameters) {
        self.init(saveToPhotoAlbum: parameters.saveToGallery, returnMetadata: parameters.includeMetadata)
    }
}
