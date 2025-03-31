import { useAPI } from "@/composables/useApi";
import type { Transaction } from "@/types/transactions";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useTransactionStore = defineStore('transactions', ()=>{
    const isTransactionsLoading = ref(false)
    const myTransactions = ref<Transaction[]>([])
    const futureTransactions = ref<Transaction[]>([])
    const walletId = ref<number | null>(null)

    async function fetchTransactions() {
        const api = await useAPI();
        if (!api || !walletId) {
            return;
        }
        isTransactionsLoading.value = true
        try {
            const response = await api.server.get("/api/transaction", {
                params: {
                    wallet_id: walletId.value,
                    limit: null,
                    is_until_today: true
                }
            });

            const responseOthers = await api.server.get("/api/transaction", {
                params: {
                    wallet_id: walletId.value,
                    limit: null,
                    is_after_today: true
                }
            });

            const {transactions: futureTransactionsResponse} = responseOthers.data
            const {transactions} = response.data;

            futureTransactions.value = futureTransactionsResponse
            myTransactions.value = transactions
        } catch (error) {
            console.error("Erro ao buscar transações:", error);
            throw error;
        } finally {
            isTransactionsLoading.value = false
        }
    }

    function setWalletToProvider(wallet_id: number){
        walletId.value = wallet_id
    }

    function refetchTransactions(){
        fetchTransactions()
    }

    return {
        myTransactions,
        futureTransactions,
        isTransactionsLoading,
        refetchTransactions,
        setWalletToProvider,
        fetchTransactions
    }
})