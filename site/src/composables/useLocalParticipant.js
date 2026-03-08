import { computed } from 'vue'
import { Track } from 'livekit-client'
import { useRoom } from './useRoom'

/**
 * Локальний учасник та публікація камери (для превʼю та перемикачів).
 * @returns {{ localParticipant: import('livekit-client').LocalParticipant, cameraTrack: import('vue').ComputedRef<import('livekit-client').TrackPublication | undefined> }} Об'єкт з локальним учасником і computed публікації камери.
 */
export function useLocalParticipant() {
  const room = useRoom()
  const localParticipant = room.localParticipant
  const cameraTrack = computed(() =>
    [...localParticipant.trackPublications.values()].find(pub => pub.source === Track.Source.Camera)
  )
  return { localParticipant, cameraTrack }
}
