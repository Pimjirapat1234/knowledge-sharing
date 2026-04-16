<script setup lang="ts">
import ErrorState from '@/components/ui/ErrorState.vue'
</script>

<template>
  <main class="nf">
    <div class="nf__wrap">
      <ErrorState
        title="ไม่พบหน้าที่ต้องการ (404)"
        message="URL อาจพิมพ์ผิด หรือหน้านี้ถูกย้ายไปแล้ว · กลับไปที่หน้าหลักเพื่อเริ่มใหม่"
        :recoverable="false"
      />
      <a href="/" class="nf__back">← กลับหน้าหลัก</a>
    </div>
  </main>
</template>

<style scoped>
.nf { padding: var(--space-12) var(--space-4); min-height: 60vh; display: flex; align-items: center; justify-content: center; }
.nf__wrap { max-width: 480px; width: 100%; text-align: center; }
.nf__back { display: inline-block; margin-top: var(--space-4); font-weight: var(--weight-medium); }
</style>
