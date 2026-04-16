<script setup lang="ts">
defineProps<{
  modelValue?: string | number
  type?: string
  placeholder?: string
  label?: string
  hint?: string
  helper?: string
  error?: string
  readonly?: boolean
  disabled?: boolean
  id?: string
  maxlength?: number
  autocomplete?: string
}>()

defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <div class="field">
    <label v-if="label" class="field__label" :for="id">
      {{ label }}
      <span v-if="hint" class="field__hint">({{ hint }})</span>
    </label>
    <input
      :id="id"
      :value="modelValue"
      :type="type ?? 'text'"
      :placeholder="placeholder"
      :readonly="readonly"
      :disabled="disabled"
      :maxlength="maxlength"
      :autocomplete="autocomplete"
      :aria-invalid="!!error"
      class="field__input"
      :class="{ 'field__input--error': error, 'field__input--readonly': readonly }"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <p v-if="error" class="field__error" role="alert">{{ error }}</p>
    <p v-else-if="helper" class="field__helper">{{ helper }}</p>
  </div>
</template>

<style scoped>
.field { display: flex; flex-direction: column; gap: var(--space-2); }
.field__label {
  font-size: var(--text-body-sm);
  font-weight: var(--weight-medium);
  color: var(--color-text-primary);
}
.field__hint {
  font-weight: var(--weight-regular);
  color: var(--color-text-tertiary);
}
.field__input {
  width: 100%;
  min-height: var(--size-input-lg);
  padding: var(--space-input-y) var(--space-input-x);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  font-size: var(--text-body);
  color: var(--color-text-primary);
  background: var(--color-white);
  transition: border-color var(--duration-fast), box-shadow var(--duration-fast);
}
.field__input:focus { outline: none; border-color: var(--color-border-focus); box-shadow: var(--shadow-focus); }
.field__input--readonly { background: var(--color-gray-100); color: var(--color-text-secondary); cursor: not-allowed; }
.field__input--error { border-color: var(--color-danger); }
.field__helper { font-size: var(--text-caption); color: var(--color-text-secondary); }
.field__error { font-size: var(--text-caption); color: var(--color-danger-dark); }
</style>
