<template>
  <div v-if="isOpen" class="lk-debug-overlay">
    <section id="room-info">
      <h3>Room Info {{ room.name }}: {{ roomSid }}</h3>
    </section>
    <details open>
      <summary>
        <b>Local Participant: {{ room.localParticipant.identity }}</b>
      </summary>
      <details open class="details-section">
        <summary><b>Published tracks</b></summary>
        <div>
          <template v-for="t in localTracks" :key="t.trackSid">
            <div>
              <i
                >{{ t.source.toString() }} &nbsp;<span>{{ t.trackSid }}</span></i
              >
            </div>
            <table>
              <tbody>
                <tr>
                  <td>Kind</td>
                  <td>
                    {{ t.kind }}
                    <span v-if="t.kind === 'video'">
                      {{ t.track?.dimensions?.width }}x{{ t.track?.dimensions?.height }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Bitrate</td>
                  <td>{{ t.track ? Math.ceil(t.track.currentBitrate / 1000) : 0 }} kbps</td>
                </tr>
              </tbody>
            </table>
          </template>
        </div>
      </details>
      <details open class="details-section">
        <summary><b>Permissions</b></summary>
        <div>
          <table v-if="room.localParticipant.permissions">
            <tbody>
              <tr v-for="(val, key) in room.localParticipant.permissions" :key="key">
                <td>{{ key }}</td>
                <td>{{ key === 'canPublishSources' ? (val || []).join(', ') : String(val) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </details>
    </details>
    <details>
      <summary><b>Remote Participants</b></summary>
      <details v-for="p in remoteParticipants" :key="p.sid" class="details-section">
        <summary>
          <b>{{ p.identity }}</b>
        </summary>
        <div>
          <template v-for="t in getParticipantTracks(p)" :key="t.trackSid">
            <div>
              <i
                >{{ t.source.toString() }} &nbsp;<span>{{ t.trackSid }}</span></i
              >
            </div>
            <table>
              <tbody>
                <tr>
                  <td>Kind</td>
                  <td>
                    {{ t.kind }}
                    <span v-if="t.kind === 'video'">{{ t.dimensions?.width }}x{{ t.dimensions?.height }}</span>
                  </td>
                </tr>
                <tr>
                  <td>Status</td>
                  <td>{{ trackStatus(t) }}</td>
                </tr>
                <tr v-if="t.track">
                  <td>Bitrate</td>
                  <td>{{ Math.ceil(t.track.currentBitrate / 1000) }} kbps</td>
                </tr>
              </tbody>
            </table>
          </template>
        </div>
      </details>
    </details>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, getCurrentInstance } from 'vue'
import { useRoom } from '@/composables/useRoom'
import { setLogLevel } from 'livekit-client'
import { tinykeys } from 'tinykeys'

const props = defineProps({
  logLevel: { type: String, default: 'debug' }
})

const instance = getCurrentInstance()
const room = useRoom()
const isOpen = ref(false)
const roomSid = ref('')
const tick = ref(0)

const localTracks = computed(() => [...room.localParticipant.trackPublications.values()])

const remoteParticipants = computed(() => [...room.remoteParticipants.values()])

function getParticipantTracks(p) {
  return [...p.trackPublications.values()]
}

function trackStatus(t) {
  if (t.isSubscribed) return t.isEnabled ? 'enabled' : 'disabled'
  return 'unsubscribed'
}

let intervalId
let unsubscribeTiny

onMounted(() => {
  setLogLevel(props.logLevel ?? 'debug')
  window.__lk_room = room
  room
    .getSid()
    .then(s => {
      if (instance?.isUnmounted) return
      roomSid.value = s
    })
    .catch(() => {
      if (instance?.isUnmounted) return
      roomSid.value = ''
    })
  intervalId = setInterval(() => {
    if (instance?.isUnmounted) return
    tick.value++
  }, 1000)
  unsubscribeTiny = tinykeys(window, {
    'Shift+D': () => {
      if (instance?.isUnmounted) return
      isOpen.value = !isOpen.value
    }
  })
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
  if (typeof unsubscribeTiny === 'function') unsubscribeTiny()
  window.__lk_room = undefined
})
</script>

<style scoped>
.lk-debug-overlay {
  position: absolute;
  top: 0;
  background: rgba(0, 0, 0, 0.6);
  padding: 1rem;
  max-height: min(100%, 100vh);
  overflow-y: auto;
  z-index: 1000;
}
.details-section {
  padding-left: 1rem;
}
.details-section > div {
  padding-left: 1rem;
}
</style>
