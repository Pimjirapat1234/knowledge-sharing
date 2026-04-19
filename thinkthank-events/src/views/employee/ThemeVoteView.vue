<script setup lang="ts">
/**
 * Screen #6 — Theme Voting (PRD §11.1 #6 · FR-THEME · Story E4).
 * Theme cards · 1 vote only · live/hold results · editable until deadline.
 */
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { Vote, Clock, CheckCircle2, Eye, EyeOff } from 'lucide-vue-next'
import { useThemeStore } from '@/stores/theme'
import { useEventStore } from '@/stores/event'
import { useUiState } from '@/composables/useUiState'
import { useToast } from '@/composables/useToast'
import { formatDateTime } from '@/composables/useFormat'
import AppIcon from '@/components/ui/AppIcon.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'

const themeStore = useThemeStore()
const { themes, myVoteId, resultsVisible } = storeToRefs(themeStore)
const { event } = storeToRefs(useEventStore())
const ui = useUiState()
const { success } = useToast()

const selected = ref<string | null>(myVoteId.value)
const submitting = ref(false)

const totalVotes = computed(() => themes.value.reduce((n, t) => n + t.votes, 0))
const deadline = computed(() => formatDateTime(event.value.votingDeadline))

function pct(votes: number) {
  if (totalVotes.value === 0) return 0
  return Math.round((votes / totalVotes.value) * 100)
}

function vote() {
  if (!selected.value) return
  submitting.value = true
  setTimeout(() => {
    myVoteId.value = selected.value
    submitting.value = false
    success('โหวตเรียบร้อย', 'แก้ไขได้จนถึง ' + deadline.value)
  }, 600)
}
</script>

<template>
  <div class="page page--form vote-page">
    <ErrorState v-if="ui.isErrorBlocking.value" :recoverable="false" title="ไม่เปิดโหวต" message="HR ยังไม่ได้เปิดให้โหวต · กรุณารอประกาศ" />
    <ErrorState v-else-if="ui.isError.value" @retry="() => {}" />
    <EmptyState v-else-if="ui.isEmpty.value" :icon="Vote" title="ยังไม่มีธีมให้โหวต" message="HR ยังไม่ได้ตั้งค่าตัวเลือกธีม · เปิดโหวต 1 สัปดาห์ก่อนงาน" />

    <template v-else-if="ui.isLoading.value">
      <LoadingSkeleton variant="line" width="60%" height="32px" />
      <LoadingSkeleton variant="card" :count="4" />
    </template>

    <template v-else>
      <header class="head">
        <p class="head__tag">โหวตธีมกิจกรรม</p>
        <h1 class="head__title">เลือกธีมที่คุณชอบ</h1>
        <p class="head__desc">โหวตได้ 1 ตัวเลือกเท่านั้น · แก้ไขได้จนถึง {{ deadline }}</p>
        <div class="head__meta">
          <AppBadge variant="info" size="md">
            <AppIcon :icon="resultsVisible ? Eye : EyeOff" size="sm" aria-hidden="true" />
            {{ resultsVisible ? 'แสดงผลโหวต real-time' : 'ซ่อนผลจนปิดโหวต' }}
          </AppBadge>
          <span class="head__total">โหวตไปแล้ว {{ totalVotes }} เสียง</span>
        </div>
      </header>

      <section class="auto-grid themes" style="--min:300px" role="radiogroup" aria-label="ตัวเลือกธีม">
        <label
          v-for="t in themes"
          :key="t.id"
          class="theme"
          :class="{ 'is-selected': selected === t.id, 'is-voted': myVoteId === t.id }"
        >
          <input type="radio" :value="t.id" v-model="selected" class="theme__input" />
          <div class="theme__img">
            <img :src="t.imageUrl" :alt="t.title" loading="lazy" />
            <div v-if="myVoteId === t.id" class="theme__voted" aria-label="โหวตแล้ว">
              <AppIcon :icon="CheckCircle2" size="md" aria-hidden="true" />
              โหวตแล้ว
            </div>
          </div>
          <div class="theme__body">
            <h3 class="theme__title">{{ t.title }}</h3>
            <p class="theme__desc">{{ t.description }}</p>
            <div v-if="resultsVisible" class="theme__bar">
              <div class="theme__fill" :style="`width: ${pct(t.votes)}%`"></div>
              <span class="theme__pct">{{ pct(t.votes) }}%</span>
            </div>
            <p v-if="resultsVisible" class="theme__count">{{ t.votes }} เสียง</p>
          </div>
        </label>
      </section>

      <div class="actions">
        <AppBadge v-if="myVoteId" variant="success" size="md">
          <AppIcon :icon="CheckCircle2" size="sm" aria-hidden="true" />
          คุณโหวตแล้ว — เปลี่ยนได้จนถึงปิดโหวต
        </AppBadge>
        <AppButton
          variant="primary"
          size="lg"
          :loading="submitting"
          :disabled="!selected || selected === myVoteId"
          @click="vote"
        >
          <AppIcon :icon="Vote" size="md" aria-hidden="true" />
          {{ myVoteId ? 'เปลี่ยนโหวต' : 'ยืนยันโหวต' }}
        </AppButton>
      </div>
    </template>
  </div>
