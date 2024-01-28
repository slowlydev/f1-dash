use serde_json::Value;

pub fn merge(base: &mut Value, update: &Value) {
    match (base, update) {
        (Value::Object(ref mut prev), &Value::Object(ref update)) => {
            for (k, v) in update {
                merge(prev.entry(k).or_insert(Value::Null), v);
            }
        }
        (Value::Array(ref mut prev), &Value::Array(ref update)) => {
            if prev.len() == 0 {
                *prev = update.clone();
                return;
            }

            if update.is_empty() {
                return;
            }

            let mut new_array: Vec<Value> = vec![];

            for (i, v) in update.iter().enumerate() {
                if i > prev.len() - 1 {
                    new_array.push(v.clone());
                    continue;
                }

                if v.is_object() && prev[i].is_object() {
                    merge(&mut prev[i], v);
                    new_array.push(prev[i].clone());
                    continue;
                }

                if v.is_array() && prev[i].is_array() {
                    merge(&mut prev[i], v);
                    new_array.push(prev[i].clone());
                    continue;
                }

                new_array.push(v.clone())
            }

            if new_array.len() < prev.len() {
                let rest = &prev[new_array.len()..];
                new_array.extend_from_slice(rest);
            }

            *prev = new_array;
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

#[cfg(test)]
mod tests {
    use serde_json::json;

    use crate::history::merge;

    #[test]
    fn merge_arrays_excess() {
        let mut base = json!({
            "object_array": [{ "b": 2 }, { "d": 4 }, { "e": 6 }]
        });
        let update = json!({
            "object_array": [{ "c": 3 }, { "e": 5 }]
        });

        merge::merge(&mut base, &update);

        assert_eq!(
            base,
            json!({
                "object_array": [{ "b": 2, "c": 3 }, { "d": 4, "e": 5 }, { "e": 6 }]
            })
        )
    }

    #[test]
    fn merge_arrays_more() {
        let mut base = json!({
            "object_array": [{ "b": 2 }, { "d": 4 }]
        });
        let update = json!({
            "object_array": [{ "c": 3 }, { "e": 5 }, { "e": 6 }]
        });

        merge::merge(&mut base, &update);

        assert_eq!(
            base,
            json!({
                "object_array": [{ "b": 2, "c": 3 }, { "d": 4, "e": 5 }, { "e": 6 }]
            })
        )
    }

    #[test]
    fn merge_arrays_empty() {
        let mut base = json!({
            "object_array": [{ "b": 2 }, { "d": 4 }]
        });
        let update = json!({
            "object_array": []
        });

        merge::merge(&mut base, &update);

        assert_eq!(
            base,
            json!({
                "object_array": [{ "b": 2 }, { "d": 4 }]
            })
        )
    }

    #[test]
    fn merge_object() {
        let mut base = json!({
            "state": "old"
        });
        let update = json!({
            "state": "new"
        });

        merge::merge(&mut base, &update);

        assert_eq!(
            base,
            json!({
                "state": "new"
            })
        )
    }

    #[test]
    fn merge_object_additional() {
        let mut base = json!({
            "state": "old",
            "other": "ingore me",
        });
        let update = json!({
            "state": "new"
        });

        merge::merge(&mut base, &update);

        assert_eq!(
            base,
            json!({
                "state": "new",
                "other": "ingore me",
            })
        )
    }
}
