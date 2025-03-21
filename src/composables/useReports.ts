import { onMounted, ref, watch } from "vue";
import { useAPI } from "./useApi";
import type { AnuualReports, MonthReport } from "@/types/reports";

export function useReports(wallet_id: string | string[]){
    const currentYear = new Date().getFullYear();
    const availableYears = ref(Array.from({ length: 6 }, (_, i) => currentYear + 1 - i));
    const yearSelected = ref(currentYear)
    const yearReport = ref<AnuualReports[]>([])
    const monthReport = ref<MonthReport | null>(null)
    const selectedMonth = ref<number | null>(null)
        
    async function getAnnualReports() {
        const api = await useAPI();
        if (!api) return;
      
        try {
          const response = await api.server.get(`/api/wallet/${wallet_id}/reports/annual`, {
            params: { year: yearSelected.value },
          });
          yearReport.value = response.data.report;
        } catch (err) {
          console.error("Erro ao buscar relatório anual", err);
        }
    }

    async function getMonthReport(month: number, year: number) {
      const api = await useAPI();
      if (!api) {
          return;
      }
      try {
        const response = await api.server.get(`/api/wallet/${wallet_id}/reports/month`,
          {
            params: { year, month },
          }
        );
        monthReport.value = (response.data.report);
      } catch (error) {
        console.error('Erro ao buscar relatório mensal:', error);
      }
    }

    function handleSelectYear(year: number) {
        yearSelected.value = year
    }

    function handleSelectMonth(month: number){
      selectedMonth.value = month
      getMonthReport(month, yearSelected.value)
    }

    watch(yearSelected, getAnnualReports);
    onMounted(getAnnualReports);

    return {
        yearReport,
        monthReport,
        yearSelected,
        availableYears,
        selectedMonth,
        handleSelectYear,
        handleSelectMonth
    }
}