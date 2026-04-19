<script setup lang="ts">
/**
 * Screen #5 — Menu Selection (PRD §11.1 #5 · FR-MENU · Story E3).
 * ≤60s · menu card + image + tags · allergy free-text (200 chars) · deadline lock.
 */
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { Check, Clock, AlertTriangle, Save, UtensilsCrossed } from 'lucide-vue-next'
import { useMenuStore, TAG_LABEL } from '@/stores/menu'
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

const { menus } = storeToRefs(useMenuStore())
const { event } = storeToRefs(useEventStore())
const ui = useUiState()
const { success } = useToast()

const selectedId = ref<string | null>(null)
const allergy = ref('')
const saving = ref(false)

const deadline = computed(() => formatDateTime(event.value.menuDeadline))

function submit() {
  if (!selectedId.value) return
  saving.value = true
  setTimeout(() => {
    saving.value = false
    success('บันทึกเมนูแล้ว', 'แก้ไขได้จนถึง ' + deadline.value)
  }, 700)
}
</script>

<template>
  <div class="page page--form menu-page">
    <ErrorState v-if="ui.isErrorBlocking.value" :recoverable="false" title="เมนูไม่พร้อม" message="HR ยังไม่ได้ตั้งค่าเมนู · กรุณารอประกาศ" />
    <ErrorState v-else-if="ui.isError.value" title="โหลดเมนูไม่ได้" @retry="() => {}" />
    <EmptyState v-else-if="ui.isEmpty.value" :icon="UtensilsCrossed" title="ยังไม่มีเมนูในงานนี้" message="HR จะเปิดให้เลือกเมนูก่อนวันงาน 7 วัน · รอการแจ้งเตือน" />

    <template v-else-if="ui.isLoading.value">
      <LoadingSkeleton variant="line" width="60%" height="32px" />
      <LoadingSkeleton variant="card" :count="3" />
    </template>

    <template v-else>
      <header class="head">
        <p class="head__tag">เลือกเมนูอาหาร</p>
        <h1 class="head__title">{{ event.title }}</h1>
        <div class="head__deadline" :class="{ 'is-warning': ui.isSuccess.value }">
          <AppIcon :icon="Clock" size="sm" aria-hidden="true" />
          <span>ปิดรับ {{ deadline }}</span>
        </div>
      </header>

      <section class="menu-list" role="radiogroup" aria-label="เลือกเมนู">
        <label
          v-for="m in menus"
          :key="m.id"
          class="menu-card"
          :class="{ 'is-selected': selectedId === m.id }"
        >
          <input type="radio" :value="m.id" v-model="selectedId" class="menu-card__input" />
          <div class="menu-card__img">
            <img :src="m.imageUrl" :alt="m.name" loading="lazy" />
            <div v-if="selectedId === m.id" class="menu-card__check" aria-hidden="true">
              <AppIcon :icon="Check" size="md" :stroke-width="3" />
            </div>
          </div>
          <div class="menu-card__body">
            <h3 class="menu-card__name">{{ m.name }}</h3>
            <p class="menu-card__desc">{{ m.description }}</p>
            <div class="menu-card__tags">
              <AppBadge v-for="t in m.tags" :key="t" variant="neutral" size="sm">
                {{ TAG_LABEL[t] }}
              </AppBadge>
            </div>
            <p v-if="ui.isSuccess.value" class="menu-card__count">เลือกแล้ว {{ m.count }} คน</p>
          </div>
        </label>
      </section>

      <!-- Partial state example: show loading for popularity counts -->
      <div v-if="ui.isPartial.value" class="partial-note">
        <LoadingSkeleton variant="line" width="40%" height="12px" />
        <p>กำลังนับจำนวนคนที่เลือกเมนูแต่ละเมนู...</p>
      </div>

      <section class="allergy" role="group" aria-labelledby="allergy-title">
        <h2 id="allergy-title" class="allergy__title">
          <AppIcon :icon="AlertTriangle" size="md" aria-hidden="true" />
          แพ้อาหาร / ข้อจำกัดอื่น
        </h2>
        <p class="allergy__desc">บอก catering ให้เตรียมพิเศษ · ข้อมูลนี้ส่งเฉพาะทีม catering · HR เห็นเฉพาะแจ้งเตือน ไม่ระบุชื่อ</p>
        <textarea
          v-model="allergy"
          class="allergy__input"
          rows="3"
          maxlength="200"
          placeholder="เช่น แพ้กุ้ง · ไม่ทานเนื้อวัว · ทานวีแกน"
        ></textarea>
        <p class="allergy__counter">{{ allergy.length }} / 200</p>
      </section>

      <div class="actions">
        <AppButton variant="secondary" size="lg" @click="$router.back()">ยกเลิก</AppButton>
        <AppButton
          variant="primary"
          size="lg"
          :disabled="!selectedId"
          :loading="saving"
          @click="submit"
        >
          <AppIcon :icon="Save" size="md" aria-hidden="true" />
          บันทึกเมนู
        </AppButton>
      </div>
    </template>
  </div>
