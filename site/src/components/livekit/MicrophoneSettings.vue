<template>
  <div class="lk-microphone-settings">
    <section class="lk-button-group">
      <TrackToggle source="microphone" label="Мікрофон" />
      <MediaDeviceMenu kind="audioinput" />
    </section>
    <button
      type="button"
      class="lk-button"
      :disabled="isNoiseFilterPending"
      :aria-pressed="isNoiseFilterEnabled"
      @click="setNoiseFilterEnabled(!isNoiseFilterEnabled)">
      {{ isNoiseFilterEnabled ? 'Вимкнути' : 'Увімкнути' }} шумозаглушення
    </button>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useKrispNoiseFilter } from '@/composables/useKrispNoiseFilter'
import { isLowPowerDevice } from '@/lib/client-utils'
import TrackToggle from './TrackToggle.vue'
import MediaDeviceMenu from './MediaDeviceMenu.vue'

const { isNoiseFilterEnabled, setNoiseFilterEnabled, isNoiseFilterPending } = useKrispNoiseFilter({
  filterOptions: {
    bufferOverflowMs: 100,
    bufferDropMs: 200,
    quality: isLowPowerDevice() ? 'low' : 'medium',
    onBufferDrop: () => {
      console.warn('krisp buffer dropped')
    }
  }
})

onMounted(() => {
  setNoiseFilterEnabled(!isLowPowerDevice())
})
</script>

<style scoped>
.lk-microphone-settings {
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}
</style>
