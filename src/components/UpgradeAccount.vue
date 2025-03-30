<script setup lang="ts">
import { DialogClose, DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogRoot, DialogTitle } from 'radix-vue'
import { HomeIcon, BriefcaseIcon, ChartBarIcon, DocumentTextIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import { useAPI } from '@/composables/useApi';
import useCustomToast from '@/composables/useCustomToast';

const OPEN = true

const props = defineProps<{
  handleClose: ()=>void
}>()

const {showError} = useCustomToast()

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
    showError('Não foi possível concluir o upgrade. Tente novamente.')
  }
}
</script>

<template>
  <DialogRoot :default-open="OPEN">
    <DialogPortal>
      <DialogOverlay class="DialogOverlay" />

      <DialogContent class="DialogContent">

        <div class="left-info">
          <DialogTitle class="DialogTitle">
            Upgrade Disponível!
          </DialogTitle>

          <DialogDescription class="DialogDescription">
            Seu upgrade para conta Premium está disponível! <br>
            Apenas uma única vez, e você garante benefícios incríveis durante todo uso. 
          </DialogDescription>

        </div>

        <div class="right-info">
          <h3>Benefícios Exclusivos para Conta Premium:</h3>
          <ul class="list">
            <li class="benefits">
              <HomeIcon class="icon" />
              <span>Carteiras ilimitadas</span>
            </li>
            <li class="benefits">
              <BriefcaseIcon class="icon" />
              <span>Carteira empresarial</span>
            </li>
            <li class="benefits">
              <ChartBarIcon class="icon" />
              <span>Relatórios customizados</span>
            </li>
            <li class="benefits">
              <DocumentTextIcon class="icon" />
              <span>Acesso a comprovantes</span>
            </li>
          </ul>

          <div class="actions">
            <button class="Button green" @click="handleUpgradeAccount">
              Quero ser Premium
            </button>
          </div>
        </div>


        <DialogClose class="IconButton" aria-label="Fechar" @click="props.handleClose">
          <XMarkIcon class="icon" />
        </DialogClose>
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
  backdrop-filter: blur(5px);
}

.DialogContent {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  position: fixed;
  display: flex;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  max-width: 1000px;
  animation: contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}

.icon {
  width: 30px;
  height: 30px;
  stroke: #000;
  stroke-width: 1.5;
  transition: transform 0.3s ease;
}

.icon:hover {
  transform: scale(1.1);
}

.DialogTitle {
  font-weight: 700;
  color: #ffffff;
  font-size: 28px;
  font-family: 'Playwrite', sans-serif;
  margin-bottom: 10px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.DialogDescription {
  margin: 10px 0 20px;
  color: #ffffff;
  font-size: 16px;
  line-height: 1.6;
  text-align: center;
  font-style: italic;
  opacity: 0.9;
}

.left-info {
  border-radius: 12px 0 0 12px;
  background: linear-gradient(135deg, var(--color-green-medium), #2ecc71);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  width: 40%;
}

.right-info {
  padding: 40px;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 60%;
}

.right-info h3 {
  font-family: 'Playwrite', sans-serif;
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}

.list {
  margin-top: 25px;
  gap: 25px;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.benefits {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 45%;
  text-align: center;
}

.benefits span {
  font-weight: bold;
  color: var(--color-green-medium);
  font-size: 16px;
}

.IconButton {
  font-family: inherit;
  border-radius: 50%;
  height: 40px;
  width: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #333;
  position: absolute;
  top: 15px;
  right: 15px;
  background-color: rgba(255, 255, 255, 0.8);
  transition: background-color 0.3s ease;
}

.IconButton:hover {
  background-color: rgba(255, 255, 255, 1);
}

.actions {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}

.Button {
  padding: 12px 30px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.Button:hover {
  background-color: #45a049;
  transform: translateY(-2px);
}

.Button:active {
  transform: translateY(0);
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
