const ajax = new XMLHttpRequest();
const NEWS_URL = "http://api.hnpwa.com/v0/news/1.json";
ajax.open("GET", NEWS_URL, false);
ajax.send();

const newsFeed = JSON.parse(ajax.response);
// const url = import('./rust_code/pkg').then(module => module.document);
const doc = import("./rust_code/pkg").then((module) => {
  return module.DocumentObject;
});

doc.then((doc) => doc.get_window());
