<script setup lang="ts">
/**
 * Super Admin · Roles & Permissions (List)
 * Overview of 4 roles · click to edit
 */
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import {
  Shield, User, UserCog, Crown, ShieldCheck, ChevronRight, RotateCcw,
} from 'lucide-vue-next'
import { usePermissionsStore, ROLE_MENUS } from '@/stores/permissions'
import { useAdminStore } from '@/stores/admin'
import { useToast } from '@/composables/useToast'
import { useUiState } from '@/composables/useUiState'
import { ROLE_LABEL, ROLE_DESC, type UserRole } from '@/stores/user'
import AppIcon from '@/components/ui/AppIcon.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton.vue'

const permStore = usePermissionsStore()
const { counts } = storeToRefs(permStore)
const { users } = storeToRefs(useAdminStore())
const { success, warning } = useToast()
const ui = useUiState()

const roles: UserRole[] = ['EMPLOYEE', 'HR', 'C_LEVEL', 'SUPER_ADMIN']

const iconByRole = {
  EMPLOYEE: User,
  HR: UserCog,
  C_LEVEL: Crown,
  SUPER_ADMIN: ShieldCheck,
}

const colorByRole: Record<UserRole, string> = {
  EMPLOYEE: 'var(--color-info)',
  HR: 'var(--color-primary)',
  C_LEVEL: 'var(--color-warning)',
  SUPER_ADMIN: 'var(--color-danger)',
}

const userCountByRole = computed(() => {
  const map: Record<UserRole, number> = { EMPLOYEE: 0, HR: 0, C_LEVEL: 0, SUPER_ADMIN: 0 }
  users.value.forEach(u => { if (u.active) map[u.role] += 1 })
  return map
})

function resetAll() {
  if (!confirm('Reset ทุก role เป็น default permissions? · การเปลี่ยนแปลงถูก log ใน audit')) return
  permStore.resetAll()
  warning('Reset แล้ว', 'ทุก role กลับเป็น permissions เริ่มต้น')
}

function resetRole(role: UserRole) {
  if (!confirm(`Reset permissions ของ ${ROLE_LABEL[role]} เป็น default?`)) return
  permStore.resetRole(role)
  success('Reset สำเร็จ', `${ROLE_LABEL[role]} กลับเป็น default permissions`)
}
</script>

