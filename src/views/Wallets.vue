<script setup lang="ts">
import CreateWallet from '@/components/CreateWallet.vue';
import Profiles from '@/components/Profiles.vue';
import WalletLoading from '@/components/WalletLoading.vue';
import UpgradeAccount from '@/components/UpgradeAccount.vue';
import { useWallets } from '@/composables/useWallets';
import router from '@/router';
import { useAuthStore } from '@/stores/auth';
import { useTransactionStore } from '@/stores/transactions';
import { ArrowRightStartOnRectangleIcon } from '@heroicons/vue/24/outline'
import { onMounted, ref } from 'vue';
import UserProfile from '@/components/UserProfile.vue';

const {onLogout, getUserProfile} = useAuthStore()
const {setWalletToProvider} = useTransactionStore()
const { isLoadingWallets, wallets, refreshWallets } = useWallets()

const user = getUserProfile()
const isModalOpen = ref(false)

onMounted(() => {
    if(!user?.is_premium){
        isModalOpen.value = true
    }
})

function handleCloseModal() {
  isModalOpen.value = false
}

function handleSelectWallet(wallet_id: number){
    setWalletToProvider(wallet_id)
    router.push(`/dashboard/${wallet_id}`)
}

</script>

<template>
    <main class="main-container">
        <header class="header">
            <!-- <img alt="Grana Flow logo" src="@/assets/logo.png" width="70" height="70" /> -->
             <UserProfile :user="user"/>
            <ArrowRightStartOnRectangleIcon class="back" @click="onLogout"/>
        </header>

        <div class="container-info">
            <h1>Carteiras</h1>
            <span>Centralize suas finanças em um único lugar</span>
        </div>

        <div>
            <div class="wallets-container" v-if="isLoadingWallets">
                <WalletLoading />
            </div>

            <div class="wallets-container" v-else>
                <Profiles
                    v-for="wallet in wallets"
                    :key="wallet.id"
                    :type="wallet.type"
                    :name="wallet.name"
                    :id="wallet.id"
                    :handleSelectWallet="handleSelectWallet"
                />
                <CreateWallet 
                    :refreshWallets="refreshWallets"
                />
            </div>
        </div>
    </main>

    <template v-if="isModalOpen">
        <UpgradeAccount
            :handle-close="handleCloseModal"
        />
    </template>
</template>

<style scoped>

.header{
    display: flex;
    padding: 1rem;
    align-items: center;
    justify-content: space-between;
}

.container-info{
    margin-top: 5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    color: white;
    font-family: 'Playwrite', sans-serif;
}

.wallets-container{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
    margin-top: 1.25rem;
}

@media screen and (min-width: 871px) {
    .wallets-container{
        flex-direction: row;
        justify-content: center;
    }
}
</style>