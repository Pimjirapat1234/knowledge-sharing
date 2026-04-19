<script setup lang="ts">
/**
 * Screen #17 — Feedback Report (PRD §11.1 #17 · Story H7).
 * Aggregate view · sentiment keyword cloud · comments list · export.
 */
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { Download, TrendingUp, MessageSquare, Hash, Heart, UtensilsCrossed, ClipboardList, Shield, Eye } from 'lucide-vue-next'
import { useFeedbackStore } from '@/stores/feedback'
import { useUiState } from '@/composables/useUiState'
import { useToast } from '@/composables/useToast'
import AppIcon from '@/components/ui/AppIcon.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import StatCard from '@/components/ui/StatCard.vue'
import AppStarRating from '@/components/ui/AppStarRating.vue'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'

const { entries, summary } = storeToRefs(useFeedbackStore())
const ui = useUiState()
const { success } = useToast()

const filter = ref<'all' | 'positive' | 'critical'>('all')

const filtered = computed(() => {
  if (filter.value === 'positive') return entries.value.filter(e => e.overall >= 4)
  if (filter.value === 'critical') return entries.value.filter(e => e.overall <= 3)
  return entries.value
})

const sentimentWords = computed(() => [
  { word: 'สนุก', count: 12, weight: 3 },
  { word: 'ได้ไอเดีย', count: 9, weight: 2 },
  { word: 'อาหารดี', count: 7, weight: 2 },
  { word: 'keynote', count: 6, weight: 2 },
  { word: 'ทีมจัดสุดยอด', count: 5, weight: 2 },
  { word: 'inspiring', count: 4, weight: 1 },
  { word: 'ช่วงบ่ายยาว', count: 3, weight: 1 },
  { word: 'เผ็ดไปหน่อย', count: 2, weight: 1 },
])

function exportCsv() { success('Export รายงาน', 'ไฟล์ CSV ส่งไปยังอีเมลพร้อม sentiment breakdown') }

function formatTime(iso: string) { return iso.slice(11, 16) + ' น.' }
</script>

<template>
  <div class="page" style="--page-gap: var(--space-5)">
    <ErrorState v-if="ui.isErrorBlocking.value" :recoverable="false" />
    <ErrorState v-else-if="ui.isError.value" @retry="() => {}" />

    <EmptyState
      v-else-if="ui.isEmpty.value || entries.length === 0"
      :icon="MessageSquare"
      title="ยังไม่มี feedback"
      message="เปิด feedback form หลังจบงาน 1 ชม. · ขั้นต่ำ 5 responses ถึงดูผลได้ (ป้องกัน identify)"
    />

    <template v-else-if="ui.isLoading.value">
      <LoadingSkeleton variant="line" width="60%" height="32px" />
      <LoadingSkeleton variant="card" :count="3" />
    </template>

    <template v-else>
      <header class="head">
        <div>
          <p class="head__tag">รายงาน Feedback</p>
          <h1 class="head__title">{{ summary.total }} responses</h1>
          <p class="head__desc">Thinktank Q2: Future of Work</p>
        </div>
        <div class="head__actions">
          <AppButton variant="secondary" size="md">
            <AppIcon :icon="Eye" size="sm" aria-hidden="true" />
            Preview
          </AppButton>
          <AppButton variant="primary" size="md" @click="exportCsv">
            <AppIcon :icon="Download" size="sm" aria-hidden="true" />
            Export CSV
          </AppButton>
        </div>
      </header>

      <!-- Summary scores -->
      <section class="auto-grid" style="--min: 180px; gap: var(--space-3)">
        <div class="summary-card">
          <div class="summary-card__icon"><AppIcon :icon="Heart" size="lg" /></div>
          <p class="summary-card__label">ภาพรวม</p>
          <p class="summary-card__value">{{ summary.overall }}<span>/5</span></p>
          <AppStarRating :model-value="Math.round(summary.overall)" readonly size="md" />
        </div>
        <div class="summary-card">
          <div class="summary-card__icon"><AppIcon :icon="UtensilsCrossed" size="lg" /></div>
          <p class="summary-card__label">อาหาร</p>
          <p class="summary-card__value">{{ summary.food }}<span>/5</span></p>
          <AppStarRating :model-value="Math.round(summary.food)" readonly size="md" />
        </div>
        <div class="summary-card">
          <div class="summary-card__icon"><AppIcon :icon="ClipboardList" size="lg" /></div>
          <p class="summary-card__label">การจัดงาน</p>
          <p class="summary-card__value">{{ summary.organization }}<span>/5</span></p>
          <AppStarRating :model-value="Math.round(summary.organization)" readonly size="md" />
        </div>
        <div class="summary-card">
          <div class="summary-card__icon"><AppIcon :icon="MessageSquare" size="lg" /></div>
          <p class="summary-card__label">เนื้อหา</p>
          <p class="summary-card__value">{{ summary.content }}<span>/5</span></p>
          <AppStarRating :model-value="Math.round(summary.content)" readonly size="md" />
        </div>
      </section>

      <!-- Sentiment -->
      <section class="sect">
        <h2 class="sect__title">
          <AppIcon :icon="Hash" size="md" aria-hidden="true" />
          Keyword cloud
        </h2>
        <div class="cloud">
          <span
            v-for="w in sentimentWords"
            :key="w.word"
            class="cloud__word"
            :style="{ fontSize: `${12 + w.weight * 6}px`, opacity: 0.6 + w.weight * 0.15 }"
          >
            {{ w.word }} <small>{{ w.count }}</small>
          </span>
        </div>
      </section>

      <!-- Comments -->
      <section class="sect">
        <div class="sect-head">
          <h2 class="sect__title">
            <AppIcon :icon="MessageSquare" size="md" aria-hidden="true" />
            ความคิดเห็น
          </h2>
          <div class="filter-tabs" role="tablist">
            <button
              v-for="f in (['all', 'positive', 'critical'] as const)"
              :key="f"
              class="filter-tab"
              :class="{ 'is-active': filter === f }"
              @click="filter = f"
            >
              {{ f === 'all' ? 'ทั้งหมด' : f === 'positive' ? 'Positive (4-5)' : 'Critical (1-3)' }}
            </button>
          </div>
        </div>

        <ul class="comments">
          <li v-for="c in filtered" :key="c.id" class="comment">
            <div class="comment__head">
              <AppStarRating :model-value="c.overall" readonly size="md" />
              <span class="comment__time">{{ formatTime(c.createdAt) }}</span>
              <AppBadge :variant="c.anonymous ? 'neutral' : 'info'" size="sm">
                <AppIcon :icon="c.anonymous ? Shield : MessageSquare" size="sm" aria-hidden="true" />
                {{ c.anonymous ? 'นิรนาม' : 'ระบุชื่อ' }}
              </AppBadge>
            </div>
            <p class="comment__text">{{ c.comment }}</p>
          </li>
        </ul>
      </section>

      <!-- Privacy -->
      <aside class="privacy" role="note">
        <AppIcon :icon="Shield" size="sm" aria-hidden="true" />
        <p>
          <strong>Privacy note:</strong> feedback แบบ anonymous จะเปิดดูได้เมื่อมี ≥ 5 responses (ป้องกัน identify) ·
          audit log บันทึกทุกการ export
        </p>
      </aside>
    </template>
  </div>
