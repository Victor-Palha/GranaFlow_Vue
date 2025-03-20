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
.container-wallet{
    /* items-center justify-center gap-2 */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    background-color: transparent;
    border: none;
}

.avatar {
  width: 7rem; /* 28 x 0.25rem */
  height: 7rem;
  border: 1px dashed black;
  border-radius: 9999px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 2px 5px black;
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