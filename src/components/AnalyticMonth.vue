<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { ApexOptions } from 'apexcharts';
import { useReports } from '@/composables/useReports';
import type { MonthReportSubtype } from '@/types/reports';

const DEFAULT_COLORS = [
  '#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336',
  '#00BCD4', '#673AB7', '#3F51B5', '#009688', '#CDDC39',
  '#FFC107', '#795548', '#607D8B', '#E91E63', '#8BC34A'
];

const props = defineProps<{
  walletId: string | string[];
}>();

const { handleSelectMonth, monthReport } = useReports(props.walletId);
const dataReport = ref<MonthReportSubtype[]>([]);
const showIncome = ref(false);

handleSelectMonth(new Date().getMonth() + 1);


watch(monthReport, () => {
  const filterType = showIncome.value ? 'INCOME' : 'OUTCOME';
  const subtypesFiltered = monthReport.value?.subtypes.filter((item) => {
    return item.type === filterType;
  }) || [];
  
  dataReport.value = subtypesFiltered;
}, { immediate: true });

watch(showIncome, () => {
  const filterType = showIncome.value ? 'INCOME' : 'OUTCOME';
  const subtypesFiltered = monthReport.value?.subtypes.filter((item) => {
    return item.type === filterType;
  }) || [];
  
  dataReport.value = subtypesFiltered;
});


const currentTotal = computed(() => {
  if (!dataReport.value || dataReport.value.length === 0) return '0.00';
  
  return dataReport.value.reduce((sum, item) => {
    return sum + parseFloat(item.total);
  }, 0).toFixed(2);
});

const expenseData = computed(() => {
  if (!dataReport.value || dataReport.value.length === 0) {
    return {
      categories: ['Sem dados'],
      series: [100],
      colors: ['#CCCCCC'],
      totals: ['0.00']
    };
  }

  return {
    categories: dataReport.value.map(item => item.subtype),
    series: dataReport.value.map(item => parseFloat(item.percentage)),
    colors: dataReport.value.map((_, index) => 
      DEFAULT_COLORS[index % DEFAULT_COLORS.length]
    ),
    totals: dataReport.value.map(item => item.total)
  };
});

const series = computed(() => expenseData.value.series);
const categories = computed(() => expenseData.value.categories);
const colors = computed(() => expenseData.value.colors);
const totals = computed(() => expenseData.value.totals);

const chartOptions = computed(() => ({
  chart: {
    type: 'donut',
    height: 350,
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 800,
      animateGradually: {
        enabled: true,
        delay: 150
      },
      dynamicAnimation: {
        enabled: true,
        speed: 350
      }
    }
  },
  colors: colors.value,
  labels: categories.value,
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        width: 300
      },
      legend: {
        position: 'bottom'
      }
    }
  }],
  plotOptions: {
    pie: {
      donut: {
        size: '75%',
        labels: {
          show: true,
          total: {
            show: true,
            label: showIncome.value ? 'Total Receita' : 'Total Despesa',
            color: '#333',
            formatter: () => `R$ ${currentTotal.value}`
          },
          value: {
            color: '#333',
            fontSize: '24px',
            fontWeight: 'bold',
            formatter: (value: number) => `${value}%`
          }
        }
      }
    }
  },
  dataLabels: {
    enabled: false
  },
  legend: {
    show: false
  },
  tooltip: {
    y: {
      formatter: (value: number, { seriesIndex }: { seriesIndex: number }) => {
        return `${value}% (R$ ${totals.value[seriesIndex]})`;
      }
    },
    marker: {
      show: true
    }
  }
}));
</script>

<template>
  <div class="donut-chart-container">
    <div class="chart-header">
      <h2 class="chart-title">
        {{ showIncome ? 'Distribuição de Receitas do mês' : 'Distribuição de Despesas do mês' }}
      </h2>
      
      <div class="type-toggle">
        <button
          @click="showIncome = false"
          :class="{ active: !showIncome }"
          class="toggle-btn outcome"
        >
          Despesas
        </button>
        <button
          @click="showIncome = true"
          :class="{ active: showIncome }"
          class="toggle-btn income"
        >
          Receitas
        </button>
      </div>
    </div>
    
    <div class="chart-wrapper">
      <apexchart
        type="donut"
        :options="chartOptions"
        :series="series"
      ></apexchart>
    </div>
    
    <div class="chart-legend">
      <div 
        v-for="(item, index) in categories" 
        :key="index" 
        class="legend-item"
      >
        <span 
          class="legend-color" 
          :style="{ backgroundColor: colors[index] }"
        ></span>
        <div class="legend-details">
          <span class="legend-label">{{ item }}</span>
          <span class="legend-values">
            {{ series[index] }}% (R$ {{ totals[index] }})
          </span>
        </div>
      </div>
    </div>
    
    <div v-if="dataReport.length === 0" class="no-data-message">
      Nenhum dado {{ showIncome ? 'de receita' : 'de despesa' }} disponível para o mês atual.
    </div>
  </div>
</template>

<style scoped>
.donut-chart-container {
  padding: 20px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.chart-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.chart-title {
  text-align: center;
  color: #333;
  margin: 0;
  font-weight: 600;
  font-size: 1.25rem;
  font-family: 'Playwrite', sans-serif;
}

.type-toggle {
  display: flex;
  border-radius: 24px;
  background-color: #f0f0f0;
  padding: 4px;
}

.toggle-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  background-color: transparent;
}

.toggle-btn.active {
  color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.toggle-btn.outcome.active {
  background-color: var(--color-red-medium);
}

.toggle-btn.income.active {
  background-color: var(--color-green-medium);
}

.chart-wrapper {
  margin-bottom: 20px;
}

.chart-legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: 8px;
  background-color: #f8f9fa;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-details {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.legend-label {
  font-weight: 500;
  color: #333;
}

.legend-values {
  font-size: 0.85rem;
  color: #666;
}

.no-data-message {
  text-align: center;
  color: #666;
  padding: 20px;
  font-style: italic;
  background-color: #f9f9f9;
  border-radius: 8px;
}
</style>