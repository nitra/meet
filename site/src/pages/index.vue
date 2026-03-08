<template>
  <main :class="$style.main" data-lk-theme="default">
    <div class="header">
      <img src="/images/livekit-meet-home.svg" alt="Nitra Live" width="360" height="45" />
      <h2>
        Open source video conferencing app built on
        <a href="https://github.com/livekit/components-js?ref=meet" rel="noopener">LiveKit&nbsp;Components</a>,
        <a href="https://livekit.io/cloud?ref=meet" rel="noopener">LiveKit&nbsp;Cloud</a>
        and Vite.
      </h2>
    </div>
    <div :class="$style.tabContent">
      <p style="margin: 0">Try Nitra Live for free with our live demo project.</p>
      <button type="button" style="margin-top: 1rem" class="lk-button" @click="startMeeting">Start Meeting</button>
    </div>
  </main>
  <footer data-lk-theme="default">
    Hosted on
    <a href="https://livekit.io/cloud?ref=meet" rel="noopener">LiveKit Cloud</a>. Source code on
    <a href="https://github.com/livekit/meet?ref=meet" rel="noopener">GitHub</a>.
  </footer>
</template>

<script setup>
import { generateRoomId } from '@/lib/client-utils'
import { useRouter } from 'vue-router'

const router = useRouter()

function startMeeting() {
  router.push(`/rooms/${generateRoomId()}`)
}
</script>

<style module src="@/styles/Home.module.css"></style>
