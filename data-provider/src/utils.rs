pub fn fix_json(line: &str) -> String {
    let fixed_line = line
        .replace("'", "\"")
        .replace("True", "true")
        .replace("False", "false");
    fixed_line
}

pub fn encode_uri_component(s: &str) -> String {
    let mut encoded = String::new();
    for c in s.chars() {
        match c {
            '-' | '_' | '.' | '!' | '~' | '*' | '\'' | '(' | ')' => {
                encoded.push(c);
            }
            '0'..='9' | 'a'..='z' | 'A'..='Z' => {
                encoded.push(c);
            }
            _ => {
                for b in c.to_string().as_bytes() {
                    encoded.push_str(format!("%{:X}", b).as_str());
                }
            }
        }
    }
    encoded
}
