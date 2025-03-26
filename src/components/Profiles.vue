<script setup lang="ts">

defineProps<{
    id: number,
    type: string,
    name: string,
    handleSelectWallet(wallet_id: number): void
}>()

</script>

<template>
    <button class="container-wallet" @click="()=>handleSelectWallet(id)">
        <div class="avatar" :class="{'bg-yellow-medium': type === 'PERSONAL', 'bg-blue-medium': type !== 'PERSONAL'}">
            <span class="avatar-letter">{{ name[0] }}</span>
        </div>
        <p class="entity-name">{{ name }}</p>
    </button>
</template>

<style scoped>
.container-wallet {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.container-wallet:hover {
  transform: scale(1.1);
}

.avatar {
  width: 7rem;
  height: 7rem;
  border: 1px dashed black;
  border-radius: 9999px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.456);
  transition: box-shadow 0.3s ease;
}

.container-wallet:hover .avatar {
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.644);
}

.avatar-letter {
  font-size: 2.5rem;
}

.entity-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  margin-top: 0.5rem;
}

.bg-yellow-medium {
  background-color: var(--color-yellow-medium); /* amarelo médio */
}

.bg-blue-medium {
  background-color:  var(--color-blue-medium); /* azul médio */
}
</style>