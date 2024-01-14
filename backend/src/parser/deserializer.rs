use base64::{engine::general_purpose, Engine};
use flate2::read::DeflateDecoder;
use serde::{de::DeserializeOwned, Deserialize, Deserializer};

pub fn inflate_zlib<'de, D, T>(deserializer: D) -> Result<T, D::Error>
where
    D: Deserializer<'de>,
    T: DeserializeOwned,
{
    let s: String = Deserialize::deserialize(deserializer)?;
    let decoded: Vec<u8> = general_purpose::STANDARD
        .decode(s)
        .map_err(serde::de::Error::custom)?;
    let decoder: DeflateDecoder<&[u8]> = DeflateDecoder::new(&decoded[..]);
    let data: T = serde_json::from_reader(decoder).map_err(serde::de::Error::custom)?;
    Ok(data)
}
