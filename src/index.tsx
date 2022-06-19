/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import App from "./App";

render(() => <App />, document.getElementById("root")!);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("../sw.js", { scope: '/' }).then(() => {
      console.log("[PWA] Service Worker Registered");
    });
  });
}
