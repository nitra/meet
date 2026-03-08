<template>
  <div class="lk-prejoin">
    <form class="lk-prejoin-form" @submit.prevent="onSubmitForm">
      <label>
        <span>Ваше ім’я</span>
        <input
          v-model="form.username"
          type="text"
          placeholder="Participant name"
          autocomplete="username"
          class="lk-input" />
      </label>
      <label class="lk-prejoin-checkbox">
        <input v-model="form.videoEnabled" type="checkbox" />
        <span>Увімкнути камеру</span>
      </label>
      <label class="lk-prejoin-checkbox">
        <input v-model="form.audioEnabled" type="checkbox" />
        <span>Увімкнути мікрофон</span>
      </label>
      <template v-if="devices.video.length > 1 || devices.audio.length > 1">
        <label v-if="devices.video.length > 1">
          <span>Камера</span>
          <select v-model="form.videoDeviceId" class="lk-input">
            <option value="">За замовчуванням</option>
            <option v-for="d in devices.video" :key="d.deviceId" :value="d.deviceId">
              {{ d.label || `Camera ${d.deviceId.slice(0, 8)}` }}
            </option>
          </select>
        </label>
        <label v-if="devices.audio.length > 1">
          <span>Мікрофон</span>
          <select v-model="form.audioDeviceId" class="lk-input">
            <option value="">За замовчуванням</option>
            <option v-for="d in devices.audio" :key="d.deviceId" :value="d.deviceId">
              {{ d.label || `Microphone ${d.deviceId.slice(0, 8)}` }}
            </option>
          </select>
        </label>
      </template>
      <button type="submit" class="lk-button" :disabled="loading" aria-label="Увійти">
        {{ loading ? 'Підключення…' : 'Приєднатися' }}
      </button>
      <p v-if="error" class="lk-prejoin-error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const props = defineProps({
  defaults: {
    type: Object,
    default: () => ({ username: '', videoEnabled: true, audioEnabled: true })
  }
})

const emit = defineEmits(['submit', 'error'])

const form = reactive({
  username: props.defaults.username ?? '',
  videoEnabled: props.defaults.videoEnabled ?? true,
  audioEnabled: props.defaults.audioEnabled ?? true,
  videoDeviceId: props.defaults.videoDeviceId ?? '',
  audioDeviceId: props.defaults.audioDeviceId ?? ''
})

const loading = ref(false)
const error = ref('')
const devices = reactive({ video: [], audio: [] })

async function loadDevices() {
  try {
    const list = await navigator.mediaDevices.enumerateDevices()
    devices.video = list.filter(d => d.kind === 'videoinput')
    devices.audio = list.filter(d => d.kind === 'audioinput')
  } catch (error) {
    emit('error', error)
  }
}

async function onSubmitForm() {
  error.value = ''
  loading.value = true
  try {
    const payload = {
      username: form.username.trim() || 'Participant',
      videoEnabled: form.videoEnabled,
      audioEnabled: form.audioEnabled,
      videoDeviceId: form.videoDeviceId || undefined,
      audioDeviceId: form.audioDeviceId || undefined
    }
    emit('submit', payload)
  } catch (error) {
    error.value = error?.message ?? String(error)
    emit('error', error)
  } finally {
    loading.value = false
  }
}

onMounted(loadDevices)
</script>

<style scoped>
.lk-prejoin {
  padding: 1.5rem;
  max-width: 400px;
  background: var(--lk-bg2, #1a1a1a);
  border-radius: 8px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
}
.lk-prejoin-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.lk-prejoin-form label {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.lk-prejoin-checkbox {
  flex-direction: row;
  align-items: center;
}
.lk-prejoin-checkbox input {
  margin-right: 0.5rem;
}
.lk-input {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid var(--lk-border, #333);
  background: var(--lk-bg3, #252525);
  color: var(--lk-fg, #fff);
}
.lk-prejoin-error {
  color: var(--lk-danger, #f44);
  font-size: 0.9rem;
  margin: 0;
}
</style>
