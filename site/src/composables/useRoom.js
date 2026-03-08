import { inject } from 'vue'
import { LK_ROOM } from '@/components/livekit/roomSymbol'

/**
 * Отримати поточну кімнату LiveKit (має бути нащадком компонента, що provide room).
 * @returns {import('livekit-client').Room} Екземпляр кімнати.
 */
export function useRoom() {
  const room = inject(LK_ROOM)
  if (!room) {
    throw new Error('useRoom() must be used inside a LiveKit room (e.g. LiveKitRoom.vue)')
  }
  return room
}
