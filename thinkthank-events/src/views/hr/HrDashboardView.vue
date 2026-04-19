<script setup lang="ts">
/**
 * Screen #10 — HR Dashboard (PRD §11.1 #10).
 * Event list · quick stats · action cards · action on current event.
 */
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import {
  Users, UtensilsCrossed, Camera, TrendingUp, Calendar, Plus,
  ClipboardCheck, LayoutGrid, AlertTriangle, ArrowRight,
} from 'lucide-vue-next'
import { useEventStore } from '@/stores/event'
import { useParticipantStore } from '@/stores/participant'
import { useFeedbackStore } from '@/stores/feedback'
import { useUiState } from '@/composables/useUiState'
import { formatDateRange } from '@/composables/useFormat'
import AppIcon from '@/components/ui/AppIcon.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import StatCard from '@/components/ui/StatCard.vue'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'

const { event, pastEvents } = storeToRefs(useEventStore())
const { participants } = storeToRefs(useParticipantStore())
const { summary } = storeToRefs(useFeedbackStore())
const ui = useUiState()

const confirmed = computed(() => participants.value.filter(p => p.status === 'confirmed').length)
const checkedIn = computed(() => participants.value.filter(p => p.checkedInAt).length)
const allergyCount = computed(() => participants.value.filter(p => p.allergy).length)
const registrationPct = computed(() => Math.round((confirmed.value / event.value.capacity) * 100))
</script>

<template>
  <div class="page dash" style="--page-gap: var(--space-5)">
    <ErrorState v-if="ui.isErrorBlocking.value" :recoverable="false" />
    <ErrorState v-else-if="ui.isError.value" @retry="() => {}" />

    <template v-else-if="ui.isLoading.value">
      <LoadingSkeleton variant="line" width="60%" height="32px" />
      <LoadingSkeleton variant="card" :count="2" />
    </template>

    <template v-else>
      <header class="head">
        <div>
          <p class="head__tag">HR Dashboard</p>
          <h1 class="head__title">ภาพรวมกิจกรรม</h1>
        </div>
        <AppButton variant="primary" size="md">
          <AppIcon :icon="Plus" size="sm" aria-hidden="true" />
          สร้าง Event ใหม่
        </AppButton>
      </header>

      <!-- Active event card -->
      <EmptyState
        v-if="ui.isEmpty.value"
        :icon="Calendar"
        title="ยังไม่มี event active"
        message="สร้าง event ใหม่เพื่อเริ่มเปิดรับลงทะเบียน"
        cta-label="สร้าง Event"
      />

      <section v-else class="active">
        <div class="active__head">
          <AppBadge variant="success" size="md">เปิดลงทะเบียน</AppBadge>
          <span class="active__date">{{ formatDateRange(event.startAt, event.endAt) }}</span>
        </div>
        <h2 class="active__title">{{ event.title }}</h2>

        <!-- Stats -->
        <div class="auto-grid" style="--min: 180px; gap: var(--space-3)">
          <StatCard label="ลงทะเบียน" :value="confirmed" :suffix="`/${event.capacity}`" :icon="Users" color="primary" />
          <StatCard label="Check-in" :value="checkedIn" :icon="Camera" color="success" />
          <StatCard label="แพ้อาหาร" :value="allergyCount" :icon="AlertTriangle" color="warning" />
          <StatCard label="Feedback" :value="summary.total" suffix="ข้อ" :icon="TrendingUp" color="info" />
        </div>

        <!-- Progress -->
        <div class="progress">
          <div class="progress__head">
            <span>จำนวนลงทะเบียน</span>
            <strong>{{ registrationPct }}%</strong>
          </div>
          <div class="progress__bar">
            <div class="progress__fill" :style="`width: ${registrationPct}%`"></div>
          </div>
          <p class="progress__note">เป้าหมาย {{ event.capacity }} คน · ปิดรับ 10 พ.ค. · ส่ง reminder ได้จากหน้ารายชื่อ</p>
        </div>

        <!-- Quick actions grid -->
        <div class="auto-grid" style="--min: 180px; gap: var(--space-3)">
          <RouterLink :to="`/events/${event.id}/admin/participants`" class="qa__card">
            <AppIcon :icon="Users" size="lg" aria-hidden="true" />
            <span class="qa__title">ผู้ลงทะเบียน</span>
            <span class="qa__count">{{ confirmed }}</span>
          </RouterLink>
          <RouterLink :to="`/events/${event.id}/admin/menu-summary`" class="qa__card">
            <AppIcon :icon="UtensilsCrossed" size="lg" aria-hidden="true" />
            <span class="qa__title">สรุปเมนู</span>
            <span class="qa__count">3 เมนู</span>
          </RouterLink>
          <RouterLink :to="`/events/${event.id}/admin/check-in`" class="qa__card qa__card--primary">
            <AppIcon :icon="Camera" size="lg" aria-hidden="true" />
            <span class="qa__title">Scan QR</span>
            <span class="qa__count">เปิด scanner</span>
          </RouterLink>
          <RouterLink :to="`/events/${event.id}/admin/groups`" class="qa__card">
            <AppIcon :icon="LayoutGrid" size="lg" aria-hidden="true" />
            <span class="qa__title">จัดกลุ่ม</span>
            <span class="qa__count">4 ทีม</span>
          </RouterLink>
          <RouterLink :to="`/events/${event.id}/admin/feedback-report`" class="qa__card">
            <AppIcon :icon="TrendingUp" size="lg" aria-hidden="true" />
            <span class="qa__title">รายงาน</span>
            <span class="qa__count">⌀ {{ summary.overall }}</span>
          </RouterLink>
          <RouterLink :to="`/events/${event.id}/admin/theme-setup`" class="qa__card">
            <AppIcon :icon="ClipboardCheck" size="lg" aria-hidden="true" />
            <span class="qa__title">ตั้งค่าโหวต</span>
            <span class="qa__count">4 ตัวเลือก</span>
          </RouterLink>
        </div>
      </section>

      <!-- Past events -->
      <section class="past">
        <h2 class="past__title">Events ที่ผ่านมา</h2>
        <div class="past__list">
          <RouterLink v-for="e in pastEvents" :key="e.id" :to="`/events/${e.id}`" class="past__item">
            <img :src="e.bannerUrl" :alt="e.title" />
            <div>
              <p class="past__name">{{ e.title }}</p>
              <p class="past__date">{{ formatDateRange(e.startAt, e.startAt) }}</p>
            </div>
            <AppIcon :icon="ArrowRight" size="sm" aria-hidden="true" />
          </RouterLink>
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
/* layout via global .page */

