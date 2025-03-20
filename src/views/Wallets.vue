<script setup lang="ts">
import CreateWallet from '@/components/CreateWallet.vue';
import Profiles from '@/components/Profiles.vue';
import { ArrowRightStartOnRectangleIcon } from '@heroicons/vue/24/outline'

function test(wallet_id: number){
    alert(wallet_id)
}
</script>

<template>
    <main class="main-container">
        <header class="header">
            <img alt="Grana Flow logo" src="@/assets/logo.png" width="70" height="70" />
            <ArrowRightStartOnRectangleIcon class="icon"/>
        </header>

        <div class="container-info">
            <h1>Carteiras</h1>
            <span>Centralize suas finanças em um único lugar</span>
        </div>

        <nav class="wallets-container">
            <Profiles type="PERSONAL" name="BANANNA" :id="1" :handleSelectWallet="test"/>
            <Profiles type="yes" name="ABACAXI" :id="1" :handleSelectWallet="test"/>
            <CreateWallet/>
        </nav>
    </main>
</template>

<style scoped>

.header{
    display: flex;
    padding: 1rem;
    align-items: center;
    justify-content: space-between;
}

.icon {
  width: 40px;
  height: 40px;
  stroke: #fff; /* ícones outline usam stroke */
  stroke-width: 1.5;
  transition: 0.5s;
}

.icon:hover{
    stroke: var(--color-red-medium);
    transform: scale(1.1);
    filter: drop-shadow(0px 2px 5px rgba(0, 0, 0, 0.4));
}

.container-info{
    margin-top: 5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    color: white;
    font-family: 'Playwrite', sans-serif;
}

.wallets-container{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
    margin-top: 1.25rem;
}

@media screen and (min-width: 871px) {
    .wallets-container{
        flex-direction: row;
        justify-content: center;
    }
}
</style>