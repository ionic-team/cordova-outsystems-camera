import Foundation
import IONCameraLib

struct IONCAMRPlayVideoParameters {
    let url: URL
}

extension IONCAMRPlayVideoParameters: Decodable {
    enum DecodeError: Error {
        case invalidURL
    }
    
    enum CodingKeys: String, CodingKey {
        case uri
    }
    
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        let urlString = try container.decode(String.self, forKey: .uri)
        
        guard let url = URL(string: urlString) else { throw DecodeError.invalidURL }
        self.init(url: url)
    }
}
