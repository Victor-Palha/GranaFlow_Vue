<script setup lang="ts">
import AnnualReportChart from '@/components/AnnualReportChart.vue';
import MonthlyReportInfo from '@/components/MonthlyReportInfo.vue';
import SubHeader from '@/components/SubHeader.vue';
import { useReports } from '@/composables/useReports';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import PremiumExportOptions from '@/components/PremiumExportOptions.vue';
import FinancialForecast from '@/components/FinancialForecast.vue';

const route = useRoute()
const wallet_id = route.params.id
const { getUserProfile } = useAuthStore()
const user = getUserProfile()

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
        
        <PremiumExportOptions 
            v-if="user?.is_premium"
            :year="yearSelected"
            :month="selectedMonth"
            :wallet-id="wallet_id"
            :annualData="yearReport"
            :monthly-data="monthReport"
        />
    </nav>
    
    <main>
        <div class="report-grid">
            <section class="main-report">
                <AnnualReportChart 
                    :data="yearReport"
                    :wallet-id="wallet_id"
                    :year="yearSelected"
                    :handle-select-month="handleSelectMonth"
                    :is-premium="user?.is_premium"
                />

                <aside v-if="monthReport" class="monthly-info">
                    <MonthlyReportInfo
                        :month-report="monthReport"
                        :month="selectedMonth || 0"
                        :year-report="yearReport[selectedMonth - 1]"
                        :is-premium="user?.is_premium"
                    />
                </aside>
            </section>

            <template v-if="user?.is_premium">
                <section class="premium-section">
                    <FinancialForecast
                        :wallet-id="wallet_id"
                        :annual-report="yearReport"
                        :year="yearSelected"
                    />
                </section>
            </template>
        </div>
    </main>
</template>

<style scoped>
:root{
  --border-color: #e2e8f0;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 1.5rem;
  background-color: #ffffff;
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  width: 100%;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.select {
  appearance: none;
  padding: 0.625rem 1rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-green-medium);
  background-color: white;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;
  color: #111827;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: var(--transition);
  width: 100%;
  max-width: 300px;
  font-weight: 500;
}

.select:hover {
  border-color: var(--color-green-low);
  box-shadow: var(--shadow-sm);
}

.select:focus {
  outline: none;
  border-color: var(--color-green-low);
  box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.2);
}

main {
  width: 100%;
  padding-bottom: 2rem;
}

.report-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.main-report {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.monthly-info,
.premium-section {
  background: white;
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
  transition: var(--transition);
}

.monthly-info:hover,
.premium-section:hover {
  box-shadow: var(--shadow-md);
}

.premium-section {
  border-color: rgba(234, 179, 8, 0.3);
  background-color: transparent
}

.premium-badge {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(234, 179, 8, 0.5);
}

@media (min-width: 640px) {
  .nav-bar {
    padding: 0.875rem 1.75rem;
  }
  
  .select {
    width: 300px;
  }
}

@media (min-width: 768px) {
  .report-grid {
    gap: 2rem;
  }
  
  .monthly-info,
  .premium-section {
    padding: 1.75rem;
  }
}

@media (min-width: 1024px) {
  .report-grid {
    grid-template-columns: 2fr 1fr;
    gap: 2rem;
  }
  
  .premium-badge {
    grid-column: span 2;
  }
}

@media (min-width: 1280px) {
  .report-grid {
    grid-template-columns: 1.5fr 1fr;
    gap: 2.5rem;
  }
  
  .premium-section:nth-child(3) {
    grid-row: span 2;
    align-self: start;
  }
  
  .monthly-info,
  .premium-section {
    padding: 2rem;
  }
}

@media (min-width: 1536px) {
  main {
    max-width: 1440px;
    margin: 0 auto;
  }
}
</style>