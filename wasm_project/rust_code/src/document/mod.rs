use wasm_bindgen::JsCast;

pub struct DocumentObject {
  window: web_sys::Window,
  document: web_sys::Document
}

impl DocumentObject {
  pub fn get_window(&mut self) -> web_sys::Window {
    web_sys::window().expect("global window does not exist")
  }

  pub fn get_document(&mut self) -> web_sys::Document {
    self.window.document().expect("expecting a document on window")
  }

  pub fn document_get_element_by_id(&self, id: String) -> web_sys::HtmlElement {
    let node = self.document.get_element_by_id(&id)
                              .unwrap()
                              .dyn_into::<web_sys::HtmlElement>()
                              .unwrap();
    node  
  }

  pub fn document_create_element(&self, ele: String) {
    self.document.create_element(&ele).unwrap();
  }
}

