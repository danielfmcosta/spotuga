import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import InfoSpotuga from "../views/InfoSpotuga.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/info",
      name: "InfoSpotuga",
      component: InfoSpotuga,
    },
  ],
});
export default router;
