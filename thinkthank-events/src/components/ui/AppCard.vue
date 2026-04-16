<script setup lang="ts">
withDefaults(
  defineProps<{
    padding?: 'none' | 'sm' | 'md' | 'lg'
    elevated?: boolean
    interactive?: boolean
  }>(),
  { padding: 'md', elevated: false, interactive: false },
)
</script>

<template>
  <div
    class="card"
    :class="[
      `card--pad-${padding}`,
      { 'card--elevated': elevated, 'card--interactive': interactive },
    ]"
  >
    <slot />
  </div>
</template>

<style scoped>
.card {
  background: var(--color-white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  transition: all var(--duration-fast) var(--ease-out);
}
.card--elevated { box-shadow: var(--shadow-sm); }
.card--interactive { cursor: pointer; }
.card--interactive:hover { border-color: var(--color-primary-muted); box-shadow: var(--shadow-md); transform: translateY(-2px); }

.card--pad-none { padding: 0; }
.card--pad-sm { padding: var(--space-3); }
.card--pad-md { padding: var(--space-5); }
.card--pad-lg { padding: var(--space-6); }

@media (min-width: 768px) {
  .card--pad-md { padding: var(--space-6); }
  .card--pad-lg { padding: var(--space-8); }
}
</style>
