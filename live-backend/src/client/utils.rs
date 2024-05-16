pub fn encode_uri_component(s: &str) -> String {
    let mut encoded: String = String::new();
    for ch in s.chars() {
        match ch {
            '-' | '_' | '.' | '!' | '~' | '*' | '\'' | '(' | ')' => {
                encoded.push(ch);
            }
            '0'..='9' | 'a'..='z' | 'A'..='Z' => {
                encoded.push(ch);
            }
            _ => {
                for b in ch.to_string().as_bytes() {
                    encoded.push_str(format!("%{:X}", b).as_str());
                }
            }
        }
    }
    encoded
}
