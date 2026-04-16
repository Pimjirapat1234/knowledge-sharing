import { defineStore } from 'pinia'
import { computed, ref, watch, type Component } from 'vue'
import {
  Home, Calendar, FileText, UtensilsCrossed, Vote, MessageSquare, BarChart3, Trophy,
  Users, ChefHat, Settings, Camera, LayoutGrid, Dices, TrendingUp,
  Star, MessageCircle,
  UserCog, FileSearch, Flag, Cog, Shield,
} from 'lucide-vue-next'
import type { UserRole } from './user'

/**
 * Role-based menu permission system.
 * Each role has a set of menu keys it can see in sidebar.
 * Super Admin can toggle menus on/off per role.
 * Persisted in localStorage for demo.
 */
export interface MenuDef {
  key: string
  label: string
  path: string
  group: string
  icon: Component
  description?: string
  required?: boolean // cannot be disabled (e.g., dashboard home)
}

/**
 * All menus per role — the complete catalog.
 * Required=true means menu cannot be disabled (must be visible).
 */
export const ROLE_MENUS: Record<UserRole, MenuDef[]> = {
  EMPLOYEE: [
    { key: 'emp.dashboard', label: 'Dashboard', path: '/employee', group: 'กิจกรรม', icon: Home, description: 'หน้าหลัก · event cards · stats', required: true },
    { key: 'emp.event-detail', label: 'รายละเอียดงาน', path: '/events/evt-2026-q2', group: 'กิจกรรม', icon: Calendar, description: 'Hero banner · agenda · action cards' },
    { key: 'emp.register', label: 'ลงทะเบียน', path: '/events/evt-2026-q2/register', group: 'ก่อนงาน', icon: FileText, description: 'Prefill SSO · PDPA consent · confirm' },
    { key: 'emp.menu', label: 'เลือกเมนู', path: '/events/evt-2026-q2/menu', group: 'ก่อนงาน', icon: UtensilsCrossed, description: 'เลือกเมนู 1 จาก N · แจ้งแพ้อาหาร' },
    { key: 'emp.vote', label: 'โหวตธีม', path: '/events/evt-2026-q2/vote-theme', group: 'ก่อนงาน', icon: Vote, description: 'Theme voting · live results' },
    { key: 'emp.feedback', label: 'Feedback', path: '/events/evt-2026-q2/feedback', group: 'หลังงาน', icon: MessageSquare, description: 'Rating 4 criteria · anonymous option' },
    { key: 'emp.my-score', label: 'คะแนนของฉัน', path: '/events/evt-2026-q2/my-score', group: 'หลังงาน', icon: BarChart3, description: 'Bar chart · trend · compare team avg' },
    { key: 'emp.leaderboard', label: 'Leaderboard', path: '/events/evt-2026-q2/leaderboard', group: 'หลังงาน', icon: Trophy, description: 'Team/personal ranking · podium top 3' },
  ],
  HR: [
    { key: 'hr.dashboard', label: 'HR Dashboard', path: '/hr', group: 'ภาพรวม', icon: Home, description: 'Overview · stats · action cards', required: true },
    { key: 'hr.participants', label: 'ผู้ลงทะเบียน', path: '/events/evt-2026-q2/admin/participants', group: 'ก่อนงาน', icon: Users, description: 'Data table · filter · export CSV' },
    { key: 'hr.menu-summary', label: 'สรุปเมนู', path: '/events/evt-2026-q2/admin/menu-summary', group: 'ก่อนงาน', icon: ChefHat, description: 'Aggregate count · allergy list' },
    { key: 'hr.theme-setup', label: 'ตั้งค่าโหวต', path: '/events/evt-2026-q2/admin/theme-setup', group: 'ก่อนงาน', icon: Settings, description: 'CRUD themes · deadline · live/hold results' },
    { key: 'hr.check-in', label: 'Scan QR', path: '/events/evt-2026-q2/admin/check-in', group: 'ระหว่างงาน', icon: Camera, description: 'Camera scanner · offline queue · manual fallback' },
    { key: 'hr.groups', label: 'จัดกลุ่ม', path: '/events/evt-2026-q2/admin/groups', group: 'ระหว่างงาน', icon: LayoutGrid, description: 'Drag-drop · auto-balance · lock + notify' },
    { key: 'hr.queue', label: 'สุ่มคิว', path: '/events/evt-2026-q2/admin/queue', group: 'ระหว่างงาน', icon: Dices, description: 'Slot-machine animation · big-screen mode' },
    { key: 'hr.feedback-report', label: 'รายงาน feedback', path: '/events/evt-2026-q2/admin/feedback-report', group: 'หลังงาน', icon: TrendingUp, description: 'Aggregate scores · sentiment cloud · export' },
  ],
  C_LEVEL: [
    { key: 'cl.dashboard', label: 'Dashboard', path: '/judge', group: 'ให้คะแนน', icon: Home, description: 'Pending ratings · event overview', required: true },
    { key: 'cl.rate', label: 'ให้คะแนนทีม', path: '/events/evt-2026-q2/judge/rate', group: 'ให้คะแนน', icon: Star, description: 'Rating 3 criteria · 56px touch · confirm modal' },
    { key: 'cl.team-feedback', label: 'Feedback ทีม', path: '/events/evt-2026-q2/judge/team-feedback', group: 'ให้คะแนน', icon: MessageCircle, description: 'Free-text per team · visible to HR only' },
    { key: 'cl.leaderboard', label: 'Leaderboard', path: '/events/evt-2026-q2/leaderboard', group: 'ผลงาน', icon: Trophy, description: 'Overall ranking · post-event' },
  ],
  SUPER_ADMIN: [
    { key: 'adm.users', label: 'Users', path: '/admin/users', group: 'System Admin', icon: UserCog, description: 'จัดการ users · role assignment · impersonate', required: true },
    { key: 'adm.roles', label: 'Roles & Permissions', path: '/admin/roles', group: 'System Admin', icon: Shield, description: 'จัดการ role permissions · เปิด/ปิด menus per role' },
    { key: 'adm.events', label: 'All Events', path: '/admin/events', group: 'System Admin', icon: Calendar, description: 'Cross-HR event management' },
    { key: 'adm.audit', label: 'Audit Log', path: '/admin/audit', group: 'System Admin', icon: FileSearch, description: 'System audit · 5-year retention' },
    { key: 'adm.flags', label: 'Feature Flags', path: '/admin/feature-flags', group: 'System Admin', icon: Flag, description: 'Kill switches · A/B tests · gradual rollout' },
    { key: 'adm.system', label: 'System Settings', path: '/admin/system', group: 'System', icon: Cog, description: 'SSO · security · data retention · hosting' },
  ],
}

