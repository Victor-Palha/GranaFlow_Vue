<script setup lang="ts">
import { ref } from 'vue'
import TransactionModal from '@/components/TransactionModal.vue'
import { useTransactionManager } from '@/composables/useTransactionManager'
import type { Transaction } from '@/types/transactions'
import { 
  CurrencyDollarIcon, 
  ArrowTrendingDownIcon
} from '@heroicons/vue/24/outline'
import useCustomToast from '@/composables/useCustomToast'
import { formatarDataBr } from '@/utils/formatDate'

const props = defineProps<{
  data: Transaction
}>()

const emit = defineEmits(['deleted', 'edit'])

const isOpen = ref(false)
const isDeleting = ref(false)
const isEditing = ref(false)

const { handleDeleteTransaction, handleEditTransaction } = useTransactionManager()
const {showSuccess, showError} = useCustomToast()

const amountFormatted = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
}).format(parseFloat(props.data.amount))

function handleOpenModal() {
  isOpen.value = true
}

async function onDeleteTransaction(){
  if (!confirm('Tem certeza que deseja excluir esta transação?')) return
  
  isDeleting.value = true
  try {
    await handleDeleteTransaction(props.data.id, props.data.wallet_id)
    emit('deleted', props.data.id)
    showSuccess("Sua transação foi deletada com sucesso!")
    isOpen.value = false
  }catch(error){
    showError("Um erro inesperado ocorreu enquanto tentavamos deletar sua transação.")
  } finally {
    isDeleting.value = false
  }
}

async function onUpdateTransaction(updatedTransaction: Transaction){
  if (!confirm('Tem certeza que deseja editar esta transação?')) return
  isEditing.value = true
  try {
    await handleEditTransaction(props.data.id, props.data.wallet_id, updatedTransaction)
    emit('edit', props.data.id)
    showSuccess("Sua transação foi atualizada com sucesso!")
    isOpen.value = false
  }catch(error){
    showError("Um erro inesperado ocorreu enquanto tentavamos editar sua transação.")
  } finally {
    isEditing.value = false
  }
}

</script>

<template>
  <div class="transaction-container" @click="handleOpenModal">
    <div class="left-container">
      <div class="icons-container" :class="data.type === 'INCOME' ? 'icons-income' : 'icons-outcome'">
        <CurrencyDollarIcon v-if="data.type === 'INCOME'" class="icon"/>
        <ArrowTrendingDownIcon v-else class="icon"/>
      </div>

      <div class="container-info">
        <p class="transaction-name">{{ data.name }}</p>
        <span class="subtype">{{ data.subtype }}</span>
        <span class="description">{{ data.description }}</span>
      </div>
    </div>

    <div class="amount-container">
      <p class="amount-value" :class="data.type === 'INCOME' ? 'amount-value-income' : 'amount-value-outcome'">
        {{ amountFormatted }}
      </p>
      <span class="date-transaction">
        {{ formatarDataBr(data.transaction_date ) }}
      </span>
    </div>
  </div>

  <TransactionModal
    :transaction="data"
    :open="isOpen"
    :is-deleting="isDeleting"
    @update:open="isOpen = $event"
    @delete="onDeleteTransaction"
    @edit="onUpdateTransaction"
  />
</template>

<style scoped>
.transaction-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  padding: 0.75rem 0.5rem;
  width: 100%;
  max-width: 100%;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-radius: 8px;
}

.transaction-container:hover {
  background-color: #f3f4f6;
}

.left-container {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
}

.icons-container {
    display: flex;
    border-radius: 100%;
    padding: 0.75rem;
    flex-shrink: 0;
}

.icons-income {
    background-color: var(--color-green-medium);
    border: 0.5px solid var(--color-green-high);
}

.icons-outcome {
    background-color: var(--color-red-medium);
    border: 0.5px solid var(--color-red-high);
}

.container-info {
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.transaction-name {
    font-weight: 600;
    font-size: 1rem;
    color: #111827;
    margin-bottom: 0.25rem;
    word-break: break-word;
}

.subtype {
    font-size: 0.75rem;
    color: #374151;
    font-style: italic;
    margin-bottom: 0.25rem;
    text-transform: uppercase;
}

.description {
    font-size: 0.875rem;
    color: #4b5563;
    word-break: break-word;
}

.amount-container {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    flex-shrink: 0;
    margin-left: auto;
    text-align: right;
}

.amount-value {
    font-weight: 600;
    font-size: 1rem;
    margin-bottom: 0.25rem;
}

.amount-value-income {
    color: var(--color-green-high);
}

.amount-value-outcome {
    color: var(--color-red-high);
}

.date-transaction {
    font-size: 0.75rem;
    color: #6b7280;
}

.icon {
    width: 20px;
    height: 20px;
    stroke: #000;
    stroke-width: 1.5;
}

@media screen and (max-width: 768px) {
    .transaction-container {
        gap: 0.75rem;
        padding: 0.5rem 0;
    }
    
    .icons-container {
        padding: 0.5rem;
    }
    
    .transaction-name {
        font-size: 0.875rem;
    }
    
    .description {
        font-size: 0.75rem;
    }
    
    .amount-value {
        font-size: 0.875rem;
    }
}

@media screen and (max-width: 480px) {
    .left-container {
        gap: 0.5rem;
    }
    
    .transaction-name {
        font-size: 0.8125rem;
    }
    
    .subtype {
        font-size: 0.6875rem;
    }
    
    .description {
        font-size: 0.6875rem;
    }
    
    .amount-value {
        font-size: 0.8125rem;
    }
    
    .date-transaction {
        font-size: 0.6875rem;
    }
    
    .icon {
        width: 18px;
        height: 18px;
    }
}
</style>
