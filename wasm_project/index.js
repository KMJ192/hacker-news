function main() {
  import("../wasm_project/rust_code/pkg").then((module) => {
    console.log(module.main());
  });
}
main();
