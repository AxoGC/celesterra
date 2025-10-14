import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/DatapackList.vue'),
    },
    {
      path: '/:datapackId',
      component: () => import('@/views/DatapackDetail.vue'),
    },
    {
      path: '/:datapackId/achievements/:achievementId',
      component: () => import('@/views/AchievementDetail.vue'),
    },
    {
      path: '/:datapackId/areas/:areaId',
      component: () => import('@/views/AreaDetail.vue'),
    },
    {
      path: '/:datapackId/areas/:areaId/places/:placeId',
      component: () => import('@/views/PlaceDetail.vue'),
    },
    {
      path: '/:datapackId/entitypes/:entitypeId',
      component: () => import('@/views/EntitypeDetail.vue'),
    },
    {
      path: '/:datapackId/quests/:questId',
      component: () => import('@/views/QuestDetail.vue'),
    },
    {
      path: '/:datapackId/effects/:effectId',
      component: () => import('@/views/EffectDetail.vue'),
    },
    {
      path: '/:datapackId/itemtypes/:itemId',
      component: () => import('@/views/ItemtypeDetail.vue'),
    },
    {
      path: '/test',
      component: () => import('@/views/Test.vue'),
    },
  ],
})

export default router
