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
import {PlusIcon, XMarkIcon} from '@heroicons/vue/24/outline'
import { ref } from 'vue';
import { useAPI } from '@/composables/useApi';
import { AxiosError } from 'axios';

const props = defineProps<{
  refreshWallets: () => void
}>()

const name = ref('')
const type = ref('PERSONAL')
const isCreatingWaller = ref(false)

async function handleCreateWallet(){
    if(name.value.length < 3){
        return alert("Por favor, dê um nome com mais de 3 letras para sua carteira")
    }
    const api = await useAPI();
    if (!api) {
        return;
    }
    isCreatingWaller.value = true
    try{
        await api.server.post("/api/wallet", {name: name.value, type: type.value})
        name.value = ""
        props.refreshWallets()
    }catch(error){
        if(error instanceof AxiosError){
            return alert(error.response?.data.message)
        }
    }finally{
      isCreatingWaller.value = false
    }
}

</script>

<template>
  <DialogRoot>
    <DialogTrigger>
        <div class="Avatar">
            <PlusIcon class="icon"/>
        </div>
        <p className="AvatarLabel">Criar carteira</p>
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay class="DialogOverlay" />
      <DialogContent
        class="DialogContent"
      >
        <DialogTitle class="DialogTitle">
          Criar nova carteira
        </DialogTitle>
        <DialogDescription class="DialogDescription">
          Crie uma carteira para gerenciar suas finanças!
        </DialogDescription>

        <fieldset class="Fieldset">
          <label class="Label" for="name"> Nome </label>
          <input
            id="name"
            class="Input"
            v-model="name"
            placeholder="Digite o nome da carteira"
          />
        </fieldset>

        <fieldset class="Fieldset">
          <label class="Label" for="type"> Tipo </label>
          <select
            id="type"
            name="type"
            class="Select"
            v-model="type"
          >
            <option value="PERSONAL">Pessoal</option>
            <option value="ENTERPRISE">Empresarial</option>
          </select>
        </fieldset>

        <div :style="{ display: 'flex', marginTop: 25, justifyContent: 'flex-end' }">
          <DialogClose as-child>
            <button class="Button green" @click="handleCreateWallet">
              Criar
            </button>
          </DialogClose>
        </div>

        <DialogClose
          class="IconButton"
          aria-label="Close"
        >
          <XMarkIcon icon="lucide:x" />
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style>
button,
fieldset,
input {
  all: unset;
}

.Avatar {
    width: 7rem;
    height: 7rem;
    border: 1px;
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
    font-size: 1.25rem /* 20px */;
    line-height: 1.75rem;
    color: white;
    font-weight: bold;
}

.icon {
  width: 40px;
  height: 40px;
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
  max-height: 85vh;
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

.Select {
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