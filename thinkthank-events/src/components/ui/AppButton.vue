<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost' | 'destructive'
    size?: 'sm' | 'md' | 'lg' | 'xl'
    loading?: boolean
    disabled?: boolean
    fullWidth?: boolean
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    variant: 'primary',
    size: 'md',
    loading: false,
    disabled: false,
    fullWidth: false,
    type: 'button',
  },
)
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :aria-busy="loading"
    class="btn"
    :class="[
      `btn--${variant}`,
      `btn--${size}`,
      { 'btn--block': fullWidth, 'btn--loading': loading },
    ]"
  >
    <span v-if="loading" class="btn__spinner" aria-hidden="true"></span>
    <slot />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  font-family: var(--font-th);
  font-weight: var(--weight-semibold);
  border-radius: var(--radius-md);
  transition: all var(--duration-fast) var(--ease-out);
  white-space: nowrap;
  user-select: none;
  border: 1px solid transparent;
  min-height: var(--size-touch-target);
}
.btn:disabled { cursor: not-allowed; opacity: 0.65; }
.btn--block { width: 100%; }

.btn--sm { height: 32px; padding: 0 var(--space-3); font-size: var(--text-body-sm); }
.btn--md { height: var(--size-btn-md); padding: 0 var(--space-4); font-size: var(--text-body-sm); }
.btn--lg { height: var(--size-btn-lg); padding: 0 var(--space-6); font-size: var(--text-body); }
.btn--xl { height: 56px; padding: 0 var(--space-8); font-size: var(--text-h4); }

.btn--primary {
  background: var(--color-primary);
  color: var(--color-white);
  box-shadow: var(--shadow-sm);
}
.btn--primary:hover:not(:disabled) { background: var(--color-primary-hover); box-shadow: var(--shadow-md); }
.btn--primary:active:not(:disabled) { background: var(--color-primary-active); transform: scale(0.98); }

.btn--secondary {
  background: var(--color-white);
  color: var(--color-text-primary);
  border-color: var(--color-border-default);
}
.btn--secondary:hover:not(:disabled) { background: var(--color-gray-50); border-color: var(--color-border-strong); }

.btn--ghost {
  background: transparent;
  color: var(--color-text-primary);
}
.btn--ghost:hover:not(:disabled) { background: var(--color-gray-100); }

.btn--destructive {
  background: var(--color-danger);
  color: var(--color-white);
}
.btn--destructive:hover:not(:disabled) { background: var(--color-danger-dark); }

.btn__spinner {
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  opacity: 0.7;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
