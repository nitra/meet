<template>
  <div v-if="room" class="lk-room-container">
    <KeyboardShortcuts />
    <VideoConference :show-settings="showSettingsMenu" />
    <DebugMode />
    <RecordingIndicator />
  </div>
  <div v-else class="lk-room-container lk-connecting">Підключення…</div>
</template>

<script setup>
import { ref, provide, onMounted, onUnmounted, computed, markRaw } from 'vue'
import { Room, RoomEvent, VideoPresets } from 'livekit-client'
import { LK_ROOM } from './roomSymbol'
import { useToast } from './toast'
import { useLowCPUOptimizer } from '@/composables/useLowCPUOptimizer'
import KeyboardShortcuts from './KeyboardShortcuts.vue'
import VideoConference from './VideoConference.vue'
import DebugMode from './DebugMode.vue'
import RecordingIndicator from './RecordingIndicator.vue'

const CONNECT_OPTIONS = { autoSubscribe: true }
const SHOW_SETTINGS_MENU = import.meta.env.VITE_SHOW_SETTINGS_MENU === 'true'

const props = defineProps({
  connectionDetails: { type: Object, required: true },
  userChoices: { type: Object, required: true },
  options: { type: Object, default: () => ({}) },
  isCustom: { type: Boolean, default: false },
  onLeave: { type: Function, default: null }
})

const { toast } = useToast()

const roomOptions = computed(() => {
  if (props.isCustom) {
    return {
      publishDefaults: {
        videoSimulcastLayers: [VideoPresets.h540, VideoPresets.h216],
        red: true,
        videoCodec: 'vp9'
      },
      adaptiveStream: { pixelDensity: 'screen' },
      dynacast: true,
      singlePeerConnection: props.options.singlePC
    }
  }
  return {
    videoCaptureDefaults: {
      deviceId: props.userChoices.videoDeviceId,
      resolution: props.options.hq ? VideoPresets.h2160 : VideoPresets.h720
    },
    publishDefaults: {
      dtx: false,
      videoSimulcastLayers: props.options.hq
        ? [VideoPresets.h1080, VideoPresets.h720]
        : [VideoPresets.h540, VideoPresets.h216],
      red: true,
      videoCodec: 'vp9'
    },
    audioCaptureDefaults: { deviceId: props.userChoices.audioDeviceId },
    adaptiveStream: true,
    dynacast: true,
    singlePeerConnection: true
  }
})

const room = ref(markRaw(new Room(roomOptions.value)))
provide(LK_ROOM, room.value)
const mounted = ref(true)

function handleLeave() {
  if (typeof props.onLeave === 'function') props.onLeave()
}

function handleError(err) {
  console.error(err)
  toast.error(props.isCustom ? `Помилка: ${err?.message ?? err}` : `Unexpected error, check console: ${err.message}`)
}

onMounted(() => {
  const r = room.value

  r.on(RoomEvent.Disconnected, handleLeave)
  r.on(RoomEvent.MediaDevicesError, handleError)

  r.connect(props.connectionDetails.serverUrl, props.connectionDetails.participantToken, CONNECT_OPTIONS)
    .then(() => {
      if (!mounted.value) return
      if (props.isCustom) return r.localParticipant.enableCameraAndMicrophone()
      if (props.userChoices.videoEnabled) r.localParticipant.setCameraEnabled(true).catch(handleError)
      if (props.userChoices.audioEnabled) r.localParticipant.setMicrophoneEnabled(true).catch(handleError)
    })
    .catch(error => {
      if (!mounted.value) return
      if (
        props.isCustom &&
        (error?.name === 'NotFoundError' || error?.message?.includes('Requested device not found'))
      ) {
        r.localParticipant.setCameraEnabled(true).catch(() => {
          /* ігнорувати помилку пристрою */
        })
        r.localParticipant.setMicrophoneEnabled(true).catch(() => {
          /* ігнорувати помилку пристрою */
        })
        return
      }
      handleError(error)
    })
})

onUnmounted(() => {
  mounted.value = false
  const r = room.value
  if (r) {
    r.off(RoomEvent.Disconnected, handleLeave)
    r.off(RoomEvent.MediaDevicesError, handleError)
  }
})

const showSettingsMenu = computed(() => SHOW_SETTINGS_MENU)

// room передаємо явно: в цьому компоненті ми робимо provide, тому inject тут ще недоступний
useLowCPUOptimizer(room.value, {})
</script>

<style scoped>
.lk-connecting {
  display: grid;
  place-items: center;
  color: var(--lk-fg);
}
</style>
