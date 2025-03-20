<script setup lang="ts">
defineProps<{
  title: string
  target: string
}>()
</script>

<template>
    <div class="box-nav">
        <router-link :to="target" class="icon-wrapper">
            <slot />
        </router-link>
        <span class="title">{{ title }}</span>
    </div>
</template>

<style scoped>
.box-nav {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.icon-wrapper {
  background-color: var(--color-green-medium);
  padding: 0.5rem;
  border-radius: 50%;
  border: 1px solid var(--color-green-high);
  display: flex;
  justify-content: center;
  align-items: center;
}

.title {
  font-size: 0.75rem;
  font-weight: 600;
  color: #1a1a1a;
}
</style>
