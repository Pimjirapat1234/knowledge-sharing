<script setup lang="ts">
import { computed, type Component } from 'vue'
import { Inbox } from 'lucide-vue-next'
import AppIcon from './AppIcon.vue'

const props = defineProps<{
  icon?: Component
  title: string
  message: string
  ctaLabel?: string
}>()
defineEmits<{ cta: [] }>()

const displayIcon = computed<Component>(() => props.icon ?? (Inbox as unknown as Component))
</script>

<template>
  <div class="empty" role="status">
    <div class="empty__icon" aria-hidden="true">
      <AppIcon :icon="displayIcon" size="xl" />
    </div>
    <h2 class="empty__title">{{ title }}</h2>
    <p class="empty__message">{{ message }}</p>
    <button v-if="ctaLabel" type="button" class="empty__cta" @click="$emit('cta')">
      {{ ctaLabel }}
    </button>
  </div>
</template>

<style scoped>
.empty {
  padding: var(--space-12) var(--space-4);
  text-align: center;
  background: var(--color-white);
  border: 1px dashed var(--color-border-default);
  border-radius: var(--radius-xl);
}
.empty__icon {
  width: 72px; height: 72px;
  border-radius: 50%;
  background: var(--color-gray-100);
  color: var(--color-gray-500);
  display: inline-flex; align-items: center; justify-content: center;
  margin-bottom: var(--space-4);
}
.empty__title {
  font-size: var(--text-h4);
  font-weight: var(--weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}
.empty__message {
  font-size: var(--text-body-sm);
  color: var(--color-text-secondary);
  max-width: 420px;
  margin: 0 auto var(--space-5);
  line-height: var(--leading-relaxed);
}
.empty__cta {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 0 var(--space-5);
  height: var(--size-btn-md);
  min-height: var(--size-touch-target);
  background: var(--color-primary);
  color: var(--color-white);
  border-radius: var(--radius-md);
  font-weight: var(--weight-semibold);
  font-size: var(--text-body-sm);
}
.empty__cta:hover { background: var(--color-primary-hover); }
</style>
