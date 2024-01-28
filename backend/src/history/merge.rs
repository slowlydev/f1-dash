use serde_json::Value;

pub fn merge(base: &mut Value, update: &Value) {
    match (base, update) {
        (Value::Object(ref mut prev), &Value::Object(ref update)) => {
            for (k, v) in update {
                merge(prev.entry(k).or_insert(Value::Null), v);
            }
        }
        (Value::Array(ref mut a), &Value::Array(ref b)) => {
            a.extend(b.clone());
        }
        (Value::Array(ref mut prev), Value::Object(ref update)) => {
            for (k, v) in update {
                // key is "_deleted"
                if k == "_deleted" {
                    if let Ok(index_to_delete) = serde_json::from_value::<Vec<usize>>(v.to_owned())
                    {
                        for index in index_to_delete {
                            // or we chenge to prev.delete(index) if we don't want to show/mark deleted times in the UI
                            if let Some(item) = prev.get_mut(index) {
                                if let Value::Object(item_map) = item {
                                    item_map.insert(String::from("deleted"), Value::Bool(true));
                                }
                            }
                        }
                    }
                }

                // find item with racing number eq to k
                let rnr_item = prev.iter_mut().find(|val| {
                    if let Some(rnr) = val.get("RacingNumber") {
                        return rnr == k;
                    }
                    false
                });

                if let Some(rnr_item_found) = rnr_item {
                    merge(rnr_item_found, v)
                } else {
                    k.parse::<usize>()
                        .ok()
                        .and_then(|index| prev.get_mut(index).map(|item| merge(item, v)));
                }
            }
        }
        (a, b) => *a = b.clone(),
    }
}
