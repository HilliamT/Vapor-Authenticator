import Store from "electron-store";
const store = new Store(); // Create singleton instance to avoid asynchronocity issues
export default store;