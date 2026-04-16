<script setup lang="ts">
/**
 * Icon wrapper — lucide-vue-next
 * Size pattern per PRD §11.2 (FontAwesome-style sm/md/lg/xl).
 *
 * Usage:
 *   <AppIcon :icon="Home" size="md" aria-label="หน้าหลัก" />
 *   <AppIcon :icon="Check" size="sm" aria-hidden="true" />
 */
import { computed, type Component } from 'vue'

const props = withDefaults(
  defineProps<{
    icon: Component
    size?: 'sm' | 'md' | 'lg' | 'xl'
    color?: string
    strokeWidth?: number
  }>(),
  { size: 'md', strokeWidth: 2 },
)

const dim = computed(() => {
  switch (props.size) {
    case 'sm': return 16
    case 'md': return 20
    case 'lg': return 24
    case 'xl': return 32
  }
})
</script>

<template>
  <component
    :is="icon"
    :size="dim"
    :stroke-width="strokeWidth"
    :color="color"
    class="icon"
  />
</template>

<style scoped>
.icon {
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
}
</style>
