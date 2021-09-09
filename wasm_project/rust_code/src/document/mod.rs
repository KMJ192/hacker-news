use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;

#[wasm_bindgen]
pub struct DocumentObject {
  window: web_sys::Window,
  document: web_sys::Document
}

#[wasm_bindgen]
impl DocumentObject {
  pub fn new() -> Self {
    DocumentObject {
      window: web_sys::window().expect("global window does not exist"),
      document: web_sys::window().expect("global window does not exist").document().expect("expecting a document on window")
    }
  }
  pub fn get_window(&mut self) -> web_sys::Window {
    web_sys::window().expect("global window does not exist")
  }

  pub fn get_document(&self) -> web_sys::Document {
    self.window.document().expect("expecting a document on window")
  }

  pub fn document_get_element_by_id(&self, id: String) -> web_sys::HtmlElement {
    let node = self.document.get_element_by_id(&id)
                              .unwrap()
                              .dyn_into::<web_sys::HtmlElement>()
                              .unwrap();
    node  
  }
  // id querySelector
  pub fn document_query_selector_id(&self, id: String) -> web_sys::HtmlElement{
    let document = &self.document;

    let mut query = String::from("#");
    query.push_str(&id);

    let node = document.query_selector(&query)
                .unwrap()
                .unwrap()
                .dyn_into::<web_sys::HtmlElement>()
                .unwrap();
    node
  }

  pub fn document_query_selector_classname(&self, classname: String) -> web_sys::HtmlElement{
    let document = &self.document;

    let mut query = String::from(".");
    query.push_str(&classname);

    let node = document.query_selector(&query)
                .unwrap()
                .unwrap()
                .dyn_into::<web_sys::HtmlElement>()
                .unwrap();
    node
  }

  pub fn document_create_element(&self, element: String) -> web_sys::Element {
    self.document.create_element(&element).unwrap()
  }
}