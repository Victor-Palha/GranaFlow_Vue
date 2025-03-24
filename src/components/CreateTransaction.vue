<script setup lang="ts">
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  SwitchRoot, 
  SwitchThumb
} from 'radix-vue'
import { WalletIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'
import { useAPI } from '@/composables/useApi'
import { AxiosError } from 'axios'
import type { API } from '@/api/config'
import { useTransactionStore } from '@/stores/transactions'

const props = defineProps<{
  wallet_id: string | string[]
}>()

const {refetchTransactions} = useTransactionStore()

function formatDateToRef(date: Date){
  return date.toISOString().split("T")[0];
}

function formatDateToApi(date: string){
  return date+"T00:00:00.000Z"
}

const isCreatingTransaction = ref(false);
const nameTransaction = ref("");
const description = ref("");
const typeTransaction = ref("INCOME");
const subtypeTransaction = ref("FOOD");
const amountTransaction = ref("");
const isRecurring = ref(false);
const transactionDate = ref(formatDateToRef(new Date()));
const recurrenceStart = ref(formatDateToRef(new Date()));
const recurrenceEnd = ref(formatDateToRef(new Date()));

async function handleCreateTransaction() {
    if (nameTransaction.value.length < 3 || amountTransaction.value.length < 1) {
        alert("Por favor, preencha os campos de nome e valor corretamente!")
    }
    const api = await useAPI();
    if (!api) {
        return;
    }

    if (!isRecurring.value) {
        createSingleTransaction(api)
        return
    }
    createRecurrentTransaction(api)
}

async function createSingleTransaction(api: typeof API) {
    try {
        const data = {
            name: nameTransaction.value,
            type: typeTransaction.value,
            amount: amountTransaction.value,
            transaction_date: formatDateToApi(transactionDate.value),
            subtype: subtypeTransaction.value,
            description: description.value,
            proof_url: null,
            wallet_id: parseInt(props.wallet_id as string)
        }
        console.log(data)

        await api.server.post("/api/transaction/single", data)
        refetchTransactions()
    } catch (error) {
        console.log(error)
        if (error instanceof AxiosError) {
            alert(error.response?.data.message)
        }
    }
}

async function createRecurrentTransaction(api: typeof API) {
    if (recurrenceEnd < recurrenceStart) {
        alert("Por favor, escolha uma data final maior que a inicial!")
        return
    }
    try {
        const data = {
            name: nameTransaction.value,
            type: typeTransaction.value,
            amount: amountTransaction.value,
            start_date: formatDateToApi(recurrenceStart.value),
            end_date: formatDateToApi(recurrenceEnd.value),
            subtype: subtypeTransaction.value,
            description: description.value,
            proof_url: null,
            wallet_id: parseInt(props.wallet_id as string),
        };
        console.log(data)

        const response = await api.server.post("/api/transaction/recurrent", data);
        console.log(response.data)
        refetchTransactions
    } catch (error) {
        if (error instanceof AxiosError) {
            console.log(error)
            alert(error.response?.data.message || "Erro ao criar transações recorrentes.");
        } else {
            console.log(error)
            alert("Erro inesperado ao criar transações recorrentes.");
        }
    }
}
</script>

<template>
  <DialogRoot>
    <DialogTrigger class="btn">
      <div class="Avatar">
        <WalletIcon class="icon" />
      </div>
      <p class="AvatarLabel">Criar transação</p>
    </DialogTrigger>

    <DialogPortal>
      <DialogOverlay class="DialogOverlay" />
      <DialogContent class="DialogContent">
        <DialogTitle class="DialogTitle">
          Criar nova transação
        </DialogTitle>
        <DialogDescription class="DialogDescription">
          Crie uma nova transação para organizar suas finanças.
        </DialogDescription>

        <fieldset class="Fieldset">
          <label class="Label" for="name">Nome da Transação</label>
          <input
            id="name"
            class="Input"
            v-model="nameTransaction"
            placeholder="Digite o nome da transação"
          />
        </fieldset>

        <fieldset class="Fieldset">
          <label class="Label" for="name">Descrição</label>
          <input
            id="name"
            class="Input"
            v-model="description"
            placeholder="Ex: Pagamento via pix"
          />
        </fieldset>

        <fieldset class="Fieldset">
          <label class="Label" for="type">Tipo de transação</label>
          <select
            id="type"
            name="type"
            class="Select"
            v-model="typeTransaction"
          >
            <option value="INCOME">Entrada</option>
            <option value="OUTCOME">Saída</option>
          </select>
        </fieldset>

        <fieldset class="Fieldset">
          <label class="Label" for="subtype">Subtipo da transação</label>
          <select
            id="subtype"
            name="subtype"
            class="Select"
            v-model="subtypeTransaction"
          >
            <option value="FOOD">Alimentação</option>
            <option value="HOUSING">Moradia</option>
            <option value="TRANSPORT">Transporte</option>
            <option value="ENTERTAINMENT">Lazer</option>
            <option value="HEALTH">Saúde</option>
            <option value="EDUCATION">Educação</option>
            <option value="BILLS">Contas</option>
            <option value="INVESTMENT">Investimentos</option>
            <option value="WAGE">Salário</option>
            <option value="DONATION">Doações</option>
            <option value="OTHER">Outros</option>
          </select>
        </fieldset>

        <fieldset class="Fieldset">
          <label class="Label" for="amount-transaction">Valor da transação</label>
          <input
            id="amount-transaction"
            class="Input"
            type="number"
            v-model="amountTransaction"
            placeholder="Ex: 54,99"
          />
        </fieldset>

        <fieldset v-if="!isRecurring" class="Fieldset">
          <label class="Label" for="date-transaction">Data da transação</label>
          <input
            id="date-transaction"
            class="Input"
            type="date"
            v-model="transactionDate"
          />
        </fieldset>

        <template v-else>
            <fieldset class="Fieldset">
              <label class="Label" for="start-date-transaction">De:</label>
              <input
                id="start-date-transaction"
                class="Input"
                type="date"
                v-model="recurrenceStart"
              />
          </fieldset>
          <fieldset class="Fieldset">
              <label class="Label" for="end-date-transaction">Até</label>
              <input
                id="end-date-transaction"
                class="Input"
                type="date"
                v-model="recurrenceEnd"
              />
          </fieldset>
        </template>

        <fieldset class="Fieldset">
          <label class="Label" for="recurring">
            Pagamento recorrente?
          </label>

          <SwitchRoot class="SwitchRoot" id="recurring" v-model:checked="isRecurring">
            <SwitchThumb class="SwitchThumb"/>
          </SwitchRoot>

        </fieldset>


        <div :style="{ display: 'flex', marginTop: '25px', justifyContent: 'flex-end' }">
          <DialogClose as-child>
            <button class="Button green" @click="handleCreateTransaction" :disabled="isCreatingTransaction">
              {{ isCreatingTransaction ? 'Criando...' : 'Criar' }}
            </button>
          </DialogClose>
        </div>

        <DialogClose class="IconButton" aria-label="Fechar">
          <XMarkIcon class="icon" />
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>


<style scoped>
button, fieldset, input, select {
  all: unset;
  box-sizing: border-box;
}

.btn {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.btn:hover {
  transform: translateY(-2px);
}

.Avatar {
  width: 3.5rem;
  height: 3.5rem;
  border: 1px dashed var(--color-gray-medium);
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-green-medium);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.Avatar:hover {
  background-color: var(--color-green-low);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.AvatarLabel {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-gray-dark);
}

.icon {
  width: 24px;
  height: 24px;
  stroke: var(--color-gray-dark);
  stroke-width: 2;
  transition: all 0.3s ease;
}

.DialogOverlay {
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  position: fixed;
  inset: 0;
  animation: overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 1000;
}

.DialogContent {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  max-width: 450px;
  max-height: 85vh;
  padding: 1.5rem;
  animation: contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
  overflow-y: auto;
  z-index: 1001;
}

.DialogTitle {
  margin: 0;
  font-weight: 600;
  color: var(--color-gray-dark);
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.DialogDescription {
  margin: 0 0 1.5rem;
  color: var(--color-gray-medium);
  font-size: 0.875rem;
  line-height: 1.5;
}

.IconButton {
  font-family: inherit;
  border-radius: 100%;
  height: 30px;
  width: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-gray-medium);
  position: absolute;
  top: 12px;
  right: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.IconButton:hover {
  background-color: var(--color-gray-bg);
  color: var(--color-gray-dark);
}

.Fieldset {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
  width: 100%;
}

.Label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-gray-dark);
}

.Input, .Select {
  width: 100%;
  padding: 0.75rem;
  font-size: 0.9375rem;
  color: var(--color-gray-dark);
  border: 1px solid var(--color-gray-bg);
  border-radius: 6px;
  background-color: white;
  transition: all 0.2s ease;
}

.Input:focus, .Select:focus {
  outline: none;
  border-color: var(--color-green-medium);
  box-shadow: 0 0 0 2px rgba(var(--color-green-rgb), 0.2);
}

.Select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;
  cursor: pointer;
}

