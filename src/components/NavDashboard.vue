<script setup lang="ts">
import IconNav from './IconNav.vue';
import { BanknotesIcon, ChartBarIcon } from '@heroicons/vue/24/outline';

defineProps<{
  walletId: string | string[]
}>()
</script>

<template>
    <div class="nav-container">
        <IconNav :title="'Transações'" :target="`#`">
            <BanknotesIcon class="icon"/>
        </IconNav>

        <IconNav :title="'Relatórios'" :target="`#`">
            <ChartBarIcon class="icon"/>
        </IconNav>
    </div>
</template>

<style scoped>
.nav-container {
    display: flex;
    flex-direction: row;
    background-color: #e5e5e5;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    position: relative;
    top: -50px;
    height: 100px;
    width: 80%;
    margin: 0 auto;
    justify-content: center;
    align-items: center;
    gap: 1rem;
}

.icon {
    width: 25px;
    height: 25px;
    stroke: #000;
    stroke-width: 1.5;
    transition: 0.5s;
}

@media screen and (min-width: 871px) {
    .nav-container{
        width: 60%;
    }
}
</style>
