<template>
    <div class="wallets-loading">
      <div class="wallet-container">
        <button class="wallet-item">
          <div class="wallet-circle"></div>
          <div class="wallet-text"></div>
        </button>
      </div>
      <div class="wallet-container">
        <button class="wallet-item">
          <div class="wallet-circle"></div>
          <div class="wallet-text"></div>
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  </script>
  
  <style scoped>
  .wallets-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    margin-top: 20px;
  }
  
  .wallet-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
  }
  
  .wallet-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    animation: pulse 1.5s infinite ease-in-out;
  }
  
  .wallet-circle {
    width: 112px;
    height: 112px;
    border: 2px dashed black;
    border-radius: 50%;
    background-color: #d1d5db; /* gray-300 equivalent */
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* Shadow */
  }
  
  .wallet-text {
    width: 112px;
    height: 24px;
    background-color: #d1d5db; /* gray-300 equivalent */
    border-radius: 8px;
  }
  
  /* Pulsing animation */
  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }
  </style>
  