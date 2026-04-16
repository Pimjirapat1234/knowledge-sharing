import { defineStore } from 'pinia'
import { ref } from 'vue'

export type MenuTag = 'pork' | 'chicken' | 'beef' | 'seafood' | 'vegetarian' | 'vegan' | 'halal'

export interface MenuItem {
  id: string
  name: string
  description: string
  imageUrl: string
  tags: MenuTag[]
  count: number
}

export const TAG_LABEL: Record<MenuTag, string> = {
  pork: 'หมู',
  chicken: 'ไก่',
  beef: 'เนื้อ',
  seafood: 'ทะเล',
  vegetarian: 'มังสวิรัติ',
  vegan: 'วีแกน',
  halal: 'ฮาลาล',
}

export const useMenuStore = defineStore('menu', () => {
  const menus = ref<MenuItem[]>([
    {
      id: 'm1',
      name: 'ข้าวกะเพราไก่ไข่ดาว',
      description: 'กะเพราไก่สับพริกสด ไข่ดาวกรอบ เสิร์ฟพร้อมข้าวหุงหอม',
      imageUrl: 'https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?auto=format&fit=crop&w=800&q=80',
      tags: ['chicken', 'halal'],
      count: 42,
    },
    {
      id: 'm2',
      name: 'ข้าวหมูแดงหมูกรอบ',
      description: 'หมูแดงหอมน้ำผึ้ง หมูกรอบสามชั้น ราดน้ำเกรวี่สูตรเฉพาะ',
      imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80',
      tags: ['pork'],
      count: 28,
    },
    {
      id: 'm3',
      name: 'สลัดผักรวมเต้าหู้ย่าง',
      description: 'ผักสลัดสดกรุบกรอบ เต้าหู้ย่าง งาขาว ราดน้ำสลัดงา',
      imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
      tags: ['vegetarian', 'vegan', 'halal'],
      count: 17,
    },
  ])

  return { menus }
})
