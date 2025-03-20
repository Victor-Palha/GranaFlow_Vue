<script setup lang="ts">
</script>

<template>
    <div class="transactions-loading">
        <div class="left">
            <div class="icon-placeholder" />
    
            <div class="text-placeholder">
            <div class="line line-half" />
            <div class="line line-third" />
            <div class="line line-three-quarter" />
            </div>
        </div>
  
        <div class="right">
            <div class="line line-amount" />
            <div class="line line-date" />
        </div>
    </div>
</template>
  
  
  <style scoped>
  .transactions-loading {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    min-width: 400px;
    padding-bottom: 12px;
    animation: pulse 1.5s infinite ease-in-out;
  }
  
  .left {
    display: flex;
    flex: 1;
    flex-direction: row;
    gap: 12px;
    align-items: flex-start;
  }
  
  .icon-placeholder {
    width: 40px;
    height: 40px;
    background-color: #d1d5db; /* gray-300 */
    border: 1px solid #d1d5db;
    border-radius: 9999px;
    padding: 12px;
  }
  
  .text-placeholder {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: 2px;
  }
  
  .right {
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: flex-end;
    margin-left: 12px;
  }
  
  .line {
    height: 12px;
    background-color: #d1d5db; /* gray-300 */
    border-radius: 4px;
  }
  
  .line-half {
    width: 50%;
    height: 16px;
  }
  
  .line-third {
    width: 33%;
  }
  
  .line-three-quarter {
    width: 75%;
  }
  
  .line-amount {
    width: 56px;
    height: 16px;
  }
  
  .line-date {
    width: 48px;
  }

  @media screen and (max-width: 450px) {
    .transactions-loading {
      min-width: 250px;
      max-width: 250px;
      padding-bottom: 8px;
    }

    .line-half {
      width: 60%;
    }

    .line-third {
      width: 45%;
    }

    .line-three-quarter {
      width: 70%;
    }

    .line-amount {
      width: 50px;
    }

    .line-date {
      width: 40px;
    }
  }
</style>
  