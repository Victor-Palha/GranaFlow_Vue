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
import { useCreateTransaction } from '@/composables/useCreateTransaction';
import { useAPI } from '@/composables/useApi';
import { ref } from 'vue';
import { AxiosError } from 'axios';
import CreateProof from './CreateProof.vue';

const props = defineProps<{
  wallet_id: string | string[]
}>()

const customSubtypes = ref<{name: string, id: number}[]>([])
const showAddSubtype = ref(false)
const newSubtypeName = ref<{name: string, id: number}>({name: "", id: 9999})

const {
    amountTransaction,
    description,
    isRecurring,
    nameTransaction,
    recurrenceEnd,
    recurrenceStart,
    subtypeTransaction,
    transactionDate,
    typeTransaction,
    isCreatingTransaction,
    handleCreateTransaction,
    handleGetProofUrl,

} = useCreateTransaction(props.wallet_id)


async function loadCustomSubtypes() {
    try {
        const api = await useAPI()
        if(!api){
            return
        }
        const response = await api.server.get(`/api/premium/custom-subtypes`)
        customSubtypes.value = response.data.custom_subtypes
    } catch (error) {
        console.error('Failed to load custom subtypes:', error)
    }
}

async function addCustomSubtype() {
  if (!newSubtypeName.value.name.trim()) {
    alert('Por favor, insira um nome válido para o subtipo')
    return
  }

  try {
    const api = await useAPI()
    if(!api) return

    await api.server.post(`/api/premium/custom-subtypes`, {
      name: newSubtypeName.value.name.trim()
    })
    
    customSubtypes.value.push(newSubtypeName.value)
    showAddSubtype.value = false
  } catch (error) {
    console.error('Failed to add custom subtype:', error)
    if (error instanceof AxiosError) {
      alert(error.response?.data.message || 'Erro ao adicionar subtipo')
    }
  }
}

function showSubtypeModal(){
    showAddSubtype.value = true
}

function closeSubtypeModal(){
    showAddSubtype.value = false
}

loadCustomSubtypes()

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
            <div class="Subtype">
                <label class="Label" for="subtype">Categoria da transação</label>
                <button v-if="!showAddSubtype" @click="showSubtypeModal" class="OpenSubtype">Novo categoria</button>

                <button v-else @click="closeSubtypeModal" class="CloseSubtype">
                    <XMarkIcon class="icon" />
                </button>
            </div>
            <div v-if="showAddSubtype" class="Subtype-Modal">
                <input
                    v-model="newSubtypeName.name"
                    class="Input"
                    placeholder="Nome da nova categoria"
                />
                <button @click="addCustomSubtype" class="Button-Add-Subtype">
                    Adicionar
                </button>
            </div>
            <select
                id="subtype"
                name="subtype"
                class="Select"
                v-model="subtypeTransaction"
                v-if="!showAddSubtype"
            >
                <option 
                    v-for="subtype in customSubtypes" 
                    :key="subtype.id" 
                    :value="subtype.name"
                >
                    {{ subtype.name }}
                </option>
                <option value="Alimentação">Alimentação</option>
                <option value="Moradia">Moradia</option>
                <option value="Transporte">Transporte</option>
                <option value="Lazer">Lazer</option>
                <option value="Saúde">Saúde</option>
                <option value="Educação">Educação</option>
                <option value="Contas">Contas</option>
                <option value="Investimentos">Investimentos</option>
                <option value="Salário">Salário</option>
                <option value="Doações">Doações</option>
                <option value="Pet">Pet</option>
                <option value="Comunicação">Comunicação</option>
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

        <CreateProof v-if="!isRecurring" :handle-get-proof-url="handleGetProofUrl"/>

        <div :style="{ display: 'flex', marginTop: '25px', justifyContent: 'flex-end' }">
            <button class="Button green" @click="handleCreateTransaction" :disabled="isCreatingTransaction">
              {{ isCreatingTransaction ? 'Criando...' : 'Criar' }}
            </button>
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

.Subtype{
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.OpenSubtype{
    background-color: var(--color-green-medium);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    padding: 0 0.75rem;
    font-size: 1rem;
    font-weight: 400;
    height: 35px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: white;
    font-style: italic;
}

.OpenSubtype:hover{
    background-color: var(--color-green-high);
}

.Subtype-Modal{
    display: flex;
    flex-direction: column;
    align-items: center;
}
.Button-Add-Subtype{
    background-color: var(--color-green-medium);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    padding: 0 0.75rem;
    font-size: 1rem;
    font-weight: 400;
    height: 35px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: white;
    font-style: italic;
    width: 100%;
    margin: 10px 0;
}

.CloseSubtype{
    background-color: transparent;
    cursor: pointer;
    border-radius: 6px;

}
.CloseSubtype:hover{
    background-color: var(--color-gray-light);
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