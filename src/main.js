import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

if (process.env.NODE_ENV == "development") {
  window.api_base = "http://localhost:3000/api/"
}
else {
  window.api_base = "/api/"
}

createApp(App).use(router).mount("#app");
