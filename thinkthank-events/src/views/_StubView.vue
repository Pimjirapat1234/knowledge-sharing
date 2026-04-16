<script setup lang="ts">
/**
 * Temporary placeholder for screens not yet implemented.
 * Each stub page shows which PRD screen it represents + next steps.
 */
import { useRoute } from 'vue-router'
import { Hammer } from 'lucide-vue-next'
import AppIcon from '@/components/ui/AppIcon.vue'

const route = useRoute()

defineProps<{
  screen: string
  prdRef: string
  description?: string
}>()
</script>

<template>
  <div class="stub">
    <div class="stub__card">
      <div class="stub__icon"><AppIcon :icon="Hammer" size="xl" aria-hidden="true" /></div>
      <p class="stub__tag">กำลังสร้าง</p>
      <h1 class="stub__title">{{ screen }}</h1>
      <p class="stub__ref">PRD: {{ prdRef }}</p>
      <p v-if="description" class="stub__desc">{{ description }}</p>
      <p class="stub__path">{{ route.fullPath }}</p>
      <p class="stub__note">
        หน้านี้จะถูกสร้างในลำดับถัดไปตาม task list · ใช้ State switcher ที่มุมขวาล่าง
        เพื่อดู state ต่างๆ ของหน้าที่สร้างเสร็จแล้ว
      </p>
    </div>
  </div>
</template>

<style scoped>
.stub { padding: var(--space-12) var(--space-4); display: flex; align-items: center; justify-content: center; min-height: 60vh; }
.stub__card {
  max-width: 480px;
  width: 100%;
  padding: var(--space-8);
  background: var(--color-white);
  border: 2px dashed var(--color-border-default);
  border-radius: var(--radius-xl);
  text-align: center;
}
.stub__icon {
  width: 64px; height: 64px;
  background: var(--color-primary-subtle);
  color: var(--color-primary);
  border-radius: var(--radius-xl);
  display: inline-flex; align-items: center; justify-content: center;
  margin-bottom: var(--space-4);
}
.stub__tag {
  display: inline-block;
  font-size: var(--text-caption);
  color: var(--color-primary-dark);
  background: var(--color-primary-subtle);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-weight: var(--weight-semibold);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  margin-bottom: var(--space-3);
}
.stub__title { font-size: var(--text-h2); font-weight: var(--weight-bold); margin-bottom: var(--space-1); }
.stub__ref {
  font-size: var(--text-caption);
  color: var(--color-text-tertiary);
  font-family: var(--font-mono);
  margin-bottom: var(--space-3);
}
.stub__desc { color: var(--color-text-secondary); margin-bottom: var(--space-4); line-height: var(--leading-relaxed); }
.stub__path {
  font-family: var(--font-mono); font-size: var(--text-caption);
  background: var(--color-gray-100); color: var(--color-text-secondary);
  padding: var(--space-2) var(--space-3); border-radius: var(--radius-md);
  margin-bottom: var(--space-4);
  word-break: break-all;
}
.stub__note { font-size: var(--text-caption); color: var(--color-text-tertiary); line-height: var(--leading-relaxed); }
</style>