</template>

<style scoped>
/* layout via global .page .page--form */
.menu-page { padding-bottom: var(--space-12); }

.head__tag { font-size: var(--text-caption); text-transform: uppercase; letter-spacing: var(--tracking-wider); color: var(--color-primary); font-weight: var(--weight-semibold); }
.head__title { font-size: var(--text-h2); font-weight: var(--weight-bold); margin: var(--space-1) 0 var(--space-3); }
.head__deadline {
  display: inline-flex; align-items: center; gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background: var(--color-warning-subtle); color: var(--color-warning-dark);
  border-radius: var(--radius-full);
  font-size: var(--text-caption); font-weight: var(--weight-medium);
}

.menu-list { display: grid; grid-template-columns: 1fr; gap: var(--space-3); }

.menu-card {
  display: flex; gap: var(--space-4);
  padding: var(--space-3);
  background: var(--color-white);
  border: 2px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  cursor: pointer;
  transition: all var(--duration-fast);
}
.menu-card:hover { border-color: var(--color-primary-muted); }
.menu-card.is-selected { border-color: var(--color-primary); background: var(--color-primary-subtle); box-shadow: var(--shadow-md); }
.menu-card__input { position: absolute; opacity: 0; pointer-events: none; }
.menu-card__input:focus-visible + .menu-card__img { box-shadow: var(--shadow-focus); }

.menu-card__img { position: relative; width: 100px; height: 100px; border-radius: var(--radius-lg); overflow: hidden; flex-shrink: 0; }
@media (min-width: 640px) { .menu-card__img { width: 140px; height: 140px; } }
.menu-card__img img { width: 100%; height: 100%; object-fit: cover; display: block; }
.menu-card__check {
  position: absolute; top: var(--space-2); right: var(--space-2);
  width: 28px; height: 28px;
  background: var(--color-primary); color: var(--color-white);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  box-shadow: var(--shadow-md);
}

.menu-card__body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: var(--space-2); }
.menu-card__name { font-size: var(--text-h4); font-weight: var(--weight-semibold); }
.menu-card__desc { font-size: var(--text-body-sm); color: var(--color-text-secondary); line-height: var(--leading-relaxed); }
.menu-card__tags { display: flex; flex-wrap: wrap; gap: var(--space-1); }
.menu-card__count {
  font-size: var(--text-caption);
  color: var(--color-text-tertiary);
  margin-top: auto;
}

.partial-note {
  display: flex; align-items: center; gap: var(--space-3);
  padding: var(--space-3);
  background: var(--color-info-subtle);
  border-radius: var(--radius-md);
  font-size: var(--text-caption);
  color: var(--color-info-dark);
}

.allergy {
  background: var(--color-warning-subtle);
  border: 1px solid var(--color-warning-light);
  border-radius: var(--radius-xl);
  padding: var(--space-5);
}
.allergy__title {
  display: inline-flex; align-items: center; gap: var(--space-2);
  font-size: var(--text-h4); font-weight: var(--weight-semibold);
  color: var(--color-warning-dark); margin-bottom: var(--space-2);
}
.allergy__desc { font-size: var(--text-caption); color: var(--color-text-secondary); margin-bottom: var(--space-3); line-height: var(--leading-relaxed); }
.allergy__input {
  width: 100%; padding: var(--space-3);
  border: 1px solid var(--color-border-default); border-radius: var(--radius-md);
  font-family: inherit; font-size: var(--text-body);
  background: var(--color-white); resize: vertical; min-height: 80px;
}
.allergy__input:focus { outline: none; border-color: var(--color-warning); box-shadow: 0 0 0 3px rgba(255,159,67,0.3); }
.allergy__counter { font-size: var(--text-caption); color: var(--color-text-tertiary); text-align: right; margin-top: var(--space-1); }

.actions {
  display: flex; flex-direction: column-reverse; gap: var(--space-3);
  position: sticky; bottom: 0;
  background: linear-gradient(to top, var(--color-bg-secondary) 70%, transparent);
  padding: var(--space-3) 0;
}
@media (min-width: 640px) { .actions { flex-direction: row; justify-content: flex-end; } }
</style>
