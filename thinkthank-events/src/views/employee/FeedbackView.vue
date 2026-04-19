<script setup lang="ts">
/**
 * Screen #7 — Employee Feedback (PRD §11.1 #7 · FR-FEEDBACK · Story E5).
 * Rating × 4 criteria · free-text · anonymous toggle default-on · 60s target.
 */
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import {
  Shield, MessageSquare, Send, Heart, UtensilsCrossed, ClipboardList, Mic,
} from 'lucide-vue-next'
import { useEventStore } from '@/stores/event'
import { useUiState } from '@/composables/useUiState'
import { useToast } from '@/composables/useToast'
import AppIcon from '@/components/ui/AppIcon.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppToggle from '@/components/ui/AppToggle.vue'
import AppStarRating from '@/components/ui/AppStarRating.vue'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'

const { event } = storeToRefs(useEventStore())
const ui = useUiState()
const { success } = useToast()

const overall = ref(0)
const food = ref(0)
const organization = ref(0)
const content = ref(0)
const comment = ref('')
const anonymous = ref(true) // default on per PRD §15.7

const submitted = ref(false)
const submitting = ref(false)

const ratings = [
  { key: 'overall', label: 'ภาพรวม', desc: 'รวมๆ แล้วเป็นอย่างไร?', icon: Heart, ref: overall },
  { key: 'food', label: 'อาหาร', desc: 'รสชาติ · ปริมาณ · ความหลากหลาย', icon: UtensilsCrossed, ref: food },
  { key: 'organization', label: 'การจัดงาน', desc: 'เวลา · ความลื่นไหล · สถานที่', icon: ClipboardList, ref: organization },
  { key: 'content', label: 'เนื้อหา', desc: 'keynote · workshop · discussion', icon: MessageSquare, ref: content },
]

const canSubmit = computed(() => overall.value > 0)

function submit() {
  if (!canSubmit.value) return
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    submitted.value = true
    success('ขอบคุณมาก!', 'Feedback ช่วยให้ครั้งหน้าดีขึ้น')
  }, 800)
}
</script>

<template>
  <div class="page page--form fb-page">
    <ErrorState v-if="ui.isErrorBlocking.value" :recoverable="false" title="ยังไม่เปิด feedback" message="จะเปิดให้ feedback หลังงานจบ" />
    <ErrorState v-else-if="ui.isError.value" @retry="() => {}" />
    <EmptyState v-else-if="ui.isEmpty.value" title="ยังไม่เปิด feedback" message="เราจะส่งลิงก์หลังงานจบ 1 ชม." />

    <template v-else-if="ui.isLoading.value">
      <LoadingSkeleton variant="line" width="70%" height="28px" />
      <LoadingSkeleton variant="card" :count="4" />
    </template>

    <!-- Success (submitted state) -->
    <section v-else-if="submitted || ui.isSuccess.value" class="done" role="status" aria-live="polite">
      <div class="done__icon"><AppIcon :icon="Heart" size="xl" :stroke-width="0" class="done__heart" /></div>
      <h1 class="done__title">ขอบคุณมาก!</h1>
      <p class="done__lead">Feedback ของคุณช่วยให้ครั้งหน้าดีขึ้น</p>
      <p class="done__note">แก้ไขได้ภายใน 24 ชม. · <a href="#">ดู/แก้ feedback</a></p>
      <AppButton variant="secondary" size="lg" @click="$router.push('/')">กลับหน้าหลัก</AppButton>
    </section>

    <template v-else>
      <header class="head">
        <p class="head__tag">Feedback · ใช้เวลาประมาณ 60 วินาที</p>
        <h1 class="head__title">{{ event.title }}</h1>
        <p class="head__desc">ช่วยเราประเมินงานครั้งนี้ · feedback ทุกช่องได้รับการอ่าน</p>
      </header>

      <!-- Anonymous toggle FIRST — trust builder -->
      <section class="privacy">
        <div class="privacy__body">
          <div class="privacy__lock" aria-hidden="true">
            <AppIcon :icon="Shield" size="lg" />
          </div>
          <div>
            <p class="privacy__title">ตอบนิรนาม</p>
            <p class="privacy__desc">HR จะไม่เห็นชื่อคุณ · feedback รวมแบบ anonymous · <a href="#how">วิธีทำงาน</a></p>
          </div>
        </div>
        <AppToggle v-model="anonymous" />
      </section>

      <!-- Ratings -->
      <section v-for="r in ratings" :key="r.key" class="rate-row">
        <div class="rate-row__label">
          <div class="rate-row__icon" aria-hidden="true">
            <AppIcon :icon="r.icon" size="md" />
          </div>
          <div>
            <p class="rate-row__title">{{ r.label }}</p>
            <p class="rate-row__desc">{{ r.desc }}</p>
          </div>
        </div>
        <div class="rate-row__stars">
          <AppStarRating v-model="r.ref.value" size="lg" :aria-label="r.label" />
          <p class="rate-row__value" v-if="r.ref.value > 0">{{ r.ref.value }}/5</p>
        </div>
      </section>

      <!-- Free text -->
      <section class="section">
        <h2 class="section__title">
          <AppIcon :icon="MessageSquare" size="md" aria-hidden="true" />
          อยากบอกอะไรเพิ่มเติม?
        </h2>
        <p class="section__desc">ไม่บังคับ · แต่ช่วยเราปรับปรุงได้มาก</p>
        <textarea
          v-model="comment"
          class="textarea"
          rows="4"
          maxlength="500"
          placeholder="อะไรดี? อะไรควรปรับปรุง?"
        ></textarea>
        <div class="section__foot">
          <p class="counter">{{ comment.length }} / 500</p>
          <button type="button" class="voice-btn" disabled title="Coming v1.1">
            <AppIcon :icon="Mic" size="sm" aria-hidden="true" />
            บันทึกเสียง (เร็วๆ นี้)
          </button>
        </div>
      </section>

      <!-- Submit -->
      <div class="actions">
        <AppButton variant="secondary" size="lg" @click="$router.back()">ข้าม</AppButton>
        <AppButton
          variant="primary"
          size="lg"
          :disabled="!canSubmit"
          :loading="submitting"
          @click="submit"
        >
          <AppIcon :icon="Send" size="md" aria-hidden="true" />
          ส่ง Feedback
        </AppButton>
      </div>
    </template>
  </div>
