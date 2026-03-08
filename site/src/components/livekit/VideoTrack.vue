<template>
  <video v-if="trackRef?.publication?.kind === 'video'" ref="elRef" autoplay playsinline muted :style="style" />
  <audio v-else-if="trackRef?.publication?.kind === 'audio'" ref="elRef" autoplay :style="style" />
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'

const props = defineProps({
  trackRef: { type: Object, default: null },
  style: { type: Object, default: () => ({}) }
})

const elRef = ref(null)

watch(
  () => props.trackRef?.publication?.track,
  (track, prevTrack) => {
    const el = elRef.value
    if (prevTrack && el) {
      try {
        prevTrack.detach(el)
      } catch {
        /* трек вже від’єднано або елемент знищено */
      }
    }
    if (track && el) {
      track.attach(el)
    }
  },
  { immediate: true }
)

onUnmounted(() => {
  const track = props.trackRef?.publication?.track
  const el = elRef.value
  if (track && el) {
    try {
      track.detach(el)
    } catch {
      /* трек вже від’єднано або елемент знищено */
    }
  }
})
</script>
