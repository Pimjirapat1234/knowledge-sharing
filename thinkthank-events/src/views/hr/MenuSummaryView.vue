<script setup lang="ts">
/**
 * Screen #12 — Menu Summary (PRD §11.1 #12 · Story H2).
 * Aggregate chart · allergy list (red highlights) · export สำหรับ catering.
 */
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { Download, AlertTriangle, ChefHat, Flame } from 'lucide-vue-next'
import { useMenuStore, TAG_LABEL } from '@/stores/menu'
import { useParticipantStore } from '@/stores/participant'
import { useUiState } from '@/composables/useUiState'
import { useToast } from '@/composables/useToast'
import AppIcon from '@/components/ui/AppIcon.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'

const { menus } = storeToRefs(useMenuStore())
const { participants } = storeToRefs(useParticipantStore())
const ui = useUiState()
const { success } = useToast()

const total = computed(() => menus.value.reduce((n, m) => n + m.count, 0))
const maxCount = computed(() => Math.max(...menus.value.map(m => m.count), 1))
const allergyList = computed(() => participants.value.filter(p => p.allergy))

function exportForCatering() {
  success('Export สำหรับ catering', 'ส่งไฟล์ CSV ไปที่อีเมล + แยก allergy list')
}
</script>

<template>
  <div class="page">
    <ErrorState v-if="ui.isErrorBlocking.value" :recoverable="false" />
    <ErrorState v-else-if="ui.isError.value" @retry="() => {}" />
    <EmptyState v-else-if="ui.isEmpty.value" :icon="ChefHat" title="ยังไม่มีเมนู" message="ตั้งค่าเมนูก่อนเริ่มรับลงทะเบียน" cta-label="เพิ่มเมนู" />

    <template v-else-if="ui.isLoading.value">
      <LoadingSkeleton variant="line" width="50%" height="32px" />
      <LoadingSkeleton variant="card" :count="3" />
    </template>

    <template v-else>
      <header class="head">
        <div>
          <p class="head__tag">สรุปเมนูอาหาร</p>
          <h1 class="head__title">{{ total }} <span>รายการ</span></h1>
        </div>
        <AppButton variant="primary" size="md" @click="exportForCatering">
          <AppIcon :icon="Download" size="sm" aria-hidden="true" />
          Export สำหรับ catering
        </AppButton>
      </header>

      <!-- Menu counts -->
      <section class="menus">
        <h2 class="sect-title">จำนวนแต่ละเมนู</h2>
        <div class="menu-list">
          <article v-for="m in menus" :key="m.id" class="menu-row">
            <img :src="m.imageUrl" :alt="m.name" class="menu-row__img" />
            <div class="menu-row__body">
              <div class="menu-row__head">
                <h3 class="menu-row__name">{{ m.name }}</h3>
                <span class="menu-row__count">{{ m.count }}</span>
              </div>
              <div class="menu-row__bar">
                <div class="menu-row__fill" :style="`width: ${(m.count / maxCount) * 100}%`"></div>
              </div>
              <div class="menu-row__tags">
                <AppBadge v-for="t in m.tags" :key="t" variant="neutral" size="sm">{{ TAG_LABEL[t] }}</AppBadge>
              </div>
            </div>
          </article>
        </div>
      </section>

      <!-- Allergy alert -->
      <section class="allergy">
        <div class="allergy__head">
          <div class="allergy__icon"><AppIcon :icon="Flame" size="lg" /></div>
          <div>
            <h2 class="allergy__title">รายการแพ้อาหาร / ข้อจำกัด</h2>
            <p class="allergy__desc">{{ allergyList.length }} คน · ส่งต่อ catering พร้อมใบ brief</p>
          </div>
        </div>

        <EmptyState
          v-if="allergyList.length === 0"
          :icon="ChefHat"
          title="ไม่มีการแจ้งแพ้อาหาร"
          message="ทุกคนสามารถทานเมนูมาตรฐานได้"
        />

        <ul v-else class="allergy__list">
          <li v-for="p in allergyList" :key="p.id" class="allergy-item">
            <AppIcon :icon="AlertTriangle" size="sm" aria-hidden="true" />
            <div>
              <strong>{{ p.name }}</strong>
              <span class="allergy-item__dept">· {{ p.department }}</span>
              <p class="allergy-item__text">{{ p.allergy }}</p>
            </div>
          </li>
        </ul>
      </section>

      <!-- Privacy -->
      <aside class="privacy">
        <AppIcon :icon="AlertTriangle" size="sm" aria-hidden="true" />
        <p>
          Food allergy เป็น <strong>sensitive data</strong> — audit log จะบันทึกการ export ทุกครั้งพร้อม purpose
          · ส่งข้อมูลถึง catering แบบ aggregate (ไม่มีชื่อ) เว้นแต่กรณี severe allergy
        </p>
      </aside>
    </template>
  </div>
