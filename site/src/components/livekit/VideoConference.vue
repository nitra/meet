<template>
  <div class="lk-video-conference">
    <ParticipantGrid />
    <ControlBar
      :show-settings="showSettings"
      :settings-open="settingsOpen"
      @toggle-settings="settingsOpen = !settingsOpen" />
    <div v-if="showSettings && settingsOpen" class="lk-settings-overlay">
      <SettingsMenu @close="settingsOpen = false" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ParticipantGrid from './ParticipantGrid.vue'
import ControlBar from './ControlBar.vue'
import SettingsMenu from './SettingsMenu.vue'

defineProps({
  showSettings: { type: Boolean, default: false }
})

const settingsOpen = ref(false)
</script>

<style scoped>
.lk-video-conference {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
}
.lk-settings-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1rem;
}
</style>
