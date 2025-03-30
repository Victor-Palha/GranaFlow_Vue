<script lang="ts" setup>
import router from '@/router';
import { ChevronLeftIcon } from '@heroicons/vue/24/outline';
const props = defineProps<{
    namePage: string
}>()

function handleBack(){
    router.back()
}

</script>

<template>
    <header>
        <ChevronLeftIcon class="backHeader" @click="handleBack"/>
        <h1>{{props.namePage}}</h1>
    </header>
</template>

<style scoped>
header{
    background: linear-gradient(to bottom, 
        var(--color-green-high), 
        var(--color-green-medium)
    );
    width: 100%;
    height: 70px;
    padding: 1rem;
    align-items: center;
    box-shadow: 0px 0px 5px #000;
    gap: 5px;
    display: flex;
    justify-content: center;
}

h1{
    font-size: 1.25rem /* 20px */;
    line-height: 1.75rem;
    margin: 0 auto;
    font-weight: bolder;
    color: white;
}
</style>