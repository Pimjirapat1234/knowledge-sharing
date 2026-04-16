<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { qrToDataUrl, type QrPayload } from '@/composables/useQr'

const props = withDefaults(
  defineProps<{
    payload: QrPayload
    size?: number
    downloadName?: string
  }>(),
  { size: 280 },
)

const dataUrl = ref<string>('')
const loading = ref(true)

async function regenerate() {
  loading.value = true
  try {
    dataUrl.value = await qrToDataUrl(props.payload, { size: props.size })
  } finally {
    loading.value = false
  }
}

watch(() => [props.payload, props.size], regenerate, { deep: true })
onMounted(regenerate)

defineExpose({ regenerate, dataUrl })
</script>

<template>
  <div class="qr">
    <div v-if="loading" class="qr__placeholder" :style="{ width: size + 'px', height: size + 'px' }" aria-busy="true"></div>
    <img
      v-else
      :src="dataUrl"
      :alt="`QR code for ${payload.name}`"
      :width="size"
      :height="size"
      class="qr__img"
    />
  </div>
</template>

<style scoped>
.qr {
  display: inline-block;
  padding: var(--space-3);
  background: var(--color-white);
  border: 2px solid var(--color-border-default);
  border-radius: var(--radius-lg);
}
.qr__img { display: block; image-rendering: pixelated; }
.qr__placeholder {
  background: linear-gradient(135deg, var(--color-gray-100), var(--color-gray-200));
  border-radius: var(--radius-md);
  animation: pulse 1.5s infinite;
}
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
@media (prefers-reduced-motion: reduce) {
  .qr__placeholder { animation: none; }
}
</style>
