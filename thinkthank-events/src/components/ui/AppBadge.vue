<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
    size?: 'sm' | 'md'
  }>(),
  { variant: 'neutral', size: 'md' },
)
</script>

<template>
  <span class="badge" :class="[`badge--${variant}`, `badge--${size}`]">
    <slot />
  </span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  font-weight: var(--weight-semibold);
  border-radius: var(--radius-full);
  letter-spacing: var(--tracking-wide);
  white-space: nowrap;
}
.badge--sm { font-size: var(--text-xs); padding: 2px var(--space-2); }
.badge--md { font-size: var(--text-caption); padding: var(--space-1) var(--space-3); }

.badge--neutral { background: var(--color-gray-100); color: var(--color-gray-700); }
.badge--primary { background: var(--color-primary-subtle); color: var(--color-primary-dark); }
.badge--success { background: var(--color-success-subtle); color: var(--color-success-dark); }
.badge--warning { background: var(--color-warning-subtle); color: var(--color-warning-dark); }
.badge--danger { background: var(--color-danger-subtle); color: var(--color-danger-dark); }
.badge--info { background: var(--color-info-subtle); color: var(--color-info-dark); }
</style>
