<script setup lang="ts">
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  
  const route = useRoute()
  
  const title = computed(() => {
    switch (route.params.result) {
      case 'success':
        return 'Pagamento aprovado ✅'
      case 'error':
        return 'Erro no pagamento ❌'
      case 'pending':
        return 'Pagamento pendente ⏳'
      default:
        return 'Status desconhecido'
    }
  })
  
  const message = computed(() => {
    switch (route.params.result) {
      case 'success':
        return 'Obrigado por se tornar um membro premium! 🎉'
      case 'error':
        return 'Ocorreu um problema ao processar seu pagamento.'
      case 'pending':
        return 'Estamos aguardando a confirmação do seu pagamento.'
      default:
        return 'Não conseguimos identificar o status do pagamento.'
    }
  })
</script>
<template>
    <div class="payment-result">
      <h1>{{ title }}</h1>
      <p>{{ message }}</p>
      <router-link to="/">Voltar ao início</router-link>
    </div>
</template>
  
<style scoped>
  .payment-result {
    text-align: center;
    padding: 2rem;
  }
</style>
  