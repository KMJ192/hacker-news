function main() {
  const ajax = new XMLHttpRequest();
  import("../wasm_project/rust_code/pkg").then((module) => module.main(ajax));
}
main();
