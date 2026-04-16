<script setup lang="ts">
import { computed, type Component } from 'vue'
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { Home, Calendar, Trophy, User, Users, Camera, Star } from 'lucide-vue-next'
import { useUserStore } from '@/stores/user'
import AppIcon from '@/components/ui/AppIcon.vue'

const { currentRole } = storeToRefs(useUserStore())

interface NavItem { to: string; label: string; icon: Component }

const byRole: Record<string, NavItem[]> = {
  EMPLOYEE: [
    { to: '/employee', label: 'Home', icon: Home },
    { to: '/events/evt-2026-q2', label: 'Event', icon: Calendar },
    { to: '/events/evt-2026-q2/leaderboard', label: 'Rank', icon: Trophy },
    { to: '/profile', label: 'Profile', icon: User },
  ],
  HR: [
    { to: '/hr', label: 'Home', icon: Home },
    { to: '/events/evt-2026-q2/admin/participants', label: 'ผู้เข้าร่วม', icon: Users },
    { to: '/events/evt-2026-q2/admin/check-in', label: 'Scan', icon: Camera },
    { to: '/profile', label: 'Profile', icon: User },
  ],
  C_LEVEL: [
    { to: '/judge', label: 'Home', icon: Home },
    { to: '/events/evt-2026-q2/judge/rate', label: 'ให้คะแนน', icon: Star },
    { to: '/events/evt-2026-q2/leaderboard', label: 'อันดับ', icon: Trophy },
    { to: '/profile', label: 'Profile', icon: User },
  ],
}

const items = computed(() => byRole[currentRole.value])
</script>

<template>
  <nav class="bnav" aria-label="เมนูหลัก">
    <RouterLink
      v-for="i in items"
      :key="i.to"
      :to="i.to"
      class="bnav__item"
      active-class="is-active"
    >
      <AppIcon :icon="i.icon" size="md" aria-hidden="true" />
      <span class="bnav__label">{{ i.label }}</span>
    </RouterLink>
  </nav>
</template>

<style scoped>
.bnav {
  position: sticky; bottom: 0;
  z-index: var(--z-sticky);
  background: var(--color-white);
  border-top: 1px solid var(--color-border-light);
  display: flex;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.04);
}
@media (min-width: 768px) { .bnav { display: none; } }
.bnav__item {
  flex: 1;
  display: flex; flex-direction: column; align-items: center;
  gap: 2px;
  padding: var(--space-2) var(--space-1);
  color: var(--color-text-secondary);
  min-height: 56px;
  justify-content: center;
}
.bnav__item:hover { text-decoration: none; color: var(--color-text-primary); }
.bnav__item.is-active { color: var(--color-primary); }
.bnav__label { font-size: 10px; font-weight: var(--weight-medium); }
</style>
