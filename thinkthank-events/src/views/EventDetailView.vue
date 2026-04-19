<script setup lang="ts">
/**
 * Screen #3 — Event Detail (ALL roles).
 * Actions contextual by role + phase (PRD §7 User Journey).
 */
import { computed, type Component } from 'vue'
import { storeToRefs } from 'pinia'
import {
  Calendar, MapPin, Users, Clock, Ticket, UtensilsCrossed, Vote,
  MessageSquare, Trophy, BarChart3, Camera, LayoutGrid, Dices,
  TrendingUp, Star, MessageCircle, ChefHat, Settings, CalendarPlus,
} from 'lucide-vue-next'
import { useEventStore } from '@/stores/event'
import { useUserStore } from '@/stores/user'
import { useUiState } from '@/composables/useUiState'
import { formatDateRange } from '@/composables/useFormat'
import AppIcon from '@/components/ui/AppIcon.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton.vue'
import ErrorState from '@/components/ui/ErrorState.vue'

const { event } = storeToRefs(useEventStore())
const { currentRole } = storeToRefs(useUserStore())
const ui = useUiState()

interface Action { to: string; label: string; icon: Component; primary?: boolean }

const actions = computed<Action[]>(() => {
  const id = event.value.id
  if (currentRole.value === 'EMPLOYEE') {
    return [
      { to: `/events/${id}/register`, label: 'ลงทะเบียน', icon: Ticket, primary: true },
      { to: `/events/${id}/menu`, label: 'เลือกเมนู', icon: UtensilsCrossed },
      { to: `/events/${id}/vote-theme`, label: 'โหวตธีม', icon: Vote },
      { to: `/events/${id}/feedback`, label: 'Feedback', icon: MessageSquare },
      { to: `/events/${id}/my-score`, label: 'คะแนนของฉัน', icon: BarChart3 },
      { to: `/events/${id}/leaderboard`, label: 'Leaderboard', icon: Trophy },
    ]
  }
  if (currentRole.value === 'HR') {
    return [
      { to: `/events/${id}/admin/participants`, label: 'ผู้ลงทะเบียน', icon: Users, primary: true },
      { to: `/events/${id}/admin/menu-summary`, label: 'สรุปเมนู', icon: ChefHat },
      { to: `/events/${id}/admin/theme-setup`, label: 'ตั้งค่าโหวต', icon: Settings },
      { to: `/events/${id}/admin/check-in`, label: 'Scan QR', icon: Camera, primary: true },
      { to: `/events/${id}/admin/groups`, label: 'จัดกลุ่ม', icon: LayoutGrid },
      { to: `/events/${id}/admin/queue`, label: 'สุ่มคิว', icon: Dices },
      { to: `/events/${id}/admin/feedback-report`, label: 'Feedback Report', icon: TrendingUp },
    ]
  }
  return [
    { to: `/events/${id}/judge/rate`, label: 'ให้คะแนนทีม', icon: Star, primary: true },
    { to: `/events/${id}/judge/team-feedback`, label: 'Feedback ทีม', icon: MessageCircle },
    { to: `/events/${id}/leaderboard`, label: 'Leaderboard', icon: Trophy },
  ]
})

const dateText = computed(() => formatDateRange(event.value.startAt, event.value.endAt))
</script>

<template>
  <div class="page page--form ed">
    <ErrorState v-if="ui.isErrorBlocking.value" :recoverable="false" title="ไม่พบกิจกรรม" />

    <ErrorState v-else-if="ui.isError.value" @retry="() => {}" />

    <template v-else-if="ui.isLoading.value">
      <LoadingSkeleton variant="block" height="280px" />
      <LoadingSkeleton variant="line" width="60%" height="32px" />
      <LoadingSkeleton variant="line" :count="4" />
    </template>

    <template v-else>
      <!-- Hero -->
      <section class="hero">
        <div class="hero__img">
          <img :src="event.bannerUrl" :alt="event.title" />
          <div class="hero__overlay"></div>
          <AppBadge variant="success" size="md" class="hero__badge">เปิดลงทะเบียน</AppBadge>
        </div>
        <div class="hero__body">
          <p class="hero__tag">{{ event.tagline }}</p>
          <h1 class="hero__title">{{ event.title }}</h1>
          <p class="hero__desc">{{ event.description }}</p>

          <ul class="hero__meta" role="list">
            <li><AppIcon :icon="Calendar" size="sm" aria-hidden="true" /> {{ dateText }}</li>
            <li><AppIcon :icon="MapPin" size="sm" aria-hidden="true" /> {{ event.location }}</li>
            <li><AppIcon :icon="Users" size="sm" aria-hidden="true" /> {{ event.registeredCount }}/{{ event.capacity }} คน</li>
          </ul>
        </div>
      </section>

      <!-- Actions -->
      <section class="acts">
        <h2 class="acts__title">ทำอะไรได้บ้าง</h2>
        <div class="acts__grid auto-grid">
          <RouterLink
            v-for="a in actions"
            :key="a.to"
            :to="a.to"
            class="act-card"
            :class="{ 'act-card--primary': a.primary }"
          >
            <div class="act-card__icon">
              <AppIcon :icon="a.icon" size="lg" aria-hidden="true" />
            </div>
            <span class="act-card__label">{{ a.label }}</span>
          </RouterLink>
        </div>
      </section>

      <!-- Agenda -->
      <section class="agenda">
        <h2 class="agenda__title">
          <AppIcon :icon="Clock" size="md" aria-hidden="true" /> กำหนดการ
        </h2>
        <ol class="agenda__list">
          <li v-for="(item, idx) in event.agenda" :key="idx" class="agenda__item">
            <span class="agenda__time">{{ item.time }} น.</span>
            <span class="agenda__bullet" aria-hidden="true"></span>
            <span class="agenda__content">{{ item.title }}</span>
          </li>
        </ol>
        <AppButton variant="secondary" size="md">
          <AppIcon :icon="CalendarPlus" size="sm" aria-hidden="true" />
          เพิ่มลงปฏิทิน (.ics)
        </AppButton>
      </section>
    </template>
  </div>
