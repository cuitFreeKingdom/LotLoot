import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
import { createRouterGuards } from './router-guard';
import { whiteNameList } from "./constant";
import { App } from "vue";

const routes = [
  { 
    path: "/", 
    name: "pl",
    component: () => import("../components/App.vue") 
  }, {
    path: '/index',
    name: "index",
    component: () => import("../components/Login/Index.vue"),
    children: [
      {
        path: '',
        name: "home",
        component: () => import("../components/Login/Home.vue")
      }, {
          path: 'park',
          name: "parking",
          component: () => import("../components/Login/Parking.vue")
      }, {
          path: 'store',
          name: "store",
          component: () => import("../components/Login/Store.vue")
      },
    ]
  }, {
    path: "/404",
    name: "404",
    component: () => import("../components/App.vue"),
  }, {
    path: '/:pathMatch(.*)',
    redirect: '/404'
  }
]

export async function setupRouter(app: App) {
  // 创建路由守卫
  createRouterGuards(router, whiteNameList);

  app.use(router);

  // 路由准备就绪后挂载APP实例
  await router.isReady();
}

export const router = createRouter({
    history: createWebHistory(''),
    routes: routes
})

export default router;