import { ref, watch } from 'vue'
import { useRoom } from './useRoom'
import { Track } from 'livekit-client'
import { isLowPowerDevice } from '@/lib/client-utils'

let KrispFilterCached = null

async function getKrispFilter() {
  if (KrispFilterCached !== undefined) return KrispFilterCached
  try {
    const mod = await import('@livekit/krisp-noise-filter')
    KrispFilterCached = mod.default ?? mod.NoiseFilter ?? mod.KrispNoiseFilter
  } catch {
    KrispFilterCached = null
  }
  return KrispFilterCached
}

/**
 * Композабл для Krisp шумозаглушення на мікрофоні.
 * @param {{ filterOptions?: object }} options Опції фільтра (bufferOverflowMs, quality, onBufferDrop тощо).
 * @returns {{ isNoiseFilterEnabled: import('vue').Ref<boolean>, setNoiseFilterEnabled: (enabled: boolean) => void, isNoiseFilterPending: import('vue').Ref<boolean> }} Стан і методи для вмикання/вимикання фільтра.
 */
export function useKrispNoiseFilter(options = {}) {
  const room = useRoom()
  const isNoiseFilterEnabled = ref(false)
  const isNoiseFilterPending = ref(false)

  const filterOptions = {
    bufferOverflowMs: 100,
    bufferDropMs: 200,
    quality: isLowPowerDevice() ? 'low' : 'medium',
    onBufferDrop: () => {
      /* лог буферу опційно в filterOptions */
    },
    ...options.filterOptions
  }

  /** @param {boolean} enabled Чи увімкнено Krisp-фільтр. */
  async function setNoiseFilterEnabled(enabled) {
    const KrispFilter = await getKrispFilter()
    if (!KrispFilter) {
      isNoiseFilterEnabled.value = false
      return
    }
    isNoiseFilterPending.value = true
    try {
      const pub = room.localParticipant.getTrackPublication(Track.Source.Microphone)
      const track = pub?.track
      if (track && typeof track.setProcessor === 'function') {
        if (enabled) {
          await track.setProcessor(KrispFilter(filterOptions))
        } else {
          await track.stopProcessor()
        }
        isNoiseFilterEnabled.value = enabled
      }
    } catch (error) {
      console.error('Krisp filter error', error)
    } finally {
      isNoiseFilterPending.value = false
    }
  }

  watch(
    () => room.localParticipant.getTrackPublication(Track.Source.Microphone)?.track,
    track => {
      if (!track) {
        isNoiseFilterEnabled.value = false
        return
      }
      const processor = track.getProcessor?.()
      isNoiseFilterEnabled.value =
        processor !== null &&
        processor !== undefined &&
        (processor.name === 'krisp' || processor.constructor?.name?.toLowerCase().includes('krisp'))
    },
    { immediate: true }
  )

  return {
    isNoiseFilterEnabled,
    setNoiseFilterEnabled,
    isNoiseFilterPending
  }
}
