import { useTransactionStore } from "@/stores/transactions";
import  type { Transaction} from "@/types/transactions";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";

export enum Methods {
    ALL = "",
    INCOME = "INCOME",
    OUTCOME = "OUTCOME",
    FUTURE = "FUTURE"
}

export function usePayments(){
    const transactionsStore = useTransactionStore()
    const { myTransactions, isTransactionsLoading, futureTransactions } = storeToRefs(transactionsStore)
    const paymentsMethods = ref<Methods>(Methods.ALL)
    const selectedTransactions = ref<Transaction[]>(myTransactions.value)

    function handlePaymentsMethods(method: Methods){
        paymentsMethods.value = method
    }

    function filterTransactionsByType(transactions: Transaction[]) {
        if(paymentsMethods.value == ""){
            selectedTransactions.value = myTransactions.value
            return
        }else if(paymentsMethods.value == "FUTURE"){
            selectedTransactions.value = futureTransactions.value
            return
        }else{
            const filteredTransactions = transactions.filter(transaction => transaction.type === paymentsMethods.value);
            selectedTransactions.value = filteredTransactions
        }
    }

    watch([paymentsMethods, myTransactions], ()=>{
        filterTransactionsByType(myTransactions.value)
    })

    return {
        paymentsMethods,
        selectedTransactions,
        isTransactionsLoading,
        handlePaymentsMethods,
    }
}