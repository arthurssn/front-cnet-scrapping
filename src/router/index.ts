import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../App.vue";

const routes = [{ path: "/:id", component: HomeView }];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
