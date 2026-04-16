<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  backTo?: string
}>()
</script>

<template>
  <header class="ph">
    <a v-if="backTo" :href="backTo" class="ph__back" aria-label="กลับ">
      <span aria-hidden="true">←</span> กลับ
    </a>
    <div class="ph__content">
      <h1 class="ph__title">{{ title }}</h1>
      <p v-if="subtitle" class="ph__subtitle">{{ subtitle }}</p>
    </div>
    <div class="ph__actions"><slot name="actions" /></div>
  </header>
</template>

<style scoped>
.ph {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-bottom: var(--space-5);
}
@media (min-width: 768px) {
  .ph {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
    gap: var(--space-4);
  }
}
.ph__back {
  align-self: flex-start;
  font-size: var(--text-body-sm);
  color: var(--color-text-secondary);
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
}
.ph__back:hover { color: var(--color-primary); text-decoration: none; }
.ph__title {
  font-size: var(--text-h2);
  font-weight: var(--weight-bold);
  line-height: var(--leading-snug);
  color: var(--color-text-primary);
}
.ph__subtitle {
  font-size: var(--text-body-sm);
  color: var(--color-text-secondary);
  margin-top: var(--space-1);
}
.ph__actions { display: flex; gap: var(--space-2); flex-wrap: wrap; }
</style>
