import { createRouter, createWebHistory } from 'vue-router';

export const navLink = [
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/temp/TempIndex.vue'),
    meta: { title: 'Home' }
  },
  {
    path: '/voices',
    name: 'voices',
    component: () => import('@/views/temp/TempIndex.vue'),
    meta: { title: 'Voices' }
  },
  {
    path: '/photos',
    name: 'photos',
    component: () => import('@/views/temp/TempIndex.vue'),
    meta: { title: 'Photos' }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'root',
      redirect: navLink[0]?.path,
      component: () => import('@/layout/index.vue'),
      children: navLink
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      redirect: '/'
    }
  ]
});

export default router;
