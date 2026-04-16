<script setup lang="ts">
import { computed, type Component } from 'vue'
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-vue-next'
import { useToast, type Toast } from '@/composables/useToast'
import AppIcon from './AppIcon.vue'

const { toasts, dismiss } = useToast()

const iconMap = computed<Record<Toast['type'], Component>>(() => ({
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}))
</script>

<template>
  <div class="toast-wrap" role="region" aria-live="polite" aria-label="การแจ้งเตือน">
    <transition-group name="toast">
      <div
        v-for="t in toasts"
        :key="t.id"
        class="toast"
        :class="`toast--${t.type}`"
        role="status"
      >
        <span class="toast__icon" :class="`toast__icon--${t.type}`">
          <AppIcon :icon="iconMap[t.type]" size="md" aria-hidden="true" />
        </span>
        <div class="toast__body">
          <p class="toast__title">{{ t.title }}</p>
          <p v-if="t.message" class="toast__msg">{{ t.message }}</p>
        </div>
        <button type="button" class="toast__close" aria-label="ปิด" @click="dismiss(t.id)">
          <AppIcon :icon="X" size="sm" aria-hidden="true" />
        </button>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.toast-wrap {
  position: fixed;
  bottom: var(--space-6);
  right: var(--space-4);
  left: var(--space-4);
  z-index: var(--z-toast);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  pointer-events: none;
}
@media (min-width: 640px) {
  .toast-wrap { left: auto; max-width: 380px; }
}
.toast {
  pointer-events: auto;
  display: flex;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: var(--color-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  border-left: 4px solid var(--color-gray-400);
  align-items: flex-start;
}
.toast--success { border-left-color: var(--color-success); }
.toast--error { border-left-color: var(--color-danger); }
.toast--warning { border-left-color: var(--color-warning); }
.toast--info { border-left-color: var(--color-info); }

.toast__icon {
  flex-shrink: 0;
  color: var(--color-gray-500);
}
.toast__icon--success { color: var(--color-success); }
.toast__icon--error { color: var(--color-danger); }
.toast__icon--warning { color: var(--color-warning); }
.toast__icon--info { color: var(--color-info); }

.toast__body { flex: 1; min-width: 0; }
.toast__title { font-size: var(--text-body-sm); font-weight: var(--weight-semibold); color: var(--color-text-primary); }
.toast__msg { font-size: var(--text-caption); color: var(--color-text-secondary); margin-top: 2px; }
.toast__close {
  width: var(--size-touch-target); height: var(--size-touch-target);
  display: inline-flex; align-items: center; justify-content: center;
  color: var(--color-text-tertiary); flex-shrink: 0;
  border-radius: var(--radius-md);
}
.toast__close:hover { background: var(--color-gray-100); color: var(--color-text-primary); }

.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(16px); }
.toast-enter-active, .toast-leave-active { transition: all var(--duration-normal) var(--ease-out); }
</style>
