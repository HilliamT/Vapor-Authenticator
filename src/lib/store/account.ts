import Store from "electron-store";
const store = new Store(); // Create singleton instance to avoid polluting memory with multiple instances
export default store;