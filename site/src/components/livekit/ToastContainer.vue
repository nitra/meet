<template>
  <Teleport to="body">
    <div class="lk-toast-container" aria-live="polite">
      <div v-for="t in toasts" :key="t.id" :class="t.className" class="lk-toast-item" :style="t.style">
        <span v-if="t.icon" class="lk-toast-icon">{{ t.icon }}</span>
        <span>{{ t.message }}</span>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { toastsRef } from './toast'

const toasts = toastsRef
</script>

<style scoped>
.lk-toast-container {
  position: fixed;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  pointer-events: none;
}
.lk-toast-item {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  pointer-events: auto;
}
.lk-toast-icon {
  font-size: 1.25rem;
}
</style>
