import { ref, onMounted, onUnmounted, watch, computed, getCurrentInstance } from 'vue'
import { ParticipantEvent, RoomEvent, VideoQuality, isVideoTrack } from 'livekit-client'
import { useRoom } from './useRoom'

const defaultOptions = {
  reducePublisherVideoQuality: true,
  reduceSubscriberVideoQuality: true,
  disableVideoProcessing: false
}

/**
 * На низькопотужних пристроях знижує якість відео при CPU constraint.
 * @param {import('livekit-client').Room} [roomInstance] Передай room, якщо викликаєш з компонента, що робить provide (inject там недоступний).
 * @param {object} [options] Опції оптимізатора (reducePublisherVideoQuality, reduceSubscriberVideoQuality, disableVideoProcessing).
 * @returns {import('vue').Ref<boolean>} Ref: чи активний low-power режим.
 */
export function useLowCPUOptimizer(roomInstance, options = {}) {
  const instance = getCurrentInstance()
  const room = roomInstance ?? useRoom()
  const lowPowerMode = ref(false)
  const opts = computed(() => ({ ...defaultOptions, ...options }))

  const handleCpuConstrained = async track => {
    if (instance?.isUnmounted) return
    lowPowerMode.value = true
    console.warn('Local track CPU constrained', track)
    if (opts.value.reducePublisherVideoQuality) {
      track.prioritizePerformance()
    }
    if (opts.value.disableVideoProcessing && isVideoTrack(track)) {
      track.stopProcessor()
    }
    if (opts.value.reduceSubscriberVideoQuality) {
      for (const participant of room.remoteParticipants.values()) {
        for (const publication of participant.videoTrackPublications) {
          publication.setVideoQuality(VideoQuality.LOW)
        }
      }
    }
  }

  onMounted(() => {
    room.localParticipant.on(ParticipantEvent.LocalTrackCpuConstrained, handleCpuConstrained)
  })

  const lowerQuality = (_, publication) => {
    if (instance?.isUnmounted) return
    publication.setVideoQuality(VideoQuality.LOW)
  }

  const stopWatch = watch(
    [lowPowerMode, () => opts.value.reduceSubscriberVideoQuality],
    ([mode, reduceSub]) => {
      room.off(RoomEvent.TrackSubscribed, lowerQuality)
      if (mode && reduceSub) {
        room.on(RoomEvent.TrackSubscribed, lowerQuality)
      }
    },
    { immediate: true }
  )

  onUnmounted(() => {
    stopWatch()
    room.off(RoomEvent.TrackSubscribed, lowerQuality)
    room.localParticipant.off(ParticipantEvent.LocalTrackCpuConstrained, handleCpuConstrained)
  })

  return lowPowerMode
}
