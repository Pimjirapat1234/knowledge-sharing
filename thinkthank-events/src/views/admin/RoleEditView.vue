<script setup lang="ts">
/**
 * Super Admin · Edit single role permissions
 * Toggle menus · group by category · live sidebar preview
 */
import { computed } from 'vue'
import { useRoute, RouterLink, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import {
  Shield, ArrowLeft, RotateCcw, Lock, Check, Eye, User, UserCog, Crown, ShieldCheck,
} from 'lucide-vue-next'
import { usePermissionsStore, ROLE_MENUS, type MenuDef } from '@/stores/permissions'
import { ROLE_LABEL, ROLE_DESC, type UserRole } from '@/stores/user'
import { useToast } from '@/composables/useToast'
import AppIcon from '@/components/ui/AppIcon.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import ErrorState from '@/components/ui/ErrorState.vue'

const route = useRoute()
const router = useRouter()
const permStore = usePermissionsStore()
const { success } = useToast()

const roleKey = computed<UserRole>(() => route.params.roleKey as UserRole)
const isValidRole = computed(() => ['EMPLOYEE', 'HR', 'C_LEVEL', 'SUPER_ADMIN'].includes(roleKey.value))

const iconByRole = { EMPLOYEE: User, HR: UserCog, C_LEVEL: Crown, SUPER_ADMIN: ShieldCheck }
const colorByRole: Record<UserRole, string> = {
  EMPLOYEE: 'var(--color-info)',
  HR: 'var(--color-primary)',
  C_LEVEL: 'var(--color-warning)',
  SUPER_ADMIN: 'var(--color-danger)',
}

const menus = computed(() => ROLE_MENUS[roleKey.value] ?? [])
const groupedMenus = computed(() => {
  const groups = new Map<string, MenuDef[]>()
  menus.value.forEach(m => {
    if (!groups.has(m.group)) groups.set(m.group, [])
    groups.get(m.group)!.push(m)
  })
  return Array.from(groups.entries()).map(([label, items]) => ({ label, items }))
})

const enabledCount = computed(() => permStore.enabled[roleKey.value]?.length ?? 0)
const totalCount = computed(() => menus.value.length)

function toggle(key: string) {
  permStore.toggle(roleKey.value, key)
}

function reset() {
  if (!confirm(`Reset ${ROLE_LABEL[roleKey.value]} เป็น default permissions?`)) return
  permStore.resetRole(roleKey.value)
  success('Reset สำเร็จ', 'Permissions กลับเป็นค่าเริ่มต้น')
}

function enableAll() {
  permStore.enabled[roleKey.value] = menus.value.map(m => m.key)
}

function disableAll() {
  // Keep only required
  permStore.enabled[roleKey.value] = menus.value.filter(m => m.required).map(m => m.key)
}

// Visible in sidebar (for preview)
const visibleInSidebar = computed(() => permStore.visibleMenus(roleKey.value))
</script>

<template>
  <div class="page">
    <ErrorState v-if="!isValidRole" :recoverable="false" title="Role ไม่ถูกต้อง" message="ไม่พบ role นี้ในระบบ" />

    <template v-else>
      <!-- Back -->
      <nav class="crumbs" aria-label="breadcrumb">
        <RouterLink to="/admin/users">
          <AppIcon :icon="ArrowLeft" size="sm" aria-hidden="true" />
          กลับ
        </RouterLink>
        <span>·</span>
        <RouterLink to="/admin/roles">Roles & Permissions</RouterLink>
        <span>›</span>
        <span aria-current="page">{{ ROLE_LABEL[roleKey] }}</span>
      </nav>

      <!-- Header -->
      <header class="head" :style="{ '--c': colorByRole[roleKey] }">
        <div class="head__main">
          <div class="head__icon">
            <AppIcon :icon="iconByRole[roleKey]" size="xl" aria-hidden="true" />
          </div>
          <div class="head__info">
            <div class="head__breadcrumb">
              <AppIcon :icon="Shield" size="sm" aria-hidden="true" />
              Role Permissions
            </div>
            <h1 class="head__title">{{ ROLE_LABEL[roleKey] }}</h1>
            <p class="head__desc">{{ ROLE_DESC[roleKey] }}</p>
          </div>
        </div>

        <div class="head__summary">
          <div class="summary-stat">
            <span class="summary-stat__value">{{ enabledCount }}<small>/{{ totalCount }}</small></span>
            <span class="summary-stat__label">เมนูเปิดใช้งาน</span>
          </div>
          <div class="head__actions">
            <AppButton variant="ghost" size="sm" @click="enableAll">เปิดทั้งหมด</AppButton>
            <AppButton variant="ghost" size="sm" @click="disableAll">ปิดทั้งหมด</AppButton>
            <AppButton variant="secondary" size="sm" @click="reset">
              <AppIcon :icon="RotateCcw" size="sm" aria-hidden="true" />
              Reset
            </AppButton>
          </div>
        </div>
      </header>

      <div class="body">
        <!-- Left: Menu toggles -->
        <section class="menus-col">
          <div v-for="g in groupedMenus" :key="g.label" class="grp">
            <h2 class="grp__title">{{ g.label }}</h2>
            <ul class="grp__list">
              <li
                v-for="m in g.items"
                :key="m.key"
                class="menu-row"
                :class="{ 'is-off': !permStore.isEnabled(roleKey, m.key), 'is-locked': m.required }"
              >
                <div class="menu-row__icon">
                  <AppIcon :icon="m.icon" size="md" aria-hidden="true" />
                </div>
                <div class="menu-row__body">
                  <div class="menu-row__head">
                    <h3 class="menu-row__label">{{ m.label }}</h3>
                    <AppBadge v-if="m.required" variant="warning" size="sm">
                      <AppIcon :icon="Lock" size="sm" aria-hidden="true" />
                      Required
                    </AppBadge>
                  </div>
                  <p class="menu-row__desc">{{ m.description }}</p>
                  <code class="menu-row__path">{{ m.path }}</code>
                </div>
                <label class="menu-row__toggle" :title="m.required ? 'ปิดไม่ได้ · required menu' : 'คลิกเพื่อเปิด/ปิด'">
                  <input
                    type="checkbox"
                    :checked="permStore.isEnabled(roleKey, m.key)"
                    :disabled="m.required"
                    @change="toggle(m.key)"
                    :aria-label="`Toggle ${m.label} for ${ROLE_LABEL[roleKey]}`"
                  />
                  <span class="toggle-track"><span class="toggle-thumb"></span></span>
                </label>
              </li>
            </ul>
          </div>
        </section>

        <!-- Right: Live sidebar preview -->
        <aside class="preview-col">
          <div class="preview-card">
            <div class="preview-card__head">
              <AppIcon :icon="Eye" size="md" aria-hidden="true" />
              <div>
                <h3 class="preview-card__title">Sidebar Preview</h3>
                <p class="preview-card__desc">จำลองเมนูที่ {{ ROLE_LABEL[roleKey] }} จะเห็น</p>
              </div>
            </div>

            <div class="preview-sidebar">
              <div v-if="visibleInSidebar.length === 0" class="preview-empty">
                <AppIcon :icon="Lock" size="lg" aria-hidden="true" />
                <p>ไม่มีเมนูเปิดใช้</p>
                <small>user role นี้จะเห็นหน้าเปล่า</small>
              </div>

              <template v-else>
                <template v-for="(g, gIdx) in groupedMenus" :key="g.label">
                  <p
                    v-if="g.items.some(m => permStore.isEnabled(roleKey, m.key))"
                    class="preview-group"
                  >{{ g.label }}</p>
                  <template v-for="m in g.items" :key="m.key">
                    <div
                      v-if="permStore.isEnabled(roleKey, m.key)"
                      class="preview-item"
                      :class="{ 'is-first': gIdx === 0 && m.key === g.items[0]?.key }"
                    >
                      <AppIcon :icon="m.icon" size="sm" aria-hidden="true" />
                      <span>{{ m.label }}</span>
                      <AppIcon :icon="Check" size="sm" class="preview-item__check" aria-hidden="true" />
                    </div>
                  </template>
                </template>
              </template>
            </div>

            <p class="preview-note">
              การเปลี่ยนแปลงมีผลทันที · บันทึกใน localStorage สำหรับ demo · production จะ sync กับ backend + audit log
            </p>
          </div>
        </aside>
      </div>
    </template>
  </div>
</template>

<style scoped>
.page { max-width: var(--size-content-max); padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-4); }
@media (min-width: 768px) { .page { padding: var(--space-6); } }

