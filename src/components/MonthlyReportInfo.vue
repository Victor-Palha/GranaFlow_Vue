<script setup lang="ts">
import type { AnuualReports, MonthReport } from '@/types/reports';
import type { Transaction } from '@/types/transactions';
import { ref, watch } from 'vue';
import TransactionItem from './Transaction.vue';
import { MONTHS } from '@/constants/MONTHS';

const props = defineProps<{
    monthReport: MonthReport
    month: number,
    yearReport: AnuualReports
}>()

const selectedSubtype = ref<string | null>(null)
const selectedTransactions = ref<Transaction[]>([])

function filterTransactionsBySubtype(subtype: string) {
    const grouped = props.monthReport.transactions.reduce<Record<string, Transaction[]>>((acc, transaction) => {
        if (!acc[transaction.subtype]) {
            acc[transaction.subtype] = [];
        }
        acc[transaction.subtype].push(transaction);
        return acc;
    }, {});
    
    selectedTransactions.value = grouped[subtype] ?? [];
}

function getFilteredSubtypes(type: string) {
  return props.monthReport.subtypes.filter(subtype => subtype.type === type);
}

function handleSubtypeSelection(subtype: string) {
    selectedSubtype.value = subtype
}

watch(selectedSubtype, (newVal) => {
    if (newVal) {
        filterTransactionsBySubtype(newVal);
    }
})

watch(() => props.monthReport, () => {
    selectedSubtype.value = null;
    selectedTransactions.value = [];
})
</script>

<template>
    <div class="monthly-report">
        <!-- Header -->
        <div class="report-header">
            <h3 class="month-title">{{ MONTHS[props.month] }}</h3>
            <div class="summary-grid">
                <div class="summary-item">
                    <span class="summary-label">Entradas</span>
                    <span class="summary-value income">
                        R$ {{ parseFloat(props.yearReport.income).toFixed(2) }}
                    </span>
                </div>
                
                <div class="summary-item">
                    <span class="summary-label">Saídas</span>
                    <span class="summary-value outcome">
                        R$ {{ parseFloat(props.yearReport.outcome).toFixed(2) }}
                    </span>
                </div>
                
                <div class="summary-item">
                    <span class="summary-label">
                        {{ new Date().getMonth()+1 === month ? 'Saldo Atual' : 'Saldo Previsto' }}
                    </span>
                    <span 
                        class="summary-value"
                        :class="{
                            'income': parseFloat(props.yearReport.final_balance) > 0,
                            'outcome': parseFloat(props.yearReport.final_balance) <= 0
                        }"
                    >
                        R$ {{ parseFloat(props.yearReport.final_balance).toFixed(2) }}
                    </span>
                </div>
            </div>
        </div>

        <!-- Categories -->
        <div class="categories-section">
            <div 
                v-for="type in ['INCOME', 'OUTCOME']" 
                :key="type" 
                class="category-type"
            >
                <h4 class="category-title">
                    {{ type === 'INCOME' ? 'Entradas por categoria' : 'Saídas por categoria' }}
                </h4>
                
                <div class="category-list">
                    <div
                        v-for="subtype in getFilteredSubtypes(type)"
                        :key="subtype.subtype"
                        class="category-item"
                        :class="{ 'selected': selectedSubtype === subtype.subtype }"
                        @click="() => handleSubtypeSelection(subtype.subtype)"
                    >
                        <div class="category-info">
                            <span class="category-name">{{ subtype.subtype }}</span>
                            <span class="category-percentage">{{ parseFloat(subtype.percentage).toFixed(1) }}%</span>
                        </div>
                        
                        <div class="progress-bar">
                            <div
                                class="progress-fill"
                                :style="{ width: `${subtype.percentage}%` }"
                                :class="type === 'INCOME' ? 'income' : 'outcome'"
                            />
                        </div>
                        
                        <span class="category-amount">
                            R$ {{ parseFloat(subtype.total).toFixed(2) }}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Transactions -->
        <div v-if="selectedTransactions.length > 0" class="transactions-section">
            <h4 class="transactions-title">Transações da categoria selecionada</h4>
            <div class="transactions-list">
                <TransactionItem 
                    v-for="transaction in selectedTransactions"
                    :key="transaction.id"
                    :data="transaction"
                />
            </div>
        </div>
        
        <div v-else class="empty-state">
            <p>Selecione uma categoria para ver as transações</p>
        </div>
    </div>
</template>

<style scoped>
.monthly-report {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 24px;
    margin: 16px 0;
    max-width: 100%;
}

.report-header {
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid #f0f0f0;
}

.month-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 16px;
}

.summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
}

.summary-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.summary-label {
    font-size: 0.875rem;
    color: #666;
}

.summary-value {
    font-size: 1.125rem;
    font-weight: 600;
}

.summary-value.income {
    color: var(--color-green-medium);
}

.summary-value.outcome {
    color: var(--color-red-medium);
}

.categories-section {
    display: grid;
    gap: 24px;
}

.category-type {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.category-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #333;
}

.category-list {
    display: grid;
    gap: 12px;
}

.category-item {
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid #eee;
}

.category-item:hover {
    background-color: #f0f0f0;
}

.category-item.selected {
    background-color: #e6f7ff;
    border-color: var(--color-green-low);
}

.category-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
}

.category-name {
    font-weight: 500;
    color: #333;
}

.category-percentage {
    font-weight: 600;
    color: #555;
}

.progress-bar {
    height: 6px;
    background-color: #e0e0e0;
    border-radius: 3px;
    margin-bottom: 8px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    border-radius: 3px;
}

.progress-fill.income {
    background-color: var(--color-green-medium);
}

.progress-fill.outcome {
    background-color: var(--color-red-medium);
}

.category-amount {
    font-size: 0.875rem;
    color: #666;
    display: block;
    text-align: right;
}

.transactions-section {
    margin-top: 24px;
    border-top: 1px solid #f0f0f0;
    padding-top: 16px;
}

.transactions-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 16px;
}

.transactions-list {
    display: grid;
    gap: 12px;
}

.empty-state {
    text-align: center;
    padding: 24px;
    color: #999;
    font-size: 0.875rem;
}

@media (max-width: 768px) {
    .monthly-report {
        padding: 16px;
    }
    
    .summary-grid {
        grid-template-columns: 1fr;
    }
}
</style>