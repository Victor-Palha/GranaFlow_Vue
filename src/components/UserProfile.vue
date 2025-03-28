<script setup lang="ts">
import { ref } from 'vue'
import { HoverCardArrow, HoverCardContent, HoverCardPortal, HoverCardRoot, HoverCardTrigger } from 'radix-vue'
import type { UserProfile } from '@/stores/localStoragePersistence';

const props = defineProps<{
    user: UserProfile | null
}>()

const hoverState = ref(false)
</script>

<template>
  <HoverCardRoot v-model:open="hoverState">
    <HoverCardTrigger
      class="ImageTrigger"
    >
      <img
        class="Image normal"
        src="@/assets/logo.png"
        :alt="props.user?.name || 'User avatar'"
      >
    </HoverCardTrigger>
    <HoverCardPortal>
      <HoverCardContent
        class="HoverCardContent"
        :side-offset="5"
      >
        <div class="ProfileContainer">
          <div class="ProfileHeader">
            <img
              class="Image large"
              src="@/assets/logo.png"
              :alt="props.user?.name || 'User avatar'"
            />
            <div v-if="props.user?.is_premium" class="PremiumBadge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--color-yellow-medium)" stroke="var(--color-yellow-high)">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
              <span>Premium</span>
            </div>
          </div>
          <div class="ProfileInfo">
            <div class="UserMainInfo">
              <h3 class="Text bold">
                {{ props.user?.name || 'Anonymous User' }}
              </h3>
              <p class="Text faded">
                {{ props.user?.email }}
              </p>
            </div>
            <div class="UserStats">
              <div class="StatItem">
                <div class="StatNumber">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M22 12H18L15 21L9 3L6 12H2" />
                  </svg>
                </div>
                <div class="Text faded">
                  Active user
                </div>
              </div>
              <div v-if="props.user?.is_premium" class="StatItem">
                <div class="StatNumber">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                </div>
                <div class="Text faded">
                  Premium member
                </div>
              </div>
            </div>
          </div>
        </div>
        <HoverCardArrow class="HoverCardArrow" :width="8" />
      </HoverCardContent>
    </HoverCardPortal>
  </HoverCardRoot>
</template>

<style>
.HoverCardContent {
  border-radius: 12px;
  padding: 1.5rem;
  width: 320px;
  background-color: var(--color-gray-light);
  border: 1px solid var(--color-gray-medium);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 
              0 8px 10px -6px rgba(0, 0, 0, 0.1);
  animation-duration: 300ms;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, opacity;
  color: var(--color-gray-dark);
}

.ProfileContainer {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.ProfileHeader {
  position: relative;
  display: flex;
  justify-content: center;
}

.PremiumBadge {
  position: absolute;
  bottom: -8px;
  background-color: var(--color-yellow-low);
  border: 1px solid var(--color-yellow-medium);
  color: var(--color-yellow-high);
  padding: 4px 8px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.ProfileInfo {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.UserMainInfo {
  text-align: center;
}

.UserStats {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 0.5rem;
}

.StatItem {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.StatNumber {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--color-blue-low);
  color: var(--color-blue-high);
}

.HoverCardArrow {
  fill: var(--color-gray-light);
  stroke: var(--color-gray-medium);
  stroke-width: 1px;
}

.ImageTrigger {
  cursor: pointer;
  border-radius: 50%;
  display: inline-block;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.ImageTrigger:hover {
  transform: scale(1.05);
}

.ImageTrigger:focus {
  box-shadow: 0 0 0 3px var(--color-blue-low);
  outline: none;
}

.Image {
  display: block;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.Image.normal {
  width: 48px;
  height: 48px;
}

.Image.large {
  width: 80px;
  height: 80px;
}

.Text {
  margin: 0;
  color: var(--color-gray-dark);
  font-size: 0.9375rem;
  line-height: 1.6;
}

.Text.faded {
  color: var(--color-gray-medium);
  font-size: 0.875rem;
}

.Text.bold {
  font-weight: 600;
  color: var(--color-gray-dark);
}

@keyframes slideUpAndFade {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideRightAndFade {
  from {
    opacity: 0;
    transform: translateX(-8px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideDownAndFade {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideLeftAndFade {
  from {
    opacity: 0;
    transform: translateX(8px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 480px) {
  .HoverCardContent {
    width: 280px;
    padding: 1rem;
  }
  
  .Image.large {
    width: 64px;
    height: 64px;
  }
}
</style>