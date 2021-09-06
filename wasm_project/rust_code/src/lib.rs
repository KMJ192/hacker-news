use wasm_bindgen::prelude::*;

#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        assert_eq!(2 + 2, 4);
    }
}

pub mod api;

#[wasm_bindgen]
pub fn main(ajax: web_sys::XmlHttpRequest) {
    web_sys::console::log_1(&ajax);
}