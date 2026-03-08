<template>
  <div class="lk-camera-settings">
    <VideoTrack v-if="camTrackRef" :track-ref="camTrackRef" :style="previewStyle" />
    <section class="lk-button-group">
      <TrackToggle source="camera" label="Камера" />
      <MediaDeviceMenu kind="videoinput" />
    </section>
    <div class="lk-background-effects">
      <div class="lk-background-label">Фон</div>
      <div class="lk-background-buttons">
        <button
          type="button"
          class="lk-button lk-bg-btn"
          :aria-pressed="backgroundType === 'none'"
          :class="{ active: backgroundType === 'none' }"
          @click="selectBackground('none')">
          Немає
        </button>
        <button
          type="button"
          class="lk-button lk-bg-btn lk-bg-blur"
          :aria-pressed="backgroundType === 'blur'"
          :class="{ active: backgroundType === 'blur' }"
          @click="selectBackground('blur')">
          <span class="lk-bg-blur-preview" />
          <span class="lk-bg-label">Размиття</span>
        </button>
        <button
          v-for="img in backgroundImages"
          :key="img.path"
          type="button"
          class="lk-button lk-bg-btn lk-bg-img"
          :aria-pressed="backgroundType === 'image' && virtualBackgroundImagePath === img.path"
          :class="{ active: backgroundType === 'image' && virtualBackgroundImagePath === img.path }"
          :style="{ backgroundImage: `url(${img.path})` }"
          @click="selectBackground('image', img.path)">
          <span class="lk-bg-label">{{ img.name }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useLocalParticipant } from '@/composables/useLocalParticipant'
import { BackgroundBlur, VirtualBackground } from '@livekit/track-processors'
import { isLocalTrack, Track } from 'livekit-client'
import VideoTrack from './VideoTrack.vue'
import TrackToggle from './TrackToggle.vue'
import MediaDeviceMenu from './MediaDeviceMenu.vue'

const BACKGROUND_IMAGES = [
  { name: 'Desk', path: '/background-images/samantha-gades-BlIhVfXbi9s-unsplash.jpg' },
  { name: 'Nature', path: '/background-images/ali-kazal-tbw_KQE3Cbg-unsplash.jpg' }
]

const { cameraTrack, localParticipant } = useLocalParticipant()

const backgroundType = ref('none')
const virtualBackgroundImagePath = ref(null)

const camTrackRef = computed(() => {
  if (!cameraTrack.value) return null
  return {
    participant: localParticipant,
    publication: cameraTrack.value,
    source: Track.Source.Camera
  }
})

const previewStyle = {
  maxHeight: '280px',
  objectFit: 'contain',
  objectPosition: 'right',
  transform: 'scaleX(-1)'
}

function selectBackground(type, imagePath) {
  backgroundType.value = type
  if (type === 'image' && imagePath) {
    virtualBackgroundImagePath.value = imagePath
  } else if (type !== 'image') {
    virtualBackgroundImagePath.value = null
  }
}

watch(
  [cameraTrack, backgroundType, virtualBackgroundImagePath],
  ([cam, type, path]) => {
    const track = cam?.track
    if (track && isLocalTrack(track)) {
      if (type === 'blur') {
        track.setProcessor?.(BackgroundBlur())
      } else if (type === 'image' && path) {
        track.setProcessor?.(VirtualBackground(path))
      } else {
        track.stopProcessor?.()
      }
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.lk-camera-settings {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.lk-background-effects {
  margin-top: 10px;
}
.lk-background-label {
  margin-bottom: 8px;
}
.lk-background-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.lk-bg-btn {
  min-width: 80px;
  height: 60px;
  border: 1px solid #d1d1d1;
  position: relative;
  overflow: hidden;
}
.lk-bg-btn.active {
  border: 2px solid #0090ff;
}
.lk-bg-blur {
  background-color: #f0f0f0;
}
.lk-bg-blur-preview {
  position: absolute;
  inset: 0;
  background: #e0e0e0;
  filter: blur(8px);
  z-index: 0;
}
.lk-bg-img {
  background-size: cover;
  background-position: center;
  width: 80px;
}
.lk-bg-label {
  position: relative;
  z-index: 1;
  background: rgba(0, 0, 0, 0.6);
  padding: 2px 5px;
  border-radius: 4px;
  font-size: 12px;
}
</style>