.head { display: flex; justify-content: space-between; align-items: flex-end; gap: var(--space-4); flex-wrap: wrap; }
.head__tag { font-size: var(--text-caption); color: var(--color-text-secondary); }
.head__title { font-size: var(--text-h2); font-weight: var(--weight-bold); margin-top: 4px; }

.active {
  background: var(--color-white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  padding: var(--space-5);
  display: flex; flex-direction: column; gap: var(--space-4);
}
@media (min-width: 768px) { .active { padding: var(--space-6); } }
.active__head { display: flex; align-items: center; gap: var(--space-3); flex-wrap: wrap; }
.active__date { font-size: var(--text-caption); color: var(--color-text-secondary); }
.active__title { font-size: var(--text-h3); font-weight: var(--weight-bold); }

/* .stats grid via .auto-grid in template */

.progress {
  background: var(--color-gray-50);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
}
.progress__head { display: flex; justify-content: space-between; margin-bottom: var(--space-2); font-size: var(--text-body-sm); }
.progress__head strong { color: var(--color-primary); font-size: var(--text-h4); }
.progress__bar { height: 8px; background: var(--color-gray-200); border-radius: var(--radius-full); overflow: hidden; margin-bottom: var(--space-2); }
.progress__fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), var(--color-primary-light));
  border-radius: var(--radius-full);
}
.progress__note { font-size: var(--text-caption); color: var(--color-text-secondary); }

/* .qa grid via .auto-grid in template */
.qa__card {
  display: flex; flex-direction: column; gap: var(--space-1);
  padding: var(--space-4);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  color: var(--color-text-primary); background: var(--color-white);
  transition: all var(--duration-fast);
  min-height: 110px;
}
.qa__card:hover { border-color: var(--color-primary); text-decoration: none; transform: translateY(-2px); box-shadow: var(--shadow-sm); }
.qa__card--primary { background: var(--color-primary); color: var(--color-white); border-color: var(--color-primary); }
.qa__card--primary:hover { background: var(--color-primary-hover); border-color: var(--color-primary-hover); }
.qa__title { font-size: var(--text-body-sm); font-weight: var(--weight-semibold); margin-top: var(--space-2); }
.qa__count { font-size: var(--text-caption); opacity: 0.8; }

.past__title { font-size: var(--text-h4); font-weight: var(--weight-semibold); margin-bottom: var(--space-3); }
.past__list { display: flex; flex-direction: column; gap: var(--space-2); }
.past__item {
  display: flex; gap: var(--space-3); align-items: center;
  padding: var(--space-3); background: var(--color-white);
  border: 1px solid var(--color-border-light); border-radius: var(--radius-lg);
  color: var(--color-text-primary);
}
.past__item:hover { background: var(--color-gray-50); text-decoration: none; }
.past__item img { width: 56px; height: 56px; border-radius: var(--radius-md); object-fit: cover; }
.past__item div { flex: 1; min-width: 0; }
.past__name { font-weight: var(--weight-medium); font-size: var(--text-body-sm); }
.past__date { font-size: var(--text-caption); color: var(--color-text-tertiary); }
</style>
