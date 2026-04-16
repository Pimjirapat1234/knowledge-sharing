<script setup lang="ts">
/**
 * Super Admin · Users Management
 * CRUD users · role change · activate/deactivate · impersonate
 */
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import {
  Search, Download, UserPlus, Eye, MoreHorizontal, Shield,
  User, UserCog, Crown, ShieldCheck, Check, Pencil, X,
} from 'lucide-vue-next'
import { useAdminStore, type AdminUser } from '@/stores/admin'
import { useUserStore, ROLE_LABEL, ROLE_DESC, type UserRole } from '@/stores/user'
import { useUiState } from '@/composables/useUiState'
import { useToast } from '@/composables/useToast'
import { useRouter } from 'vue-router'
import AppIcon from '@/components/ui/AppIcon.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppToggle from '@/components/ui/AppToggle.vue'
import StatCard from '@/components/ui/StatCard.vue'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'

const { users } = storeToRefs(useAdminStore())
const userStore = useUserStore()
const router = useRouter()
const ui = useUiState()
const { success, warning } = useToast()

const query = ref('')
const roleFilter = ref<UserRole | ''>('')

const filtered = computed(() => users.value.filter(u => {
  if (query.value && !(u.name.toLowerCase().includes(query.value.toLowerCase()) || u.email.includes(query.value))) return false
  if (roleFilter.value && u.role !== roleFilter.value) return false
  return true
}))

const stats = computed(() => ({
  total: users.value.length,
  active: users.value.filter(u => u.active).length,
  employees: users.value.filter(u => u.role === 'EMPLOYEE').length,
  admins: users.value.filter(u => u.role === 'SUPER_ADMIN' || u.role === 'HR').length,
}))

const roleIcon = (r: UserRole) => r === 'SUPER_ADMIN' ? ShieldCheck : r === 'HR' ? UserCog : r === 'C_LEVEL' ? Crown : User
const roleVariant = (r: UserRole): 'danger' | 'primary' | 'warning' | 'info' =>
  r === 'SUPER_ADMIN' ? 'danger' : r === 'HR' ? 'primary' : r === 'C_LEVEL' ? 'warning' : 'info'

function impersonate(role: UserRole) {
  userStore.impersonate(role)
  const landing = role === 'HR' ? '/hr' : role === 'C_LEVEL' ? '/judge' : '/employee'
  router.push(landing)
}

function exportUsers() { success('Export users', `${filtered.value.length} รายการ · ส่งไปอีเมล`) }

function relTime(iso: string) {
  const d = new Date(iso)
  const diff = Date.now() - d.getTime()
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(hours / 24)
  if (days > 0) return `${days} วันก่อน`
  if (hours > 0) return `${hours} ชม.ก่อน`
  return 'เมื่อไม่นานมานี้'
}

// ---- Edit modal ----
const editingUser = ref<AdminUser | null>(null)
const editRole = ref<UserRole>('EMPLOYEE')
const editActive = ref(true)

function openEdit(u: AdminUser) {
  editingUser.value = u
  editRole.value = u.role
  editActive.value = u.active
}

function closeEdit() {
  editingUser.value = null
}

function saveEdit() {
  if (!editingUser.value) return
  const prev = { ...editingUser.value }
  editingUser.value.role = editRole.value
  editingUser.value.active = editActive.value
  const changes: string[] = []
  if (prev.role !== editRole.value) changes.push(`role: ${ROLE_LABEL[prev.role]} → ${ROLE_LABEL[editRole.value]}`)
  if (prev.active !== editActive.value) changes.push(`status: ${prev.active ? 'active' : 'inactive'} → ${editActive.value ? 'active' : 'inactive'}`)
  if (changes.length === 0) {
    warning('ไม่มีการเปลี่ยนแปลง')
  } else {
    success(`อัปเดตโปรไฟล์ ${editingUser.value.name}`, changes.join(' · '))
  }
  closeEdit()
}

const rolesList: UserRole[] = ['EMPLOYEE', 'HR', 'C_LEVEL', 'SUPER_ADMIN']
</script>

