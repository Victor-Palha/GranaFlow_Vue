<script setup lang="ts">
import Header from '@/components/Header.vue';
import NavDashboard from '@/components/NavDashboard.vue';
import { useDashboard } from '@/composables/useDashboard';
import { useRoute } from 'vue-router'

const route = useRoute()
const wallet_id = route.params.id

const {currentBalance, groupTransactionsByMonth, isTransactionsLoading, transactions} = useDashboard()
const groupedTransactions = groupTransactionsByMonth(transactions.value);

</script>

<template>
    <Header :total="currentBalance"/>
    <NavDashboard :wallet-id="wallet_id"/>
    <main>
        
    </main>
</template>

<style scoped>
</style>