<template>
  <div class="page" style="--page-gap: var(--space-5)">
    <ErrorState v-if="ui.isErrorBlocking.value" :recoverable="false" />
    <ErrorState v-else-if="ui.isError.value" @retry="() => {}" />

    <template v-else-if="ui.isLoading.value">
      <LoadingSkeleton variant="line" width="60%" height="32px" />
      <LoadingSkeleton variant="card" :count="4" />
    </template>

    <template v-else>
      <header class="head">
        <div>
          <div class="head__breadcrumb">
            <AppIcon :icon="Shield" size="sm" aria-hidden="true" />
            System Admin
          </div>
          <h1 class="head__title">Roles & Permissions</h1>
          <p class="head__desc">จัดการว่าแต่ละ role เห็นเมนูไหนได้บ้าง · คลิกที่ role เพื่อแก้ไข · การเปลี่ยนแปลงมีผลทันทีและบันทึก audit log</p>
        </div>
        <AppButton variant="secondary" size="md" @click="resetAll">
          <AppIcon :icon="RotateCcw" size="sm" aria-hidden="true" />
          Reset ทั้งหมด
        </AppButton>
      </header>

      <!-- Role list — horizontal rows with rich info -->
      <section class="roles" role="list" aria-label="Roles list">
        <RouterLink
          v-for="r in roles"
          :key="r"
          :to="`/admin/roles/${r}`"
          class="role-row"
          :style="{ '--c': colorByRole[r] }"
          role="listitem"
        >
          <!-- Color accent bar -->
          <div class="role-row__stripe" aria-hidden="true"></div>

          <!-- Icon -->
          <div class="role-row__icon" aria-hidden="true">
            <AppIcon :icon="iconByRole[r]" size="lg" />
          </div>

          <!-- Identity -->
          <div class="role-row__identity">
            <div class="role-row__head">
              <h2 class="role-row__name">{{ ROLE_LABEL[r] }}</h2>
              <span class="role-row__user-count" :title="`${userCountByRole[r]} users ใช้ role นี้`">
                <span class="dot" aria-hidden="true"></span>
                {{ userCountByRole[r] }} users
              </span>
            </div>
            <p class="role-row__desc">{{ ROLE_DESC[r] }}</p>
            <div class="role-row__chips">
              <span
                v-for="m in ROLE_MENUS[r].slice(0, 4)"
                :key="m.key"
                class="role-chip"
                :class="{ 'is-off': !permStore.isEnabled(r, m.key) }"
                :title="m.label + (permStore.isEnabled(r, m.key) ? '' : ' (ปิดอยู่)')"
              >
                {{ m.label }}
              </span>
              <span v-if="ROLE_MENUS[r].length > 4" class="role-chip role-chip--more">
                +{{ ROLE_MENUS[r].length - 4 }}
              </span>
            </div>
          </div>

          <!-- Permission donut -->
          <div class="role-row__donut" aria-hidden="true">
            <svg viewBox="0 0 44 44" class="donut">
              <circle class="donut__track" cx="22" cy="22" r="18"></circle>
              <circle
                class="donut__fill"
                cx="22" cy="22" r="18"
                :style="`--pct: ${(counts[r].enabled / counts[r].total) * 100}`"
              ></circle>
            </svg>
            <div class="donut__label">
              <strong>{{ counts[r].enabled }}</strong>
              <span>/ {{ counts[r].total }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="role-row__actions">
            <button
              class="action-btn action-btn--reset"
              @click.stop.prevent="resetRole(r)"
              :aria-label="`Reset permissions ของ ${ROLE_LABEL[r]}`"
              title="Reset เป็น default"
            >
              <AppIcon :icon="RotateCcw" size="sm" aria-hidden="true" />
            </button>
            <span class="role-row__chev" aria-hidden="true">
              <AppIcon :icon="ChevronRight" size="md" />
            </span>
          </div>
        </RouterLink>
      </section>

      <!-- Info -->
      <aside class="note">
        <AppIcon :icon="Shield" size="sm" aria-hidden="true" />
        <div>
          <p class="note__title">สิทธิ์ที่บังคับไม่ให้ปิด</p>
          <p>Dashboard/Home ของแต่ละ role เป็น <AppBadge variant="warning" size="sm">Required</AppBadge> ปิดไม่ได้ · เพื่อไม่ให้ user ติดอยู่ในหน้าว่างหลัง login</p>
        </div>
      </aside>
    </template>
  </div>
</template>

<style scoped>
/* layout via global .page */

.head { display: flex; justify-content: space-between; align-items: flex-end; gap: var(--space-4); flex-wrap: wrap; }
.head__breadcrumb { display: inline-flex; align-items: center; gap: var(--space-1); font-size: var(--text-caption); color: var(--color-danger-dark); font-weight: var(--weight-semibold); text-transform: uppercase; letter-spacing: var(--tracking-wide); }
.head__title { font-size: var(--text-h2); font-weight: var(--weight-bold); margin: 4px 0; }
.head__desc { font-size: var(--text-body-sm); color: var(--color-text-secondary); max-width: 700px; line-height: var(--leading-relaxed); }

/* Roles list — horizontal rows */
.roles {
  display: flex; flex-direction: column; gap: var(--space-3);
}

.role-row {
  position: relative;
  display: grid;
  grid-template-columns: auto 56px 1fr auto auto;
  gap: var(--space-4);
  align-items: center;
  padding: var(--space-4) var(--space-5) var(--space-4) 0;
  background: var(--color-white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  color: var(--color-text-primary);
  transition: all var(--duration-fast) var(--ease-out);
  overflow: hidden;
}
.role-row:hover {
  text-decoration: none;
  color: var(--color-text-primary);
  border-color: var(--c);
  box-shadow: 0 4px 16px color-mix(in srgb, var(--c) 12%, transparent);
  transform: translateY(-1px);
}
.role-row:hover .role-row__chev { transform: translateX(4px); color: var(--c); }

/* Color stripe */
.role-row__stripe {
  width: 6px;
  background: var(--c);
  align-self: stretch;
  border-radius: var(--radius-sm);
  margin-left: var(--space-1);
}

/* Icon */
.role-row__icon {
  width: 56px; height: 56px;
  border-radius: var(--radius-xl);
  background: color-mix(in srgb, var(--c) 14%, var(--color-white));
  color: var(--c);
  display: inline-flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

/* Identity (name + desc + chips) */
.role-row__identity { min-width: 0; display: flex; flex-direction: column; gap: var(--space-1); }
.role-row__head { display: flex; align-items: center; gap: var(--space-3); flex-wrap: wrap; }
.role-row__name {
  font-size: var(--text-h4);
  font-weight: var(--weight-bold);
  letter-spacing: -0.2px;
}
.role-row__user-count {
  display: inline-flex; align-items: center; gap: var(--space-1);
  font-size: var(--text-caption);
  color: var(--color-text-secondary);
  padding: 2px var(--space-2);
  background: var(--color-gray-100);
  border-radius: var(--radius-full);
}
.role-row__user-count .dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--color-success);
}
.role-row__desc { font-size: var(--text-body-sm); color: var(--color-text-secondary); }

.role-row__chips { display: flex; flex-wrap: wrap; gap: 4px; margin-top: var(--space-1); }
.role-chip {
  display: inline-flex; align-items: center;
  padding: 2px var(--space-2);
  background: color-mix(in srgb, var(--c) 10%, transparent);
  color: var(--c);
  border-radius: var(--radius-sm);
  font-size: 11px;
  font-weight: var(--weight-medium);
  white-space: nowrap;
}
.role-chip.is-off {
  background: var(--color-gray-100);
  color: var(--color-text-tertiary);
  text-decoration: line-through;
  opacity: 0.65;
}
.role-chip--more {
  background: transparent;
  color: var(--color-text-tertiary);
  border: 1px dashed var(--color-border-default);
}

/* Permission donut */
.role-row__donut { position: relative; width: 72px; height: 72px; flex-shrink: 0; }
.donut { width: 100%; height: 100%; transform: rotate(-90deg); }
.donut__track {
  fill: none;
  stroke: var(--color-gray-200);
  stroke-width: 4;
}
.donut__fill {
  fill: none;
  stroke: var(--c);
  stroke-width: 4;
  stroke-linecap: round;
  /* circumference of r=18 ≈ 113.1 */
  stroke-dasharray: 113.1;
  stroke-dashoffset: calc(113.1 - (113.1 * var(--pct, 0) / 100));
  transition: stroke-dashoffset var(--duration-slow) var(--ease-out);
}
.donut__label {
  position: absolute; inset: 0;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  font-size: var(--text-caption);
  line-height: 1;
}
.donut__label strong {
  font-size: var(--text-h4);
  font-weight: var(--weight-bold);
  color: var(--c);
}
.donut__label span { font-size: 10px; color: var(--color-text-tertiary); margin-top: 2px; }

/* Actions */
.role-row__actions {
  display: flex; align-items: center; gap: var(--space-2);
  flex-shrink: 0;
}
.action-btn {
  width: 36px; height: 36px;
  border-radius: var(--radius-md);
  color: var(--color-text-tertiary);
  display: inline-flex; align-items: center; justify-content: center;
  background: transparent;
  transition: all var(--duration-fast);
}
.action-btn:hover {
  background: var(--color-gray-100);
  color: var(--color-text-primary);
}
.role-row__chev {
  color: var(--color-text-tertiary);
  transition: all var(--duration-fast);
  display: inline-flex;
}

/* Responsive collapse */
@media (max-width: 720px) {
  .role-row {
    grid-template-columns: auto 48px 1fr auto;
    gap: var(--space-3);
    padding: var(--space-3) var(--space-3) var(--space-3) 0;
  }
  .role-row__icon { width: 48px; height: 48px; }
  .role-row__donut { display: none; }
  .role-row__name { font-size: var(--text-body); }
}
@media (max-width: 480px) {
  .role-row__actions .action-btn { display: none; }
  .role-row__chips .role-chip:nth-child(n+3) { display: none; }
}

.note { display: flex; gap: var(--space-2); padding: var(--space-4); background: var(--color-warning-subtle); color: var(--color-warning-dark); border-radius: var(--radius-lg); font-size: var(--text-body-sm); align-items: flex-start; line-height: var(--leading-relaxed); }
.note__title { font-weight: var(--weight-semibold); margin-bottom: 4px; }
</style>
