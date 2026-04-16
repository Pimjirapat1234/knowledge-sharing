<script setup lang="ts">
/**
 * Screen #18 — C-Level Rate (PRD §11.1 #18 · Story M1 · FR-RATE).
 * Moment of Truth — must be EASY · large touch targets 56px · confirm modal · 10min edit window.
 * MoT (§12.3): ถ้า C-Level บอก "ยาก" → ทั้งระบบล้ม
 */
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { Star, Lightbulb, Target, Presentation, Check, ChevronLeft, ChevronRight, Edit } from 'lucide-vue-next'
import { useGroupStore } from '@/stores/group'
import { useUiState } from '@/composables/useUiState'
import { useToast } from '@/composables/useToast'
import AppIcon from '@/components/ui/AppIcon.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppStarRating from '@/components/ui/AppStarRating.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'

const { groups } = storeToRefs(useGroupStore())
const ui = useUiState()
const { success } = useToast()

const currentIdx = ref(0)
const currentTeam = computed(() => groups.value[currentIdx.value])
const rated = ref<Record<string, { creativity: number; feasibility: number; presentation: number; submitted: boolean }>>({})

const criteria = [
  { key: 'creativity' as const, label: 'ความคิดสร้างสรรค์', desc: 'นวัตกรรม · แปลกใหม่', icon: Lightbulb },
  { key: 'feasibility' as const, label: 'ความเป็นไปได้', desc: 'ทำจริงได้ · realistic', icon: Target },
  { key: 'presentation' as const, label: 'การนำเสนอ', desc: 'ชัดเจน · น่าสนใจ', icon: Presentation },
]

const currentRating = computed(() => {
  if (!currentTeam.value) return null
  return rated.value[currentTeam.value.id] ?? { creativity: 0, feasibility: 0, presentation: 0, submitted: false }
})

function setRating(key: 'creativity' | 'feasibility' | 'presentation', v: number) {
  if (!currentTeam.value) return
  const tid = currentTeam.value.id
  rated.value[tid] = {
    ...(rated.value[tid] ?? { creativity: 0, feasibility: 0, presentation: 0, submitted: false }),
    [key]: v,
  }
}

const averageScore = computed(() => {
  if (!currentRating.value) return 0
  const { creativity, feasibility, presentation } = currentRating.value
  if (creativity === 0 || feasibility === 0 || presentation === 0) return 0
  return +((creativity + feasibility + presentation) / 3).toFixed(1)
})

const canSubmit = computed(() => averageScore.value > 0)

const showConfirm = ref(false)

function openConfirm() { if (canSubmit.value) showConfirm.value = true }
function confirm() {
  showConfirm.value = false
  if (!currentTeam.value) return
  rated.value[currentTeam.value.id]!.submitted = true
  success(
    `บันทึกคะแนนให้ ${currentTeam.value.name} แล้ว`,
    'แก้ไขได้อีก 10 นาที ก่อนปิดโหวต',
  )
  // auto-advance
  if (currentIdx.value < groups.value.length - 1) {
    setTimeout(() => (currentIdx.value += 1), 400)
  }
}

function edit() {
  if (!currentTeam.value) return
  rated.value[currentTeam.value.id]!.submitted = false
}

const totalRated = computed(() =>
  Object.values(rated.value).filter(r => r.submitted).length,
)
</script>

