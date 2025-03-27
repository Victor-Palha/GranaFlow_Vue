<script setup lang="ts">
import { ref } from 'vue';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { AnuualReports, MonthReport } from '@/types/reports';

const props = defineProps<{
  year: number;
  month?: number;
  walletId: string | string[];
  annualData?: AnuualReports[];
  monthlyData: MonthReport | null;
}>();

const exportFormats = ['PDF', 'Excel', 'CSV'] as const;
type ExportFormat = typeof exportFormats[number];
const selectedFormat = ref<ExportFormat>('PDF');
const isExporting = ref(false);
const exportSuccess = ref(false);

function generateFileName(): string {
  let name = `relatorio_${props.year}`;
  if (props.month) name += `_${props.month}`;
  return name;
}

function prepareAnnualData() {
  if (!props.annualData) return null;
  
  return props.annualData.map(item => ({
    Mes: item.month,
    Receitas: `R$ ${parseFloat(item.income).toFixed(2)}`,
    Despesas: `R$ ${parseFloat(item.outcome).toFixed(2)}`,
    Saldo: `R$ ${parseFloat(item.final_balance).toFixed(2)}`
  }));
}

function prepareMonthlyData() {
  if (!props.monthlyData) return null;
  
  const mainData = [{
    'Saldo Final': `R$ ${parseFloat(props.monthlyData.final_balance).toFixed(2)}`,
    'Total Receitas': `R$ ${parseFloat(props.monthlyData.total_income).toFixed(2)}`,
    'Total Despesas': `R$ ${parseFloat(props.monthlyData.total_outcome).toFixed(2)}`
  }];
  
  const categoriesData = props.monthlyData.subtypes.map(item => ({
    Tipo: item.type === 'INCOME' ? 'Receita' : 'Despesa',
    Categoria: item.subtype,
    Total: `R$ ${parseFloat(item.total).toFixed(2)}`,
    'Percentual': `${item.percentage}%`
  }));
  
  return { mainData, categoriesData };
}

function exportToExcel(data: any[], fileName: string) {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, "Relatório");
  XLSX.writeFile(wb, `${fileName}.xlsx`);
}

function exportToCSV(data: any[], fileName: string) {
  const csv = XLSX.utils.sheet_to_csv(XLSX.utils.json_to_sheet(data));
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${fileName}.csv`;
  link.click();
}

function exportToPDF(data: any[], fileName: string, isMonthly: boolean = false) {
  const doc = new jsPDF();
  
  doc.setFontSize(16);
  doc.setTextColor(40, 40, 40);
  doc.text(`Relatório ${isMonthly ? 'Mensal' : 'Anual'} - ${fileName.replace('_', '/')}`, 14, 20);
  
  if (isMonthly && props.monthlyData) {
    const monthly = props.monthlyData;
    
    doc.setFontSize(12);
    doc.text(`Saldo Final: R$ ${parseFloat(monthly.final_balance).toFixed(2)}`, 14, 30);
    doc.text(`Total Receitas: R$ ${parseFloat(monthly.total_income).toFixed(2)}`, 14, 40);
    doc.text(`Total Despesas: R$ ${parseFloat(monthly.total_outcome).toFixed(2)}`, 14, 50);
    
    const categoriesData = monthly.subtypes.map(item => [
      item.type === 'INCOME' ? 'Receita' : 'Despesa',
      item.subtype,
      `R$ ${parseFloat(item.total).toFixed(2)}`,
      `${item.percentage}%`
    ]);
    
    autoTable(doc, {
      startY: 60,
      head: [['Tipo', 'Categoria', 'Total', 'Percentual']],
      body: categoriesData,
      theme: 'grid',
      headStyles: { 
        fillColor: [60, 163, 120],
        textColor: 255
      },
      styles: {
        cellPadding: 3,
        fontSize: 10
      }
    });
  } else {
    autoTable(doc, {
      startY: 30,
      head: [['Mês', 'Receitas', 'Despesas', 'Saldo']],
      body: data.map(item => [item.Mês, item.Receitas, item.Despesas, item.Saldo]),
      theme: 'grid',
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255
      },
      styles: {
        cellPadding: 3,
        fontSize: 10
      }
    });
  }
  
  doc.save(`${fileName}.pdf`);
}

function handleExport() {
  isExporting.value = true;
  exportSuccess.value = false;
  
  try {
    const fileName = generateFileName();
    const isMonthly = !!props.month;
    
    if (isMonthly) {
      const preparedData = prepareMonthlyData();
      if (!preparedData) return;
      
      if (selectedFormat.value === 'Excel') {
        exportToExcel([...preparedData.mainData, ...preparedData.categoriesData], fileName);
      } else if (selectedFormat.value === 'CSV') {
        exportToCSV([...preparedData.mainData, ...preparedData.categoriesData], fileName);
      } else {
        exportToPDF([...preparedData.mainData, ...preparedData.categoriesData], fileName, true);
      }
    } else {
      const preparedData = prepareAnnualData();
      if (!preparedData) return;
      
      if (selectedFormat.value === 'Excel') {
        exportToExcel(preparedData, fileName);
      } else if (selectedFormat.value === 'CSV') {
        exportToCSV(preparedData, fileName);
      } else {
        exportToPDF(preparedData, fileName);
      }
    }
    
    exportSuccess.value = true;
    setTimeout(() => exportSuccess.value = false, 3000);
  } catch (error) {
    console.error('Erro ao exportar relatório:', error);
  } finally {
    isExporting.value = false;
  }
}
</script>

<template>
  <div class="export-options">
    <select v-model="selectedFormat" class="format-select">
      <option v-for="format in exportFormats" :key="format" :value="format">
        {{ format }}
      </option>
    </select>
    
    <button 
      @click="handleExport" 
      :disabled="isExporting || (!annualData && !monthlyData)"
      class="export-button"
    >
      <span v-if="!isExporting">Exportar</span>
      <span v-else>Exportando...</span>
    </button>
    
    <div v-if="exportSuccess" class="export-success">
      Relatório exportado com sucesso!
    </div>
  </div>
</template>

<style scoped>
.export-options {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.format-select {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: 1px solid #d1d5db;
  background-color: white;
  font-size: 0.875rem;
  cursor: pointer;
  min-width: 100px;
}

.export-button {
  padding: 0.5rem 1.25rem;
  background-color: var(--color-green-medium);
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.export-button:hover {
  background-color: var(--color-green-low);
}

.export-button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.export-success {
  margin-left: 0.5rem;
  color: var(--color-green-medium);
  font-size: 0.875rem;
  font-weight: 500;
  flex-basis: 100%;
}

@media (max-width: 768px) {
  .export-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .format-select, .export-button {
    width: 100%;
  }
  
  .export-success {
    margin-left: 0;
    margin-top: 0.5rem;
  }
}
</style>