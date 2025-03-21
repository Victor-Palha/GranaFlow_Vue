import { onMounted, ref, watch } from "vue";
import { useAPI } from "./useApi";
import type { AnuualReports } from "@/types/reports";

export function useReports(wallet_id: string | string[]){
    const currentYear = new Date().getFullYear();
    const availableYears = ref(Array.from({ length: 6 }, (_, i) => currentYear + 1 - i));
    const yearSelected = ref(currentYear)
    const yearReport = ref<AnuualReports[]>([])
        
    async function getReports() {
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

    function handleSelectYear(year: number) {
        yearSelected.value = year
    }

    watch(yearSelected, getReports);
    onMounted(getReports);

    return {
        yearReport,
        yearSelected,
        availableYears,
        handleSelectYear,
    }
}