.crumbs { display: flex; align-items: center; gap: var(--space-2); font-size: var(--text-body-sm); color: var(--color-text-secondary); flex-wrap: wrap; }
.crumbs a { color: var(--color-text-secondary); display: inline-flex; align-items: center; gap: 4px; }
.crumbs a:hover { color: var(--color-primary); }
.crumbs [aria-current] { color: var(--color-text-primary); font-weight: var(--weight-medium); }

.head {
  padding: var(--space-5);
  background: var(--color-white);
  border-radius: var(--radius-xl);
  border-top: 4px solid var(--c);
  display: flex; flex-direction: column; gap: var(--space-4);
}
@media (min-width: 768px) { .head { padding: var(--space-6); } }

.head__main { display: flex; gap: var(--space-4); align-items: center; }
.head__icon {
  width: 72px; height: 72px; border-radius: var(--radius-xl);
  background: color-mix(in srgb, var(--c) 15%, transparent);
  color: var(--c);
  display: inline-flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.head__info { flex: 1; min-width: 0; }
.head__breadcrumb { display: inline-flex; align-items: center; gap: var(--space-1); font-size: var(--text-caption); color: var(--color-danger-dark); font-weight: var(--weight-semibold); text-transform: uppercase; letter-spacing: var(--tracking-wide); }
.head__title { font-size: var(--text-h1); font-weight: var(--weight-bold); margin: 4px 0; }
.head__desc { color: var(--color-text-secondary); }

.head__summary { display: flex; justify-content: space-between; align-items: center; padding-top: var(--space-4); border-top: 1px solid var(--color-border-light); flex-wrap: wrap; gap: var(--space-3); }
.summary-stat { display: flex; flex-direction: column; }
.summary-stat__value { font-size: var(--text-h2); font-weight: var(--weight-bold); color: var(--c); line-height: 1; }
.summary-stat__value small { font-size: var(--text-body); color: var(--color-text-tertiary); font-weight: var(--weight-regular); }
.summary-stat__label { font-size: var(--text-caption); color: var(--color-text-secondary); margin-top: 4px; }

.head__actions { display: flex; gap: var(--space-2); flex-wrap: wrap; }

/* Body layout */
.body { display: grid; grid-template-columns: 1fr; gap: var(--space-4); }
@media (min-width: 1024px) { .body { grid-template-columns: 1fr 320px; } }

.menus-col { display: flex; flex-direction: column; gap: var(--space-5); }

.grp__title { font-size: var(--text-caption); font-weight: var(--weight-bold); color: var(--color-text-tertiary); text-transform: uppercase; letter-spacing: var(--tracking-wider); margin-bottom: var(--space-2); padding: 0 var(--space-2); }
.grp__list { list-style: none; display: flex; flex-direction: column; gap: var(--space-2); }

.menu-row {
  display: flex; gap: var(--space-3); align-items: center;
  padding: var(--space-4);
  background: var(--color-white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  transition: all var(--duration-fast);
}
.menu-row:hover { border-color: var(--color-primary-muted); }
.menu-row.is-off { background: var(--color-gray-50); opacity: 0.65; }
.menu-row.is-locked { background: var(--color-warning-subtle); border-color: var(--color-warning-light); }

.menu-row__icon {
  width: 40px; height: 40px; border-radius: var(--radius-lg);
  background: var(--color-primary-subtle); color: var(--color-primary);
  display: inline-flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.menu-row__body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.menu-row__head { display: flex; align-items: center; gap: var(--space-2); flex-wrap: wrap; }
.menu-row__label { font-size: var(--text-body); font-weight: var(--weight-semibold); }
.menu-row__desc { font-size: var(--text-caption); color: var(--color-text-secondary); line-height: var(--leading-relaxed); }
.menu-row__path { font-family: var(--font-mono); font-size: 10px; color: var(--color-text-tertiary); background: var(--color-gray-100); padding: 2px var(--space-2); border-radius: var(--radius-sm); margin-top: 4px; display: inline-block; max-width: 100%; overflow: hidden; text-overflow: ellipsis; }

.menu-row__toggle { position: relative; flex-shrink: 0; cursor: pointer; }
.menu-row__toggle input { position: absolute; opacity: 0; pointer-events: none; }
.menu-row__toggle input:disabled ~ .toggle-track { opacity: 0.5; cursor: not-allowed; }
.toggle-track {
  display: inline-block; position: relative;
  width: 52px; height: 28px;
  background: var(--color-gray-300);
  border-radius: var(--radius-full);
  transition: background var(--duration-fast);
}
.toggle-thumb {
  position: absolute; top: 2px; left: 2px;
  width: 24px; height: 24px;
  background: var(--color-white); border-radius: 50%;
  box-shadow: var(--shadow-sm);
  transition: transform var(--duration-fast) var(--ease-out);
}
.menu-row__toggle input:checked ~ .toggle-track { background: var(--color-primary); }
.menu-row__toggle input:checked ~ .toggle-track .toggle-thumb { transform: translateX(24px); }
.menu-row__toggle input:focus-visible ~ .toggle-track { box-shadow: var(--shadow-focus); }

/* Preview */
.preview-col { position: relative; }
@media (min-width: 1024px) { .preview-col { position: sticky; top: calc(var(--size-topbar) + var(--space-4)); align-self: flex-start; } }

.preview-card {
  background: var(--color-white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  padding: var(--space-5);
}
.preview-card__head { display: flex; align-items: flex-start; gap: var(--space-2); margin-bottom: var(--space-4); }
.preview-card__head > :first-child { color: var(--color-primary); margin-top: 2px; }
.preview-card__title { font-size: var(--text-body); font-weight: var(--weight-semibold); }
.preview-card__desc { font-size: var(--text-caption); color: var(--color-text-secondary); }

.preview-sidebar {
  background: var(--color-gray-50);
  border-radius: var(--radius-lg);
  padding: var(--space-3);
  min-height: 200px;
  display: flex; flex-direction: column; gap: var(--space-1);
}

.preview-group {
  font-size: 10px;
  font-weight: var(--weight-bold);
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
  padding: var(--space-2) var(--space-2) var(--space-1);
}

.preview-item {
  display: flex; align-items: center; gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background: var(--color-white);
  border-radius: var(--radius-md);
  font-size: var(--text-body-sm);
  color: var(--color-text-primary);
  animation: fade-in 0.3s var(--ease-out);
}
.preview-item__check { margin-left: auto; color: var(--color-success); }
@keyframes fade-in { from { opacity: 0; transform: translateX(-4px); } to { opacity: 1; transform: none; } }

.preview-empty {
  text-align: center;
  padding: var(--space-8) var(--space-3);
  color: var(--color-text-tertiary);
  display: flex; flex-direction: column; gap: var(--space-2); align-items: center;
}
.preview-empty small { font-size: var(--text-caption); }

.preview-note {
  font-size: var(--text-caption);
  color: var(--color-text-tertiary);
  line-height: var(--leading-relaxed);
  margin-top: var(--space-3);
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-border-light);
}
</style>
