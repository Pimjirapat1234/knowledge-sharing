import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Group {
  id: string
  name: string
  color: string
  memberIds: string[]
  queueOrder?: number
  score?: number
}

export const useGroupStore = defineStore('group', () => {
  const groups = ref<Group[]>([
    { id: 'g1', name: 'Team Orange', color: '#F05A28', memberIds: ['p1', 'p2'], queueOrder: 1, score: 87 },
    { id: 'g2', name: 'Team Emerald', color: '#10B981', memberIds: ['p3', 'p4'], queueOrder: 2, score: 92 },
    { id: 'g3', name: 'Team Sky', color: '#0EA5E9', memberIds: ['p5', 'p6'], queueOrder: 3, score: 78 },
    { id: 'g4', name: 'Team Amber', color: '#F59E0B', memberIds: ['p7', 'p8'], queueOrder: 4, score: 85 },
  ])

  const locked = ref(true)

  return { groups, locked }
})