<template>
  <div class="page">
    <ErrorState v-if="ui.isErrorBlocking.value" :recoverable="false" />
    <ErrorState v-else-if="ui.isError.value" @retry="() => {}" />

    <EmptyState
      v-else-if="ui.isEmpty.value || groups.length === 0"
      :icon="Star"
      title="ยังไม่มีทีมให้ให้คะแนน"
      message="HR ยังไม่ได้จัดกลุ่มและสุ่มคิวนำเสนอ"
    />

    <template v-else-if="ui.isLoading.value">
      <LoadingSkeleton variant="block" height="400px" />
    </template>

    <template v-else-if="currentTeam">
      <!-- Progress -->
      <header class="head">
        <p class="head__progress">
          ทีมที่ {{ currentIdx + 1 }} / {{ groups.length }} ·
          <strong>{{ totalRated }}</strong> ให้คะแนนแล้ว
        </p>
        <div class="head__bar">
          <div class="head__fill" :style="`width: ${(totalRated / groups.length) * 100}%`"></div>
        </div>
      </header>

      <!-- BIG team card (C-Level context — large everything) -->
      <section class="team" :style="{ '--c': currentTeam.color }">
        <div class="team__head">
          <span class="team__dot" :style="{ backgroundColor: currentTeam.color }" aria-hidden="true"></span>
          <h1 class="team__name">{{ currentTeam.name }}</h1>
          <AppBadge v-if="currentRating?.submitted" variant="success" size="md">
            <AppIcon :icon="Check" size="sm" aria-hidden="true" />
            ให้คะแนนแล้ว
          </AppBadge>
          <AppBadge v-else variant="warning" size="md">
            รอคะแนน
          </AppBadge>
        </div>
        <p class="team__sub">{{ currentTeam.memberIds.length }} คน · Present อันดับที่ {{ currentTeam.queueOrder }}</p>
      </section>

      <!-- Criteria rating -->
      <section class="criteria">
        <article v-for="c in criteria" :key="c.key" class="criterion">
          <div class="criterion__head">
            <div class="criterion__icon" aria-hidden="true"><AppIcon :icon="c.icon" size="lg" /></div>
            <div>
              <h3 class="criterion__title">{{ c.label }}</h3>
              <p class="criterion__desc">{{ c.desc }}</p>
            </div>
          </div>
          <AppStarRating
            :model-value="currentRating?.[c.key] ?? 0"
            size="xl"
            :aria-label="c.label"
            @update:model-value="v => setRating(c.key, v)"
            :readonly="currentRating?.submitted"
          />
        </article>
      </section>

      <!-- Average score preview -->
      <div v-if="averageScore > 0" class="avg">
        <span>คะแนนเฉลี่ย</span>
        <strong>{{ averageScore }}<small>/5</small></strong>
      </div>

      <!-- Actions (big, C-Level style) -->
      <div class="actions">
        <AppButton
          v-if="currentIdx > 0"
          variant="ghost"
          size="xl"
          @click="currentIdx -= 1"
        >
          <AppIcon :icon="ChevronLeft" size="md" aria-hidden="true" />
          ทีมก่อนหน้า
        </AppButton>

        <AppButton
          v-if="currentRating?.submitted"
          variant="secondary"
          size="xl"
          @click="edit"
        >
          <AppIcon :icon="Edit" size="md" aria-hidden="true" />
          แก้ไขคะแนน
        </AppButton>
        <AppButton
          v-else
          variant="primary"
          size="xl"
          :disabled="!canSubmit"
          @click="openConfirm"
        >
          <AppIcon :icon="Check" size="md" aria-hidden="true" />
          ยืนยันคะแนน
        </AppButton>

        <AppButton
          v-if="currentIdx < groups.length - 1"
          variant="ghost"
          size="xl"
          @click="currentIdx += 1"
        >
          ทีมถัดไป
          <AppIcon :icon="ChevronRight" size="md" aria-hidden="true" />
        </AppButton>
      </div>

      <!-- Confirm modal -->
      <div v-if="showConfirm" class="modal" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
        <div class="modal__backdrop" @click="showConfirm = false"></div>
        <div class="modal__body">
          <h2 id="confirm-title" class="modal__title">ยืนยันคะแนน?</h2>
          <p class="modal__team">{{ currentTeam.name }}</p>

          <div class="modal__scores">
            <div v-for="c in criteria" :key="c.key" class="modal__score-row">
              <span>{{ c.label }}</span>
              <strong>{{ currentRating?.[c.key] }}/5</strong>
            </div>
            <div class="modal__score-row modal__score-row--avg">
              <span>เฉลี่ย</span>
              <strong>{{ averageScore }}/5</strong>
            </div>
          </div>

          <p class="modal__note">แก้ไขได้ 10 นาทีหลังส่ง · หลังจากนั้น คะแนนจะถูกนับเป็นทางการ</p>

          <div class="modal__actions">
            <AppButton variant="ghost" size="lg" @click="showConfirm = false">ยกเลิก</AppButton>
            <AppButton variant="primary" size="lg" @click="confirm">
              <AppIcon :icon="Check" size="md" aria-hidden="true" />
              ส่งคะแนน
            </AppButton>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.page { max-width: 720px; margin: 0 auto; padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-5); padding-bottom: var(--space-16); }
