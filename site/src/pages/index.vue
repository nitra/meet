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
    <div :class="$style.tabContainer">
      <div :class="$style.tabSelect">
        <button
          v-for="(tab, index) in tabs"
          :key="tab.label"
          type="button"
          class="lk-button"
          :aria-pressed="tabIndex === index"
          @click="tabIndex = index">
          {{ tab.label }}
        </button>
      </div>
      <div v-if="tabIndex === 0" :class="$style.tabContent">
        <p style="margin: 0">Try Nitra Live for free with our live demo project.</p>
        <button type="button" style="margin-top: 1rem" class="lk-button" @click="startMeeting">Start Meeting</button>
      </div>
      <form v-else :class="$style.tabContent" @submit.prevent="onSubmit">
        <p style="margin-top: 0">Connect Nitra Live with a custom server using LiveKit Cloud or LiveKit Server.</p>
        <input
          id="serverUrl"
          v-model="form.serverUrl"
          name="serverUrl"
          type="url"
          placeholder="LiveKit Server URL: wss://*.livekit.cloud"
          required />
        <textarea
          id="token"
          v-model="form.token"
          name="token"
          placeholder="Token"
          required
          rows="5"
          style="padding: 1px 2px; font-size: inherit; line-height: inherit" />
        <hr style="width: 100%; border-color: rgba(255, 255, 255, 0.15); margin-block: 1rem" />
        <button style="padding-inline: 1.25rem; width: 100%" class="lk-button" type="submit">Connect</button>
      </form>
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
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const tabs = [{ label: 'Demo' }, { label: 'Custom' }]

const tabIndex = ref(route.query.tab === 'custom' ? 1 : 0)

watch(
  () => route.query.tab,
  tab => {
    tabIndex.value = tab === 'custom' ? 1 : 0
  }
)

watch(tabIndex, idx => {
  const tab = idx === 1 ? 'custom' : 'demo'
  router.replace({ query: { tab } })
})

const form = ref({ serverUrl: '', token: '' })

function startMeeting() {
  router.push(`/rooms/${generateRoomId()}`)
}

function onSubmit() {
  router.push({
    path: '/custom',
    query: {
      liveKitUrl: form.value.serverUrl,
      token: form.value.token
    }
  })
}
</script>

<style module src="@/styles/Home.module.css"></style>
