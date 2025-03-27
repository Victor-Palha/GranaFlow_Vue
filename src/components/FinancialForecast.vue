<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { AnuualReports } from '@/types/reports';

const props = defineProps<{
  year: number;
  annualReport: AnuualReports[];
}>();

interface Forecast {
  month: number;
  final_balance: number;
  percentage_change: number;
  status: 'positive' | 'warning' | 'negative';
  message: string;
}

const forecast = ref<Forecast[]>([]);
const isLoading = ref(false);
const currentMonth = new Date().getMonth() + 1;

function calculateForecast() {
  isLoading.value = true;
  
  try {
    const annualReport = props.annualReport;
    if (!annualReport || annualReport.length === 0) {
      forecast.value = [];
      return;
    }

    const projections: Forecast[] = [];

    for (let month = 2; month <= 12; month++) {
      const current = annualReport.find(m => parseInt(m.month) === month);
      const previous = annualReport.find(m => parseInt(m.month) === month - 1);

      if (!current || !previous) continue;

      const currentBalance = parseFloat(current.final_balance);
      const previousBalance = parseFloat(previous.final_balance);
      
      const percentageChange = previousBalance !== 0 
        ? ((currentBalance - previousBalance) / Math.abs(previousBalance)) * 100 
        : 0;

      let status: 'positive' | 'warning' | 'negative' = 'positive';
      let message = 'Crescimento positivo';

      if (percentageChange < 0) {
        status = percentageChange < -20 ? 'negative' : 'warning';
        message = percentageChange < -20 
          ? 'Queda significativa' 
          : 'Redução no saldo';
      }

      if (percentageChange == 0){
        status = 'warning';
        message = 'Sem ganhos';
      }

      projections.push({
        month,
        final_balance: currentBalance,
        percentage_change: percentageChange,
        status,
        message
      });
    }

    forecast.value = projections;
  } catch (error) {
    console.error('Erro ao calcular previsão:', error);
  } finally {
    isLoading.value = false;
  }
}

const upcomingForecast = computed(() => {
  const currentYear = new Date().getFullYear();
  return forecast.value.filter(item => 
    props.year === currentYear ? item.month >= currentMonth : true
  );
});

watch(() => [props.annualReport, props.year], calculateForecast, { immediate: true });
</script>

<template>
  <div class="financial-forecast">
    <h3 class="section-title">Variação Mensal</h3>
    
    <div v-if="isLoading" class="loading">
      Calculando variações...
    </div>
    
    <div v-else-if="forecast.length === 0" class="empty-state">
      Dados insuficientes para calcular variações.
    </div>
    
    <div v-else>
      <div class="forecast-item" v-for="item in upcomingForecast" :key="item.month">
        <div class="month-info">
          <span class="month-name">
            {{ new Date(props.year, item.month - 1).toLocaleDateString('pt-BR', { month: 'long' }) }}
          </span>
          
          <div class="values-container">
            <span class="final-balance">
              {{ item.final_balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}
            </span>
            <span class="percentage-change" :class="item.status">
              {{ item.percentage_change > 0 ? '+' : '' }}{{ item.percentage_change.toFixed(1) }}%
            </span>
          </div>
        </div>
        
        <div class="forecast-message" :class="item.status">
          {{ item.message }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.financial-forecast {
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #1a1a1a;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 0.75rem;
}

.loading, .empty-state {
  color: #666;
  text-align: center;
  padding: 1.5rem 0;
  font-size: 0.9rem;
}

.forecast-item {
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: #f9fafb;
  transition: all 0.2s ease;
}

.forecast-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.month-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.month-name {
  font-weight: 500;
  color: #333;
  text-transform: capitalize;
}

.values-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.final-balance {
  font-size: 0.95rem;
  color: #444;
}

.percentage-change {
  font-weight: 600;
  font-size: 0.9rem;
}

.percentage-change.positive {
  color: var(--color-green-medium);
}

.percentage-change.warning {
  color: var(--color-yellow-medium);
}

.percentage-change.negative {
  color: var(--color-red-medium);
}

.forecast-message {
  font-size: 0.85rem;
  padding-top: 0.5rem;
  border-top: 1px dashed #eee;
  color: #555;
}

.forecast-message.positive {
  color: var(--color-green-dark);
}

.forecast-message.warning {
  color: var(--color-yellow-dark);
}

.forecast-message.negative {
  color: var(--color-red-dark);
}

@media (max-width: 768px) {
  .financial-forecast {
    padding: 1rem;
  }
  
  .month-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .values-container {
    align-items: flex-start;
    width: 100%;
  }
}
</style>