import { ref, computed, watch, getCurrentInstance } from 'vue'
import { Track } from 'livekit-client'
import { useRoom } from './useRoom'

/**
 * Перемикання мікрофона або камери.
 * @param {{ source: import('livekit-client').Track.Source }} options Джерело треку (Microphone або Camera).
 * @returns {{ enabled: import('vue').Ref<boolean>, toggle: () => Promise<void> }} Стан увімкненості та функція перемикання.
 */
export function useTrackToggle(options) {
  const instance = getCurrentInstance()
  const room = useRoom()
  const source = options.source
  const enabled = ref(true)

  const publication =
    source === Track.Source.Microphone
      ? computed(() => room.localParticipant.getTrackPublication(Track.Source.Microphone))
      : computed(() => room.localParticipant.getTrackPublication(Track.Source.Camera))

  function updateEnabled() {
    if (instance?.isUnmounted) return
    const pub = publication.value
    enabled.value = pub ? pub.isEnabled : false
  }

  watch(
    publication,
    (pub, oldPub) => {
      updateEnabled()
      if (oldPub) {
        oldPub.off('trackUpdated', updateEnabled)
      }
      if (pub) {
        pub.on('trackUpdated', updateEnabled)
      }
    },
    { immediate: true }
  )

  async function toggle() {
    try {
      if (source === Track.Source.Microphone) {
        await room.localParticipant.setMicrophoneEnabled(!enabled.value)
      } else {
        await room.localParticipant.setCameraEnabled(!enabled.value)
      }
      updateEnabled()
    } catch (error) {
      console.error('Track toggle error', error)
    }
  }

  return { enabled, toggle }
}
