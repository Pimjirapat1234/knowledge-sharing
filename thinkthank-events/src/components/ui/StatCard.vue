<script setup lang="ts">
import { type Component } from 'vue'
import { ArrowUp, ArrowDown, Minus } from 'lucide-vue-next'
import AppIcon from './AppIcon.vue'

withDefaults(
  defineProps<{
    label: string
    value: string | number
    icon?: Component
    delta?: number
    suffix?: string
    color?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  }>(),
  { color: 'primary' },
)
</script>

<template>
  <div class="stat" :class="`stat--${color}`">
    <div v-if="icon" class="stat__icon" aria-hidden="true">
      <AppIcon :icon="icon" size="lg" />
    </div>
    <div class="stat__body">
      <p class="stat__label">{{ label }}</p>
      <p class="stat__value">
        {{ value }}<span v-if="suffix" class="stat__suffix">{{ suffix }}</span>
      </p>
      <p v-if="delta !== undefined" class="stat__delta" :class="{ 'is-pos': delta > 0, 'is-neg': delta < 0 }">
        <AppIcon :icon="delta > 0 ? ArrowUp : delta < 0 ? ArrowDown : Minus" size="sm" aria-hidden="true" />
        {{ Math.abs(delta) }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.stat {
  display: flex;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--color-white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  align-items: flex-start;
}
.stat__icon {
  width: 44px; height: 44px;
  border-radius: var(--radius-lg);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.stat--primary .stat__icon { background: var(--color-primary-subtle); color: var(--color-primary); }
.stat--success .stat__icon { background: var(--color-success-subtle); color: var(--color-success-dark); }
.stat--warning .stat__icon { background: var(--color-warning-subtle); color: var(--color-warning-dark); }
.stat--danger .stat__icon { background: var(--color-danger-subtle); color: var(--color-danger-dark); }
.stat--info .stat__icon { background: var(--color-info-subtle); color: var(--color-info-dark); }

.stat__body { flex: 1; min-width: 0; }
.stat__label {
  font-size: var(--text-caption);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  font-weight: var(--weight-medium);
}
.stat__value {
  font-size: var(--text-h2);
  font-weight: var(--weight-bold);
  color: var(--color-text-primary);
  line-height: var(--leading-tight);
  margin-top: 4px;
}
.stat__suffix { font-size: var(--text-body-sm); color: var(--color-text-secondary); font-weight: var(--weight-regular); margin-left: 4px; }
.stat__delta {
  font-size: var(--text-caption);
  font-weight: var(--weight-semibold);
  margin-top: 4px;
  display: inline-flex; gap: 2px;
  align-items: center;
  color: var(--color-text-tertiary);
}
.stat__delta.is-pos { color: var(--color-success-dark); }
.stat__delta.is-neg { color: var(--color-danger-dark); }
</style>
