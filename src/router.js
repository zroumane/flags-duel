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
    path: "/duel/:id",
    name: "duel",
    component: DuelView
  },
  {
    name: "notfound",
    path: "/:pathMatch(.*)*",
    redirect: {name: "home"}
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
