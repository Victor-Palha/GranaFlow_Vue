<script setup lang="ts">
import Header from '@/components/Header.vue';
import NavDashboard from '@/components/NavDashboard.vue';
import Transaction from "@/components/Transaction.vue";
import { useDashboard } from '@/composables/useDashboard';
import { useRoute } from 'vue-router'

const route = useRoute()
const wallet_id = route.params.id

const {currentBalance, isTransactionsLoading, transactions} = useDashboard()
</script>

<template>
    <Header :total="currentBalance"/>
    <NavDashboard :wallet-id="wallet_id"/>
    <main>
        <h2>Últimas Transações</h2>
        <div v-for="(transactions, monthYear) in transactions" :key="monthYear" class="container-transactions">
            <p>{{ monthYear }}</p>
            <Transaction
                v-for="transaction in transactions"
                :key="transaction.id"
                :data="transaction"
            />
        </div>
    </main>
</template>

<style scoped>
main{
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 1rem;
    padding: 0 2.5rem;
}
h2{
    font-size: 1.5rem /* 24px */;
    line-height: 2rem;
    text-align: center;
    color: #111827;
    margin-bottom: 2.5rem;
    font-family: 'Playwrite', sans-serif;
}
.container-transactions{
    display: flex;
    flex-direction: column;
    margin-bottom: 0.25rem;
}

.container-transactions p {
    /* text-lg font-semibold text-gray-900 mb-6" */
    font-size: 1.125rem /* 18px */;
    line-height: 1.75rem;
    font-weight: bold;
    color: #111827;
    margin-bottom: 1.5rem;
}
</style>