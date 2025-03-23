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
    const is_premium = params.get('premium')!
    let is_premium_parsed
    if(is_premium == "true"){
      is_premium_parsed = true
    }else{
      is_premium_parsed = false
    }

    const user: UserProfile = { id, email, name, avatar_url, is_premium: is_premium_parsed }

    LocalStoragePersistence.setRefreshJWT(refresh)
    LocalStoragePersistence.setJWT(token)
    LocalStoragePersistence.setUserProfile(user)
    LocalStoragePersistence.setIsPremium(is_premium)

    next('/wallets')
  }
})
</script>

<template>
  <div>Redirecionando...</div>
</template>
