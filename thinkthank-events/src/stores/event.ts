import { defineStore } from 'pinia'
import { ref } from 'vue'

export type EventStatus =
  | 'DRAFT'
  | 'PUBLISHED'
  | 'REGISTRATION_OPEN'
  | 'ACTIVE'
  | 'CLOSED'

export interface ThinktankEvent {
  id: string
  title: string
  tagline: string
  description: string
  bannerUrl: string
  location: string
  startAt: string
  endAt: string
  registrationDeadline: string
  menuDeadline: string
  votingDeadline: string
  capacity: number
  registeredCount: number
  status: EventStatus
  agenda: Array<{ time: string; title: string }>
}

export const useEventStore = defineStore('event', () => {
  const event = ref<ThinktankEvent>({
    id: 'evt-2026-q2',
    title: 'Thinktank Q2: Future of Work',
    tagline: 'ระดมสมองวางทิศทางทีมไตรมาส 2',
    description:
      'กิจกรรม Think Tank ประจำไตรมาส — ร่วมกันคิด ออกแบบ และ present ไอเดียใหม่ สำหรับการเติบโตของ Real Factory ในครึ่งปีหลัง',
    bannerUrl:
      'https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?auto=format&fit=crop&w=1600&q=80',
    location: 'Real Factory HQ · ห้อง Auditorium ชั้น 8',
    startAt: '2026-05-15T09:00:00+07:00',
    endAt: '2026-05-15T17:00:00+07:00',
    registrationDeadline: '2026-05-10T18:00:00+07:00',
    menuDeadline: '2026-05-12T18:00:00+07:00',
    votingDeadline: '2026-05-13T18:00:00+07:00',
    capacity: 120,
    registeredCount: 87,
    status: 'REGISTRATION_OPEN',
    agenda: [
      { time: '09:00', title: 'Welcome + Opening' },
      { time: '10:00', title: 'Keynote: The Future of Work' },
      { time: '11:30', title: 'Group Brainstorm Session' },
      { time: '12:30', title: 'Lunch + Networking' },
      { time: '14:00', title: 'Group Presentation' },
      { time: '16:00', title: 'C-Level Judging + Awards' },
      { time: '17:00', title: 'Closing' },
    ],
  })

  const pastEvents = ref<Array<Pick<ThinktankEvent, 'id' | 'title' | 'startAt' | 'bannerUrl'>>>([
    {
      id: 'evt-2026-q1',
      title: 'Thinktank Q1: Innovation Day',
      startAt: '2026-02-20T09:00:00+07:00',
      bannerUrl: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'evt-2025-q4',
      title: 'Thinktank Q4: Wrap Up 2025',
      startAt: '2025-12-15T09:00:00+07:00',
      bannerUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
    },
  ])

  return { event, pastEvents }
})
