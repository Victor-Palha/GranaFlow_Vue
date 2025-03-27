<script setup lang="ts">
import AnalyticMonth from '@/components/AnalyticMonth.vue';
import Header from '@/components/Header.vue';
import NavDashboard from '@/components/NavDashboard.vue';
import Transaction from "@/components/Transaction.vue";
import TransactionLoading from "@/components/TransactionLoading.vue";
import { useDashboard } from '@/composables/useDashboard';
import { useAuthStore } from '@/stores/auth';
import { useRoute } from 'vue-router'

const route = useRoute()
const wallet_id = route.params.id

const {getUserProfile} = useAuthStore()
const user = getUserProfile()

const {currentBalance, isTransactionsLoading, transactions} = useDashboard()
</script>

<template>
    <div class="dashboard-layout">
        <Header :total="currentBalance"/>
        <NavDashboard :wallet-id="wallet_id"/>
        <main class="dashboard-main">
            <AnalyticMonth v-if="user?.is_premium" :wallet-id="wallet_id" class="analytic-month"/>
            <div class="transactions-section">
                <div class="transactions">
                    <h2>Últimas Transações</h2>
                    <div v-if="!isTransactionsLoading" v-for="(transactions, monthYear) in transactions" :key="monthYear" class="container-transactions">
                        <p class="month-title">{{ monthYear }}</p>
                        <Transaction
                            v-for="transaction in transactions"
                            :key="transaction.id"
                            :data="transaction"
                        />
                    </div>
                    <div v-else class="container-transactions loading-state">
                        <TransactionLoading/>
                        <TransactionLoading/>
                        <TransactionLoading/>
                        <TransactionLoading/>
                        <TransactionLoading/>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<style scoped>
.dashboard-layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #f8fafc;
}

.dashboard-main {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 1.5rem;
    max-width: 1440px;
    margin: 0 auto;
    width: 100%;
    box-sizing: border-box;
}

.analytic-month {
    width: 100%;
    margin-bottom: 1.5rem;
}

.transactions-section {
    width: 100%;
}

.transactions {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
    max-width: 100%;
    background-color: white;
    border-radius: 0.75rem;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.transactions h2 {
    font-size: 1.5rem;
    line-height: 2rem;
    text-align: center;
    color: #111827;
    margin-bottom: 1rem;
    font-family: 'Playwrite', sans-serif;
    font-weight: 600;
}

.container-transactions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
}

.month-title {
    font-size: 1.125rem;
    line-height: 1.75rem;
    font-weight: 600;
    color: #111827;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e2e8f0;
    margin-top: 1rem;
}

.loading-state {
    gap: 1.5rem;
}

/* Responsividade */
@media screen and (min-width: 768px) {
    .dashboard-main {
        padding: 2rem;
        gap: 2.5rem;
    }
    
    .transactions {
        padding: 2rem;
    }
    
    .transactions h2 {
        font-size: 1.75rem;
        margin-bottom: 1.5rem;
    }
}

@media screen and (min-width: 1024px) {
    .dashboard-main {
        flex-direction: row;
        align-items: flex-start;
    }
    
    .analytic-month {
        flex: 1;
        position: sticky;
        top: 1.5rem;
        margin-bottom: 0;
    }
    
    .transactions-section {
        flex: 2;
    }
}

@media screen and (min-width: 1280px) {
    .dashboard-main {
        padding: 2.5rem;
    }
    
    .transactions {
        padding: 2.5rem;
    }
}
</style>