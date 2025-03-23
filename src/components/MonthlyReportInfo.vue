<script setup lang="ts">
import type { AnuualReports, MonthReport } from '@/types/reports';
import type { Transaction } from '@/types/transactions';
import { ref, watch } from 'vue';
import T from './Transaction.vue';
import { MONTHS } from '@/constants/MONTHS';

const props = defineProps<{
    monthReport: MonthReport
    month: number,
    yearReport: AnuualReports
}>()

const selectedSubtype = ref<string | null>(null)
const selectedTransactionsBasedOnSubtype = ref<Transaction[]>([])

function selectTransactionsBySubtype(subtype: string) {
    const grouped = props.monthReport.transactions.reduce<Record<string, Transaction[]>>((acc, transaction) => {
        if (!acc[transaction.subtype]) {
            acc[transaction.subtype] = [];
        }
        acc[transaction.subtype].push(transaction);
        return acc;
    }, {});
    
    selectedTransactionsBasedOnSubtype.value = (grouped[subtype] ?? []);
}

function filteredSubtypes(type: string) {
  return props.monthReport.subtypes.filter(subtype => subtype.type === type);
}

function handleSelectSubtype(subtype: string){
    selectedSubtype.value = subtype
}

watch(selectedSubtype, ()=>{
    if(selectedSubtype.value){
        selectTransactionsBySubtype(selectedSubtype.value)
    }
})

watch(props.monthReport, ()=>{
    selectedSubtype.value = null
    selectedTransactionsBasedOnSubtype.value = []
})
</script>

<template>
    <div class="report-container">
        <!-- Information -->
        <p class="report-month">
            {{MONTHS[props.month]}}
        </p>
    
        <div class="report-row">
            <p class="label">Entradas:</p>
            <p class="green-text">
            R$ {{ parseFloat(props.yearReport.income).toFixed(2) }}
            </p>
        </div>
    
        <div class="report-row">
            <p class="label">Saídas:</p>
            <p class="red-text">
            R$ {{ parseFloat(props.yearReport.outcome).toFixed(2) }}
            </p>
        </div>
    
        <div class="report-row">
            <p class="label">
            {{ new Date().getMonth()+1 == props.month ? "Saldo Atual: " : "Saldo previsto: " }}
            </p>
            <p
            :class="[
                parseFloat(props.yearReport.final_balance) <= 0
                ? 'red-text'
                : 'green-text',
            ]"
            >
            R$ {{ parseFloat(props.yearReport.final_balance).toFixed(2) }}
            </p>
        </div>
  
        <!-- Subtypes -->
        <div v-for="type in ['INCOME', 'OUTCOME']" :key="type" class="subtype-section">
            <p class="font-bold text-lg mb-3 text-zinc-700">
                {{ type === 'INCOME' ? 'Entradas por categoria' : 'Saídas por categoria' }}
            </p>

            <div
                v-for="subtype in filteredSubtypes(type)"
                :key="subtype.subtype"
                class="subtype-item"
                @click="()=> handleSelectSubtype(subtype.subtype)"
            >
                <div class="percentage-container">
                    <p class="subtype-name">{{ subtype.subtype }}</p>
                    <p class="percentage">{{ parseFloat(subtype.percentage).toFixed(1) }}%</p>
                </div>

                <div class="bar-container">
                    <div
                        class="bar"
                        :style="{ width: `${subtype.percentage}%` }"
                        :class="[
                        type === 'INCOME' ? 'bar-income' : 'bar-outcome',
                        ]"
                    />
                </div>
            </div>
        </div>
        
        <!-- Transactions -->
        <div class="transaction-section">
            <T v-for="item in selectedTransactionsBasedOnSubtype" :key="item.id" :data="item" />
        </div>
    </div>
</template>

<style scoped>
.report-container {
  margin: 1.5rem auto;
  padding: 0.75rem;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  background-color: #e4e7eb;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2.5rem;
  min-width: 95%;
  max-width: 95%;
}

.report-month {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.report-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
}

.label {
  color: #6b7280;
}

.green-text {
  color: var(--color-green-medium);
  font-weight: bold;
}

.red-text {
  color: var(--color-red-medium);
  font-weight: bold;
}

.green-medium {
  color: var(--color-green-medium);
}

.red-medium {
  color: var(--color-red-medium);
}

.subtype-section {
  margin-top: 1.5rem;
  cursor: pointer;
}

.subtype-item {
  margin-bottom: 1rem;
}

.percentage-container{
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
}

.subtype-name {
  color: #4b5563;
  font-weight: 500;
}

.percentage {
  color: #1f2937;
  font-weight: 600;
}

.bar-container {
  width: 100%;
  height: 0.75rem;
  background-color: #d1d5db;
  border-radius: 9999px;
  overflow: hidden;
}

.bar {
  height: 100%;
  border-radius: 9999px;
}

.bar-income {
    background-color: var(--color-green-medium);
}

.bar-outcome {
    background-color: var(--color-red-medium);
}

.transaction-section {
  margin-top: 2.5rem;
  display: flex;
  justify-items: center;
  justify-content: center;
}

@media screen and (min-width: 750px) {
    .report-container{
        min-width: 70%;
        max-width: 70%;
    }
}
</style>