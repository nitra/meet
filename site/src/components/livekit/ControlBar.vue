<template>
  <div class="lk-control-bar">
    <div class="lk-button-group">
      <TrackToggle source="microphone" label="Мікрофон" />
      <MediaDeviceMenu kind="audioinput" />
    </div>
    <div class="lk-button-group">
      <TrackToggle source="camera" label="Камера" />
      <MediaDeviceMenu kind="videoinput" />
    </div>
    <button type="button" class="lk-button lk-disconnect" @click="disconnect">Вийти</button>
    <button v-if="showSettings" type="button" class="lk-button" aria-pressed="settingsOpen" @click="toggleSettings">
      Налаштування
    </button>
  </div>
</template>

<script setup>
import { useRoom } from '@/composables/useRoom'
import TrackToggle from './TrackToggle.vue'
import MediaDeviceMenu from './MediaDeviceMenu.vue'

defineProps({
  showSettings: { type: Boolean, default: false },
  settingsOpen: { type: Boolean, default: false }
})

const emit = defineEmits(['toggle-settings'])

const room = useRoom()

function disconnect() {
  room.disconnect(true)
}

function toggleSettings() {
  emit('toggle-settings')
}
</script>

<style scoped>
.lk-control-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.5rem;
  align-items: center;
  justify-content: center;
  background: var(--lk-bg2, #1a1a1a);
}
.lk-button-group {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}
.lk-disconnect {
  background: var(--lk-danger, #c00);
  color: #fff;
}
</style>
