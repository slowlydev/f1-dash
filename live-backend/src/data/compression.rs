use base64::Engine;
use flate2::write::DeflateEncoder;
use flate2::Compression;
use std::io::prelude::*;

pub fn deflate(data: String) -> Option<String> {
    // Create a ZlibEncoder
    let mut encoder = DeflateEncoder::new(Vec::new(), Compression::default());

    // Write the JSON string into the encoder
    match encoder.write_all(data.as_bytes()) {
        Ok(_) => (),
        Err(_) => return None,
    }

    // Finish the encoding process
    let encoded_bytes = match encoder.finish() {
        Ok(bytes) => bytes,
        Err(_) => return None,
    };

    // Convert the byte array to base64
    Some(base64::engine::general_purpose::STANDARD.encode(encoded_bytes))
}
