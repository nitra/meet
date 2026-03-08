<template>
  <main v-if="liveKitUrl && token" data-lk-theme="default" style="height: 100%">
    <LiveKitRoom :live-kit-url="liveKitUrl" :token="token" :single-peer-connection="singlePC" :on-leave="goHome" />
  </main>
  <h2 v-else-if="!liveKitUrl">Missing LiveKit URL</h2>
  <h2 v-else>Missing LiveKit token</h2>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LiveKitRoom from '@/components/LiveKitRoom.vue'

const route = useRoute()
const router = useRouter()

const liveKitUrl = computed(() => route.query.liveKitUrl ?? undefined)
const token = computed(() => route.query.token ?? undefined)
const singlePC = computed(() => route.query.singlePC === 'true')

function goHome() {
  router.push('/')
}
</script>
