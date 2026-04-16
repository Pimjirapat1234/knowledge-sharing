import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export type RegStatus = 'confirmed' | 'pending' | 'no_show' | 'cancelled'

export interface Participant {
  id: string
  name: string
  nickname: string
  email: string
  department: string
  registeredAt: string
  status: RegStatus
  checkedInAt?: string
  checkInMode?: 'qr' | 'manual'
  menuId?: string
  allergy?: string
  groupId?: string
}

export const useParticipantStore = defineStore('participant', () => {
  const participants = ref<Participant[]>([
    { id: 'p1', name: 'นันทิชา จันทร์เพ็ญ', nickname: 'แนน', email: 'nan.j@real-factory.co', department: 'Marketing', registeredAt: '2026-04-20T10:12:00+07:00', status: 'confirmed', menuId: 'm1', allergy: 'แพ้กุ้ง', groupId: 'g1', checkedInAt: '2026-05-15T08:52:00+07:00', checkInMode: 'qr' },
    { id: 'p2', name: 'ภูริช สว่างพงษ์', nickname: 'ภู', email: 'phurich.s@real-factory.co', department: 'Engineering', registeredAt: '2026-04-20T11:02:00+07:00', status: 'confirmed', menuId: 'm2', groupId: 'g1', checkedInAt: '2026-05-15T08:55:00+07:00', checkInMode: 'qr' },
    { id: 'p3', name: 'ปรียาพร โชติกุล', nickname: 'พร', email: 'preeyaporn.c@real-factory.co', department: 'Product', registeredAt: '2026-04-21T09:30:00+07:00', status: 'confirmed', menuId: 'm1' },
    { id: 'p4', name: 'ธนภัทร สุขสมบูรณ์', nickname: 'ภัทร', email: 'thanaphat.s@real-factory.co', department: 'Design', registeredAt: '2026-04-21T14:22:00+07:00', status: 'confirmed', menuId: 'm3', allergy: 'ทานมังสวิรัติ' },
    { id: 'p5', name: 'กฤติยา วงษ์พานิช', nickname: 'กิ่ง', email: 'krittiya.w@real-factory.co', department: 'HR', registeredAt: '2026-04-22T10:05:00+07:00', status: 'confirmed', menuId: 'm2' },
    { id: 'p6', name: 'อนันต์ ชัยชมภู', nickname: 'ต้น', email: 'anan.c@real-factory.co', department: 'Finance', registeredAt: '2026-04-22T16:48:00+07:00', status: 'pending' },
    { id: 'p7', name: 'วรรณวิษา นาคะ', nickname: 'วิษา', email: 'wannawisa.n@real-factory.co', department: 'Marketing', registeredAt: '2026-04-23T09:15:00+07:00', status: 'confirmed', menuId: 'm1' },
    { id: 'p8', name: 'ศิริชัย โชติกุล', nickname: 'ชัย', email: 'sirichai.c@real-factory.co', department: 'Engineering', registeredAt: '2026-04-23T11:30:00+07:00', status: 'confirmed', menuId: 'm3', allergy: 'แพ้ถั่ว' },
  ])

  /** Check in a participant by id (from QR scan or manual) */
  function checkIn(participantId: string, mode: 'qr' | 'manual' = 'qr'): { ok: boolean; duplicate?: boolean; at?: string } {
    const p = participants.value.find(x => x.id === participantId)
    if (!p) return { ok: false }
    if (p.checkedInAt) return { ok: false, duplicate: true, at: p.checkedInAt }
    p.checkedInAt = new Date().toISOString()
    p.checkInMode = mode
    return { ok: true, at: p.checkedInAt }
  }

  /** Undo check-in (correction) */
  function undoCheckIn(participantId: string) {
    const p = participants.value.find(x => x.id === participantId)
    if (p) {
      p.checkedInAt = undefined
      p.checkInMode = undefined
    }
  }

  const checkedIn = computed(() => participants.value.filter(p => p.checkedInAt))
  const notCheckedIn = computed(() => participants.value.filter(p => !p.checkedInAt && p.status === 'confirmed'))

  return { participants, checkIn, undoCheckIn, checkedIn, notCheckedIn }
})