</template>

<style scoped>
.page { max-width: 960px; padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-5); }
@media (min-width: 768px) { .page { padding: var(--space-6); } }

.head { display: flex; justify-content: space-between; align-items: flex-end; gap: var(--space-4); flex-wrap: wrap; }
.head__tag { font-size: var(--text-caption); color: var(--color-text-secondary); }
.head__title { font-size: var(--text-h2); font-weight: var(--weight-bold); }
.head__title span { font-size: var(--text-body); color: var(--color-text-tertiary); font-weight: var(--weight-regular); }

.sect-title { font-size: var(--text-h4); font-weight: var(--weight-semibold); margin-bottom: var(--space-3); }

.menu-list { display: flex; flex-direction: column; gap: var(--space-3); }
.menu-row {
  display: flex; gap: var(--space-4);
  padding: var(--space-4);
  background: var(--color-white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
}
.menu-row__img { width: 64px; height: 64px; border-radius: var(--radius-lg); object-fit: cover; flex-shrink: 0; }
.menu-row__body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: var(--space-2); }
.menu-row__head { display: flex; justify-content: space-between; align-items: center; gap: var(--space-2); }
.menu-row__name { font-size: var(--text-body); font-weight: var(--weight-semibold); }
.menu-row__count { font-size: var(--text-h3); font-weight: var(--weight-bold); color: var(--color-primary); }
.menu-row__bar { height: 8px; background: var(--color-gray-200); border-radius: var(--radius-full); overflow: hidden; }
.menu-row__fill { height: 100%; background: var(--color-primary); border-radius: var(--radius-full); }
.menu-row__tags { display: flex; flex-wrap: wrap; gap: 4px; }

.allergy {
  background: var(--color-danger-subtle);
  border: 1px solid var(--color-danger-light);
  border-radius: var(--radius-xl);
  padding: var(--space-5);
}
.allergy__head { display: flex; gap: var(--space-3); align-items: center; margin-bottom: var(--space-4); }
.allergy__icon {
  width: 48px; height: 48px; border-radius: var(--radius-lg);
  background: var(--color-danger); color: var(--color-white);
  display: inline-flex; align-items: center; justify-content: center;
}
.allergy__title { font-size: var(--text-h4); font-weight: var(--weight-semibold); color: var(--color-danger-dark); }
.allergy__desc { font-size: var(--text-caption); color: var(--color-text-secondary); }

.allergy__list { list-style: none; display: flex; flex-direction: column; gap: var(--space-2); }
.allergy-item {
  display: flex; gap: var(--space-3); align-items: flex-start;
  padding: var(--space-3);
  background: var(--color-white);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--color-danger);
  color: var(--color-danger-dark);
}
.allergy-item strong { color: var(--color-text-primary); }
.allergy-item__dept { font-size: var(--text-caption); color: var(--color-text-tertiary); margin-left: 4px; }
.allergy-item__text { font-size: var(--text-body-sm); color: var(--color-text-secondary); margin-top: 4px; }

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
