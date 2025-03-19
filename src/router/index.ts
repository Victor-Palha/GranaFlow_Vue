import { useAuthStore } from '@/stores/auth'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/Home.vue')
    },
    {
      path: '/wallets',
      name: 'Wallets',
      component: () => import('@/views/Wallets.vue')
    },
    {
      path: '/auth/callback',
      name: 'OAuthCallback',
      component: () => import('@/views/OAuthCallback.vue')
    }
  ],
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()

  if (to.path !== '/auth/callback' && to.meta.requiresAuth && !auth.authState.authenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
