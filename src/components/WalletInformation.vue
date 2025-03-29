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
} from 'radix-vue'
import {XMarkIcon} from '@heroicons/vue/24/outline'
import { ref, watch } from 'vue'
import { useAPI } from '@/composables/useApi'
import useCustomToast from '@/composables/useCustomToast'
import { AxiosError } from 'axios'

const { showWarning, showError, showSuccess } = useCustomToast()

const props = defineProps<{
  id: number,
  name: string,
  refreshWallets: () => void
}>()

const walletName = ref(props.name)
const isSubmitting = ref(false)

watch(() => props.name, (newVal) => {
  walletName.value = newVal
})

async function handleUpdateWalletName(){
  if (!walletName.value.trim()) {
    showWarning('Por favor, insira um nome válido')
    return
  }

  isSubmitting.value = true
  try {
    const api = await useAPI()
    if(!api) return
    const response = await api.server.patch("/api/wallet", {
        wallet_id: props.id,
        wallet_name: walletName.value
    })
    showSuccess(response.data.message)
    props.refreshWallets()
  } catch (error) {
    if(error instanceof AxiosError){
        showError(error.response?.data.message)
        return
    }
    showError('Erro ao atualizar carteira')
  } finally {
    isSubmitting.value = false
  }
}

async function handleDeleteWallet() {
  const confirmed = confirm('Tem certeza que deseja excluir esta carteira? Esta ação não pode ser desfeita.')
  if (!confirmed) return

  isSubmitting.value = true
  try {
    const api = await useAPI()
    if(!api) return
    const response = await api.server.delete("/api/wallet", {
        data: {
            wallet_id: props.id
        }
    })
    showSuccess(response.data.message)
    props.refreshWallets()
  } catch (error) {
    if(error instanceof AxiosError){
        showError(error.response?.data.message)
        return
    }
    showError('Erro ao atualizar carteira')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <DialogRoot>
    <DialogTrigger as-child>
      <button class="edit-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 20h9"></path>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
        </svg>
      </button>
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay class="DialogOverlay" />
      <DialogContent class="DialogContent">
        <DialogTitle class="DialogTitle">
          Editar carteira
        </DialogTitle>
        <DialogDescription class="DialogDescription">
          Atualize os dados da sua carteira
        </DialogDescription>

        <fieldset class="Fieldset">
          <label class="Label" for="name">Nome</label>
          <input
            id="name"
            class="Input"
            v-model="walletName"
            placeholder="Nome da carteira"
          />
        </fieldset>

        <div class="ActionsContainer">
          <DialogClose as-child>
            <button 
              class="Button danger" 
              @click="handleDeleteWallet"
              :disabled="isSubmitting"
            >
              Excluir
            </button>
          </DialogClose>
          <div class="RightActions">
            <DialogClose as-child>
              <button 
                class="Button confirm" 
                @click="handleUpdateWalletName"
                :disabled="isSubmitting"
              >
                {{ isSubmitting ? 'Salvando...' : 'Salvar' }}
              </button>
            </DialogClose>
          </div>
        </div>

        <DialogClose class="IconButton" aria-label="Close">
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

.edit-button {
  position: absolute;
  top: 0;
  right: 0;
  background: var(--color-gray-medium);
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 10;
  transform: translate(30%, -30%);
  transition: all 0.2s ease;
}

.edit-button:hover {
  background: var(--color-gray-light);
  transform: translate(30%, -30%) scale(1.1);
}

.DialogOverlay {
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  inset: 0;
  animation: overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 1000;
}

.DialogContent {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  max-width: 450px;
  max-height: 85vh;
  padding: 24px;
  animation: contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 1001;
}

.DialogContent:focus {
  outline: none;
}

.DialogTitle {
  margin: 0;
  font-weight: 600;
  color: var(--color-gray-dark);
  font-size: 18px;
}

.DialogDescription {
  margin: 8px 0 16px;
  color: var(--color-gray-medium);
  font-size: 14px;
  line-height: 1.5;
}

.Fieldset {
  display: flex;
  gap: 20px;
  align-items: center;
  margin-bottom: 15px;
}

.Label {
  font-size: 15px;
  color: var(--color-green-medium);
  width: 90px;
  text-align: right;
}

.Input {
  width: 100%;
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  padding: 0 10px;
  font-size: 15px;
  line-height: 1;
  color: var(--color-green-medium);
  box-shadow: 0 0 0 1px var(--color-green-medium);
  height: 35px;
}
.Input:focus {
  box-shadow: 0 0 0 2px var(--color-green-medium);
}

.ActionsContainer {
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
}

.RightActions {
  display: flex;
  gap: 8px;
}

.Button {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.Button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.Button.confirm {
  background-color: var(--color-green-medium);
  color: white;
}

.Button.confirm:hover:not(:disabled) {
  background-color: var(--color-green-high);
}

.Button.cancel {
  background-color: white;
  color: var(--color-gray-dark);
  border: 1px solid var(--color-gray-light);
}

.Button.cancel:hover:not(:disabled) {
  background-color: var(--color-gray-lightest);
}

.Button.danger {
  background-color: var(--color-red-medium);
  color: white;
}

.Button.danger:hover:not(:disabled) {
  background-color: var(--color-red-high);
}

.IconButton {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: var(--color-gray-medium);
  cursor: pointer;
  transition: background-color 0.2s;
}

.IconButton:hover {
  background-color: var(--color-gray-lightest);
}

.icon {
  width: 20px;
  height: 20px;
  stroke: currentColor;
  stroke-width: 2;
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