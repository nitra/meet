<template>
  <div class="lk-participant-tile">
    <VideoTrack v-if="videoTrackRef" :track-ref="videoTrackRef" :style="videoStyle" />
    <div v-else class="lk-placeholder">
      <span>{{ participant.identity ?? participant.name }}</span>
    </div>
    <div class="lk-participant-name">{{ participant.identity ?? participant.name }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Track } from 'livekit-client'
import VideoTrack from './VideoTrack.vue'

const props = defineProps({
  participant: { type: Object, required: true },
  videoStyle: { type: Object, default: () => ({}) }
})

const videoTrackRef = computed(() => {
  const pub = [...props.participant.trackPublications.values()].find(p => p.source === Track.Source.Camera && p.track)
  if (!pub) return null
  return {
    participant: props.participant,
    publication: pub,
    source: Track.Source.Camera
  }
})
</script>

<style scoped>
.lk-participant-tile {
  position: relative;
  background: var(--lk-bg3, #252525);
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 16/10;
}
.lk-participant-tile video {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.lk-placeholder {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  color: var(--lk-fg2);
  font-size: 1.25rem;
}
.lk-participant-name {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.25rem 0.5rem;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: #fff;
  font-size: 0.875rem;
}
</style>
