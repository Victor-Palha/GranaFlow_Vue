<script setup lang="ts">
import SubHeader from '@/components/SubHeader.vue';
import { usePayments } from '@/composables/usePayments';
import { useRoute } from 'vue-router';

const route = useRoute()
const wallet_id = route.params.id

const {
    handlePaymentsMethods,
    isTransactionsLoading,
    paymentsMethods,
    selectedTransactions
} = usePayments()


</script>

<template>
    <SubHeader namePage="Transações"/>
</template>

<style scoped>

</style>