<template>
  <div
    class="lk-recording-indicator"
    :style="{
      boxShadow: isRecording ? 'var(--lk-danger3) 0px 0px 0px 3px inset' : 'none'
    }" />
</template>

<script setup>
import { ref, watch, getCurrentInstance } from 'vue'
import { useIsRecording } from '@/composables/useIsRecording'
import { useToast } from './toast'

const instance = getCurrentInstance()
const isRecording = useIsRecording()
const { toast } = useToast()
const wasRecording = ref(false)

watch(
  isRecording,
  rec => {
    if (instance?.isUnmounted) return
    if (rec && !wasRecording.value) {
      wasRecording.value = true
      toast('This meeting is being recorded', {
        duration: 3000,
        icon: '🎥',
        position: 'top-center',
        className: 'lk-button',
        style: {
          backgroundColor: 'var(--lk-danger3)',
          color: 'var(--lk-fg)'
        }
      })
    }
    if (!rec) wasRecording.value = false
  },
  { immediate: true }
)
</script>

<style scoped>
.lk-recording-indicator {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
