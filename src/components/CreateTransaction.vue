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
button,
fieldset,
input {
  all: unset;
}

.btn{
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}

.Avatar {
    width: 3.5rem;
    height: 3.5rem;
    border: 0.5px;
    border-color: black;
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-style: dashed;
    background-color: var(--color-green-medium);
    box-shadow: 0px 2px 5px black;
}

.AvatarLabel {
    margin-top: 0.5rem;
    font-size: 0.75rem;
    line-height: 1rem;
    color: black;
    font-weight: bold;
}

.icon {
  width: 30px;
  height: 30px;
  stroke: black; /* ícones outline usam stroke */
  stroke-width: 1.5;
  transition: 0.5s;
}

.DialogOverlay {
  background-color: var(--color-gray-bg);
  position: fixed;
  inset: 0;
  animation: overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
}

.DialogContent {
  background-color: white;
  border-radius: 6px;
  box-shadow: hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  max-width: 450px;
  padding: 25px;
  animation: contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
}
.DialogContent:focus {
  outline: none;
}

.DialogTitle {
  margin: 0;
  font-weight: 500;
  color: var(--color-gray-dark);
  font-size: 17px;
}

.DialogDescription {
  margin: 10px 0 20px;
  color: var(--color-gray-medium);
  font-size: 15px;
  line-height: 1.5;
}

.IconButton {
  font-family: inherit;
  border-radius: 100%;
  height: 25px;
  width: 25px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-green-high);
  position: absolute;
  top: 10px;
  right: 10px;
}
.IconButton:hover {
  background-color: var(--color-green-high);
}
.IconButton:focus {
  box-shadow: 0 0 0 2px var(--color-green-medium);
}

.Fieldset {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: start;
  margin-bottom: 15px;
}

.Label {
  font-size: 15px;
  color: var(--color-green-medium);
  text-align: right;
}

.Input {
  width: 90%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 15px;
  line-height: 1;
  color: var(--color-green-medium);
  box-shadow: 0 0 0 1px var(--color-green-medium);
}
.Input:focus {
  box-shadow: 0 0 0 2px var(--color-green-medium);
}

.Select {
  width: 100%;
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 15px;
  line-height: 1;
  color: var(--color-green-medium);
  box-shadow: 0 0 0 1px var(--color-green-medium);
  height: 35px;
  background-color: transparent;
  border: none;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  cursor: pointer;
}

.Select:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--color-green-medium);
}

.Button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  padding: 0 15px;
  font-size: 15px;
  line-height: 1;
  font-weight: 500;
  height: 35px;
}
.Button.green {
  background-color: var(--color-green-medium);
  color: white;
}
.Button.green:hover {
  background-color: var(--color-green-low);
}
.Button.green:focus {
  box-shadow: 0 0 0 2px var(--color-green-high);
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
</style>