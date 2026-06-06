use anyhow::Error;
use serde_json::Value;
use std::sync::Arc;
use tokio::sync::RwLock;

#[derive(Clone)]
pub struct StateService {
    state: Arc<RwLock<Value>>,
}

impl StateService {
    pub fn new() -> Self {
        Self {
            state: Arc::new(RwLock::new(Value::Object(serde_json::Map::new()))),
        }
    }

    pub async fn get_state(&self) -> Result<Value, Error> {
        let state = self.state.read().await;
        Ok(state.clone())
    }

    pub async fn get_state_string(&self) -> Result<String, Error> {
        let state = self.state.read().await;
        Ok(state.to_string())
    }

    pub async fn set_state(&self, new_state: Value) -> Result<(), Error> {
        let mut state = self.state.write().await;
        *state = new_state;
        Ok(())
    }

    pub async fn update_state(&self, update: Value) -> Result<(), Error> {
        let mut state = self.state.write().await;
        merge(&mut state, update);
        Ok(())
    }
}

pub fn merge(base: &mut Value, update: Value) {
    match (base, update) {
        (Value::Object(prev), Value::Object(update)) => {
            for (k, v) in update {
                merge(prev.entry(k).or_insert(Value::Null), v);
            }
        }
        (Value::Array(prev), Value::Object(update)) => {
            for (k, v) in update {
                if let Ok(index) = k.parse::<usize>() {
                    if let Some(item) = prev.get_mut(index) {
                        merge(item, v);
                    } else {
                        prev.push(v);
                    }
                }
            }
        }
        (a, b) => *a = b,
    }
}
