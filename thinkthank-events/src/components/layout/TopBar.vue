<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { Bell } from 'lucide-vue-next'
import { useUserStore } from '@/stores/user'
import RoleSwitcher from './RoleSwitcher.vue'
import AppIcon from '@/components/ui/AppIcon.vue'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
</script>

<template>
  <header class="tb" role="banner">
    <div class="tb__inner">
      <a href="/" class="brand" aria-label="Thinktank Events">
        <span class="brand__mark" aria-hidden="true">T</span>
        <span class="brand__name">Thinktank</span>
      </a>

      <div class="tb__right">
        <RoleSwitcher />

        <button class="icon-btn" aria-label="การแจ้งเตือน" title="การแจ้งเตือน">
          <AppIcon :icon="Bell" size="md" aria-hidden="true" />
          <span class="icon-btn__dot" aria-hidden="true"></span>
        </button>

        <a href="/profile" class="user" aria-label="โปรไฟล์">
          <span class="avatar" aria-hidden="true">{{ user.initials }}</span>
          <span class="user__meta">
            <span class="user__name">คุณ{{ user.nickname }}</span>
            <span class="user__role">{{ user.department }}</span>
          </span>
        </a>
      </div>
    </div>
  </header>
</template>

<style scoped>
.tb {
  position: sticky; top: 0; z-index: var(--z-sticky);
  background: var(--color-white);
  border-bottom: 1px solid var(--color-border-light);
  height: var(--size-topbar);
}
.tb__inner {
  padding: 0 var(--space-4);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}
@media (min-width: 768px) { .tb__inner { padding: 0 var(--space-6); } }
.brand { display: flex; align-items: center; gap: var(--space-2); color: var(--color-text-primary); font-weight: var(--weight-bold); }
.brand:hover { text-decoration: none; }
.brand__mark {
  width: 32px; height: 32px;
  border-radius: var(--radius-md);
  background: var(--color-primary);
  color: var(--color-white);
  display: flex; align-items: center; justify-content: center;
  font-weight: var(--weight-bold);
}
@media (max-width: 480px) { .brand__name { display: none; } }
.tb__right { display: flex; align-items: center; gap: var(--space-3); }

.icon-btn {
  position: relative;
  width: var(--size-touch-target); height: var(--size-touch-target);
  border-radius: var(--radius-full);
  display: inline-flex; align-items: center; justify-content: center;
  color: var(--color-text-secondary);
}
.icon-btn:hover { background: var(--color-gray-100); color: var(--color-text-primary); }
.icon-btn__dot {
  position: absolute; top: 10px; right: 10px;
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--color-primary);
  border: 2px solid var(--color-white);
}

.user { display: flex; align-items: center; gap: var(--space-2); color: var(--color-text-primary); }
.user:hover { text-decoration: none; }
.avatar {
  width: 32px; height: 32px;
  border-radius: var(--radius-full);
  background: var(--color-primary-muted);
  color: var(--color-primary-dark);
  display: flex; align-items: center; justify-content: center;
  font-weight: var(--weight-semibold);
  font-size: var(--text-body-sm);
}
.user__meta { display: none; flex-direction: column; line-height: 1.2; }
@media (min-width: 768px) { .user__meta { display: flex; } }
.user__name { font-size: var(--text-body-sm); font-weight: var(--weight-medium); }
.user__role { font-size: var(--text-caption); color: var(--color-text-secondary); }
</style>