/**
 * Default enabled menus per role (initially ALL menus).
 * Super Admin can turn off non-required ones.
 */
const DEFAULT_ENABLED: Record<UserRole, string[]> = {
  EMPLOYEE: ROLE_MENUS.EMPLOYEE.map(m => m.key),
  HR: ROLE_MENUS.HR.map(m => m.key),
  C_LEVEL: ROLE_MENUS.C_LEVEL.map(m => m.key),
  SUPER_ADMIN: ROLE_MENUS.SUPER_ADMIN.map(m => m.key),
}

const STORAGE_KEY = 'tt_role_permissions_v1'

function loadFromStorage(): Record<UserRole, string[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Record<UserRole, string[]>
  } catch { /* ignore */ }
  return { ...DEFAULT_ENABLED }
}

export const usePermissionsStore = defineStore('permissions', () => {
  const enabled = ref<Record<UserRole, string[]>>(loadFromStorage())

  // Persist on change
  watch(enabled, (v) => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(v)) } catch { /* ignore */ }
  }, { deep: true })

  function isEnabled(role: UserRole, menuKey: string) {
    return enabled.value[role]?.includes(menuKey) ?? false
  }

  function toggle(role: UserRole, menuKey: string) {
    const menus = ROLE_MENUS[role]
    const def = menus.find(m => m.key === menuKey)
    if (def?.required) return // required menus can't be toggled off
    const list = enabled.value[role] ?? []
    if (list.includes(menuKey)) {
      enabled.value[role] = list.filter(k => k !== menuKey)
    } else {
      enabled.value[role] = [...list, menuKey]
    }
  }

  function resetRole(role: UserRole) {
    enabled.value[role] = [...DEFAULT_ENABLED[role]]
  }

  function resetAll() {
    enabled.value = { ...DEFAULT_ENABLED }
  }

  /** Get enabled menus as full MenuDef objects (for sidebar) */
  function visibleMenus(role: UserRole): MenuDef[] {
    const list = enabled.value[role] ?? []
    return ROLE_MENUS[role].filter(m => list.includes(m.key))
  }

  const counts = computed(() => ({
    EMPLOYEE: { enabled: enabled.value.EMPLOYEE.length, total: ROLE_MENUS.EMPLOYEE.length },
    HR: { enabled: enabled.value.HR.length, total: ROLE_MENUS.HR.length },
    C_LEVEL: { enabled: enabled.value.C_LEVEL.length, total: ROLE_MENUS.C_LEVEL.length },
    SUPER_ADMIN: { enabled: enabled.value.SUPER_ADMIN.length, total: ROLE_MENUS.SUPER_ADMIN.length },
  }))

  return { enabled, isEnabled, toggle, resetRole, resetAll, visibleMenus, counts }
})