<template>
  <div class="page">
    <ErrorState v-if="ui.isErrorBlocking.value" :recoverable="false" />
    <ErrorState v-else-if="ui.isError.value" @retry="() => {}" />

    <template v-else>
      <header class="head">
        <div>
          <div class="head__breadcrumb">
            <AppIcon :icon="Shield" size="sm" aria-hidden="true" />
            System Admin
          </div>
          <h1 class="head__title">Users</h1>
          <p class="head__desc">จัดการผู้ใช้ทั้งระบบ · role assignment · impersonate สำหรับ support</p>
        </div>
        <div class="head__actions">
          <AppButton variant="secondary" size="md" @click="exportUsers">
            <AppIcon :icon="Download" size="sm" aria-hidden="true" />
            Export
          </AppButton>
          <AppButton variant="primary" size="md">
            <AppIcon :icon="UserPlus" size="sm" aria-hidden="true" />
            เพิ่ม User
          </AppButton>
        </div>
      </header>

      <!-- Stats -->
      <section class="stats">
        <StatCard label="Total" :value="stats.total" :icon="User" color="primary" />
        <StatCard label="Active" :value="stats.active" :icon="Check" color="success" />
        <StatCard label="Employees" :value="stats.employees" :icon="User" color="info" />
        <StatCard label="Admins" :value="stats.admins" :icon="ShieldCheck" color="danger" />
      </section>

      <!-- Filter -->
      <section class="filter">
        <div class="filter__search">
          <AppIcon :icon="Search" size="sm" aria-hidden="true" />
          <input v-model="query" type="search" placeholder="ค้นหาชื่อ/อีเมล..." />
        </div>
        <select v-model="roleFilter" class="select">
          <option value="">ทุก role</option>
          <option value="EMPLOYEE">Employee</option>
          <option value="HR">HR</option>
          <option value="C_LEVEL">C-Level</option>
          <option value="SUPER_ADMIN">Super Admin</option>
        </select>
      </section>

      <template v-if="ui.isLoading.value">
        <LoadingSkeleton variant="line" :count="6" height="56px" />
      </template>

      <EmptyState
        v-else-if="ui.isEmpty.value || users.length === 0"
        :icon="User"
        title="ยังไม่มี users"
        message="เริ่ม import จาก Azure AD หรือเพิ่มด้วยตนเอง"
        cta-label="Import จาก SSO"
      />

      <EmptyState
        v-else-if="filtered.length === 0"
        title="ไม่พบผู้ใช้ที่ตรงกับ filter"
        message="ลองเปลี่ยน keyword หรือปิด filter"
      />

      <!-- Users table -->
      <div v-else class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>ผู้ใช้</th>
              <th>แผนก</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in filtered" :key="u.id" :class="{ 'is-inactive': !u.active }">
              <td>
                <div class="user-cell">
                  <span class="avatar">{{ u.name.charAt(0) }}</span>
                  <div>
                    <div class="user-cell__name">{{ u.name }}</div>
                    <div class="user-cell__email">{{ u.email }}</div>
                  </div>
                </div>
              </td>
              <td>{{ u.department }}</td>
              <td>
                <AppBadge :variant="roleVariant(u.role)" size="sm">
                  <AppIcon :icon="roleIcon(u.role)" size="sm" aria-hidden="true" />
                  {{ ROLE_LABEL[u.role] }}
                </AppBadge>
              </td>
              <td>
                <AppBadge :variant="u.active ? 'success' : 'neutral'" size="sm">
                  {{ u.active ? 'Active' : 'Inactive' }}
                </AppBadge>
              </td>
              <td class="muted">{{ relTime(u.lastLogin) }}</td>
              <td>
                <div class="row-actions">
                  <button
                    class="row-btn"
                    title="แก้ไข role / status"
                    :aria-label="`Edit ${u.name}`"
                    @click="openEdit(u)"
                  >
                    <AppIcon :icon="Pencil" size="sm" aria-hidden="true" />
                  </button>
                  <button
                    v-if="u.role !== 'SUPER_ADMIN'"
                    class="row-btn"
                    :title="`ดูในฐานะ ${u.name}`"
                    :aria-label="`Impersonate ${u.name}`"
                    @click="impersonate(u.role)"
                  >
                    <AppIcon :icon="Eye" size="sm" aria-hidden="true" />
                  </button>
                  <button class="row-btn" aria-label="More actions">
                    <AppIcon :icon="MoreHorizontal" size="sm" aria-hidden="true" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <aside class="privacy">
        <AppIcon :icon="Shield" size="sm" aria-hidden="true" />
        <p>
          <strong>Security note:</strong> การ impersonate หรือเปลี่ยน role จะถูกบันทึกใน audit log
          · Super Admin เห็นข้อมูลทั้งหมดเฉพาะเพื่อ system maintenance · อย่า share session
        </p>
      </aside>
    </template>

    <!-- Edit user modal -->
    <div v-if="editingUser" class="modal" role="dialog" aria-modal="true" aria-labelledby="edit-title">
      <div class="modal__bg" @click="closeEdit"></div>
      <div class="modal__body">
        <header class="modal__head">
          <div>
            <h2 id="edit-title" class="modal__title">แก้ไขโปรไฟล์</h2>
            <p class="modal__user">{{ editingUser.name }} · {{ editingUser.email }}</p>
          </div>
          <button class="modal__close" aria-label="ปิด" @click="closeEdit">
            <AppIcon :icon="X" size="md" />
          </button>
        </header>

        <section class="modal__section">
          <h3 class="modal__label">Role</h3>
          <p class="modal__hint">การเปลี่ยน role จะเปลี่ยนเมนูที่ user เห็น · ตั้งค่า menu per role ได้ที่
            <RouterLink to="/admin/roles">Roles & Permissions</RouterLink>
          </p>
          <div class="role-options" role="radiogroup">
            <label
              v-for="r in rolesList"
              :key="r"
              class="role-option"
              :class="{ 'is-active': editRole === r }"
            >
              <input type="radio" :value="r" v-model="editRole" :aria-label="ROLE_LABEL[r]" />
              <div class="role-option__icon">
                <AppIcon :icon="roleIcon(r)" size="lg" aria-hidden="true" />
              </div>
              <div>
                <strong>{{ ROLE_LABEL[r] }}</strong>
                <small>{{ ROLE_DESC[r] }}</small>
              </div>
              <AppIcon v-if="editRole === r" :icon="Check" size="md" class="role-option__check" aria-hidden="true" />
            </label>
          </div>
        </section>

        <section class="modal__section">
          <AppToggle
            v-model="editActive"
            label="Active"
            description="Inactive users ล็อกบัญชี · ไม่สามารถ login ได้"
          />
        </section>

        <footer class="modal__foot">
          <AppButton variant="ghost" size="md" @click="closeEdit">ยกเลิก</AppButton>
          <AppButton variant="primary" size="md" @click="saveEdit">
            <AppIcon :icon="Check" size="sm" aria-hidden="true" />
            บันทึก
          </AppButton>
        </footer>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page { max-width: var(--size-content-max); padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-5); }
