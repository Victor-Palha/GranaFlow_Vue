<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const {validateAuth, onLogin, isLoading} = useAuthStore()

onMounted(() => {
  validateAuth()
})
</script>

<template>
  <main class="main-container main">
    <header>
      <div class="logo">
        <img alt="Grana Flow logo" src="@/assets/logo.png" width="200" height="200" />
        <h1 class="logo-text">Grana<span>Flow</span></h1>
      </div>

      <div class="label-info">
        <h2>Controle suas finanças</h2>
        <span>Pessoais e Empresariais.</span>
      </div>
    </header>

    <nav>
      <button class="btn-provider" @click="onLogin" :disabled="isLoading">
        <img alt="google logo" src="@/assets/Google.png" width="30" height="30" />
        <span>Entrar com Google</span>
      </button>
    </nav>

  </main>
</template>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5rem 0;
  gap: 10rem
}

.logo{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 2rem 0;
}

.logo-text{
  font-family: 'Playwrite', sans-serif;
}

.logo-text span{
  color: var(--color-green-low);
}

.label-info{
  gap: 1rem;
  text-align: center;
  display: flex;
  flex-direction: column;
}

.label-info h2{
  font-family: 'Playwrite', sans-serif;
  font-size: 2rem;
  line-height: 2.5rem;
  color: var(--color-green-low);
  text-shadow: 0px 5px 5px var(--color-green-high);
}

.label-info span{
  font-family: 'Playwrite', sans-serif;
  font-size: 1.5rem;
  line-height: 2rem;
  color: #fff;
  text-shadow: 0px 5px 5px #00000085;
}

.btn-provider{
  display: flex;
  align-items: center;
  gap: 1.25rem;
  background-color: #fff;
  justify-content: center;
  border-radius: 0.5rem;
  padding: 0.75rem 2.5rem;
  transition: 0.5s;
  cursor: pointer;
  border: none;
}

.btn-provider:hover{
  box-shadow: 2px 5px 15px #000;
}

.btn-provider span{
  font-size: 1.25rem;
}

.btn-provider:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
  opacity: 0.7;
  box-shadow: none;
  transform: none;
}

.btn-provider:disabled:hover {
  box-shadow: none;
  background-color: #f3f4f6;
}

.btn-provider:disabled span {
  color: #9ca3af;
}

</style>
