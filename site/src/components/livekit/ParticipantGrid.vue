<template>
  <div class="lk-participant-grid">
    <ParticipantTile v-for="p in allParticipants" :key="p.sid" :participant="p" :video-style="tileVideoStyle" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoom } from '@/composables/useRoom'
import ParticipantTile from './ParticipantTile.vue'

const props = defineProps({
  tileVideoStyle: { type: Object, default: () => ({}) }
})

const room = useRoom()

const allParticipants = computed(() => {
  const list = [room.localParticipant]
  for (const p of room.remoteParticipants.values()) {
    list.push(p)
  }
  return list
})
</script>

<style scoped>
.lk-participant-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 0.5rem;
  padding: 0.5rem;
  flex: 1;
  min-height: 0;
  overflow: auto;
}
</style>
