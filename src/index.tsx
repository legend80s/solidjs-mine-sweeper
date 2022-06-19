/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import App from "./App";

render(() => <App />, document.getElementById("root")!);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").then((registration) => {
      console.log("[PWA] Service Worker registered successfully with scope:", registration.scope);
    }).catch((error) => {
      console.log('[PWA] Service Worker registered failed:', error);
    });
  });
}
