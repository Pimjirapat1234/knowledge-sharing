import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserRole } from './user'

export interface AdminUser {
  id: string
  name: string
  email: string
  department: string
  role: UserRole
  active: boolean
  lastLogin: string
}

export interface AuditEntry {
  id: string
  userId: string
  userName: string
  action: string
  resource: string
  timestamp: string
  mode?: 'impersonated'
  ip?: string
}

export interface FeatureFlag {
  key: string
  label: string
  description: string
  enabled: boolean
  rolloutPct: number
  owner: string
}

export const useAdminStore = defineStore('admin', () => {
  const users = ref<AdminUser[]>([
    { id: 'u-0000', name: 'แอดมินระบบ', email: 'admin@real-factory.co', department: 'IT', role: 'SUPER_ADMIN', active: true, lastLogin: '2026-04-16T09:12:00+07:00' },
    { id: 'u-0001', name: 'ต้น ชัยวัฒน์', email: 'ton.c@real-factory.co', department: 'Executive', role: 'C_LEVEL', active: true, lastLogin: '2026-04-15T18:40:00+07:00' },
    { id: 'u-0002', name: 'ธวัชชัย อารีย์', email: 'thawat.a@real-factory.co', department: 'Executive', role: 'C_LEVEL', active: true, lastLogin: '2026-04-14T14:22:00+07:00' },
    { id: 'u-0101', name: 'เจนจิรา สุขใส', email: 'jane.s@real-factory.co', department: 'HR', role: 'HR', active: true, lastLogin: '2026-04-16T10:05:00+07:00' },
    { id: 'u-0102', name: 'พิมพ์ใจ วัฒนาการ', email: 'pimjai.w@real-factory.co', department: 'HR', role: 'HR', active: true, lastLogin: '2026-04-16T08:30:00+07:00' },
    { id: 'u-0421', name: 'นันทิชา จันทร์เพ็ญ', email: 'nan.j@real-factory.co', department: 'Marketing', role: 'EMPLOYEE', active: true, lastLogin: '2026-04-16T11:45:00+07:00' },
    { id: 'u-0422', name: 'ภูริช สว่างพงษ์', email: 'phurich.s@real-factory.co', department: 'Engineering', role: 'EMPLOYEE', active: true, lastLogin: '2026-04-16T09:20:00+07:00' },
    { id: 'u-0423', name: 'ปรียาพร โชติกุล', email: 'preeyaporn.c@real-factory.co', department: 'Product', role: 'EMPLOYEE', active: true, lastLogin: '2026-04-15T17:00:00+07:00' },
    { id: 'u-0424', name: 'อดิศร วงษ์มั่น', email: 'adisorn.w@real-factory.co', department: 'Sales', role: 'EMPLOYEE', active: false, lastLogin: '2025-12-10T09:00:00+07:00' },
    { id: 'u-0425', name: 'ณัฐวดี พิทักษ์', email: 'natwadee.p@real-factory.co', department: 'Legal', role: 'EMPLOYEE', active: true, lastLogin: '2026-04-13T15:30:00+07:00' },
  ])

  const auditEntries = ref<AuditEntry[]>([
    { id: 'a1', userId: 'u-0000', userName: 'แอดมินระบบ', action: 'impersonate_start', resource: 'role:HR', timestamp: '2026-04-16T09:15:00+07:00', mode: 'impersonated', ip: '192.168.1.10' },
    { id: 'a2', userId: 'u-0101', userName: 'เจนจิรา สุขใส', action: 'export_participants_csv', resource: 'event:evt-2026-q2', timestamp: '2026-04-16T10:22:00+07:00', ip: '192.168.1.24' },
    { id: 'a3', userId: 'u-0001', userName: 'ต้น ชัยวัฒน์', action: 'submit_rating', resource: 'group:g2', timestamp: '2026-05-15T16:40:00+07:00', ip: '192.168.1.5' },
    { id: 'a4', userId: 'u-0101', userName: 'เจนจิรา สุขใส', action: 'qr_scan', resource: 'user:u-0421', timestamp: '2026-05-15T08:52:00+07:00', ip: '192.168.1.24' },
    { id: 'a5', userId: 'u-0000', userName: 'แอดมินระบบ', action: 'user_role_update', resource: 'user:u-0424', timestamp: '2026-04-14T14:20:00+07:00', ip: '192.168.1.10' },
    { id: 'a6', userId: 'u-0101', userName: 'เจนจิรา สุขใส', action: 'event_publish', resource: 'event:evt-2026-q2', timestamp: '2026-04-10T13:00:00+07:00', ip: '192.168.1.24' },
    { id: 'a7', userId: 'u-0000', userName: 'แอดมินระบบ', action: 'feature_flag_toggle', resource: 'flag:enable_leaderboard', timestamp: '2026-04-09T09:00:00+07:00', ip: '192.168.1.10' },
    { id: 'a8', userId: 'u-0421', userName: 'นันทิชา จันทร์เพ็ญ', action: 'register_event', resource: 'event:evt-2026-q2', timestamp: '2026-04-20T10:12:00+07:00', ip: '192.168.1.85' },
  ])

  const flags = ref<FeatureFlag[]>([
    { key: 'enable_leaderboard', label: 'Leaderboard', description: 'Kill switch · ถ้าเกิด toxic behavior ปิดได้ทันที', enabled: true, rolloutPct: 100, owner: 'HR Director' },
    { key: 'enable_anonymous_feedback', label: 'Anonymous Feedback', description: 'A/B test · วัด response rate impact', enabled: true, rolloutPct: 100, owner: 'Product' },
    { key: 'enable_offline_scan', label: 'Offline QR scan', description: 'เก็บ scan ใน localStorage · sync เมื่อมี network', enabled: true, rolloutPct: 100, owner: 'Engineering' },
    { key: 'enable_voice_feedback', label: 'Voice Feedback (v1.1)', description: 'Beta feature · อัดเสียงเป็น feedback', enabled: false, rolloutPct: 0, owner: 'Product' },
    { key: 'gradual_rollout', label: 'Gradual Rollout', description: '% users ที่เห็น latest release', enabled: true, rolloutPct: 100, owner: 'Engineering' },
  ])

  return { users, auditEntries, flags }
})
