import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import type { UserRole } from '@/stores/user'
import { useUserStore } from '@/stores/user'

declare module 'vue-router' {
  interface RouteMeta {
    roles?: UserRole[]
    title?: string
  }
}

const routes: RouteRecordRaw[] = [
  // Auth
  { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue'), meta: { title: 'เข้าสู่ระบบ' } },

  // Root — role-based redirect
  {
    path: '/',
    name: 'root',
    redirect: () => {
      const role = useUserStore().effectiveRole
      if (role === 'SUPER_ADMIN') return '/admin/users'
      if (role === 'HR') return '/hr'
      if (role === 'C_LEVEL') return '/judge'
      return '/employee'
    },
  },

  // Employee
  { path: '/employee', name: 'employee-dashboard', component: () => import('@/views/employee/EmployeeDashboardView.vue'), meta: { roles: ['EMPLOYEE', 'SUPER_ADMIN'], title: 'Dashboard' } },
  { path: '/events/:id', name: 'event-detail', component: () => import('@/views/EventDetailView.vue'), meta: { title: 'รายละเอียดงาน' } },
  { path: '/events/:id/register', name: 'event-register', component: () => import('@/views/employee/EventRegisterView.vue'), meta: { roles: ['EMPLOYEE', 'SUPER_ADMIN'], title: 'ลงทะเบียน' } },
  { path: '/events/:id/menu', name: 'event-menu', component: () => import('@/views/employee/MenuSelectionView.vue'), meta: { roles: ['EMPLOYEE', 'SUPER_ADMIN'], title: 'เลือกเมนู' } },
  { path: '/events/:id/vote-theme', name: 'event-vote', component: () => import('@/views/employee/ThemeVoteView.vue'), meta: { roles: ['EMPLOYEE', 'SUPER_ADMIN'], title: 'โหวตธีม' } },
  { path: '/events/:id/feedback', name: 'event-feedback', component: () => import('@/views/employee/FeedbackView.vue'), meta: { roles: ['EMPLOYEE', 'SUPER_ADMIN'], title: 'Feedback' } },
  { path: '/events/:id/my-score', name: 'event-my-score', component: () => import('@/views/employee/MyScoreView.vue'), meta: { roles: ['EMPLOYEE', 'SUPER_ADMIN'], title: 'คะแนนของฉัน' } },
  { path: '/events/:id/leaderboard', name: 'event-leaderboard', component: () => import('@/views/employee/TeamLeaderboardView.vue'), meta: { title: 'Leaderboard' } },

  // HR
  { path: '/hr', name: 'hr-dashboard', component: () => import('@/views/hr/HrDashboardView.vue'), meta: { roles: ['HR', 'SUPER_ADMIN'], title: 'HR Dashboard' } },
  { path: '/events/:id/admin/participants', name: 'hr-participants', component: () => import('@/views/hr/ParticipantsView.vue'), meta: { roles: ['HR', 'SUPER_ADMIN'], title: 'ผู้ลงทะเบียน' } },
  { path: '/events/:id/admin/menu-summary', name: 'hr-menu-summary', component: () => import('@/views/hr/MenuSummaryView.vue'), meta: { roles: ['HR', 'SUPER_ADMIN'], title: 'สรุปเมนูอาหาร' } },
  { path: '/events/:id/admin/theme-setup', name: 'hr-theme-setup', component: () => import('@/views/hr/ThemeSetupView.vue'), meta: { roles: ['HR', 'SUPER_ADMIN'], title: 'ตั้งค่าโหวตธีม' } },
  { path: '/events/:id/admin/check-in', name: 'hr-checkin', component: () => import('@/views/hr/QrScannerView.vue'), meta: { roles: ['HR', 'SUPER_ADMIN'], title: 'Scan QR' } },
  { path: '/events/:id/admin/groups', name: 'hr-groups', component: () => import('@/views/hr/GroupManagerView.vue'), meta: { roles: ['HR', 'SUPER_ADMIN'], title: 'จัดกลุ่ม' } },
  { path: '/events/:id/admin/queue', name: 'hr-queue', component: () => import('@/views/hr/QueueRandomizerView.vue'), meta: { roles: ['HR', 'SUPER_ADMIN'], title: 'สุ่มคิวนำเสนอ' } },
  { path: '/events/:id/admin/feedback-report', name: 'hr-feedback-report', component: () => import('@/views/hr/FeedbackReportView.vue'), meta: { roles: ['HR', 'SUPER_ADMIN'], title: 'รายงาน feedback' } },

  // C-Level
  { path: '/judge', name: 'judge-dashboard', component: () => import('@/views/clevel/JudgeDashboardView.vue'), meta: { roles: ['C_LEVEL', 'SUPER_ADMIN'], title: 'Judge Dashboard' } },
  { path: '/events/:id/judge/rate', name: 'judge-rate', component: () => import('@/views/clevel/RateView.vue'), meta: { roles: ['C_LEVEL', 'SUPER_ADMIN'], title: 'ให้คะแนนทีม' } },
  { path: '/events/:id/judge/team-feedback', name: 'judge-team-feedback', component: () => import('@/views/clevel/TeamFeedbackView.vue'), meta: { roles: ['C_LEVEL', 'SUPER_ADMIN'], title: 'Feedback ทีม' } },

  // Super Admin
  { path: '/admin/users', name: 'admin-users', component: () => import('@/views/admin/UsersView.vue'), meta: { roles: ['SUPER_ADMIN'], title: 'จัดการ Users' } },
  { path: '/admin/roles', name: 'admin-roles', component: () => import('@/views/admin/RolesView.vue'), meta: { roles: ['SUPER_ADMIN'], title: 'Roles & Permissions' } },
  { path: '/admin/roles/:roleKey', name: 'admin-role-edit', component: () => import('@/views/admin/RoleEditView.vue'), meta: { roles: ['SUPER_ADMIN'], title: 'แก้ไข Role' } },
  { path: '/admin/events', name: 'admin-events', component: () => import('@/views/admin/EventsAdminView.vue'), meta: { roles: ['SUPER_ADMIN'], title: 'จัดการ Events' } },
  { path: '/admin/audit', name: 'admin-audit', component: () => import('@/views/admin/AuditLogView.vue'), meta: { roles: ['SUPER_ADMIN'], title: 'Audit Log' } },
  { path: '/admin/feature-flags', name: 'admin-flags', component: () => import('@/views/admin/FeatureFlagsView.vue'), meta: { roles: ['SUPER_ADMIN'], title: 'Feature Flags' } },
  { path: '/admin/system', name: 'admin-system', component: () => import('@/views/admin/SystemSettingsView.vue'), meta: { roles: ['SUPER_ADMIN'], title: 'System Settings' } },

  // Profile
  { path: '/profile', name: 'profile', component: () => import('@/views/ProfileView.vue'), meta: { title: 'โปรไฟล์' } },

  // 404
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFoundView.vue'), meta: { title: 'ไม่พบหน้านี้' } },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0, behavior: 'smooth' }),
})

// Role guard — redirect to correct role landing if route requires a role user doesn't have
router.beforeEach((to) => {
  const store = useUserStore()
  // Super admin never blocked by role guards (see landing above)
  // Effective role = impersonated role OR currentRole
  const role = store.effectiveRole

  if (to.meta.roles && !to.meta.roles.includes(role)) {
    // Real super admin bypasses all guards (even during impersonation they get to see the page)
    if (store.currentRole === 'SUPER_ADMIN') return true
    return { path: '/', query: { state: 'error-blocking', reason: 'permission' } }
  }
  if (to.meta.title) {
    document.title = `${to.meta.title} · Thinktank Events`
  }
  return true
})

export default router
