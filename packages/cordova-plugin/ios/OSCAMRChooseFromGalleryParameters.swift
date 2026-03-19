import IONCameraLib

struct OSCAMRChooseFromGalleryParameters {
    let mediaType: IONCAMRMediaType
    let allowMultipleSelection: Bool
    let limit: Int?
    let includeMetadata: Bool
    let allowEdit: Bool
}

extension OSCAMRChooseFromGalleryParameters: Decodable {
    enum CodingKeys: String, CodingKey {
        case mediaType
        case allowMultipleSelection
        case limit
        case includeMetadata
        case allowEdit
    }
    
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        let mediaTypeValue = try container.decode(Int.self, forKey: .mediaType)
        let allowMultipleSelection = try container.decode(Bool.self, forKey: .allowMultipleSelection)
        let limit = try container.decodeIfPresent(Int.self, forKey: .limit)
        let includeMetadata = try container.decode(Bool.self, forKey: .includeMetadata)
        let allowEdit = try container.decode(Bool.self, forKey: .allowEdit)
                
        let mediaType = try IONCAMRMediaType(from: mediaTypeValue)
        self.init(mediaType: mediaType, allowMultipleSelection: allowMultipleSelection, limit: limit, includeMetadata: includeMetadata, allowEdit: allowEdit)
    }
}
