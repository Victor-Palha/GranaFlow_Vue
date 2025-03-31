import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { URLS } from '@/constants/URLS'
import { LocalStoragePersistence } from './localStoragePersistence'
import { useAPI } from '@/composables/useApi'

export const useAuthStore = defineStore('auth', () => {
    const authState = ref<{ user_id: string | null, authenticated: boolean | null }>({
        authenticated: null,
        user_id: null
    })
    const isLoading = ref(false)
    const router = useRouter()

    async function onLogin() {
        isLoading.value = true
        window.location.href = `${URLS.api}/auth/google?client=web`
    }

    async function onLogout() {
        const confirmedLogout = confirm("Você tem certeza que deseja sair?")
        if(!confirmedLogout){
            return
        }
        LocalStoragePersistence.deleteAll()
        authState.value = { authenticated: false, user_id: null }
        router.replace('/')
    }

    async function validateAuth() {
        isLoading.value = true
        try {
            const api = await useAPI()
            if (api) {
                const user = LocalStoragePersistence.getUserProfile()
                if(!user){
                    return
                }
                authState.value = {
                    authenticated: true,
                    user_id: user.id
                }
                router.replace('/wallets')
            } else {
                authState.value = { authenticated: false, user_id: null }
            }
        } catch (error) {
            authState.value = { authenticated: false, user_id: null }
        } finally {
            isLoading.value = false
        }
    }

    function getUserProfile(){
        return LocalStoragePersistence.getUserProfile()
    }

    return {
        authState,
        isLoading,
        onLogin,
        onLogout,
        validateAuth,
        getUserProfile
    }
})
