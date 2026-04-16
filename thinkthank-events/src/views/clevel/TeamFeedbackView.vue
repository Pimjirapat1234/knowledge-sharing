<script setup lang="ts">
/**
 * Screen #19 — Team Feedback (C-Level · PRD §11.1 #19 · Story M2).
 * Free-text note visible to HR only · aggregate hides identity when < 3 raters.
 */
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { MessageCircle, Save, Lock, Mic } from 'lucide-vue-next'
import { useGroupStore } from '@/stores/group'
import { useUiState } from '@/composables/useUiState'
import { useToast } from '@/composables/useToast'
import AppIcon from '@/components/ui/AppIcon.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'

const { groups } = storeToRefs(useGroupStore())
const ui = useUiState()
const { success } = useToast()

const notes = ref<Record<string, string>>({})
const saving = ref<string | null>(null)

function save(groupId: string) {
  saving.value = groupId
  setTimeout(() => {
    saving.value = null
    success('บันทึก feedback แล้ว', 'HR เท่านั้นเห็น · ไม่แชร์ถึงสมาชิกทีม')
  }, 500)
}
</script>

<template>
  <div class="page">
    <ErrorState v-if="ui.isErrorBlocking.value" :recoverable="false" />
    <ErrorState v-else-if="ui.isError.value" @retry="() => {}" />

    <EmptyState
      v-else-if="ui.isEmpty.value || groups.length === 0"
      :icon="MessageCircle"
      title="ยังไม่มีทีมที่จะให้ feedback"
      message="รอ HR จัดกลุ่มเสร็จก่อน"
    />

    <template v-else-if="ui.isLoading.value">
      <LoadingSkeleton variant="card" :count="3" />
    </template>

    <template v-else>
      <header class="head">
        <div>
          <p class="head__tag">Feedback ส่วนตัวให้ทีม</p>
          <h1 class="head__title">แชร์ความเห็นเพิ่มเติม</h1>
        </div>
        <AppBadge variant="info" size="md">
          <AppIcon :icon="Lock" size="sm" aria-hidden="true" />
          HR เท่านั้นเห็น
        </AppBadge>
      </header>

      <p class="intro">
        ข้อความนี้จะส่งถึง HR เท่านั้น · <strong>ไม่แชร์กับสมาชิกทีม</strong> ·
        aggregate feedback เปิดได้เฉพาะเมื่อมี ≥ 3 C-Level ให้ feedback (anti-identification)
      </p>

      <section class="teams">
        <article v-for="g in groups" :key="g.id" class="team" :style="{ '--c': g.color }">
          <div class="team__head">
            <span class="team__dot" :style="{ backgroundColor: g.color }" aria-hidden="true"></span>
            <h2 class="team__name">{{ g.name }}</h2>
            <span class="team__size">{{ g.memberIds.length }} คน</span>
          </div>

          <textarea
            v-model="notes[g.id]"
            class="team__input"
            rows="4"
            maxlength="500"
            :placeholder="`ความเห็นเพิ่มเติมเกี่ยวกับ ${g.name}...`"
          ></textarea>

          <div class="team__foot">
            <div class="team__meta">
              <span class="team__counter">{{ notes[g.id]?.length ?? 0 }} / 500</span>
              <button type="button" class="voice-btn" disabled title="Coming v1.1">
                <AppIcon :icon="Mic" size="sm" aria-hidden="true" />
                บันทึกเสียง (v1.1)
              </button>
            </div>
            <AppButton
              variant="primary"
              size="md"
              :loading="saving === g.id"
              :disabled="!notes[g.id]"
              @click="save(g.id)"
            >
              <AppIcon :icon="Save" size="sm" aria-hidden="true" />
              บันทึก
            </AppButton>
          </div>
        </article>
      </section>
    </template>
  </div>
</template>

<style scoped>
.page { max-width: 720px; margin: 0 auto; padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-5); padding-bottom: var(--space-12); }
@media (min-width: 768px) { .page { padding: var(--space-8) var(--space-6); } }

.head { display: flex; justify-content: space-between; align-items: flex-end; gap: var(--space-4); flex-wrap: wrap; }
.head__tag { font-size: var(--text-caption); color: var(--color-text-secondary); }
.head__title { font-size: var(--text-h2); font-weight: var(--weight-bold); margin-top: 4px; }

.intro { font-size: var(--text-body-sm); color: var(--color-text-secondary); line-height: var(--leading-relaxed); padding: var(--space-3); background: var(--color-info-subtle); border-radius: var(--radius-md); }

.teams { display: flex; flex-direction: column; gap: var(--space-3); }

.team {
  padding: var(--space-5);
  background: var(--color-white);
  border: 1px solid var(--color-border-light);
  border-left: 4px solid var(--c);
  border-radius: var(--radius-xl);
  display: flex; flex-direction: column; gap: var(--space-3);
}
.team__head { display: flex; align-items: center; gap: var(--space-2); }
.team__dot { width: 14px; height: 14px; border-radius: 50%; }
.team__name { font-size: var(--text-h4); font-weight: var(--weight-bold); flex: 1; }
.team__size { font-size: var(--text-caption); color: var(--color-text-tertiary); }

.team__input {
  width: 100%; padding: var(--space-3);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  font-family: inherit; font-size: var(--text-body);
  resize: vertical; min-height: 100px;
  line-height: var(--leading-relaxed);
}
.team__input:focus { outline: none; border-color: var(--color-border-focus); box-shadow: var(--shadow-focus); }

.team__foot { display: flex; justify-content: space-between; align-items: center; gap: var(--space-3); flex-wrap: wrap; }
.team__meta { display: flex; gap: var(--space-3); align-items: center; }
.team__counter { font-size: var(--text-caption); color: var(--color-text-tertiary); font-family: var(--font-mono); }
.voice-btn { display: inline-flex; align-items: center; gap: 4px; font-size: var(--text-caption); color: var(--color-text-tertiary); opacity: 0.7; }
</style>
