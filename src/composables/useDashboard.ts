import { MONTHS } from "@/constants/MONTHS";
import { useTransactionStore } from "@/stores/transactions";
import type { Transaction } from "@/types/transactions";
import { storeToRefs } from "pinia";
import { onMounted, ref, watch } from "vue";

export function useDashboard(){
    const transactionsStore = useTransactionStore()
    onMounted(()=>{
      transactionsStore.fetchTransactions()
    })
    
    const { myTransactions, isTransactionsLoading } = storeToRefs(transactionsStore)
    const currentBalance = ref(0.0)
    const transactionsSeparedByMonths = ref<Record<string, Transaction[]>>({})

    function calculateCurrentBalance(transactions: Transaction[]) {
        const current_balance = transactions.reduce((acc, transaction) => {
          const amount = parseFloat(transaction.amount);
      
          if (transaction.type === "INCOME") {
            return acc + amount;
          } else if (transaction.type === "OUTCOME") {
            return acc - amount;
          }
      
          return acc;
        }, 0);
      
        currentBalance.value = current_balance
    }

    function groupTransactionsByMonth(transactions: Transaction[]) {
      const transactionsSepared = transactions.reduce<Record<string, Transaction[]>>((acc, transaction) => {
        const [yearStr, monthStr, _] = transaction.transaction_date.split('-');
        const year = parseInt(yearStr, 10);
        const month = parseInt(monthStr, 10);
    
        const label = `${MONTHS[month]} ${year}`;
    
        if (!acc[label]) {
          acc[label] = [];
        }
    
        acc[label].push(transaction);
        return acc;
      }, {});
    
      transactionsSeparedByMonths.value = transactionsSepared;
    }

    watch(myTransactions, ()=>{
        calculateCurrentBalance(myTransactions.value)
        groupTransactionsByMonth(myTransactions.value)
    })

    return {
        transactions: transactionsSeparedByMonths,
        currentBalance,
        isTransactionsLoading,
        groupTransactionsByMonth
    }
}