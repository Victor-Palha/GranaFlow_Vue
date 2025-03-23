<script setup lang="ts">
import { DialogClose, DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogRoot, DialogTitle } from 'radix-vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { useAPI } from '@/composables/useApi';

const OPEN = true

const props = defineProps<{
  handleClose: ()=>void
}>()


async function handleUpgradeAccount(){
  const api = await useAPI();
    if (!api) {
        return;
    }

  try {
    const response = await api.server.post("/api/upgrade")
    window.location.href = response.data.url;
  } catch (error) {
    console.error('Erro ao notificar pagamento:', error)
    alert('Não foi possível concluir o upgrade. Tente novamente.')
  }
}
</script>

<template>
  <DialogRoot :default-open="OPEN">
    <!-- <DialogTrigger /> -->
    <DialogPortal>
      <DialogOverlay class="DialogOverlay" />
      <DialogContent class="DialogContent">
        <DialogTitle class="DialogTitle">
          Upgrade Disponível!
        </DialogTitle>
        <DialogDescription class="DialogDescription">
          Sua conta está qualificada para um upgrade. Aproveite os benefícios de uma conta premium agora!
        </DialogDescription>

        <div class="actions">
          <button class="Button green" @click="handleUpgradeAccount">
            Confirmar
          </button>
        </div>

        <DialogClose class="IconButton" aria-label="Fechar" @click="props.handleClose">
          <XMarkIcon class="icon" />
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style scoped>
.btn {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn:hover {
  background-color: #45a049;
}

.DialogOverlay {
  background-color: rgba(0, 0, 0, 0.5);
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

.DialogTitle {
  font-weight: 500;
  color: #333;
  font-size: 17px;
}

.DialogDescription {
  margin: 10px 0 20px;
  color: #666;
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
  color: #333;
  position: absolute;
  top: 10px;
  right: 10px;
}

.IconButton:hover {
  background-color: #ddd;
}

.actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.Button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.Button:hover {
  background-color: #45a049;
}
</style>
