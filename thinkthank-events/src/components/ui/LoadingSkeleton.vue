<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'line' | 'block' | 'avatar' | 'card'
    width?: string
    height?: string
    count?: number
  }>(),
  { variant: 'line', count: 1 },
)
</script>

<template>
  <template v-if="variant === 'card'">
    <div class="skel-card" v-for="i in count" :key="i">
      <div class="skel skel-block" style="height: 140px"></div>
      <div class="skel skel-line" style="width: 60%"></div>
      <div class="skel skel-line" style="width: 90%"></div>
      <div class="skel skel-line" style="width: 40%"></div>
    </div>
  </template>
  <template v-else-if="variant === 'avatar'">
    <div class="skel skel-avatar" :style="{ width: width ?? '40px', height: height ?? '40px' }" v-for="i in count" :key="i"></div>
  </template>
  <div v-else
    v-for="i in count"
    :key="i"
    class="skel"
    :class="[`skel-${variant}`]"
    :style="{ width, height }"
  ></div>
</template>

<style scoped>
.skel {
  background: linear-gradient(90deg, var(--color-gray-200) 0%, var(--color-gray-100) 50%, var(--color-gray-200) 100%);
  background-size: 200% 100%;
  border-radius: var(--radius-md);
  animation: shimmer 1.4s infinite linear;
}
.skel-line { height: 14px; margin-bottom: var(--space-2); border-radius: var(--radius-sm); }
.skel-block { width: 100%; border-radius: var(--radius-lg); }
.skel-avatar { border-radius: 50%; }
.skel-card {
  background: var(--color-white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  padding: var(--space-5);
  margin-bottom: var(--space-4);
}
.skel-card .skel-block { margin-bottom: var(--space-4); }

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
@media (prefers-reduced-motion: reduce) {
  .skel { animation: none; }
}
</style>