@media (min-width: 768px) { .page { padding: var(--space-6); } }

.head { display: flex; justify-content: space-between; align-items: flex-end; gap: var(--space-4); flex-wrap: wrap; }
.head__breadcrumb { display: inline-flex; align-items: center; gap: var(--space-1); font-size: var(--text-caption); color: var(--color-danger-dark); font-weight: var(--weight-semibold); text-transform: uppercase; letter-spacing: var(--tracking-wide); }
.head__title { font-size: var(--text-h2); font-weight: var(--weight-bold); margin: 4px 0; }
.head__desc { font-size: var(--text-body-sm); color: var(--color-text-secondary); max-width: 640px; }
.head__actions { display: flex; gap: var(--space-2); flex-wrap: wrap; }

.stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: var(--space-3); }

.filter { display: flex; gap: var(--space-2); flex-wrap: wrap; background: var(--color-white); border: 1px solid var(--color-border-light); border-radius: var(--radius-lg); padding: var(--space-2); }
.filter__search { flex: 1; min-width: 200px; display: flex; align-items: center; gap: var(--space-2); padding: 0 var(--space-3); background: var(--color-gray-50); border-radius: var(--radius-md); color: var(--color-text-tertiary); }
.filter__search input { flex: 1; border: none; background: transparent; padding: var(--space-2) 0; min-height: var(--size-input-md); font-family: inherit; font-size: var(--text-body-sm); }
.filter__search input:focus { outline: none; }
.select { padding: 0 var(--space-3); min-height: var(--size-input-md); border: 1px solid var(--color-border-default); border-radius: var(--radius-md); background: var(--color-white); font-family: inherit; font-size: var(--text-body-sm); }

