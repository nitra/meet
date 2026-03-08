<template><!-- без UI --></template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useTrackToggle } from '@/composables/useTrackToggle'
import { Track } from 'livekit-client'

const { toggle: toggleMic } = useTrackToggle({ source: Track.Source.Microphone })
const { toggle: toggleCamera } = useTrackToggle({ source: Track.Source.Camera })

function handleShortcut(event) {
  if (toggleMic && event.key === 'a' && (event.ctrlKey || event.metaKey)) {
    event.preventDefault()
    toggleMic()
  }
  if (event.key === 'v' && (event.ctrlKey || event.metaKey)) {
    event.preventDefault()
    toggleCamera()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleShortcut)
})
onUnmounted(() => {
  window.removeEventListener('keydown', handleShortcut)
})
</script>
