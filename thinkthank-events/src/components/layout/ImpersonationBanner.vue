<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ShieldAlert, ArrowLeft } from 'lucide-vue-next'
import { useUserStore, ROLE_LABEL } from '@/stores/user'
import { useRouter } from 'vue-router'
import AppIcon from '@/components/ui/AppIcon.vue'

const store = useUserStore()
const router = useRouter()
const { isImpersonating, impersonating } = storeToRefs(store)

function stop() {
  store.stopImpersonation()
  router.push('/admin/users')
}
</script>

<template>
  <div v-if="isImpersonating" class="imp" role="alert">
    <div class="imp__inner">
      <AppIcon :icon="ShieldAlert" size="md" aria-hidden="true" />
      <div class="imp__body">
        <strong>กำลังดูในฐานะ {{ impersonating ? ROLE_LABEL[impersonating] : '' }}</strong>
        <span class="imp__desc">Super Admin impersonation · action ทั้งหมดถูก log · data จะไม่ถูกแก้ไขจริง</span>
      </div>
      <button class="imp__stop" type="button" @click="stop">
        <AppIcon :icon="ArrowLeft" size="sm" aria-hidden="true" />
        กลับเป็น Admin
      </button>
    </div>
  </div>
</template>

<style scoped>
.imp {
  background: linear-gradient(90deg, var(--color-danger) 0%, var(--color-danger-dark) 100%);
  color: var(--color-white);
  position: sticky; top: var(--size-topbar); z-index: calc(var(--z-sticky) - 1);
  animation: pulse-border 2s infinite;
}
@keyframes pulse-border {
  0%, 100% { box-shadow: 0 0 0 0 rgba(234, 84, 85, 0); }
  50% { box-shadow: 0 2px 16px rgba(234, 84, 85, 0.5); }
}
.imp__inner {
  padding: var(--space-3) var(--space-4);
  display: flex; align-items: center; gap: var(--space-3);
  max-width: 100%;
}
@media (min-width: 768px) { .imp__inner { padding: var(--space-3) var(--space-6); } }

.imp__body { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.imp__body strong { font-size: var(--text-body-sm); font-weight: var(--weight-semibold); }
.imp__desc { font-size: var(--text-caption); opacity: 0.9; }

.imp__stop {
  display: inline-flex; align-items: center; gap: var(--space-1);
  padding: var(--space-1) var(--space-3);
  min-height: 32px;
  background: rgba(255,255,255,0.2);
  color: var(--color-white);
  border-radius: var(--radius-md);
  font-size: var(--text-caption);
  font-weight: var(--weight-semibold);
  flex-shrink: 0;
}
.imp__stop:hover { background: rgba(255,255,255,0.3); }

@media (prefers-reduced-motion: reduce) { .imp { animation: none; } }
</style>
