import { AxiosError } from "axios";
import { useAPI } from "./useApi";
import { useTransactionStore } from "@/stores/transactions";
import type { Transaction } from "@/types/transactions";

export function useTransactionManager(){
    const {refetchTransactions} = useTransactionStore()
    async function handleGetTransaction(transactionId: number, walletId: number){
        const api = await useAPI()
        if(!api){
            return
        }
        try{
            const response = await api.server.get(`/api/transaction/${transactionId}/${walletId}`)
            return response.data.transaction
        } catch(error){
            if(error instanceof AxiosError){
                alert(error.response?.data.message)
            }
        }

    }

    async function handleDeleteTransaction(transactionId: number, walletId: number) {
        const api = await useAPI()
        if(!api){
            return
        }
        try{
            await api.server.delete(`/api/transaction/${transactionId}/${walletId}`)
            refetchTransactions()
        } catch(error){
            if(error instanceof AxiosError){
                console.log(error.response?.data.message)
            }
        }
    }

    async function handleEditTransaction(transactionId: number, walletId: number, transaction: Transaction){
        const api = await useAPI()
        if(!api){
            return
        }
        try{
            await api.server.patch(`/api/transaction/${transactionId}/${walletId}`, transaction)
            refetchTransactions()
        } catch(error){
            if(error instanceof AxiosError){
                console.log(error.response?.data.message)
            }
        }
    }

    return {
        handleDeleteTransaction,
        handleGetTransaction,
        handleEditTransaction
    }
}