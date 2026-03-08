<template>
  <button type="button" class="lk-button" :aria-pressed="enabled" :disabled="disabled" @click="toggle">
    <slot>{{ label }}</slot>
  </button>
</template>

<script setup>
import { useTrackToggle } from '@/composables/useTrackToggle'
import { Track } from 'livekit-client'

const props = defineProps({
  source: { type: String, required: true },
  label: { type: String, default: '' },
  disabled: { type: Boolean, default: false }
})

const sourceEnum =
  typeof props.source === 'number'
    ? props.source
    : props.source === 'microphone'
      ? Track.Source.Microphone
      : Track.Source.Camera

const { enabled, toggle } = useTrackToggle({ source: sourceEnum })
</script>
