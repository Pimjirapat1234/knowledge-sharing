<script setup lang="ts">
defineProps<{
  modelValue: boolean
  label?: string
  description?: string
  id?: string
}>()
defineEmits<{ 'update:modelValue': [value: boolean] }>()
</script>

<template>
  <label class="tg">
    <input
      :id="id"
      type="checkbox"
      :checked="modelValue"
      class="tg__input"
      @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
    <span class="tg__track"><span class="tg__thumb"></span></span>
    <span v-if="label || description" class="tg__body">
      <span v-if="label" class="tg__label">{{ label }}</span>
      <span v-if="description" class="tg__desc">{{ description }}</span>
    </span>
  </label>
</template>

<style scoped>
.tg { display: inline-flex; align-items: flex-start; gap: var(--space-3); cursor: pointer; min-height: var(--size-touch-target); }
.tg__input { position: absolute; opacity: 0; pointer-events: none; }
.tg__track {
  position: relative;
  width: 44px; height: 24px;
  background: var(--color-gray-300);
  border-radius: var(--radius-full);
  transition: background var(--duration-fast);
  flex-shrink: 0;
  margin-top: 2px;
}
.tg__thumb {
  position: absolute;
  top: 2px; left: 2px;
  width: 20px; height: 20px;
  background: var(--color-white);
  border-radius: 50%;
  transition: transform var(--duration-fast);
  box-shadow: var(--shadow-sm);
}
.tg__input:checked + .tg__track { background: var(--color-primary); }
.tg__input:checked + .tg__track .tg__thumb { transform: translateX(20px); }
.tg__input:focus-visible + .tg__track { box-shadow: var(--shadow-focus); }

.tg__body { display: flex; flex-direction: column; gap: 2px; }
.tg__label { font-size: var(--text-body); color: var(--color-text-primary); font-weight: var(--weight-medium); }
.tg__desc { font-size: var(--text-caption); color: var(--color-text-secondary); }
</style>
