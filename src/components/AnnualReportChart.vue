<script setup lang="ts">
import { MONTHS } from '@/constants/MONTHS';
import type { AnuualReports } from '@/types/reports';
import { ref, watch, onMounted, onUnmounted } from 'vue';
import ApexCharts from 'vue3-apexcharts';

const props = defineProps<{
  data: AnuualReports[];
  walletId: string | string[];
  year: number;
  handleSelectMonth: (month: number) => void;
}>();

const chartOptions = ref({});
const series = ref<{ name: string, data: number[] }[]>([]);

function prepareChartData() {
  const incomeSeries = props.data.map((r) => parseFloat(r.income));
  const outcomeSeries = props.data.map((r) => parseFloat(r.outcome));

  series.value = [
    {
      name: 'Entradas',
      data: incomeSeries,
    },
    {
      name: 'Saídas',
      data: outcomeSeries,
    },
  ];

  chartOptions.value = {
    chart: {
      type: 'bar',
      height: 400,
      width: "100%",
      toolbar: { show: true },
      events: {
        dataPointSelection: (event: MouseEvent, chartContext: any, config: any) => {
          const index = config.dataPointIndex;
          const selectedMonth = parseInt(index + 1);
          props.handleSelectMonth(selectedMonth);
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '70%',
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: props.data.map((r) => MONTHS[parseInt(r.month)]),
    },
    yaxis: {
      labels: {
        formatter: (val: number) => `R$ ${val.toFixed(2)}`,
      },
    },
    fill: {
      opacity: 1,
      colors: ['#3CA378', '#D94B4B'],
    },
    tooltip: {
      y: {
        formatter: (val: number) => `R$ ${val.toFixed(2)}`,
      },
    },
  };
}

watch(() => props.data, prepareChartData, { immediate: true });
</script>

<template>
  <div class="chart-container">
    <h2>Entradas e Saídas Mensais</h2>
    <div class="chart-wrapper">
      <ApexCharts
        type="bar"
        height="350"
        :options="chartOptions"
        :series="series"
      />
    </div>
  </div>
</template>

<style scoped>
.chart-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 70%;
  margin: 0px auto;
}

h2 {
  font-size: 1.125rem;
  line-height: 1.75rem;
  font-weight: bold;
  margin-bottom: 1.25rem;
  text-align: center;
  font-family: 'Playwrite', sans-serif;
}

@media screen and (max-width: 735px) {
    .chart-container {
        width: 100%;
    }
}
</style>