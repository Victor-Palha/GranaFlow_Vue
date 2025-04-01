<script setup lang="ts">
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle
} from 'radix-vue'
import { 
  XMarkIcon,
  TrashIcon,
  TagIcon,
  DocumentTextIcon,
  CalendarIcon,
  WalletIcon,
  PaperClipIcon,
  PencilSquareIcon
} from '@heroicons/vue/24/outline'
import type { Transaction } from '@/types/transactions'
import { computed, ref } from 'vue';
import { formatarDataBr } from '@/utils/formatDate';

const props = defineProps<{
  transaction: Transaction
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'edit', transaction: Transaction): void
  (e: 'delete', transactionId: number): void
}>()

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
})

const isDeleting = ref(false)
const isEditing = ref(false)

const amountFormatted = computed(() => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(parseFloat(props.transaction.amount))
})

const hasProof = computed(() => {
  return !!props.transaction.proof_url
})

const editedTransaction = ref({
  name: props.transaction.name,
  description: props.transaction.description,
  amount: props.transaction.amount,
  transaction_date: props.transaction.transaction_date,
  subtype: props.transaction.subtype,
  type: props.transaction.type
})

async function handleDeleteTransaction() {
  isDeleting.value = true
  try {
    emit('delete', props.transaction.id)
    isOpen.value = false
  } finally {
    isDeleting.value = false
  }
}

async function handleEditTransaction() {
  isEditing.value = true
  try {
    const updatedTransaction = {
      ...props.transaction,
      ...editedTransaction.value
    }
    emit('edit', updatedTransaction)
    isOpen.value = false
  } finally {
    isEditing.value = false
  }
}

function startEditing() {
  editedTransaction.value = {
    name: props.transaction.name,
    description: props.transaction.description,
    amount: props.transaction.amount,
    transaction_date: props.transaction.transaction_date,
    subtype: props.transaction.subtype,
    type: props.transaction.type
  }
  isEditing.value = true
}

function cancelEditing() {
  isEditing.value = false
}
</script>

<template>
  <DialogRoot v-model:open="isOpen">
    <DialogPortal>
      <DialogOverlay class="DialogOverlay" />
      <DialogContent class="DialogContent">
        <div class="DialogHeader">
          <DialogTitle class="DialogTitle">
            {{ isEditing ? 'Editar Transação' : 'Detalhes da Transação' }}
          </DialogTitle>
          <DialogClose class="IconButton" aria-label="Fechar">
            <XMarkIcon class="Icon" />
          </DialogClose>
        </div>

        <DialogDescription class="DialogDescription">
          <div class="TransactionInfo">
            <div class="InfoSection">
              <div class="InfoRow">
                <div class="InfoIconContainer">
                  <TagIcon class="InfoIcon" />
                </div>
                <div class="InfoTextContainer">
                  <h3 class="InfoLabel">Nome</h3>
                  <input
                    v-if="isEditing"
                    v-model="editedTransaction.name"
                    class="EditInput"
                    type="text"
                  >
                  <p v-else class="InfoValue">{{ transaction.name }}</p>
                </div>
              </div>

              <div class="InfoRow">
                <div class="InfoIconContainer">
                  <DocumentTextIcon class="InfoIcon" />
                </div>
                <div class="InfoTextContainer">
                  <h3 class="InfoLabel">Descrição</h3>
                  <textarea
                    v-if="isEditing"
                    v-model="editedTransaction.description"
                    class="EditTextarea"
                  />
                  <p v-else class="InfoValue">{{ transaction.description || 'Nenhuma descrição fornecida' }}</p>
                </div>
              </div>

              <div class="InfoRow">
                <div class="InfoIconContainer">
                  <CalendarIcon class="InfoIcon" />
                </div>
                <div class="InfoTextContainer">
                  <h3 class="InfoLabel">Data</h3>
                  <input
                    v-if="isEditing"
                    v-model="editedTransaction.transaction_date"
                    class="EditInput"
                    type="date"
                  >
                  <p v-else class="InfoValue">{{ formatarDataBr(props.transaction.transaction_date ) }}</p>
                </div>
              </div>

              <div class="InfoRow">
                <div class="InfoIconContainer">
                  <WalletIcon class="InfoIcon" />
                </div>
                <div class="InfoTextContainer">
                  <h3 class="InfoLabel">Carteira</h3>
                  <p class="InfoValue">ID: {{ transaction.wallet_id }}</p>
                </div>
              </div>

              <div v-if="hasProof" class="InfoRow">
                <div class="InfoIconContainer">
                  <PaperClipIcon class="InfoIcon" />
                </div>
                <div class="InfoTextContainer">
                  <h3 class="InfoLabel">Comprovante</h3>
                  <a 
                    :href="transaction.proof_url || ''" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="ProofLink"
                  >
                    Ver comprovante
                  </a>
                </div>
              </div>
            </div>

            <div class="FinancialSection">
              <div class="AmountDisplay" :class="transaction.type">
                <span class="AmountType">{{ transaction.type === 'INCOME' ? 'Receita' : 'Despesa' }}</span>
                <input
                  v-if="isEditing"
                  v-model="editedTransaction.amount"
                  class="EditInput amount"
                  type="number"
                  step="0.01"
                >
                <span v-else class="Amount">{{ amountFormatted }}</span>
              </div>

              <div class="SubtypeDisplay">
                <span class="SubtypeLabel">Categoria:</span>
                <span class="SubtypeValue">{{ transaction.subtype }}</span>
              </div>
            </div>
          </div>
        </DialogDescription>

        <div class="DialogFooter">
          <button 
            v-if="!isEditing"
            @click="startEditing" 
            class="Button primary"
          >
            <PencilSquareIcon class="ButtonIcon" />
            Editar
          </button>
          
          <template v-if="isEditing">
            <button 
              @click="cancelEditing" 
              class="Button muted"
            >
              Cancelar
            </button>
            <button 
              @click="handleEditTransaction" 
              class="Button primary"
            >
              Salvar
            </button>
          </template>
          
          <button 
            v-if="!isEditing"
            @click="handleDeleteTransaction" 
            class="Button danger" 
            :disabled="isDeleting"
          >
            <TrashIcon class="ButtonIcon" />
            {{ isDeleting ? 'Excluindo...' : 'Excluir' }}
          </button>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style scoped>