</template>

<style scoped>
/* layout via global .page */

.head { display: flex; justify-content: space-between; align-items: flex-end; gap: var(--space-4); flex-wrap: wrap; }
.head__tag { font-size: var(--text-caption); color: var(--color-text-secondary); }
.head__title { font-size: var(--text-h2); font-weight: var(--weight-bold); margin: 4px 0; }
.head__desc { font-size: var(--text-body-sm); color: var(--color-text-secondary); }
.head__actions { display: flex; gap: var(--space-2); flex-wrap: wrap; }

/* .summary grid via .auto-grid in template */
.summary-card {
  padding: var(--space-4);
  background: var(--color-white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  text-align: center;
}
.summary-card__icon {
  width: 40px; height: 40px; border-radius: var(--radius-lg);
  background: var(--color-primary-subtle); color: var(--color-primary);
  display: inline-flex; align-items: center; justify-content: center;
  margin-bottom: var(--space-2);
}
.summary-card__label { font-size: var(--text-caption); color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: var(--tracking-wide); font-weight: var(--weight-medium); }
.summary-card__value { font-size: var(--text-h2); font-weight: var(--weight-bold); margin: 4px 0; }
.summary-card__value span { font-size: var(--text-body); opacity: 0.6; font-weight: var(--weight-regular); }

.sect {
  background: var(--color-white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  padding: var(--space-5);
}
.sect__title { display: inline-flex; align-items: center; gap: var(--space-2); font-size: var(--text-h4); font-weight: var(--weight-semibold); margin-bottom: var(--space-4); }
.sect-head { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: var(--space-3); margin-bottom: var(--space-4); }

.cloud { display: flex; flex-wrap: wrap; gap: var(--space-3); align-items: center; padding: var(--space-4); background: var(--color-gray-50); border-radius: var(--radius-lg); }
.cloud__word {
  color: var(--color-primary);
  font-weight: var(--weight-semibold);
  line-height: 1.4;
}
.cloud__word small { color: var(--color-text-tertiary); font-size: 0.6em; margin-left: 4px; }

.filter-tabs { display: inline-flex; background: var(--color-gray-100); border-radius: var(--radius-full); padding: 3px; gap: 2px; }
.filter-tab {
  padding: var(--space-1) var(--space-3);
  min-height: 32px;
  border-radius: var(--radius-full);
  font-size: var(--text-caption); font-weight: var(--weight-medium);
  color: var(--color-text-secondary);
}
.filter-tab.is-active { background: var(--color-white); color: var(--color-text-primary); box-shadow: var(--shadow-sm); }

.comments { list-style: none; display: flex; flex-direction: column; gap: var(--space-3); }
.comment {
  padding: var(--space-4);
  background: var(--color-gray-50);
  border-radius: var(--radius-lg);
  border-left: 3px solid var(--color-primary);
}
.comment__head { display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-2); flex-wrap: wrap; }
.comment__time { font-size: var(--text-caption); color: var(--color-text-tertiary); font-family: var(--font-mono); }
.comment__text { font-size: var(--text-body-sm); line-height: var(--leading-relaxed); color: var(--color-text-primary); }

.privacy {
  display: flex; gap: var(--space-2); align-items: flex-start;
  padding: var(--space-3);
  background: var(--color-info-subtle);
  color: var(--color-info-dark);
  border-radius: var(--radius-md);
  font-size: var(--text-caption);
  line-height: var(--leading-relaxed);
}
</style>
