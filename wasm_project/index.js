function main() {
  import("./wasm/pkg").then((module) => module.greet("test"));
}
main();