.DialogOverlay {
  background-color: rgba(0, 0, 0, 0.6);
  position: fixed;
  inset: 0;
  animation: overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
  backdrop-filter: blur(2px);
}

.DialogContent {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  max-width: 500px;
  max-height: 85vh;
  padding: 24px;
  animation: contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 1000;
  border: 1px solid #e5e7eb;
}

.DialogHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.DialogTitle {
  margin: 0;
  font-weight: 600;
  font-size: 1.25rem;
  color: #111827;
}

.DialogDescription {
  margin-bottom: 20px;
  font-size: 0.875rem;
  color: #6b7280;
}

.IconButton {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: #6b7280;
  transition: all 0.2s ease;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.IconButton:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.Icon {
  width: 20px;
  height: 20px;
}

.TransactionInfo {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.InfoSection {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.InfoRow {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.InfoIconContainer {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: #f3f4f6;
  flex-shrink: 0;
}

.InfoIcon {
  width: 18px;
  height: 18px;
  color: #4b5563;
}

.InfoTextContainer {
  flex: 1;
}

.InfoLabel {
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 4px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.InfoValue {
  font-size: 0.9375rem;
  color: #111827;
  line-height: 1.5;
  word-break: break-word;
}

.ProofLink {
  color: #2563eb;
  text-decoration: none;
  font-size: 0.9375rem;
  transition: color 0.2s ease;
  display: inline-block;
  margin-top: 4px;
  border-bottom: 1px solid transparent;
}

.ProofLink:hover {
  color: #1d4ed8;
  border-bottom-color: #1d4ed8;
}

.FinancialSection {
  border-top: 1px solid #e5e7eb;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.AmountDisplay {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  font-weight: 600;
}

.AmountDisplay.INCOME {
  background-color: #f0fdf4;
  color: #16a34a;
  border: 1px solid #dcfce7;
}

.AmountDisplay.OUTCOME {
  background-color: #fef2f2;
  color: #dc2626;
  border: 1px solid #fee2e2;
}

.AmountType {
  font-size: 0.875rem;
}

.Amount {
  font-size: 1.25rem;
}

.SubtypeDisplay {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #e5e7eb;
}

.SubtypeLabel {
  font-size: 0.75rem;
  color: #6b7280;
}

.SubtypeValue {
  font-size: 0.875rem;
  color: #111827;
  font-weight: 500;
  text-transform: uppercase;
}

.DialogFooter {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.Button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.Button.primary {
  background-color: #2563eb;
  color: white;
}

.Button.primary:hover {
  background-color: #1d4ed8;
}

.Button.danger {
  background-color: #fef2f2;
  color: #dc2626;
  border: 1px solid #fee2e2;
}

.Button.danger:hover {
  background-color: #fee2e2;
}

.Button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.ButtonIcon {
  width: 16px;
  height: 16px;
}

.EditInput,
.EditTextarea,
.EditSelect {
  width: 100%;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  font-size: 0.9375rem;
  transition: border-color 0.2s ease;
}

.EditInput:focus,
.EditTextarea:focus,
.EditSelect:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
}

.EditTextarea {
  min-height: 80px;
  resize: vertical;
}

.EditInput.amount {
  max-width: 120px;
  text-align: right;
}

.EditSelect {
  background-color: white;
  cursor: pointer;
}

.Button.muted {
  background-color: #f3f4f6;
  color: #4b5563;
  border: 1px solid #e5e7eb;
}

.Button.muted:hover {
  background-color: #e5e7eb;
}

@keyframes overlayShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes contentShow {
  from {
    opacity: 0;
    transform: translate(-50%, -48%) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

/* Responsividade */
@media (max-width: 640px) {
  .DialogContent {
    padding: 20px;
  }
  
  .DialogFooter {
    flex-direction: column-reverse;
  }
  
  .Button {
    width: 100%;
  }
}
</style>