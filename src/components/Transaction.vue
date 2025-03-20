<script setup lang="ts">
import type { Transaction } from '@/types/transactions';
import { CurrencyDollarIcon, ArrowTrendingDownIcon } from '@heroicons/vue/24/outline';

const props = defineProps<{
    data: Transaction
}>()

const amountFormatted = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
}).format(parseFloat(props.data.amount));

</script>

<template>
    <div class="transaction-container">
        <!-- Left - Icon + Text  -->
        <div class="left-container">
            <div class="icons-container" :class="props.data.type === 'INCOME' ? 'icons-income' : 'icons-outcome'">
                <CurrencyDollarIcon v-if="props.data.type === 'INCOME'" class="icon"/>
                <ArrowTrendingDownIcon v-else class="icon"/>
            </div>

            <div class="container-info">
                <p>{{props.data.name}}</p>
                <span class="subtype">{{props.data.subtype}}</span>
                <span class="description">{{props.data.description}}</span>
            </div>
        </div>

        <div class="amount-container">
            <p class="amount-value" :class="props.data.type === 'INCOME' ? 'amount-value-income' : 'amount-value-outcome'">{{amountFormatted}}</p>
            <span class="date-transaction">{{props.data.transaction_date}}</span>
        </div>
    </div>
</template>

<style scoped>
.transaction-container{
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-width: 400px;
    padding-bottom: 0.75rem;
}

.left-container {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
}

.icons-container{
    display: flex;
    border-radius: 100%;
    padding: 0.75rem;
    border: 0.5px;
}

.icons-income{
    border-color: var(--color-green-high);
    background-color: var(--color-green-medium);
}
.icons-outcome{
    border-color: var(--color-red-high);
    background-color: var(--color-red-medium);
}

.container-info{
    display: flex;
    flex-direction: column;
}

.container-info p{
    /* font-semibold text-base text-gray-900 */
    font-weight: bold;
    color: #111827;
}

.container-info .subtype{
    font-size: 0.75rem;
    line-height: 1rem;
    font-style: italic;
    color: #374151;
}

.container-info .description{
    /* text-sm text-gray-600 mt-1 */
    font-size: 0.875rem;
    line-height: 1.25rem;
    margin-top: 0.25rem;
    color: #4b5563;
}

.amount-container{
    display: flex;
    flex-direction: column;
    align-items: end;
    margin-left: 0.75rem;
}

.amount-value{
    font-weight: bold;
    margin-bottom: 1rem;
}

.amount-value-income{
    color: var(--color-green-high);
}
.amount-value-outcome{
    color: var(--color-red-high);
}
.date-transaction{
    /* text-xs text-gray-500 */
    font-size: 0.75rem;
    color: #6b7280;
}
.icon {
  width: 20px;
  height: 20px;
  stroke: #000;
  stroke-width: 1.5;
}

@media screen and (max-width: 450px) {
    .transaction-container{
        min-width: 250px;
        max-width: 250px;
        padding-bottom: 0.5rem;
    }

    .container-info{
        display: flex;
        flex-direction: column;
    }

    .container-info p{
        /* font-semibold text-base text-gray-900 */
        font-size: 0.75rem;
        line-height: 1rem;
        font-weight: bold;
        color: #111827;
    }

    .container-info .subtype{
        font-size: 0.5rem;
        line-height: 1rem;
        font-style: italic;
        color: #374151;
    }

    .container-info .description{
        /* text-sm text-gray-600 mt-1 */
        font-size: 0.75rem;
        line-height: 1.25rem;
        margin-top: 0.25rem;
        color: #4b5563;
    }
}
</style>