.table-wrap { background: var(--color-white); border: 1px solid var(--color-border-light); border-radius: var(--radius-xl); overflow-x: auto; }
.table { width: 100%; border-collapse: collapse; font-size: var(--text-body-sm); }
.table th, .table td { padding: var(--space-3) var(--space-4); text-align: left; }
.table th { background: var(--color-gray-50); font-size: var(--text-caption); font-weight: var(--weight-semibold); color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: var(--tracking-wide); border-bottom: 1px solid var(--color-border-default); white-space: nowrap; }
.table td { border-bottom: 1px solid var(--color-border-light); vertical-align: middle; }
.table tr:last-child td { border-bottom: none; }
.table tr:hover { background: var(--color-gray-50); }
.table tr.is-inactive td { opacity: 0.5; }

.user-cell { display: flex; gap: var(--space-2); align-items: center; }
.avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--color-primary-muted); color: var(--color-primary-dark); display: inline-flex; align-items: center; justify-content: center; font-weight: var(--weight-semibold); }
.user-cell__name { font-weight: var(--weight-medium); }
.user-cell__email { font-size: var(--text-caption); color: var(--color-text-tertiary); }
.muted { color: var(--color-text-tertiary); font-size: var(--text-caption); }

.row-actions { display: flex; gap: 4px; }
.row-btn { width: 32px; height: 32px; border-radius: var(--radius-md); color: var(--color-text-secondary); display: inline-flex; align-items: center; justify-content: center; }
.row-btn:hover { background: var(--color-gray-100); color: var(--color-primary); }

.privacy { display: flex; gap: var(--space-2); align-items: flex-start; padding: var(--space-3); background: var(--color-danger-subtle); color: var(--color-danger-dark); border-radius: var(--radius-md); font-size: var(--text-caption); line-height: var(--leading-relaxed); }

/* Edit modal */
.modal { position: fixed; inset: 0; z-index: var(--z-modal); display: flex; align-items: center; justify-content: center; padding: var(--space-4); }
.modal__bg { position: absolute; inset: 0; background: var(--color-bg-overlay); backdrop-filter: blur(4px); }
.modal__body {
  position: relative;
  max-width: 560px; width: 100%;
  background: var(--color-white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  max-height: 90vh;
  overflow: auto;
}
.modal__head { display: flex; justify-content: space-between; align-items: flex-start; gap: var(--space-3); padding: var(--space-5) var(--space-5) var(--space-3); border-bottom: 1px solid var(--color-border-light); }
.modal__title { font-size: var(--text-h3); font-weight: var(--weight-bold); }
.modal__user { font-size: var(--text-body-sm); color: var(--color-text-secondary); margin-top: 2px; }
.modal__close { width: 36px; height: 36px; border-radius: var(--radius-md); color: var(--color-text-secondary); display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
.modal__close:hover { background: var(--color-gray-100); }

.modal__section { padding: var(--space-4) var(--space-5); display: flex; flex-direction: column; gap: var(--space-3); }
.modal__section:not(:last-child) { border-bottom: 1px solid var(--color-border-light); }
.modal__label { font-size: var(--text-body); font-weight: var(--weight-semibold); }
.modal__hint { font-size: var(--text-caption); color: var(--color-text-secondary); line-height: var(--leading-relaxed); }
.modal__hint a { color: var(--color-primary); font-weight: var(--weight-medium); }

.role-options { display: grid; grid-template-columns: 1fr; gap: var(--space-2); }
@media (min-width: 480px) { .role-options { grid-template-columns: 1fr 1fr; } }

.role-option {
  display: flex; gap: var(--space-3); align-items: center;
  padding: var(--space-3);
  border: 2px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--duration-fast);
}
.role-option input { position: absolute; opacity: 0; pointer-events: none; }
.role-option:hover { border-color: var(--color-primary-muted); }
.role-option.is-active { border-color: var(--color-primary); background: var(--color-primary-subtle); }
.role-option__icon {
  width: 40px; height: 40px; border-radius: var(--radius-lg);
  background: var(--color-gray-100); color: var(--color-text-secondary);
  display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.role-option.is-active .role-option__icon { background: var(--color-primary); color: var(--color-white); }
.role-option strong { display: block; font-size: var(--text-body-sm); color: var(--color-text-primary); }
.role-option small { display: block; font-size: var(--text-caption); color: var(--color-text-secondary); margin-top: 2px; }
.role-option__check { color: var(--color-primary); margin-left: auto; flex-shrink: 0; }

.modal__foot { display: flex; justify-content: flex-end; gap: var(--space-2); padding: var(--space-4) var(--space-5); background: var(--color-gray-50); border-top: 1px solid var(--color-border-light); border-radius: 0 0 var(--radius-xl) var(--radius-xl); }
</style>
