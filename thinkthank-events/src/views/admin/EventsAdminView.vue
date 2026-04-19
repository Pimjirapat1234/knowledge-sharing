<script setup lang="ts">
/**
 * Super Admin · All Events · cross-HR view
 */
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import {
  Shield, Calendar, Plus, ExternalLink, MoreHorizontal, Users, CheckCircle2,
} from 'lucide-vue-next'
import { useEventStore } from '@/stores/event'
import { useParticipantStore } from '@/stores/participant'
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
const ui = useUiState()

const allEvents = computed(() => [event.value, ...pastEvents.value.map(p => ({
  ...p,
  location: 'Real Factory HQ',
  registeredCount: 0,
  capacity: 0,
  status: 'CLOSED' as const,
}))])
</script>

<template>
  <div class="page" style="--page-gap: var(--space-5)">
    <ErrorState v-if="ui.isErrorBlocking.value" :recoverable="false" />
    <ErrorState v-else-if="ui.isError.value" @retry="() => {}" />

    <template v-else>
      <header class="head">
        <div>
          <div class="head__breadcrumb">
            <AppIcon :icon="Shield" size="sm" aria-hidden="true" />
            System Admin
          </div>
          <h1 class="head__title">All Events</h1>
          <p class="head__desc">ดู/จัดการ event ทั้งหมดข้าม HR · force delete · move to different HR</p>
        </div>
        <AppButton variant="primary" size="md">
          <AppIcon :icon="Plus" size="sm" aria-hidden="true" />
          สร้าง Event
        </AppButton>
      </header>

      <section class="stats auto-grid">
        <StatCard label="Total Events" :value="allEvents.length" :icon="Calendar" color="primary" />
        <StatCard label="Active" :value="1" :icon="CheckCircle2" color="success" />
        <StatCard label="Participants" :value="participants.length" :icon="Users" color="info" />
      </section>

      <template v-if="ui.isLoading.value">
        <LoadingSkeleton variant="card" :count="3" />
      </template>

      <EmptyState
        v-else-if="ui.isEmpty.value"
        :icon="Calendar"
        title="ยังไม่มี events"
        message="สร้าง event แรกเพื่อเริ่มใช้ระบบ"
        cta-label="สร้าง Event"
      />

      <!-- Events list -->
      <div v-else class="events auto-grid">
        <!-- Active -->
        <article class="event event--active">
          <img :src="event.bannerUrl" :alt="event.title" class="event__img" />
          <div class="event__body">
            <div class="event__head">
              <AppBadge variant="success" size="sm">Active</AppBadge>
              <span class="event__id">{{ event.id }}</span>
            </div>
            <h2 class="event__title">{{ event.title }}</h2>
            <p class="event__meta">
              <AppIcon :icon="Calendar" size="sm" aria-hidden="true" /> {{ formatDateRange(event.startAt, event.endAt) }}
            </p>
            <p class="event__owner">Owner: <strong>เจนจิรา สุขใส (HR)</strong> · {{ event.registeredCount }}/{{ event.capacity }} คน</p>
            <div class="event__actions">
              <RouterLink :to="`/events/${event.id}`" class="event-link">
                <AppIcon :icon="ExternalLink" size="sm" aria-hidden="true" />
                ดู event
              </RouterLink>
              <button class="event-more" aria-label="More">
                <AppIcon :icon="MoreHorizontal" size="sm" aria-hidden="true" />
              </button>
            </div>
          </div>
        </article>

        <!-- Past -->
        <article v-for="e in pastEvents" :key="e.id" class="event">
          <img :src="e.bannerUrl" :alt="e.title" class="event__img" />
          <div class="event__body">
            <div class="event__head">
              <AppBadge variant="neutral" size="sm">Closed</AppBadge>
              <span class="event__id">{{ e.id }}</span>
            </div>
            <h2 class="event__title">{{ e.title }}</h2>
            <p class="event__meta">
              <AppIcon :icon="Calendar" size="sm" aria-hidden="true" /> {{ formatDateRange(e.startAt, e.startAt) }}
            </p>
            <p class="event__owner">Archived</p>
            <div class="event__actions">
              <RouterLink :to="`/events/${e.id}`" class="event-link">
                <AppIcon :icon="ExternalLink" size="sm" aria-hidden="true" />
                ดู event
              </RouterLink>
              <button class="event-more" aria-label="More">
                <AppIcon :icon="MoreHorizontal" size="sm" aria-hidden="true" />
              </button>
            </div>
          </div>
        </article>
      </div>
    </template>
  </div>
</template>

<style scoped>
/* layout via global .page */

.head { display: flex; justify-content: space-between; align-items: flex-end; gap: var(--space-4); flex-wrap: wrap; }
.head__breadcrumb { display: inline-flex; align-items: center; gap: var(--space-1); font-size: var(--text-caption); color: var(--color-danger-dark); font-weight: var(--weight-semibold); text-transform: uppercase; letter-spacing: var(--tracking-wide); }
.head__title { font-size: var(--text-h2); font-weight: var(--weight-bold); margin: 4px 0; }
.head__desc { font-size: var(--text-body-sm); color: var(--color-text-secondary); max-width: 640px; }

/* .stats + .events use global .auto-grid */

.event {
  display: flex; flex-direction: column;
  background: var(--color-white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  overflow: hidden;
}
.event--active { border-color: var(--color-success); }

.event__img { width: 100%; aspect-ratio: 16/9; object-fit: cover; }
.event__body { padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-2); }
.event__head { display: flex; justify-content: space-between; align-items: center; }
.event__id { font-family: var(--font-mono); font-size: var(--text-caption); color: var(--color-text-tertiary); }
.event__title { font-size: var(--text-h4); font-weight: var(--weight-semibold); }
.event__meta { display: inline-flex; align-items: center; gap: var(--space-1); font-size: var(--text-body-sm); color: var(--color-text-secondary); }
.event__owner { font-size: var(--text-caption); color: var(--color-text-secondary); }
.event__actions { display: flex; gap: var(--space-2); align-items: center; margin-top: var(--space-2); }
.event-link {
  flex: 1;
  display: inline-flex; align-items: center; justify-content: center; gap: var(--space-1);
  padding: var(--space-2); min-height: var(--size-touch-target);
  background: var(--color-gray-50);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-size: var(--text-body-sm);
  font-weight: var(--weight-medium);
}
.event-link:hover { background: var(--color-primary-subtle); color: var(--color-primary); text-decoration: none; }
.event-more { width: var(--size-touch-target); height: var(--size-touch-target); border-radius: var(--radius-md); color: var(--color-text-secondary); display: inline-flex; align-items: center; justify-content: center; }
.event-more:hover { background: var(--color-gray-100); }
</style>
