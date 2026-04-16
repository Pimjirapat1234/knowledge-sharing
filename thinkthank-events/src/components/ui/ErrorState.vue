<script setup lang="ts">
import { computed, type Component } from 'vue'
import { AlertTriangle, Ban } from 'lucide-vue-next'
import AppIcon from './AppIcon.vue'

const props = withDefaults(
  defineProps<{
    icon?: Component
    title?: string
    message?: string
    recoverable?: boolean
    retryLabel?: string
    inline?: boolean
  }>(),
  { recoverable: true, retryLabel: 'ลองใหม่', inline: false },
)
defineEmits<{ retry: [] }>()

const effectiveIcon = computed(() =>
  props.icon ?? (props.recoverable ? AlertTriangle : Ban),
)
</script>

<template>
  <div class="err" :class="{ 'err--inline': inline }" role="alert">
    <div class="err__icon" aria-hidden="true">
      <AppIcon :icon="effectiveIcon" :size="inline ? 'md' : 'xl'" />
    </div>
    <div class="err__body">
      <h2 v-if="title" class="err__title">{{ title }}</h2>
      <p class="err__message">
        {{ message ?? (recoverable ? 'ระบบขัดข้องชั่วคราว · ลองใหม่อีกครั้งใน 1 นาที' : 'ไม่พบหน้าที่ต้องการ หรือคุณไม่มีสิทธิ์เข้าถึง') }}
      </p>
      <div v-if="recoverable" class="err__actions">
        <button type="button" class="err__retry" @click="$emit('retry')">
          {{ retryLabel }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.err {
  padding: var(--space-8) var(--space-4);
  text-align: center;
  background: var(--color-danger-subtle);
  border: 1px solid var(--color-danger-light);
  border-radius: var(--radius-xl);
}
.err--inline {
  display: flex; gap: var(--space-3); align-items: flex-start;
  text-align: left; padding: var(--space-4);
}
.err__icon {
  color: var(--color-danger);
  margin-bottom: var(--space-3);
  display: inline-flex;
  flex-shrink: 0;
}
.err--inline .err__icon { margin-bottom: 0; }
.err__title {
  font-size: var(--text-h4);
  font-weight: var(--weight-semibold);
  color: var(--color-danger-dark);
  margin-bottom: var(--space-2);
}
.err__message {
  font-size: var(--text-body-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-4);
}
.err--inline .err__message { margin-bottom: var(--space-2); }
.err__retry {
  display: inline-flex;
  align-items: center;
  padding: 0 var(--space-4);
  height: var(--size-btn-md);
  min-height: var(--size-touch-target);
  background: var(--color-white);
  color: var(--color-danger-dark);
  border: 1px solid var(--color-danger);
  border-radius: var(--radius-md);
  font-weight: var(--weight-semibold);
  font-size: var(--text-body-sm);
}
.err__retry:hover { background: var(--color-danger); color: var(--color-white); }
</style>
