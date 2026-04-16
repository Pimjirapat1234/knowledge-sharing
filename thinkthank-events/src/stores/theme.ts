import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface ThemeOption {
  id: string
  title: string
  description: string
  imageUrl: string
  votes: number
}

export const useThemeStore = defineStore('theme', () => {
  const themes = ref<ThemeOption[]>([
    {
      id: 't1',
      title: 'Future of Work',
      description: 'ทำงานยังไงให้ AI กับมนุษย์เป็นทีมเดียวกัน',
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      votes: 34,
    },
    {
      id: 't2',
      title: 'Sustainability First',
      description: 'ธุรกิจที่ไม่ทำร้ายโลก · green ops สไตล์ Real Factory',
      imageUrl: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&w=800&q=80',
      votes: 28,
    },
    {
      id: 't3',
      title: 'Customer Obsession',
      description: 'ออกแบบ product ที่ลูกค้ารัก · obsess เรื่อง details',
      imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
      votes: 19,
    },
    {
      id: 't4',
      title: 'Build in Public',
      description: 'แบ่งปันสิ่งที่ทำ · เติบโตไปกับ community',
      imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
      votes: 15,
    },
  ])

  const myVoteId = ref<string | null>(null)
  const resultsVisible = ref(true) // HR-configurable (FR-THEME-03)

  return { themes, myVoteId, resultsVisible }
})
