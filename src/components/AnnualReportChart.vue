<script setup lang="ts">
import { MONTHS } from '@/constants/MONTHS';
import type { AnuualReports } from '@/types/reports';
import { computed, ref, watch } from 'vue';
import ApexCharts from 'vue3-apexcharts';

const props = defineProps<{
  data: AnuualReports[];
  walletId: string | string[];
  year: number;
  handleSelectMonth: (month: number) => void;
}>();

const chartOptions = ref({});
const series = ref<{name: string, data: number[]}[]>([]);

const columnWidth = computed(() => {
  if (window.innerWidth < 600) {
    return '70%';
  }
  else if(window.innerWidth > 600 && window.innerWidth < 900){
    return '50%'
  }
  return '30%';
});

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
            height: 350,
            toolbar: { show: true },
            events: {
                dataPointSelection: (event: MouseEvent, chartContext: any, config: any) => {
                    const index = config.dataPointIndex;
                    const selectedMonth = parseInt(index+1);
                    props.handleSelectMonth(selectedMonth);
                }
            }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: columnWidth.value,
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
        }
    }
}

watch(() => props.data, prepareChartData, { immediate: true });
</script>

<template>
    <div>
        <h2 class="text-lg font-bold mb-2">Entradas e Saídas Mensais</h2>
        <ApexCharts
            type="bar"
            height="350"
            :options="chartOptions"
            :series="series"
        />
    </div>
</template>

<style scoped>
h2{
    font-size: 1.125rem;
    line-height: 1.75rem;
    font-weight: bold;
    margin-bottom: 1.25rem;
    text-align: center;
    font-family: 'Playwrite', sans-serif;
}
</style>