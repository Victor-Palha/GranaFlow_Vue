import { ref } from 'vue'
import { useAPI } from './useApi'
import type { Wallet } from '@/types/wallet'
import { AxiosError } from 'axios'
import { LocalStoragePersistence } from '@/stores/localStoragePersistence'

export function useWallets() {
  const wallets = ref<Wallet[]>([])
  const isLoadingWallets = ref(false)

  async function loadWallets() {
    const token = LocalStoragePersistence.getJWT()
    if (!token) return

    isLoadingWallets.value = true
    try {
      const api = await useAPI()
      if (!api) return

      const response = await api.server.get('/api/wallet')
      wallets.value = response.data.wallets
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data)
        if (error.status === 404) {
          wallets.value = []
        } else {
          alert('Erro: ' + error.response?.data.message)
        }
      }
    } finally {
      isLoadingWallets.value = false
    }
  }

  function refreshWallets() {
    loadWallets()
  }


  loadWallets()

  return {
    wallets,
    isLoadingWallets,
    refreshWallets,
  }
}
