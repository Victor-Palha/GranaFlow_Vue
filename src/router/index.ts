import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
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
      component: () => import('@/views/Wallets.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/auth/callback',
      name: 'OAuthCallback',
      component: () => import('@/views/OAuthCallback.vue')
    }
  ],
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  if (!auth.authState.authenticated && to.meta.requiresAuth) {
    if (to.path !== '/') {
      return next('/')
    } else {
      return next()
    }
  }

  return next()
})
export default router
