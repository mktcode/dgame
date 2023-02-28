import { createRouter, createWebHashHistory } from "vue-router";
import Game from "./Game.vue";

const routes = [{ path: "/:x?/:y?/:z?", component: Game }];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
