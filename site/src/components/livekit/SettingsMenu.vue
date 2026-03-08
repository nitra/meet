<template>
  <div class="settings-menu lk-settings-menu">
    <div class="lk-settings-tabs">
      <button
        v-for="tab in tabs"
        :key="tab"
        type="button"
        class="lk-button lk-tab"
        :aria-pressed="activeTab === tab"
        @click="activeTab = tab">
        {{ settings[tab].label }}
      </button>
    </div>
    <div class="tab-content">
      <template v-if="activeTab === 'media'">
        <template v-if="settings.media?.camera">
          <h3>Камера</h3>
          <section>
            <CameraSettings />
          </section>
        </template>
        <template v-if="settings.media?.microphone">
          <h3>Мікрофон</h3>
          <section>
            <MicrophoneSettings />
          </section>
        </template>
        <template v-if="settings.media?.speaker">
          <h3>Динаміки</h3>
          <section class="lk-button-group">
            <span class="lk-button">Аудіо вихід</span>
            <MediaDeviceMenu kind="audiooutput" />
          </section>
        </template>
      </template>
      <template v-if="activeTab === 'recording'">
        <h3>Запис зустрічі</h3>
        <section>
          <p>
            {{ isRecording ? 'Зустріч зараз записується' : 'Немає активного запису' }}
          </p>
          <button type="button" class="lk-button" :disabled="processingRecRequest" @click="toggleRoomRecording">
            {{ isRecording ? 'Зупинити' : 'Почати' }} запис
          </button>
        </section>
      </template>
    </div>
    <div class="lk-settings-footer">
      <button type="button" class="lk-button" @click="$emit('close')">Закрити</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoom } from '@/composables/useRoom'
import { useIsRecording } from '@/composables/useIsRecording'
import MediaDeviceMenu from './MediaDeviceMenu.vue'
import CameraSettings from './CameraSettings.vue'
import MicrophoneSettings from './MicrophoneSettings.vue'

defineEmits(['close'])

const room = useRoom()
const recordingEndpoint = import.meta.env.VITE_LK_RECORD_ENDPOINT

const settings = computed(() => ({
  media: { camera: true, microphone: true, label: 'Медіа', speaker: true },
  recording: recordingEndpoint ? { label: 'Запис' } : undefined
}))

const tabs = computed(() =>
  Object.keys(settings.value).filter(t => settings.value[t] !== undefined && settings.value[t] !== null)
)

const activeTab = ref(tabs.value[0] ?? 'media')
const isRecording = useIsRecording()
const initialRecStatus = ref(isRecording.value)
const processingRecRequest = ref(false)

watch(
  () => isRecording.value,
  v => {
    if (initialRecStatus.value !== v) processingRecRequest.value = false
  }
)

async function toggleRoomRecording() {
  if (!recordingEndpoint) {
    throw new TypeError('No recording endpoint specified')
  }
  processingRecRequest.value = true
  initialRecStatus.value = isRecording.value
  const url = isRecording.value
    ? `${recordingEndpoint}/stop?roomName=${room.name}`
    : `${recordingEndpoint}/start?roomName=${room.name}`
  const response = await fetch(url)
  if (!response.ok) {
    console.error('Error handling recording request', response.status, response.statusText)
    processingRecRequest.value = false
  }
}
</script>

<style scoped>
.lk-settings-menu {
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  background: var(--lk-bg2, #1a1a1a);
  padding: 1rem;
  border-radius: 8px;
}
.lk-settings-tabs {
  display: flex;
  gap: 0.25rem;
  margin-bottom: 1rem;
}
.lk-tab {
  padding: 0.5rem;
  border-radius: 0;
  border-bottom: 3px solid var(--bg5, #333);
}
.lk-tab[aria-pressed='true'] {
  border-color: var(--lk-accent-bg);
}
.tab-content h3 {
  margin: 0.5rem 0 0.25rem;
  font-size: 1rem;
}
.tab-content section {
  margin-bottom: 1rem;
}
.lk-settings-footer {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-top: 1rem;
}
</style>
