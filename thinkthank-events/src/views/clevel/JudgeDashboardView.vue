<script setup lang="ts">
/**
 * C-Level Dashboard — entry point for judging.
 * Big touch targets (per PRD §12.10 generational accessibility).
 */
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { Star, MessageCircle, Trophy, ChevronRight, Calendar } from 'lucide-vue-next'
import { useEventStore } from '@/stores/event'
import { useGroupStore } from '@/stores/group'
import { useUserStore } from '@/stores/user'
import { useUiState } from '@/composables/useUiState'
import { formatDateRange } from '@/composables/useFormat'
import AppIcon from '@/components/ui/AppIcon.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'

const { event } = storeToRefs(useEventStore())
const { groups } = storeToRefs(useGroupStore())
const { user } = storeToRefs(useUserStore())
const ui = useUiState()

const pendingRatings = computed(() => groups.value.length)
const nextAction = computed(() => `ให้คะแนนทีมทั้ง ${pendingRatings.value} ทีม`)
</script>

<template>
  <div class="page" style="--page-gap: var(--space-5)">
    <ErrorState v-if="ui.isErrorBlocking.value" :recoverable="false" />
    <ErrorState v-else-if="ui.isError.value" @retry="() => {}" />

    <header class="hero">
      <div class="hero__content">
        <p class="hero__hi">สวัสดีคุณ{{ user.nickname }}</p>
        <h1 class="hero__title">พร้อมให้คะแนนแล้วไหม?</h1>
        <p class="hero__desc">ให้คะแนนใหญ่ชัด · confirm ก่อนส่ง · แก้ไขได้ 10 นาที</p>
      </div>
    </header>

    <EmptyState
      v-if="ui.isEmpty.value"
      :icon="Trophy"
      title="ยังไม่มี event ที่ต้องให้คะแนน"
      message="เมื่อมีงานใหม่ ระบบจะเตือนทางอีเมล"
    />

    <template v-else-if="ui.isLoading.value">
      <LoadingSkeleton variant="block" height="200px" />
      <LoadingSkeleton variant="card" :count="2" />
    </template>

    <template v-else>
      <!-- Current event -->
      <section class="current">
        <div class="current__body">
          <AppBadge variant="warning" size="md">พร้อมให้คะแนน</AppBadge>
          <h2 class="current__title">{{ event.title }}</h2>
          <p class="current__meta">
            <AppIcon :icon="Calendar" size="sm" aria-hidden="true" />
            {{ formatDateRange(event.startAt, event.endAt) }}
          </p>
          <p class="current__desc">{{ nextAction }}</p>
        </div>
        <img :src="event.bannerUrl" :alt="event.title" class="current__img" />
      </section>

      <!-- Large action tiles (56px touch target per C-Level accessibility §9.2) -->
      <section class="tiles">
        <RouterLink :to="`/events/${event.id}/judge/rate`" class="tile tile--primary">
          <div class="tile__icon"><AppIcon :icon="Star" size="xl" /></div>
          <div class="tile__body">
            <h3>ให้คะแนนทีม</h3>
            <p>{{ pendingRatings }} ทีมรอคะแนน · ~30 วินาที/ทีม</p>
          </div>
          <AppIcon :icon="ChevronRight" size="lg" aria-hidden="true" />
        </RouterLink>

        <RouterLink :to="`/events/${event.id}/judge/team-feedback`" class="tile">
          <div class="tile__icon"><AppIcon :icon="MessageCircle" size="xl" /></div>
          <div class="tile__body">
            <h3>Feedback ส่วนตัวให้ทีม</h3>
            <p>ข้อความเพิ่มเติมถึงแต่ละทีม · HR เท่านั้นเห็น</p>
          </div>
          <AppIcon :icon="ChevronRight" size="lg" aria-hidden="true" />
        </RouterLink>

        <RouterLink :to="`/events/${event.id}/leaderboard`" class="tile">
          <div class="tile__icon"><AppIcon :icon="Trophy" size="xl" /></div>
          <div class="tile__body">
            <h3>ดู Leaderboard</h3>
            <p>ผลจัดอันดับรวม · เปิดดูได้หลัง rating ของทุกคน</p>
          </div>
          <AppIcon :icon="ChevronRight" size="lg" aria-hidden="true" />
        </RouterLink>
      </section>

      <!-- Privacy assurance -->
      <aside class="privacy">
        <p class="privacy__title">ความเป็นส่วนตัวของคะแนน</p>
        <ul class="privacy__list">
          <li>คะแนนคุณซ่อน · แสดงเฉพาะ aggregate ไม่ระบุคนให้</li>
          <li>Feedback ส่งถึง HR เท่านั้น · ไม่ส่งต่อพนักงานเจ้าของทีม</li>
          <li>C-Level คนอื่นเห็น aggregate ≥ 3 คน ถึงดูได้</li>
        </ul>
      </aside>
    </template>
  </div>
