<script setup lang="ts">
import AnnualReportChart from '@/components/AnnualReportChart.vue';
import MonthlyReportInfo from '@/components/MonthlyReportInfo.vue';
import SubHeader from '@/components/SubHeader.vue';
import { useReports } from '@/composables/useReports';
import { useRoute } from 'vue-router';
const route = useRoute()
const wallet_id = route.params.id

const {
    availableYears,
    yearReport,
    yearSelected,
    monthReport,
    selectedMonth,
    handleSelectYear,
    handleSelectMonth,
} = useReports(wallet_id)

function onYearChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    handleSelectYear(Number(target.value));
}
</script>

<template>
    <SubHeader name-page="Relatórios"/>
    <nav class="nav-bar">
        <select
            id="year-select"
            class="select"
            :value="yearSelected"
            @change="onYearChange"
        >
            <option
                v-for="year in availableYears"
                :key="year"
                :value="year"
                class="option"
            >
                {{ year }}
            </option>
        </select>
    </nav>
    <main>
        <AnnualReportChart 
            :data="yearReport"
            :wallet-id="wallet_id"
            :year="yearSelected"
            :handle-select-month="handleSelectMonth"
        />

        <aside v-if="monthReport">
            <MonthlyReportInfo
                :month-report="monthReport"
                :month="selectedMonth || 0"
                :year-report="yearReport[selectedMonth - 1]"
            />
        </aside>
    </main>
</template>

<style scoped>
.nav-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 1rem;
    background-color: #f4f4f5;
    border-radius: 0.5rem;
    width: 100%;
    margin-bottom: 1rem;
}

.select {
    appearance: none;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    border: 1px solid var(--color-green-medium);
    background-color: white;
    color: #111827;
    font-size: 1rem;
    cursor: pointer;
    transition: border-color 0.2s ease;
    width: 300px;
    text-align: center;
}

.select:hover {
    border-color: #9ca3af;
}

.select:focus {
    outline: none;
    border-color: var(--color-green-low);
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.3);
}
</style>