import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export interface TeamScore {
  groupId: string
  name: string
  color: string
  score: number
  delta: number
}

export interface PersonalScore {
  userId: string
  name: string
  nickname: string
  avatar: string
  score: number
  rank: number
  deltaRank: number
}

export const useLeaderboardStore = defineStore('leaderboard', () => {
  const teams = ref<TeamScore[]>([
    { groupId: 'g2', name: 'Team Emerald', color: '#10B981', score: 92, delta: 2 },
    { groupId: 'g1', name: 'Team Orange', color: '#F05A28', score: 87, delta: -1 },
    { groupId: 'g4', name: 'Team Amber', color: '#F59E0B', score: 85, delta: 3 },
    { groupId: 'g3', name: 'Team Sky', color: '#0EA5E9', score: 78, delta: 0 },
  ])

  const personal = ref<PersonalScore[]>([
    { userId: 'p3', name: 'ปรียาพร โชติกุล', nickname: 'พร', avatar: 'ป', score: 96, rank: 1, deltaRank: 2 },
    { userId: 'p4', name: 'ธนภัทร สุขสมบูรณ์', nickname: 'ภัทร', avatar: 'ธ', score: 94, rank: 2, deltaRank: 0 },
    { userId: 'p7', name: 'วรรณวิษา นาคะ', nickname: 'วิษา', avatar: 'ว', score: 91, rank: 3, deltaRank: 5 },
    { userId: 'p1', name: 'นันทิชา จันทร์เพ็ญ', nickname: 'แนน', avatar: 'น', score: 88, rank: 4, deltaRank: -1 },
    { userId: 'p2', name: 'ภูริช สว่างพงษ์', nickname: 'ภู', avatar: 'ภ', score: 86, rank: 5, deltaRank: 1 },
    { userId: 'p8', name: 'ศิริชัย โชติกุล', nickname: 'ชัย', avatar: 'ศ', score: 84, rank: 6, deltaRank: 0 },
    { userId: 'p5', name: 'กฤติยา วงษ์พานิช', nickname: 'กิ่ง', avatar: 'ก', score: 82, rank: 7, deltaRank: 2 },
    { userId: 'p6', name: 'อนันต์ ชัยชมภู', nickname: 'ต้น', avatar: 'อ', score: 79, rank: 8, deltaRank: -2 },
  ])

  const myUserId = ref('p1') // current user
  const myTrend = ref<number[]>([72, 75, 80, 85, 88]) // 5 past events
  const teamAvg = ref<number[]>([70, 73, 76, 82, 85])

  const myScore = computed(() =>
    personal.value.find((p) => p.userId === myUserId.value),
  )
  const myTeamRank = computed(() => {
    // mock: p1 belongs to g1 (Team Orange)
    const idx = teams.value.findIndex((t) => t.groupId === 'g1')
    return idx + 1
  })

  return { teams, personal, myUserId, myScore, myTeamRank, myTrend, teamAvg }
})