@media (min-width: 768px) { .page { padding: var(--space-8) var(--space-6); } }

.head__progress { font-size: var(--text-body); color: var(--color-text-secondary); margin-bottom: var(--space-2); }
.head__progress strong { color: var(--color-primary); }
.head__bar { height: 8px; background: var(--color-gray-200); border-radius: var(--radius-full); overflow: hidden; }
.head__fill { height: 100%; background: var(--color-primary); border-radius: var(--radius-full); transition: width var(--duration-slow); }

.team {
  padding: var(--space-6);
  background: var(--color-white);
  border: 3px solid var(--c);
  border-radius: var(--radius-xl);
  text-align: center;
}
.team__head { display: inline-flex; align-items: center; gap: var(--space-3); flex-wrap: wrap; justify-content: center; }
.team__dot { width: 20px; height: 20px; border-radius: 50%; }
.team__name { font-size: var(--text-h1); font-weight: var(--weight-bold); color: var(--color-text-primary); }
.team__sub { font-size: var(--text-body); color: var(--color-text-secondary); margin-top: var(--space-2); }

.criteria { display: flex; flex-direction: column; gap: var(--space-3); }
.criterion {
  padding: var(--space-5);
  background: var(--color-white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  display: flex; flex-direction: column; gap: var(--space-4);
}
.criterion__head { display: flex; gap: var(--space-3); align-items: center; }
.criterion__icon {
  width: 56px; height: 56px; border-radius: var(--radius-xl);
  background: var(--color-primary-subtle); color: var(--color-primary);
  display: inline-flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.criterion__title { font-size: var(--text-h3); font-weight: var(--weight-semibold); }
.criterion__desc { font-size: var(--text-body-sm); color: var(--color-text-secondary); }

.avg {
  display: flex; justify-content: space-between; align-items: center;
  padding: var(--space-4) var(--space-5);
  background: var(--color-primary-subtle);
  border-radius: var(--radius-lg);
  font-size: var(--text-h4);
}
.avg strong { color: var(--color-primary); font-size: var(--text-h1); font-weight: var(--weight-bold); }
.avg small { font-size: var(--text-h4); opacity: 0.6; }

.actions {
  display: flex; gap: var(--space-3); justify-content: space-between; flex-wrap: wrap;
  position: sticky; bottom: 0;
  background: linear-gradient(to top, var(--color-bg-secondary) 70%, transparent);
  padding: var(--space-3) 0;
}
.actions > * { flex: 1; min-width: 140px; }

/* Confirm modal */
.modal { position: fixed; inset: 0; z-index: var(--z-modal); display: flex; align-items: center; justify-content: center; padding: var(--space-4); }
.modal__backdrop { position: absolute; inset: 0; background: var(--color-bg-overlay); backdrop-filter: blur(4px); }
.modal__body {
  position: relative;
  max-width: 480px; width: 100%;
  background: var(--color-white);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-xl);
}
.modal__title { font-size: var(--text-h3); font-weight: var(--weight-bold); margin-bottom: var(--space-2); }
.modal__team { font-size: var(--text-body); color: var(--color-text-secondary); margin-bottom: var(--space-4); }
.modal__scores { background: var(--color-gray-50); border-radius: var(--radius-lg); padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-2); margin-bottom: var(--space-4); }
.modal__score-row { display: flex; justify-content: space-between; font-size: var(--text-body); }
.modal__score-row--avg { border-top: 1px solid var(--color-border-default); padding-top: var(--space-2); margin-top: var(--space-1); font-weight: var(--weight-semibold); }
.modal__score-row--avg strong { color: var(--color-primary); font-size: var(--text-h4); }
.modal__note { font-size: var(--text-caption); color: var(--color-text-tertiary); line-height: var(--leading-relaxed); margin-bottom: var(--space-5); }
.modal__actions { display: flex; gap: var(--space-2); justify-content: flex-end; }
</style>
