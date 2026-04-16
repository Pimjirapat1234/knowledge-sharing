<script setup lang="ts">
/**
 * Screen #13 — Theme Setup (PRD §11.1 #13 · Story H3).
 * CRUD theme options · deadline picker · live/hold-results toggle.
 */
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { Plus, Trash2, Image as ImageIcon, Calendar, Eye, EyeOff, Save } from 'lucide-vue-next'
import { useThemeStore } from '@/stores/theme'
import { useEventStore } from '@/stores/event'
import { useUiState } from '@/composables/useUiState'
import { useToast } from '@/composables/useToast'
import AppIcon from '@/components/ui/AppIcon.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppToggle from '@/components/ui/AppToggle.vue'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'

const themeStore = useThemeStore()
const { themes, resultsVisible } = storeToRefs(themeStore)
const { event } = storeToRefs(useEventStore())
const ui = useUiState()
const { success, warning } = useToast()

const deadline = ref(event.value.votingDeadline)

function addTheme() {
  if (themes.value.length >= 6) {
    warning('เกินจำนวนสูงสุด', 'ตัวเลือกสูงสุดคือ 6 ธีม')
    return
  }
  themes.value.push({ id: `t${Date.now()}`, title: 'ธีมใหม่', description: '', imageUrl: '', votes: 0 })
}

function removeTheme(id: string) {
  if (themes.value.length <= 2) {
    warning('น้อยเกินไป', 'ต้องมีอย่างน้อย 2 ธีม')
    return
  }
  if (confirm('ลบธีมนี้? · โหวตที่ได้รับมาจะหายไปด้วย')) {
    themes.value = themes.value.filter(t => t.id !== id)
  }
}

function save() { success('บันทึกแล้ว', 'ตั้งค่าโหวตถูกเผยแพร่ถึงพนักงานทันที') }
</script>

<template>
  <div class="page">
    <ErrorState v-if="ui.isErrorBlocking.value" :recoverable="false" />
    <ErrorState v-else-if="ui.isError.value" @retry="() => {}" />

    <header class="head">
      <div>
        <p class="head__tag">ตั้งค่าโหวตธีม</p>
        <h1 class="head__title">Theme Voting Setup</h1>
        <p class="head__desc">ตั้งค่า 2-6 ตัวเลือก · ปักหมุด deadline · เลือกเปิดเผยผลหรือรอจนปิด</p>
      </div>
      <AppButton variant="primary" size="md" @click="save">
        <AppIcon :icon="Save" size="sm" aria-hidden="true" />
        บันทึก
      </AppButton>
    </header>

    <!-- Settings -->
    <section class="settings">
      <div class="setting">
        <div class="setting__body">
          <h3 class="setting__title">
            <AppIcon :icon="resultsVisible ? Eye : EyeOff" size="md" aria-hidden="true" />
            แสดงผลโหวต real-time
          </h3>
          <p class="setting__desc">พนักงานเห็น % โหวตแต่ละธีมทันทีหลังกดโหวต · ถ้าปิด จะแสดงเมื่อถึง deadline</p>
        </div>
        <AppToggle v-model="resultsVisible" />
      </div>

      <div class="setting">
        <div class="setting__body">
          <h3 class="setting__title">
            <AppIcon :icon="Calendar" size="md" aria-hidden="true" />
            Deadline โหวต
          </h3>
          <p class="setting__desc">ปักหมุด · พนักงานเห็นคำเตือน 24 ชม. ก่อนถึง</p>
        </div>
        <input v-model="deadline" type="datetime-local" class="date-input" />
      </div>
    </section>

    <!-- Theme options -->
    <section>
      <div class="sect-head">
        <h2 class="sect-head__title">ตัวเลือกธีม <span>({{ themes.length }}/6)</span></h2>
        <AppButton variant="secondary" size="sm" @click="addTheme">
          <AppIcon :icon="Plus" size="sm" aria-hidden="true" />
          เพิ่มธีม
        </AppButton>
      </div>

      <EmptyState
        v-if="ui.isEmpty.value || themes.length === 0"
        title="ยังไม่มีตัวเลือกธีม"
        message="เพิ่มธีมอย่างน้อย 2 ตัวเลือกเพื่อเริ่มเปิดโหวต"
        cta-label="เพิ่มธีมแรก"
        @cta="addTheme"
      />

      <template v-else-if="ui.isLoading.value">
        <LoadingSkeleton variant="card" :count="3" />
      </template>

      <div v-else class="theme-grid">
        <article v-for="(t, idx) in themes" :key="t.id" class="theme-edit">
          <div class="theme-edit__head">
            <span class="theme-edit__num">ตัวเลือกที่ {{ idx + 1 }}</span>
            <button class="theme-edit__del" :aria-label="`ลบธีม ${t.title}`" @click="removeTheme(t.id)">
              <AppIcon :icon="Trash2" size="sm" />
            </button>
          </div>

          <div class="theme-edit__img" v-if="t.imageUrl">
            <img :src="t.imageUrl" :alt="t.title" />
            <button class="theme-edit__img-btn">
              <AppIcon :icon="ImageIcon" size="sm" aria-hidden="true" />
              เปลี่ยนรูป
            </button>
          </div>
          <button v-else class="theme-edit__upload">
            <AppIcon :icon="ImageIcon" size="lg" aria-hidden="true" />
            <span>อัปโหลดรูป</span>
            <small>JPG/PNG · แนะนำ 800×450</small>
          </button>

          <div class="field">
            <label class="field__label">ชื่อธีม</label>
            <input v-model="t.title" type="text" class="input" maxlength="60" />
          </div>

          <div class="field">
            <label class="field__label">คำอธิบาย</label>
            <textarea v-model="t.description" class="input" rows="2" maxlength="160"></textarea>
          </div>

          <p v-if="t.votes > 0" class="theme-edit__votes">
            <strong>{{ t.votes }}</strong> เสียง · {{ Math.round((t.votes / themes.reduce((n, x) => n + x.votes, 0)) * 100) }}%
          </p>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page { max-width: var(--size-content-max); padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-5); }