</template>

<style scoped>
/* layout via global .page */

.hero {
  padding: var(--space-6);
  background: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-secondary-light) 100%);
  color: var(--color-white);
  border-radius: var(--radius-xl);
}
.hero__hi { font-size: var(--text-body); opacity: 0.8; }
.hero__title { font-size: var(--text-h1); font-weight: var(--weight-bold); margin: var(--space-2) 0; line-height: var(--leading-snug); }
.hero__desc { font-size: var(--text-body); opacity: 0.9; }

.current {
  display: grid; grid-template-columns: 1fr; gap: var(--space-4);
  background: var(--color-white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  overflow: hidden;
}
@media (min-width: 768px) { .current { grid-template-columns: 1fr 240px; } }
.current__body { padding: var(--space-5); display: flex; flex-direction: column; gap: var(--space-2); }
.current__title { font-size: var(--text-h3); font-weight: var(--weight-bold); margin-top: var(--space-1); }
.current__meta { display: inline-flex; align-items: center; gap: var(--space-1); color: var(--color-text-secondary); font-size: var(--text-body-sm); }
.current__desc { color: var(--color-text-secondary); font-size: var(--text-body); margin-top: var(--space-2); }
.current__img { width: 100%; height: 100%; object-fit: cover; }

.tiles { display: flex; flex-direction: column; gap: var(--space-3); }
.tile {
  display: flex; align-items: center; gap: var(--space-4);
  padding: var(--space-5);
  background: var(--color-white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  color: var(--color-text-primary);
  min-height: 96px;
  transition: all var(--duration-fast);
}
.tile:hover { text-decoration: none; border-color: var(--color-primary); transform: translateY(-2px); box-shadow: var(--shadow-md); }
.tile--primary {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: var(--color-white);
  border-color: var(--color-primary);
}
.tile--primary:hover { border-color: var(--color-primary-hover); }

.tile__icon {
  width: 72px; height: 72px; border-radius: var(--radius-xl);
  background: var(--color-primary-subtle); color: var(--color-primary);
  display: inline-flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.tile--primary .tile__icon { background: rgba(255,255,255,0.25); color: var(--color-white); }

.tile__body { flex: 1; min-width: 0; }
.tile__body h3 { font-size: var(--text-h3); font-weight: var(--weight-bold); margin-bottom: 4px; }
.tile__body p { font-size: var(--text-body-sm); opacity: 0.85; }

.privacy {
  padding: var(--space-5);
  background: var(--color-info-subtle);
  border-radius: var(--radius-xl);
  color: var(--color-info-dark);
}
.privacy__title { font-weight: var(--weight-semibold); margin-bottom: var(--space-2); }
.privacy__list { padding-left: var(--space-5); font-size: var(--text-body-sm); color: var(--color-text-secondary); line-height: var(--leading-relaxed); display: flex; flex-direction: column; gap: var(--space-1); }
</style>
