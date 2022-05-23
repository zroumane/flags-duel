import { createRouter, createWebHistory } from "vue-router";
import HomeView from "./views/HomeView.vue";
import DuelView from "./views/DuelView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/duel",
    name: "duel",
    component: DuelView
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
