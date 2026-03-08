import { ref, onMounted, onUnmounted, getCurrentInstance } from 'vue'
import { RoomEvent } from 'livekit-client'
import { useRoom } from './useRoom'

function parseRecordingFromMetadata(metadata) {
  if (!metadata) return false
  try {
    const data = JSON.parse(metadata)
    return !!data?.recording
  } catch {
    return false
  }
}

/**
 * Чи записується кімната (з room metadata).
 * @returns {import('vue').Ref<boolean>} Ref з булевим станом запису.
 */
export function useIsRecording() {
  const instance = getCurrentInstance()
  const room = useRoom()
  const isRecording = ref(parseRecordingFromMetadata(room.metadata))

  function update() {
    if (instance?.isUnmounted) return
    isRecording.value = parseRecordingFromMetadata(room.metadata)
  }

  onMounted(() => {
    room.on(RoomEvent.RoomMetadataChanged, update)
    update()
  })

  onUnmounted(() => {
    room.off(RoomEvent.RoomMetadataChanged, update)
  })

  return isRecording
}
