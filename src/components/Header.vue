<script setup lang="ts">
import { useDashboard } from '@/composables/useDashboard';
import router from '@/router';
import { ChevronLeftIcon } from '@heroicons/vue/24/outline';
import { computed } from 'vue';

const props = defineProps<{total: number}>()
const {isTransactionsLoading} = useDashboard()

function handleBackToHome(){
    router.back()
}

const formattedTotal = computed(() =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(props.total)
)
</script>

<template>
    <header>
        <div class="icons">
            <ChevronLeftIcon class="backHeader" @click="handleBackToHome"/>
            <div></div>
        </div>

        <div class="loading-balance" v-if="isTransactionsLoading">
            <div class="skeleton short" />
            <div class="skeleton long" />
        </div>
        <div class="balance-container " v-else>
            <p class="balance-label">Saldo Atual</p>
            <p class="balance-amount">
            {{ formattedTotal }}
            </p>
        </div>
    </header>
</template>

<style scoped>
    header{
        width: 100%;
        height: 350px;
        padding: 60px 16px;
        border-bottom-right-radius: 25px;
        border-bottom-left-radius: 25px;
        align-items: "center";
        box-shadow: "10";
        gap: 5;
        background: linear-gradient(to bottom, 
            var(--color-green-high), 
            var(--color-green-medium)
        );
    }

    .icons{
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
    }

    .loading-balance {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        padding-top: 5rem;
        animation: pulse 2s infinite;
    }

    .skeleton {
        background-color: #d1d5db;
        border-radius: 0.25rem;
    }

    .skeleton.short {
        height: 1rem;
        width: 6rem;
    }

    .skeleton.long {
        height: 2.5rem;
        width: 10rem;
        margin-top: 1rem;
    }

    .balance-container {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        padding-top: 5rem;
    }

    .balance-label {
        color: white;
        font-weight: 600;
    }

    .balance-amount {
        color: white;
        font-weight: bold;
        font-size: 3rem;
        margin-top: 0.5rem;
    }
</style>