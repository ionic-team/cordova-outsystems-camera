import IONCameraLib

struct OSCAMRRecordVideoParameters: Decodable {
    let saveToGallery: Bool
    let includeMetadata: Bool
}

extension IONCAMRRecordVideoOptions {
    convenience init(from parameters: OSCAMRRecordVideoParameters) {
        self.init(saveToGallery: parameters.saveToGallery, returnMetadata: parameters.includeMetadata)
    }
}
