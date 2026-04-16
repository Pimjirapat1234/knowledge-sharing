<script setup lang="ts">
import { ref, type Component } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { User, UserCog, Crown, ShieldCheck, ChevronDown, Check, Eye } from 'lucide-vue-next'
import { useUserStore, ROLE_LABEL, ROLE_DESC, type UserRole } from '@/stores/user'
import AppIcon from '@/components/ui/AppIcon.vue'

const router = useRouter()
const store = useUserStore()
const { currentRole, effectiveRole, isImpersonating, canImpersonate } = storeToRefs(store)

const open = ref(false)

const roles: UserRole[] = ['EMPLOYEE', 'HR', 'C_LEVEL', 'SUPER_ADMIN']

const iconByRole: Record<UserRole, Component> = {
  EMPLOYEE: User,
  HR: UserCog,
  C_LEVEL: Crown,
  SUPER_ADMIN: ShieldCheck,
}

const landingByRole: Record<UserRole, string> = {
  EMPLOYEE: '/employee',
  HR: '/hr',
  C_LEVEL: '/judge',
  SUPER_ADMIN: '/admin/users',
}

function select(role: UserRole) {
  open.value = false
  // If current user is SUPER_ADMIN and switching to non-admin role → impersonate
  if (canImpersonate.value && role !== 'SUPER_ADMIN') {
    store.impersonate(role)
    router.push(landingByRole[role])
    return
  }
  // If currently impersonating and switching back to SUPER_ADMIN
  if (isImpersonating.value && role === 'SUPER_ADMIN') {
    store.stopImpersonation()
    router.push(landingByRole.SUPER_ADMIN)
    return
  }
  // Regular role switch (demo mode)
  store.setRole(role)
  router.push(landingByRole[role])
}
</script>

<template>
  <div class="rs">
    <button
      type="button"
      class="rs__trigger"
      :class="{ 'is-impersonating': isImpersonating }"
      :aria-expanded="open"
      aria-haspopup="listbox"
      @click="open = !open"
    >
      <span class="rs__label">
        <AppIcon :icon="iconByRole[effectiveRole]" size="md" aria-hidden="true" />
        <span class="rs__text">
          <span class="rs__top">{{ isImpersonating ? 'Viewing as' : 'View as' }}</span>
          <span class="rs__role">{{ ROLE_LABEL[effectiveRole] }}</span>
        </span>
      </span>
      <AppIcon :icon="ChevronDown" size="sm" aria-hidden="true" />
    </button>

    <div v-if="open" class="rs__backdrop" @click="open = false" />

    <ul v-if="open" class="rs__menu" role="listbox">
      <li v-for="r in roles" :key="r">
        <button
          type="button"
          class="rs__option"
          :class="{
            'is-active': r === effectiveRole,
            'is-admin': r === 'SUPER_ADMIN',
          }"
          role="option"
          :aria-selected="r === effectiveRole"
          @click="select(r)"
        >
          <AppIcon :icon="iconByRole[r]" size="md" aria-hidden="true" />
          <span>
            <span class="rs__opt-title">
              {{ ROLE_LABEL[r] }}
              <small v-if="canImpersonate && r !== 'SUPER_ADMIN'" class="rs__imp-hint">
                <AppIcon :icon="Eye" size="sm" aria-hidden="true" /> impersonate
              </small>
            </span>
            <span class="rs__opt-desc">{{ ROLE_DESC[r] }}</span>
          </span>
          <AppIcon v-if="r === effectiveRole" :icon="Check" size="sm" class="rs__check" aria-hidden="true" />
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.rs { position: relative; }
.rs__trigger {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-1) var(--space-3);
  min-height: var(--size-touch-target);
  background: var(--color-gray-100);
  border-radius: var(--radius-full);
  font-size: var(--text-caption);
  transition: all var(--duration-fast);
}
.rs__trigger:hover { background: var(--color-gray-200); }
.rs__trigger.is-impersonating {
  background: var(--color-danger-subtle);
  color: var(--color-danger-dark);
  box-shadow: 0 0 0 2px var(--color-danger);
}
.rs__label { display: inline-flex; align-items: center; gap: var(--space-2); }
.rs__text { display: flex; flex-direction: column; align-items: flex-start; line-height: 1.1; }
.rs__top { font-size: 10px; color: var(--color-text-tertiary); text-transform: uppercase; letter-spacing: 1px; }
.is-impersonating .rs__top { color: var(--color-danger); font-weight: var(--weight-semibold); }
.rs__role { font-size: var(--text-body-sm); font-weight: var(--weight-semibold); color: var(--color-text-primary); }

.rs__backdrop { position: fixed; inset: 0; background: transparent; z-index: calc(var(--z-dropdown) - 1); }
.rs__menu {
  position: absolute;
  top: calc(100% + 8px); right: 0;
  min-width: 300px;
  background: var(--color-white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: var(--space-1);
  list-style: none;
  z-index: var(--z-dropdown);
}
.rs__option {
  width: 100%;
  display: flex;
  gap: var(--space-3);
  align-items: center;
  padding: var(--space-3);
  border-radius: var(--radius-md);
  text-align: left;
  min-height: var(--size-touch-target);
}
.rs__option:hover { background: var(--color-gray-50); }
.rs__option.is-active { background: var(--color-primary-subtle); }
.rs__option.is-admin {
  background: linear-gradient(90deg, var(--color-danger-subtle), transparent);
  border: 1px solid transparent;
}
.rs__option.is-admin:hover { border-color: var(--color-danger-light); }
.rs__option.is-admin.is-active { background: var(--color-danger-subtle); border-color: var(--color-danger); }

.rs__opt-title {
  display: flex; align-items: center; gap: var(--space-2);
  font-weight: var(--weight-medium); color: var(--color-text-primary);
  font-size: var(--text-body-sm);
}
.rs__imp-hint {
  display: inline-flex; align-items: center; gap: 2px;
  font-size: 10px;
  padding: 1px 6px;
  background: var(--color-info-subtle); color: var(--color-info-dark);
  border-radius: var(--radius-full);
  font-weight: var(--weight-regular);
}
.rs__opt-desc { display: block; font-size: var(--text-caption); color: var(--color-text-secondary); margin-top: 2px; }
.rs__check { margin-left: auto; color: var(--color-primary); }
</style>
