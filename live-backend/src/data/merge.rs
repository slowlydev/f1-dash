use serde_json::Value;

pub fn merge(base: &mut Value, update: Value) {
    match (base, update) {
        (Value::Object(ref mut prev), Value::Object(update)) => {
            for (k, v) in update {
                merge(prev.entry(k).or_insert(Value::Null), v);
            }
        }
        (Value::Array(ref mut a), Value::Array(b)) => {
            a.extend(b);
        }
        (Value::Array(ref mut prev), Value::Object(update)) => {
            for (k, v) in update {
                k.parse::<usize>()
                    .ok()
                    .and_then(|index| prev.get_mut(index).map(|item| merge(item, v)));
            }
        }
        (a, b) => *a = b,
    }
}
