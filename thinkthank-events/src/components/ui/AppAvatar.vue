<script setup lang="ts">
withDefaults(
  defineProps<{
    initials?: string
    src?: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
    color?: string
  }>(),
  { size: 'md' },
)
</script>

<template>
  <div
    class="avatar"
    :class="`avatar--${size}`"
    :style="color ? { backgroundColor: color + '33', color: color } : undefined"
  >
    <img v-if="src" :src="src" alt="" />
    <span v-else>{{ initials }}</span>
  </div>
</template>

<style scoped>
.avatar {
  border-radius: var(--radius-full);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--color-primary-muted);
  color: var(--color-primary-dark);
  font-weight: var(--weight-semibold);
  flex-shrink: 0;
}
.avatar img { width: 100%; height: 100%; object-fit: cover; }
.avatar--sm { width: 32px; height: 32px; font-size: var(--text-body-sm); }
.avatar--md { width: 40px; height: 40px; font-size: var(--text-body); }
.avatar--lg { width: 56px; height: 56px; font-size: var(--text-h4); }
.avatar--xl { width: 80px; height: 80px; font-size: var(--text-h3); }
</style>
