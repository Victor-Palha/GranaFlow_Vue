<script setup lang="ts">
import CreateTransaction from '@/components/CreateTransaction.vue';
import CreateTransactionPremium from '@/components/CreateTransactionPremium.vue';
import SubHeader from '@/components/SubHeader.vue';
import Transaction from '@/components/Transaction.vue';
import TransactionLoading from '@/components/TransactionLoading.vue';
import { Methods, usePayments } from '@/composables/usePayments';
import { useAuthStore } from '@/stores/auth';
import { useRoute } from 'vue-router';

const route = useRoute()
const wallet_id = route.params.id
const {getUserProfile} = useAuthStore()
const {
    handlePaymentsMethods,
    isTransactionsLoading,
    paymentsMethods,
    selectedTransactions
} = usePayments()

const user = getUserProfile()

</script>

<template>
    <SubHeader namePage="Transações"/>
    <nav>
        <div class="options" v-if="!user?.is_premium">
            <CreateTransaction :wallet_id="wallet_id"/>
        </div>
        <div class="options" v-else>
            <CreateTransactionPremium :wallet_id="wallet_id"/>
        </div>

        <div class="methods-container">
            <button
                @click="handlePaymentsMethods(Methods.ALL)"
                :class="['method-button', paymentsMethods === Methods.ALL ? 'active' : '']"
            >
                <span class="method-text">Todas</span>
            </button>

            <button
                @click="handlePaymentsMethods(Methods.INCOME)"
                :class="['method-button', paymentsMethods === Methods.INCOME ? 'active' : '']"
            >
                <span class="method-text">Entradas</span>
            </button>

            <button
                @click="handlePaymentsMethods(Methods.OUTCOME)"
                :class="['method-button', paymentsMethods === Methods.OUTCOME ? 'active' : '']"
            >
                <span class="method-text">Saídas</span>
            </button>
            <button
                @click="handlePaymentsMethods(Methods.OUTCOME)"
                :class="['method-button', paymentsMethods === Methods.FUTURE ? 'active' : '']"
            >
                <span class="method-text">Futuras</span>
            </button>
        </div>
    </nav>

    <div class="transactions-wrapper">
        <template v-if="!isTransactionsLoading && selectedTransactions">
            <Transaction
                v-for="transaction in selectedTransactions"
                :key="transaction.id"
                :data="transaction"
            />
        </template>

        <template v-else>
        <div class="transactions-loading-group">
            <TransactionLoading v-for="i in 6" :key="i" />
        </div>
        </template>
    </div>
</template>

<style scoped>
    nav{
        padding: 1rem;
        display: flex;
        flex-direction: column;
    }

    .options{
        /* flex-row justify-end items-end */
        display: flex;
        justify-content: end;
        align-items: end;
    }

    .methods-container {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        margin-top: 1.5rem;
        width: 100%;
        background-color: var(--color-gray-light);
        border-radius: 0.375rem;
    }

    .method-button {
        all: unset;
        box-sizing: border-box;
        padding: 0.5rem;
        height: 3rem;
        width: 33.333%;
        border-bottom: 1px solid #ccc;
        display: flex;
        align-items: center;
        justify-content: center;
        
    }

    .method-button.active {
        border-bottom-width: 4px;
    }

    .method-text {
        font-size: 1.125rem;
    }

    .transactions-wrapper {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        width: 80%;
        justify-content: center;
        margin-left: auto;
        margin-right: auto;
    }

    .transactions-loading-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        justify-content: center;
        margin-left: auto;
        margin-right: auto;
    }

    @media screen and (min-width: 600px) {
        .methods-container {
            width: 70%;
            margin-left: auto;
            margin-right: auto;
            margin-top: 1.5rem;
        }
        .transactions-wrapper {
            width: 70%;
        }
    }

    @media screen and (max-width: 450px) {
        .transactions-wrapper {
            align-items: center;
            justify-content: center;
        }

        .transactions-loading-group {
            align-items: center;
        }
    }
</style>