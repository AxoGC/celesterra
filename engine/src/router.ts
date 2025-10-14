import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/Game.vue'),
    },
    {
      path: '/saves',
      component: () => import('@/views/Save.vue'),
    },
    {
      path: '/datapacks',
      component: () => import('@/views/Datapack.vue'),
    },
  ],
})

export default router
