<template>
  <div class="lk-button-group-menu">
    <select :value="selectedId" class="lk-button lk-select" :aria-label="label" @change="onChange">
      <option v-for="d in devices" :key="d.deviceId" :value="d.deviceId">
        {{ d.label || defaultLabel(d) }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoom } from '@/composables/useRoom'
import { Track } from 'livekit-client'

const props = defineProps({
  kind: { type: String, required: true },
  label: { type: String, default: '' }
})

const room = useRoom()
const devices = ref([])
const selectedId = ref('')

const mediaKind =
  props.kind === 'videoinput' ? 'videoinput' : props.kind === 'audioinput' ? 'audioinput' : 'audiooutput'

function defaultLabel(d) {
  const pre = props.kind === 'videoinput' ? 'Camera' : props.kind === 'audioinput' ? 'Mic' : 'Speaker'
  return `${pre} ${d.deviceId.slice(0, 8)}`
}

async function loadDevices() {
  const list = await navigator.mediaDevices.enumerateDevices()
  devices.value = list.filter(d => d.kind === mediaKind)
  if (devices.value.length && !selectedId.value) {
    selectedId.value = devices.value[0].deviceId
  }
}

async function onChange(e) {
  const deviceId = e.target.value
  selectedId.value = deviceId
  try {
    if (mediaKind === 'videoinput') {
      await room.localParticipant.setCameraEnabled(true, { deviceId })
    } else if (mediaKind === 'audioinput') {
      await room.localParticipant.setMicrophoneEnabled(true, { deviceId })
    } else {
      // audiooutput - set on room or track if supported
      const pub = room.localParticipant.getTrackPublication(Track.Source.Microphone)
      if (pub?.track?.mediaStreamTrack) {
        const stream = new MediaStream([pub.track.mediaStreamTrack])
        const audioEl = document.createElement('audio')
        audioEl.srcObject = stream
        audioEl.setSinkId?.(deviceId)
      }
    }
  } catch (error) {
    console.error('Device switch error', error)
  }
}

onMounted(loadDevices)
watch(
  () => props.kind,
  () => loadDevices()
)
</script>

<style scoped>
.lk-select {
  min-width: 120px;
}
</style>
