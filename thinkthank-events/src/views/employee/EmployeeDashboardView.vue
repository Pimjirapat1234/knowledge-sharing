<script setup lang="ts">
/**
 * Screen #2 — Employee Dashboard (PRD §11.1 #2).
 * Event cards · action list · notification.
 */
import { storeToRefs } from 'pinia'
import { RouterLink } from 'vue-router'
import {
  Calendar, MapPin, Ticket, ArrowRight, Sparkles, Send,
  History, BarChart3,
} from 'lucide-vue-next'
import { useUserStore } from '@/stores/user'
import { useEventStore } from '@/stores/event'
import { useUiState } from '@/composables/useUiState'
import { formatDate, formatDateRange } from '@/composables/useFormat'
import AppIcon from '@/components/ui/AppIcon.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import StatCard from '@/components/ui/StatCard.vue'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'

const { user } = storeToRefs(useUserStore())
const { event, pastEvents } = storeToRefs(useEventStore())
const ui = useUiState()
</script>

<template>
  <div class="dash">
    <ErrorState v-if="ui.isErrorBlocking.value" :recoverable="false" />
    <ErrorState v-else-if="ui.isError.value" @retry="() => {}" />

    <template v-else>
      <!-- Greeting -->
      <section class="greet">
        <p class="greet__hi">สวัสดี คุณ{{ user.nickname }} 👋</p>
        <h1 class="greet__title">ยินดีต้อนรับสู่ Thinktank Events</h1>
        <p class="greet__sub">กิจกรรมข้างหน้า · การแจ้งเตือน · คะแนนของคุณ</p>
      </section>

      <!-- Stats -->
      <section class="stats">
        <StatCard label="Events ปีนี้" :value="3" :icon="History" color="primary" />
        <StatCard label="Avg Score" value="85" suffix="/100" :delta="5" :icon="BarChart3" color="success" />
        <StatCard label="อันดับล่าสุด" :value="4" :delta="2" :icon="Sparkles" color="warning" />
      </section>

      <!-- Upcoming event card -->
      <section>
        <div class="sect-head">
          <h2 class="sect-head__title">กิจกรรมข้างหน้า</h2>
          <span class="sect-head__count">1 งาน</span>
        </div>

        <template v-if="ui.isLoading.value">
          <LoadingSkeleton variant="card" :count="1" />
        </template>

        <EmptyState
          v-else-if="ui.isEmpty.value"
          title="ยังไม่มี event ที่จะเข้าร่วม"
          message="HR จะส่งเชิญเมื่อมีงานใหม่ · ระหว่างนี้ดูประวัติงานเดิมได้ที่หัวข้อด้านล่าง"
          cta-label="ดูประวัติงาน"
        />

        <div v-else-if="ui.isPartial.value">
          <LoadingSkeleton variant="card" :count="1" />
          <p style="text-align: center; color: var(--color-text-tertiary); font-size: var(--text-caption); margin-top: 8px;">กำลังโหลดกิจกรรมอีก 2 รายการ...</p>
        </div>

        <article v-else class="event-card">
          <RouterLink :to="`/events/${event.id}`" class="event-card__img">
            <img :src="event.bannerUrl" :alt="event.title" />
            <AppBadge variant="success" size="md" class="event-card__badge">เปิดลงทะเบียน</AppBadge>
          </RouterLink>
          <div class="event-card__body">
            <h3 class="event-card__title">{{ event.title }}</h3>
            <p class="event-card__tag">{{ event.tagline }}</p>
            <ul class="event-card__meta">
              <li><AppIcon :icon="Calendar" size="sm" aria-hidden="true" /> {{ formatDateRange(event.startAt, event.endAt) }}</li>
              <li><AppIcon :icon="MapPin" size="sm" aria-hidden="true" /> {{ event.location }}</li>
            </ul>

            <div class="event-card__checklist">
              <div class="task is-todo">
                <span class="task__dot" aria-hidden="true"></span>
                <span class="task__label">ลงทะเบียน</span>
                <RouterLink class="task__cta" :to="`/events/${event.id}/register`">
                  ทำเลย <AppIcon :icon="ArrowRight" size="sm" aria-hidden="true" />
                </RouterLink>
              </div>
              <div class="task">
                <span class="task__dot" aria-hidden="true"></span>
                <span class="task__label">เลือกเมนู (ปิดรับ {{ formatDate(event.menuDeadline) }})</span>
              </div>
              <div class="task">
                <span class="task__dot" aria-hidden="true"></span>
                <span class="task__label">โหวตธีม (ปิดรับ {{ formatDate(event.votingDeadline) }})</span>
              </div>
            </div>

            <AppButton variant="primary" size="lg" full-width>
              <AppIcon :icon="Ticket" size="md" aria-hidden="true" />
              <RouterLink :to="`/events/${event.id}/register`" style="color: inherit; text-decoration: none;">
                ลงทะเบียนเลย
              </RouterLink>
            </AppButton>
          </div>
        </article>
      </section>

      <!-- Past events -->
      <section>
        <div class="sect-head">
          <h2 class="sect-head__title">ประวัติงาน</h2>
        </div>
        <div class="past-grid">
          <RouterLink
            v-for="e in pastEvents"
            :key="e.id"
            :to="`/events/${e.id}`"
            class="past-card"
          >
            <img :src="e.bannerUrl" :alt="e.title" />
            <div class="past-card__body">
              <p class="past-card__date">{{ formatDate(e.startAt) }}</p>
              <p class="past-card__title">{{ e.title }}</p>
            </div>
          </RouterLink>
        </div>
      </section>

      <!-- Announcements -->
      <section class="ann" role="region" aria-label="ประกาศล่าสุด">
        <div class="ann__header">
          <AppIcon :icon="Send" size="md" aria-hidden="true" />
          <h2 class="ann__title">ประกาศล่าสุดจาก HR</h2>
        </div>
        <ul class="ann__list">
          <li>
            <strong>20 เม.ย.</strong> เปิดลงทะเบียน Thinktank Q2: Future of Work — ปิดรับ 10 พ.ค.
          </li>
          <li>
            <strong>15 เม.ย.</strong> ประกาศ theme-voting จะเปิด 1 สัปดาห์ก่อนงาน · อย่าลืมโหวต
          </li>
        </ul>
      </section>
    </template>
  </div>