</template>

<style scoped>
/* layout via global .page .page--form */
.vote-page { padding-bottom: var(--space-12); }

.head__tag { font-size: var(--text-caption); text-transform: uppercase; letter-spacing: var(--tracking-wider); color: var(--color-primary); font-weight: var(--weight-semibold); }
.head__title { font-size: var(--text-h2); font-weight: var(--weight-bold); margin: var(--space-1) 0 var(--space-2); }
.head__desc { font-size: var(--text-body-sm); color: var(--color-text-secondary); margin-bottom: var(--space-3); }
.head__meta { display: flex; align-items: center; gap: var(--space-3); flex-wrap: wrap; }
.head__total { font-size: var(--text-caption); color: var(--color-text-secondary); }

/* themes grid via global .auto-grid --min:300px */

.theme {
  display: flex; flex-direction: column;
  background: var(--color-white);
  border: 2px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--duration-fast);
}
.theme:hover { border-color: var(--color-primary-muted); box-shadow: var(--shadow-sm); }
.theme.is-selected { border-color: var(--color-primary); }
.theme.is-voted { border-color: var(--color-primary); box-shadow: var(--shadow-md); }
.theme__input { position: absolute; opacity: 0; pointer-events: none; }

.theme__img { position: relative; aspect-ratio: 16/9; overflow: hidden; }
.theme__img img { width: 100%; height: 100%; object-fit: cover; }
.theme__voted {
  position: absolute; top: var(--space-3); right: var(--space-3);
  display: inline-flex; align-items: center; gap: var(--space-1);
  padding: var(--space-1) var(--space-3);
  background: var(--color-success); color: var(--color-white);
  border-radius: var(--radius-full);
  font-size: var(--text-caption); font-weight: var(--weight-semibold);
  box-shadow: var(--shadow-sm);
}

.theme__body { padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-2); }
.theme__title { font-size: var(--text-h4); font-weight: var(--weight-semibold); }
.theme__desc { font-size: var(--text-body-sm); color: var(--color-text-secondary); line-height: var(--leading-relaxed); }

.theme__bar {
  position: relative;
  height: 8px; background: var(--color-gray-200);
  border-radius: var(--radius-full); overflow: hidden; margin-top: var(--space-2);
}
.theme__fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), var(--color-primary-light));
  border-radius: var(--radius-full);
  transition: width var(--duration-slow) var(--ease-out);
}
.theme__pct {
  position: absolute; top: -22px; right: 0;
  font-size: var(--text-caption); font-weight: var(--weight-semibold);
  color: var(--color-primary);
}
.theme__count { font-size: var(--text-caption); color: var(--color-text-tertiary); }

.actions {
  display: flex; flex-direction: column; gap: var(--space-3);
  position: sticky; bottom: 0;
  background: linear-gradient(to top, var(--color-bg-secondary) 70%, transparent);
  padding: var(--space-3) 0;
}
@media (min-width: 640px) { .actions { flex-direction: row; justify-content: space-between; align-items: center; } }
</style>
