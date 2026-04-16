import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export type UserRole = 'EMPLOYEE' | 'HR' | 'C_LEVEL' | 'SUPER_ADMIN'

export interface SsoUser {
  id: string
  ssoId: string
  name: string
  nickname: string
  email: string
  department: string
  role: UserRole
  initials: string
}

const profiles: Record<UserRole, SsoUser> = {
  EMPLOYEE: {
    id: 'u-0421',
    ssoId: 'nan.j@real-factory.co',
    name: 'นันทิชา จันทร์เพ็ญ',
    nickname: 'แนน',
    email: 'nan.j@real-factory.co',
    department: 'Marketing',
    role: 'EMPLOYEE',
    initials: 'น',
  },
  HR: {
    id: 'u-0101',
    ssoId: 'jane.s@real-factory.co',
    name: 'เจนจิรา สุขใส',
    nickname: 'เจน',
    email: 'jane.s@real-factory.co',
    department: 'HR',
    role: 'HR',
    initials: 'จ',
  },
  C_LEVEL: {
    id: 'u-0001',
    ssoId: 'ton.c@real-factory.co',
    name: 'ต้น ชัยวัฒน์',
    nickname: 'ต้น',
    email: 'ton.c@real-factory.co',
    department: 'Executive',
    role: 'C_LEVEL',
    initials: 'ต',
  },
  SUPER_ADMIN: {
    id: 'u-0000',
    ssoId: 'admin@real-factory.co',
    name: 'แอดมินระบบ',
    nickname: 'Admin',
    email: 'admin@real-factory.co',
    department: 'IT / System',
    role: 'SUPER_ADMIN',
    initials: 'A',
  },
}

export const useUserStore = defineStore('user', () => {
  const currentRole = ref<UserRole>('EMPLOYEE')
  const impersonating = ref<UserRole | null>(null) // set when super admin views as another role

  const user = computed(() => {
    // If impersonating, return profile of impersonated role but keep SUPER_ADMIN identity
    const effectiveRole = impersonating.value ?? currentRole.value
    return profiles[effectiveRole]
  })

  const effectiveRole = computed<UserRole>(() => impersonating.value ?? currentRole.value)
  const isImpersonating = computed(() => impersonating.value !== null)
  const canImpersonate = computed(() => currentRole.value === 'SUPER_ADMIN')

  function setRole(role: UserRole) {
    currentRole.value = role
    impersonating.value = null
  }

  function impersonate(role: UserRole) {
    if (currentRole.value !== 'SUPER_ADMIN') return
    if (role === 'SUPER_ADMIN') {
      impersonating.value = null
      return
    }
    impersonating.value = role
  }

  function stopImpersonation() {
    impersonating.value = null
  }

  return {
    user, currentRole, effectiveRole, impersonating,
    isImpersonating, canImpersonate,
    setRole, impersonate, stopImpersonation,
  }
})

export const ROLE_LABEL: Record<UserRole, string> = {
  EMPLOYEE: 'พนักงาน',
  HR: 'HR Admin',
  C_LEVEL: 'ผู้บริหาร',
  SUPER_ADMIN: 'Super Admin',
}

export const ROLE_DESC: Record<UserRole, string> = {
  EMPLOYEE: 'ลงทะเบียน · โหวต · feedback',
  HR: 'Dashboard · จัดกลุ่ม · QR',
  C_LEVEL: 'ให้คะแนน · feedback',
  SUPER_ADMIN: 'System admin · impersonate · audit',
}