</template>

<style scoped>
.dash { max-width: var(--size-content-max); padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-6); }
@media (min-width: 768px) { .dash { padding: var(--space-6); } }

.greet__hi { font-size: var(--text-body); color: var(--color-text-secondary); }
.greet__title { font-size: var(--text-h1); font-weight: var(--weight-bold); line-height: var(--leading-snug); margin: var(--space-1) 0; }
.greet__sub { font-size: var(--text-body-sm); color: var(--color-text-secondary); }

.stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-3); }

.sect-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-3); }
.sect-head__title { font-size: var(--text-h3); font-weight: var(--weight-semibold); }
.sect-head__count { font-size: var(--text-caption); color: var(--color-text-secondary); }

.event-card {
  background: var(--color-white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}
.event-card__img {
  display: block; position: relative; aspect-ratio: 16/9;
  overflow: hidden;
}
.event-card__img img { width: 100%; height: 100%; object-fit: cover; transition: transform var(--duration-slow); }
.event-card__img:hover img { transform: scale(1.05); }
.event-card__badge { position: absolute; top: var(--space-3); left: var(--space-3); }
.event-card__body { padding: var(--space-5); display: flex; flex-direction: column; gap: var(--space-4); }
@media (min-width: 768px) { .event-card__body { padding: var(--space-6); } }
.event-card__title { font-size: var(--text-h3); font-weight: var(--weight-bold); line-height: var(--leading-snug); }
.event-card__tag { font-size: var(--text-body-sm); color: var(--color-text-secondary); margin-top: calc(var(--space-3) * -1); }
.event-card__meta {
  list-style: none;
  display: flex; flex-direction: column; gap: var(--space-2);
}
@media (min-width: 640px) { .event-card__meta { flex-direction: row; gap: var(--space-4); flex-wrap: wrap; } }
.event-card__meta li { display: inline-flex; align-items: center; gap: var(--space-2); font-size: var(--text-body-sm); color: var(--color-text-secondary); }
.event-card__checklist { display: flex; flex-direction: column; gap: var(--space-2); background: var(--color-gray-50); padding: var(--space-3); border-radius: var(--radius-lg); }

.task { display: flex; align-items: center; gap: var(--space-3); font-size: var(--text-body-sm); color: var(--color-text-secondary); }
.task__dot { width: 8px; height: 8px; border-radius: 50%; background: var(--color-gray-400); flex-shrink: 0; }
.task.is-todo .task__dot { background: var(--color-primary); animation: pulse 1.6s infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
.task__label { flex: 1; }
.task.is-todo .task__label { color: var(--color-text-primary); font-weight: var(--weight-medium); }
.task__cta { display: inline-flex; align-items: center; gap: 4px; font-size: var(--text-caption); font-weight: var(--weight-semibold); color: var(--color-primary); }

.past-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--space-3); }
.past-card {
  display: flex; gap: var(--space-3); color: var(--color-text-primary);
  background: var(--color-white); border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg); overflow: hidden;
}
.past-card:hover { text-decoration: none; border-color: var(--color-primary-muted); box-shadow: var(--shadow-sm); }
.past-card img { width: 80px; height: 80px; object-fit: cover; flex-shrink: 0; }
.past-card__body { padding: var(--space-3) var(--space-2); display: flex; flex-direction: column; justify-content: center; gap: 2px; }
.past-card__date { font-size: var(--text-caption); color: var(--color-text-tertiary); }
.past-card__title { font-size: var(--text-body-sm); font-weight: var(--weight-medium); }

.ann {
  background: var(--color-info-subtle);
  border: 1px solid var(--color-info-light);
  border-radius: var(--radius-xl);
  padding: var(--space-5);
}
.ann__header { display: flex; align-items: center; gap: var(--space-2); color: var(--color-info-dark); margin-bottom: var(--space-3); }
.ann__title { font-size: var(--text-h4); font-weight: var(--weight-semibold); }
.ann__list { list-style: none; display: flex; flex-direction: column; gap: var(--space-2); font-size: var(--text-body-sm); color: var(--color-text-secondary); }
.ann__list strong { color: var(--color-text-primary); margin-right: var(--space-2); }
</style>