@media (min-width: 768px) { .page { padding: var(--space-6); } }

.head { display: flex; justify-content: space-between; align-items: flex-end; gap: var(--space-4); flex-wrap: wrap; }
.head__tag { font-size: var(--text-caption); color: var(--color-text-secondary); }
.head__title { font-size: var(--text-h2); font-weight: var(--weight-bold); margin: 4px 0; }
.head__desc { font-size: var(--text-body-sm); color: var(--color-text-secondary); max-width: 600px; }

.settings {
  background: var(--color-white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  padding: var(--space-5);
  display: flex; flex-direction: column; gap: var(--space-4);
}
.setting { display: flex; justify-content: space-between; align-items: center; gap: var(--space-4); flex-wrap: wrap; }
.setting__title { display: inline-flex; align-items: center; gap: var(--space-2); font-size: var(--text-body); font-weight: var(--weight-semibold); margin-bottom: 2px; }
.setting__desc { font-size: var(--text-caption); color: var(--color-text-secondary); max-width: 440px; }
.date-input {
  padding: var(--space-2) var(--space-3);
  min-height: var(--size-input-md);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  font-family: inherit;
}

.sect-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-3); }
.sect-head__title { font-size: var(--text-h4); font-weight: var(--weight-semibold); }
.sect-head__title span { font-size: var(--text-body-sm); color: var(--color-text-tertiary); font-weight: var(--weight-regular); }

.theme-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: var(--space-4); }

.theme-edit {
  background: var(--color-white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  padding: var(--space-4);
  display: flex; flex-direction: column; gap: var(--space-3);
}
.theme-edit__head { display: flex; justify-content: space-between; align-items: center; }
.theme-edit__num { font-size: var(--text-caption); text-transform: uppercase; letter-spacing: var(--tracking-wide); color: var(--color-text-tertiary); font-weight: var(--weight-semibold); }
.theme-edit__del {
  width: 32px; height: 32px; border-radius: var(--radius-md);
  color: var(--color-text-tertiary);
  display: inline-flex; align-items: center; justify-content: center;
}
.theme-edit__del:hover { background: var(--color-danger-subtle); color: var(--color-danger); }

.theme-edit__img { position: relative; aspect-ratio: 16/9; border-radius: var(--radius-lg); overflow: hidden; }
.theme-edit__img img { width: 100%; height: 100%; object-fit: cover; }
.theme-edit__img-btn {
  position: absolute; bottom: var(--space-2); right: var(--space-2);
  display: inline-flex; align-items: center; gap: var(--space-1);
  padding: var(--space-1) var(--space-3); min-height: 32px;
  background: rgba(0,0,0,0.6); color: var(--color-white);
  border-radius: var(--radius-md);
  font-size: var(--text-caption);
}

.theme-edit__upload {
  aspect-ratio: 16/9;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: var(--space-2);
  background: var(--color-gray-50);
  border: 2px dashed var(--color-border-default);
  border-radius: var(--radius-lg);
  color: var(--color-text-tertiary);
  font-size: var(--text-body-sm);
}
.theme-edit__upload:hover { border-color: var(--color-primary); color: var(--color-primary); }
.theme-edit__upload small { font-size: var(--text-caption); }

.field { display: flex; flex-direction: column; gap: var(--space-1); }
.field__label { font-size: var(--text-caption); font-weight: var(--weight-medium); color: var(--color-text-secondary); }
.input {
  width: 100%; padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  font-size: var(--text-body-sm); font-family: inherit;
  min-height: var(--size-input-md);
}
.input:focus { outline: none; border-color: var(--color-border-focus); box-shadow: var(--shadow-focus); }

.theme-edit__votes { font-size: var(--text-caption); color: var(--color-text-secondary); padding-top: var(--space-2); border-top: 1px solid var(--color-border-light); }
.theme-edit__votes strong { color: var(--color-primary); font-size: var(--text-body); }
</style>
