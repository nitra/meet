<template>
  <main data-lk-theme="default" class="lk-main">
    <ToastContainer />
    <template v-if="!connectionDetails">
      <div class="lk-prejoin-wrap">
        <PreJoin :defaults="preJoinDefaults" @submit="onPreJoinSubmit" @error="onPreJoinError" />
      </div>
    </template>
    <template v-else>
      <ConferenceBlock
        :connection-details="connectionDetails"
        :user-choices="userChoices"
        :options="conferenceOptions"
        :on-leave="onLeave" />
    </template>
  </main>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import PreJoin from './livekit/PreJoin.vue'
import ConferenceBlock from './livekit/ConferenceBlock.vue'
import ToastContainer from './livekit/ToastContainer.vue'

const CONN_DETAILS_ENDPOINT = import.meta.env.VITE_CONN_DETAILS_ENDPOINT ?? '/api/connection-details'
const PRE_JOIN_DEFAULTS = { username: '', videoEnabled: true, audioEnabled: true }

const props = defineProps({
  roomName: { type: String, default: '' },
  region: { type: String, default: '' },
  hq: { type: Boolean, default: false },
  onLeave: { type: Function, default: null }
})

const connectionDetails = ref(null)
const preJoinChoices = ref(null)

const preJoinDefaults = reactive({ ...PRE_JOIN_DEFAULTS })

const userChoices = computed(() => preJoinChoices.value ?? preJoinDefaults)

const conferenceOptions = computed(() => ({ hq: props.hq }))

async function onPreJoinSubmit(values) {
  const url = new URL(CONN_DETAILS_ENDPOINT, window.location.origin)
  url.searchParams.append('roomName', props.roomName)
  url.searchParams.append('participantName', values.username)
  if (props.region) url.searchParams.append('region', props.region)
  const data = await fetch(url.toString()).then(r => r.json())
  preJoinChoices.value = values
  connectionDetails.value = data
}

function onPreJoinError(e) {
  console.error(e)
}

function onLeave() {
  if (typeof props.onLeave === 'function') props.onLeave()
}
</script>

<style scoped>
.lk-main {
  height: 100%;
}
.lk-prejoin-wrap {
  display: grid;
  place-items: center;
  height: 100%;
}
</style>
