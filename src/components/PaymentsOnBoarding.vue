<script setup lang="ts">
import { ref, onMounted } from 'vue'

const steps = ref([
  {
    target: '.create-btn',
    title: 'Criar Transações',
    content: 'Aqui você pode adicionar novas transações. Clique no botão para começar.',
    position: 'left'
  },
  {
    target: '.methods-container',
    title: 'Filtrar Transações',
    content: 'Use esses botões para filtrar suas transações por tipo: Todas, Entradas, Saídas ou Futuras.',
    position: 'bottom'
  },
  {
    target: '.transactions-wrapper',
    title: 'Lista de Transações',
    content: 'Aqui aparecem todas as suas transações, ordenadas por data. Clique em uma para ver detalhes ou editar.',
    position: 'top'
  }
])

const currentStep = ref(0)
const showOnboarding = ref(false)

function nextStep() {
  if (currentStep.value < steps.value.length - 1) {
    currentStep.value++
  } else {
    finishOnboarding()
  }
}

function finishOnboarding() {
  showOnboarding.value = false
  localStorage.setItem('paymentOnboardingCompleted', 'true')
}

const getHighlightStyle = (selector: string) => {
  const element = document.querySelector(selector)
  if (!element) return { display: 'none' }

  const rect = element.getBoundingClientRect()
  return {
    top: `${rect.top}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    display: 'block'
  }
}

onMounted(() => {
  if (!localStorage.getItem('paymentsOnboardingCompleted')) {
    showOnboarding.value = true
  }
})
</script>

<template>
  <div v-if="showOnboarding" class="onboarding-overlay">
    <div class="highlight-box" :style="getHighlightStyle(steps[currentStep].target)">
      <div class="tooltip" :class="steps[currentStep].position">
        <h3>{{ steps[currentStep].title }}</h3>
        <p>{{ steps[currentStep].content }}</p>
        <div class="tooltip-actions">
          <button v-if="currentStep > 0" @click="currentStep--">Voltar</button>
          <button @click="nextStep">
            {{ currentStep === steps.length - 1 ? 'Entendi!' : 'Próximo' }}
          </button>
        </div>
        <div class="step-counter">
          Passo {{ currentStep + 1 }} de {{ steps.length }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.onboarding-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  pointer-events: none;
}

.highlight-box {
  position: absolute;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.7);
  border-radius: 8px;
  transition: all 0.3s ease;
  pointer-events: auto;
}

.tooltip {
  position: absolute;
  background: var(--color-gray-dark);
  color: white;
  padding: 1.5rem;
  border-radius: 8px;
  width: 300px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.tooltip.bottom {
  top: calc(100% + 15px);
  left: 50%;
  transform: translateX(-50%);
}

.tooltip.right {
  left: calc(100% + 15px);
  top: 50%;
  transform: translateY(-50%);
}

.tooltip.left {
  right: calc(100% + 15px);
  top: 50%;
  transform: translateY(-50%);
}

.tooltip.top {
  bottom: calc(100% + 15px);
  left: 50%;
  transform: translateX(-50%);
}

.tooltip h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: var(--color-green-low);
}

.tooltip p {
  margin-bottom: 1rem;
}

.tooltip-actions {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
}

.tooltip-actions button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  flex: 1;
}

.tooltip-actions button:last-child {
  background-color: var(--color-green-low);
  color: black;
}

.step-counter {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.8rem;
  opacity: 0.7;
}
</style>