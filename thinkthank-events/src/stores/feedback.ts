import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface FeedbackEntry {
  id: string
  userId?: string // null when anonymous
  anonymous: boolean
  overall: number
  food: number
  organization: number
  content: number
  comment: string
  createdAt: string
}

export const useFeedbackStore = defineStore('feedback', () => {
  const entries = ref<FeedbackEntry[]>([
    { id: 'f1', anonymous: true, overall: 5, food: 5, organization: 4, content: 5, comment: 'เวิร์คช็อปสนุกมาก ได้ไอเดียใหม่กลับไปใช้ได้เลย', createdAt: '2026-05-15T17:30:00+07:00' },
    { id: 'f2', anonymous: false, userId: 'p3', overall: 4, food: 3, organization: 5, content: 4, comment: 'อาหารกลางวันเผ็ดไปหน่อย แต่คอนเทนต์ดีมาก', createdAt: '2026-05-15T17:35:00+07:00' },
    { id: 'f3', anonymous: true, overall: 5, food: 5, organization: 5, content: 5, comment: 'Best ever! ทีมจัดสุดยอด', createdAt: '2026-05-15T17:40:00+07:00' },
    { id: 'f4', anonymous: false, userId: 'p5', overall: 3, food: 4, organization: 3, content: 3, comment: 'พอได้ อยากให้ช่วงบ่ายกระชับกว่านี้', createdAt: '2026-05-15T17:45:00+07:00' },
    { id: 'f5', anonymous: true, overall: 4, food: 4, organization: 4, content: 5, comment: 'ชอบ keynote มาก ฟังแล้วได้ inspiration', createdAt: '2026-05-15T17:50:00+07:00' },
  ])

  const summary = computed(() => {
    const n = entries.value.length || 1
    const sum = (k: keyof FeedbackEntry) =>
      entries.value.reduce((a, e) => a + (typeof e[k] === 'number' ? (e[k] as number) : 0), 0) / n
    return {
      overall: +sum('overall').toFixed(1),
      food: +sum('food').toFixed(1),
      organization: +sum('organization').toFixed(1),
      content: +sum('content').toFixed(1),
      total: entries.value.length,
    }
  })

  return { entries, summary }
})