</template>

<style scoped>
/* layout via global .page .page--form */
.fb-page { padding-bottom: var(--space-12); }

.head__tag { font-size: var(--text-caption); color: var(--color-text-secondary); }
.head__title { font-size: var(--text-h2); font-weight: var(--weight-bold); margin: var(--space-1) 0 var(--space-2); }
.head__desc { font-size: var(--text-body-sm); color: var(--color-text-secondary); }

.privacy {
  display: flex; align-items: center; justify-content: space-between; gap: var(--space-3);
  padding: var(--space-4);
  background: var(--color-success-subtle);
  border: 1px solid var(--color-success-light);
  border-radius: var(--radius-xl);
}
.privacy__body { display: flex; gap: var(--space-3); align-items: center; }
.privacy__lock {
  width: 40px; height: 40px; border-radius: 50%;
  background: var(--color-success); color: var(--color-white);
  display: inline-flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.privacy__title { font-size: var(--text-body); font-weight: var(--weight-semibold); color: var(--color-success-dark); }
.privacy__desc { font-size: var(--text-caption); color: var(--color-text-secondary); margin-top: 2px; }

.rate-row {
  background: var(--color-white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  padding: var(--space-4);
  display: flex; flex-direction: column; gap: var(--space-3);
}
@media (min-width: 640px) { .rate-row { flex-direction: row; align-items: center; justify-content: space-between; } }

.rate-row__label { display: flex; gap: var(--space-3); align-items: center; }
.rate-row__icon {
  width: 40px; height: 40px; border-radius: var(--radius-lg);
  background: var(--color-primary-subtle); color: var(--color-primary);
  display: inline-flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.rate-row__title { font-size: var(--text-body); font-weight: var(--weight-semibold); }
.rate-row__desc { font-size: var(--text-caption); color: var(--color-text-secondary); }
.rate-row__stars { display: flex; align-items: center; gap: var(--space-3); }
.rate-row__value { font-size: var(--text-body-sm); color: var(--color-text-secondary); font-weight: var(--weight-semibold); }

.section {
  background: var(--color-white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  padding: var(--space-4);
}
.section__title { display: inline-flex; align-items: center; gap: var(--space-2); font-size: var(--text-h4); font-weight: var(--weight-semibold); margin-bottom: var(--space-1); }
.section__desc { font-size: var(--text-body-sm); color: var(--color-text-secondary); margin-bottom: var(--space-3); }
.textarea {
  width: 100%; padding: var(--space-3);
  border: 1px solid var(--color-border-default); border-radius: var(--radius-md);
  font-family: inherit; font-size: var(--text-body);
  resize: vertical; min-height: 100px; line-height: var(--leading-relaxed);
}
.textarea:focus { outline: none; border-color: var(--color-border-focus); box-shadow: var(--shadow-focus); }
.section__foot { display: flex; justify-content: space-between; align-items: center; margin-top: var(--space-2); }
.counter { font-size: var(--text-caption); color: var(--color-text-tertiary); }
.voice-btn {
  display: inline-flex; align-items: center; gap: var(--space-1);
  font-size: var(--text-caption); color: var(--color-text-tertiary);
  padding: var(--space-1) var(--space-2); border-radius: var(--radius-sm);
  opacity: 0.7;
}

.actions {
  display: flex; flex-direction: column-reverse; gap: var(--space-3);
  position: sticky; bottom: 0;
  background: linear-gradient(to top, var(--color-bg-secondary) 70%, transparent);
  padding: var(--space-3) 0;
}
@media (min-width: 640px) { .actions { flex-direction: row; justify-content: flex-end; } }

/* Done state */
.done {
  text-align: center; padding: var(--space-12) var(--space-4);
  max-width: 480px; margin: 0 auto;
}
.done__icon {
  width: 96px; height: 96px; border-radius: 50%;
  background: var(--color-danger-subtle); color: var(--color-danger);
  display: inline-flex; align-items: center; justify-content: center;
  margin-bottom: var(--space-5);
  animation: beat 1s var(--ease-out) infinite alternate;
}
.done__heart :deep(svg) { fill: currentColor; }
@keyframes beat { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
.done__title { font-size: var(--text-h2); font-weight: var(--weight-bold); margin-bottom: var(--space-2); }
.done__lead { font-size: var(--text-body); color: var(--color-text-secondary); margin-bottom: var(--space-4); }
.done__note { font-size: var(--text-caption); color: var(--color-text-tertiary); margin-bottom: var(--space-6); }

@media (prefers-reduced-motion: reduce) {
  .done__icon { animation: none; }
}
</style>