</template>

<style scoped>
/* layout via global .page */

.hero {
  background: var(--color-white);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}
.hero__img { position: relative; aspect-ratio: 16/9; }
.hero__img img { width: 100%; height: 100%; object-fit: cover; }
.hero__overlay { position: absolute; inset: 0; background: linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.3) 100%); }
.hero__badge { position: absolute; top: var(--space-4); left: var(--space-4); }
.hero__body { padding: var(--space-6); }
.hero__tag {
  font-size: var(--text-caption); color: var(--color-primary);
  text-transform: uppercase; letter-spacing: var(--tracking-wider);
  font-weight: var(--weight-semibold); margin-bottom: var(--space-2);
}
.hero__title { font-size: var(--text-h1); font-weight: var(--weight-bold); margin-bottom: var(--space-3); line-height: var(--leading-snug); }
.hero__desc { font-size: var(--text-body); color: var(--color-text-secondary); line-height: var(--leading-relaxed); margin-bottom: var(--space-5); }
.hero__meta { list-style: none; display: flex; flex-direction: column; gap: var(--space-2); }
@media (min-width: 640px) { .hero__meta { flex-direction: row; flex-wrap: wrap; gap: var(--space-4); } }
.hero__meta li { display: inline-flex; align-items: center; gap: var(--space-2); font-size: var(--text-body-sm); color: var(--color-text-secondary); }

.acts__title { font-size: var(--text-h3); font-weight: var(--weight-semibold); margin-bottom: var(--space-4); }
/* .acts__grid uses global .auto-grid */

.act-card {
  display: flex; flex-direction: column; align-items: center; gap: var(--space-2);
  padding: var(--space-5) var(--space-3);
  background: var(--color-white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  text-align: center; color: var(--color-text-primary);
  min-height: 120px; justify-content: center;
  transition: all var(--duration-fast);
}
.act-card:hover { text-decoration: none; border-color: var(--color-primary); transform: translateY(-2px); box-shadow: var(--shadow-md); }
.act-card__icon {
  width: 48px; height: 48px; border-radius: var(--radius-lg);
  background: var(--color-primary-subtle); color: var(--color-primary);
  display: inline-flex; align-items: center; justify-content: center;
}
.act-card__label { font-size: var(--text-body-sm); font-weight: var(--weight-medium); }
.act-card--primary { background: var(--color-primary); color: var(--color-white); border-color: var(--color-primary); }
.act-card--primary .act-card__icon { background: rgba(255,255,255,0.25); color: var(--color-white); }
.act-card--primary:hover { background: var(--color-primary-hover); border-color: var(--color-primary-hover); }

.agenda {
  background: var(--color-white); border-radius: var(--radius-xl); padding: var(--space-5);
  border: 1px solid var(--color-border-light);
}
@media (min-width: 768px) { .agenda { padding: var(--space-6); } }
.agenda__title { display: inline-flex; align-items: center; gap: var(--space-2); font-size: var(--text-h4); font-weight: var(--weight-semibold); margin-bottom: var(--space-4); }
.agenda__list { list-style: none; padding: 0; margin-bottom: var(--space-4); }
.agenda__item {
  display: grid;
  grid-template-columns: 70px 16px 1fr;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) 0;
  border-bottom: 1px solid var(--color-border-light);
}
.agenda__item:last-child { border-bottom: none; }
.agenda__time { font-family: var(--font-mono); font-size: var(--text-body-sm); color: var(--color-text-secondary); }
.agenda__bullet { width: 10px; height: 10px; border-radius: 50%; background: var(--color-primary); }
.agenda__content { font-size: var(--text-body); color: var(--color-text-primary); font-weight: var(--weight-medium); }
</style>
