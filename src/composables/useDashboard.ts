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
        return transactions.reduce<Record<string, Transaction[]>>((acc, transaction) => {
          const date = new Date(transaction.transaction_date);
          const month = date.getMonth() + 1;
          const year = date.getFullYear();
          const label = `${MONTHS[month]} ${year}`;
      
          if (!acc[label]) {
            acc[label] = [];
          }
      
          acc[label].push(transaction);
          return acc;
        }, {});
    }

    watch(myTransactions, ()=>{
        calculateCurrentBalance(myTransactions.value)
    })

    return {
        transactions: myTransactions,
        currentBalance,
        isTransactionsLoading,
        groupTransactionsByMonth
    }
}