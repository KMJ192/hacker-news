use wasm_bindgen::prelude::*;

#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        assert_eq!(2 + 2, 4);
    }
}

pub mod document;
use document::DocumentObject;

#[wasm_bindgen]
pub fn doc() -> DocumentObject {
    DocumentObject::new()
}