.SwitchRoot {
  width: 42px;
  height: 24px;
  background-color: var(--color-gray-bg);
  border-radius: 9999px;
  position: relative;
  cursor: pointer;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  margin-left: auto;
}

.SwitchRoot[data-state='checked'] {
  background-color: var(--color-green-medium);
}

.SwitchThumb {
  display: block;
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: 9999px;
  transition: transform 100ms;
  transform: translateX(2px);
  will-change: transform;
}

.SwitchThumb[data-state='checked'] {
  transform: translateX(20px);
}

.Button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  padding: 0 1.25rem;
  font-size: 0.9375rem;
  font-weight: 500;
  height: 40px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.Button.green {
  background-color: var(--color-green-medium);
  color: white;
}

.Button.green:hover:not(:disabled) {
  background-color: var(--color-green-low);
}

.Button.green:focus {
  box-shadow: 0 0 0 2px var(--color-green-high);
}

.Button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Animações */
@keyframes overlayShow {
  from { opacity: 0; }
  to { opacity: 1; }
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

@media (max-width: 480px) {
  .DialogContent {
    padding: 1.25rem;
    width: 95vw;
  }
  
  .Input, .Select {
    padding: 0.625rem;
  }
  
  .Button {
    height: 36px;
    font-size: 0.875rem;
  }
}
</style>