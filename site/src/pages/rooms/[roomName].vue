<template>
  <LiveKitRoom v-if="roomName" :room-name="roomName" :region="region" :hq="hq" :on-leave="goHome" />
  <h2 v-else>Missing room name</h2>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LiveKitRoom from '@/components/LiveKitRoom.vue'

const route = useRoute()
const router = useRouter()

const roomName = computed(() => route.params.roomName ?? undefined)
const region = computed(() => route.query.region ?? undefined)
const hq = computed(() => route.query.hq === 'true')

function goHome() {
  router.push('/')
}
</script>
