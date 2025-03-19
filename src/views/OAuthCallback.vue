<script setup lang="ts">
import { LocalStoragePersistence, type UserProfile } from '@/stores/localStoragePersistence'

defineOptions({
  beforeRouteEnter(to, from, next) {
    const params = new URLSearchParams(window.location.search)

    const token = params.get('token') ?? ''
    const refresh = params.get('refresh_token') ?? ''
    const id = params.get('id')!
    const email = params.get('email')!
    const name = params.get('name')!
    const avatar_url = params.get('avatar_url')!

    const user: UserProfile = { id, email, name, avatar_url }

    LocalStoragePersistence.setRefreshJWT(refresh)
    LocalStoragePersistence.setJWT(token)
    LocalStoragePersistence.setUserProfile(user)

    next('/wallets')
  }
})
</script>

<template>
  <div>Redirecionando...</div>
</template>
