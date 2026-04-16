<script setup lang="ts">
import { Star } from 'lucide-vue-next'
import AppIcon from './AppIcon.vue'

const props = withDefaults(
  defineProps<{
    modelValue: number
    max?: number
    size?: 'md' | 'lg' | 'xl'
    readonly?: boolean
    ariaLabel?: string
  }>(),
  { max: 5, size: 'md', readonly: false },
)

defineEmits<{ 'update:modelValue': [value: number] }>()

function iconSize(s: string) {
  if (s === 'xl') return 'xl'
  if (s === 'lg') return 'lg'
  return 'md'
}
const iconDim = iconSize(props.size)
</script>

<template>
  <div
    class="stars"
    :class="[`stars--${size}`, { 'stars--readonly': readonly }]"
    role="radiogroup"
    :aria-label="ariaLabel ?? 'ให้คะแนน'"
  >
    <button
      v-for="i in max"
      :key="i"
      type="button"
      class="star"
      :class="{ 'star--active': i <= modelValue }"
      :disabled="readonly"
      :aria-label="`${i} ดาว`"
      :aria-pressed="i <= modelValue"
      @click="!readonly && $emit('update:modelValue', i)"
    >
      <AppIcon :icon="Star" :size="iconDim" :stroke-width="i <= modelValue ? 0 : 2" :class="{ 'star--filled': i <= modelValue }" aria-hidden="true" />
    </button>
  </div>
</template>

<style scoped>
.stars { display: inline-flex; gap: var(--space-1); }
.star {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: var(--color-gray-300);
  padding: var(--space-2);
  border-radius: var(--radius-md);
  transition: all var(--duration-fast);
  min-width: var(--size-touch-target);
  min-height: var(--size-touch-target);
}
.star:hover:not(:disabled) { color: var(--color-warning-light); transform: scale(1.1); background: var(--color-warning-subtle); }
.star--active { color: var(--color-warning); }
.star--active .star--filled { fill: var(--color-warning); }
.stars--xl .star { padding: var(--space-3); }
.stars--readonly .star { cursor: default; }
.stars--readonly .star:hover { transform: none; background: transparent; }

/* fill active stars */
.star.star--active :deep(svg) { fill: currentColor; }
</style>
