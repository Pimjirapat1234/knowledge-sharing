<script setup lang="ts">
/**
 * Screen #16 — Queue Randomizer (PRD §11.1 #16 · Story H6 · FR-QUEUE).
 * Slot-machine animation 3-5s · fullscreen mode · lock after.
 */
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { Dices, Maximize2, Lock, Unlock, RotateCcw, Play } from 'lucide-vue-next'
import { useGroupStore } from '@/stores/group'
import { useUiState } from '@/composables/useUiState'
import { useToast } from '@/composables/useToast'
import AppIcon from '@/components/ui/AppIcon.vue'
import AppButton from '@/components/ui/AppButton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'

const { groups, locked } = storeToRefs(useGroupStore())
const ui = useUiState()
const { success } = useToast()

const rolling = ref(false)
const revealed = ref(groups.value.every(g => g.queueOrder !== undefined))
const fullscreen = ref(false)

const sortedByQueue = computed(() =>
  [...groups.value].sort((a, b) => (a.queueOrder ?? 99) - (b.queueOrder ?? 99)),
)

function randomize() {
  if (locked.value) return
  rolling.value = true
  revealed.value = false
  setTimeout(() => {
    const shuffled = [...groups.value].sort(() => Math.random() - 0.5)
    shuffled.forEach((g, i) => { g.queueOrder = i + 1 })
    rolling.value = false
    revealed.value = true
  }, 3500)
}

function toggleLock() {
  locked.value = !locked.value
  success(locked.value ? 'Lock คิวแล้ว' : 'ปลดล็อก', locked.value ? 'คิวนี้ final · แจ้งทีมแล้ว' : 'สามารถสุ่มใหม่ได้')
}

function reset() {
  if (!confirm('รีเซ็ตคิว? · ทุกทีมกลับเป็น pending')) return
  groups.value.forEach(g => { g.queueOrder = undefined })
  revealed.value = false
}
</script>

<template>
  <div class="page" :class="{ 'is-fullscreen': fullscreen }">
    <ErrorState v-if="ui.isErrorBlocking.value" :recoverable="false" />
    <ErrorState v-else-if="ui.isError.value" @retry="() => {}" />

    <EmptyState
      v-else-if="ui.isEmpty.value || groups.length === 0"
      :icon="Dices"
      title="ยังไม่มีกลุ่ม"
      message="จัดกลุ่มก่อนที่จะเริ่มสุ่มคิว · ไปหน้าจัดกลุ่มเพื่อสร้างทีม"
      cta-label="ไปหน้าจัดกลุ่ม"
    />

    <template v-else>
      <header class="head">
        <div>
          <p class="head__tag">สุ่มคิวนำเสนอ</p>
          <h1 class="head__title">Queue Randomizer</h1>
        </div>
        <div class="head__actions">
          <AppButton variant="secondary" size="md" @click="fullscreen = !fullscreen">
            <AppIcon :icon="Maximize2" size="sm" aria-hidden="true" />
            {{ fullscreen ? 'ย่อ' : 'Big-screen mode' }}
          </AppButton>
          <AppButton v-if="revealed" variant="secondary" size="md" :disabled="locked" @click="reset">
            <AppIcon :icon="RotateCcw" size="sm" aria-hidden="true" />
            รีเซ็ต
          </AppButton>
          <AppButton v-if="revealed" :variant="locked ? 'primary' : 'destructive'" size="md" @click="toggleLock">
            <AppIcon :icon="locked ? Unlock : Lock" size="sm" aria-hidden="true" />
            {{ locked ? 'ปลดล็อก' : 'Lock คิว' }}
          </AppButton>
        </div>
      </header>

      <!-- Big display area -->
      <section class="stage">
        <div v-if="!revealed && !rolling" class="stage__idle">
          <AppIcon :icon="Dices" size="xl" class="stage__dice" />
          <h2>พร้อมสุ่มคิวนำเสนอ</h2>
          <p>{{ groups.length }} ทีม · เวลาสุ่ม 3.5 วินาที · มี Big-screen mode สำหรับฉายในห้อง</p>
          <AppButton variant="primary" size="xl" @click="randomize">
            <AppIcon :icon="Play" size="md" aria-hidden="true" />
            เริ่มสุ่ม
          </AppButton>
        </div>

        <div v-else-if="rolling" class="stage__rolling">
          <div class="slot" v-for="g in groups" :key="g.id">
            <div class="slot__reel">
              <span v-for="i in 10" :key="i" :style="{ color: g.color }">
                #{{ Math.floor(Math.random() * groups.length) + 1 }}
              </span>
            </div>
          </div>
          <p class="stage__note">กำลังสุ่มคิว...</p>
        </div>

        <div v-else class="stage__result">
          <ol class="queue">
            <li v-for="g in sortedByQueue" :key="g.id" class="queue__item" :style="{ '--c': g.color }">
              <div class="queue__rank">{{ g.queueOrder }}</div>
              <div class="queue__info">
                <p class="queue__name">{{ g.name }}</p>
                <p class="queue__sub">{{ g.memberIds.length }} คน</p>
              </div>
              <span v-if="g.queueOrder === 1" class="queue__badge">เริ่มก่อน</span>
            </li>
          </ol>
          <p v-if="locked" class="stage__note">
            <AppIcon :icon="Lock" size="sm" aria-hidden="true" />
            คิวถูก lock · ส่งแจ้งเตือนทีมแล้ว
          </p>
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
.page { max-width: 960px; margin: 0 auto; padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-5); }
@media (min-width: 768px) { .page { padding: var(--space-6); } }
.page.is-fullscreen {
  position: fixed; inset: 0; z-index: var(--z-modal);
  background: var(--color-secondary);
  color: var(--color-white);
  max-width: none; padding: var(--space-8); overflow: auto;
}
.page.is-fullscreen .head__title { color: var(--color-white); }

.head { display: flex; justify-content: space-between; align-items: flex-end; gap: var(--space-4); flex-wrap: wrap; }
.head__tag { font-size: var(--text-caption); color: var(--color-text-secondary); }
.head__title { font-size: var(--text-h2); font-weight: var(--weight-bold); margin-top: 4px; }
.head__actions { display: flex; gap: var(--space-2); flex-wrap: wrap; }

.stage {
  background: var(--color-white);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  min-height: 400px;
  display: flex; align-items: center; justify-content: center;
}
.is-fullscreen .stage { background: transparent; }

.stage__idle { text-align: center; display: flex; flex-direction: column; align-items: center; gap: var(--space-3); }
.stage__dice {
  color: var(--color-primary);
  animation: wiggle 2s ease-in-out infinite;
}
@keyframes wiggle {
  0%, 100% { transform: rotate(0); }
  25% { transform: rotate(-15deg); }
  75% { transform: rotate(15deg); }
}
.stage__idle h2 { font-size: var(--text-h2); font-weight: var(--weight-bold); }
.stage__idle p { color: var(--color-text-secondary); max-width: 420px; line-height: var(--leading-relaxed); }

.stage__rolling {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: var(--space-3);
  width: 100%; max-width: 600px;
}
.slot {
  height: 100px; overflow: hidden;
  background: var(--color-gray-100);
  border-radius: var(--radius-lg);
  display: flex; align-items: center; justify-content: center;
  position: relative;
}
.slot__reel {
  display: flex; flex-direction: column; gap: 4px;
  animation: spin-reel 0.15s linear infinite;
  font-size: var(--text-h2);
  font-weight: var(--weight-bold);
  font-family: var(--font-mono);
}
@keyframes spin-reel {
  0% { transform: translateY(0); }
  100% { transform: translateY(-40px); }
}
.stage__note { color: var(--color-text-secondary); font-size: var(--text-body-sm); margin-top: var(--space-3); display: inline-flex; align-items: center; gap: var(--space-2); justify-content: center; }

.stage__result { width: 100%; }
.queue { list-style: none; display: flex; flex-direction: column; gap: var(--space-3); }
.queue__item {
  display: flex; align-items: center; gap: var(--space-4);
  padding: var(--space-4);
  background: var(--color-white);
  border: 2px solid var(--c);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  animation: slide-in 0.4s var(--ease-out) both;
  animation-delay: calc(var(--d, 0) * 100ms);
}
.is-fullscreen .queue__item { background: rgba(255,255,255,0.1); }
@keyframes slide-in {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}
.queue__rank {
  width: 56px; height: 56px; border-radius: 50%;
  background: var(--c); color: var(--color-white);
  display: inline-flex; align-items: center; justify-content: center;
  font-size: var(--text-h2); font-weight: var(--weight-bold);
  flex-shrink: 0;
}
.queue__info { flex: 1; }
.queue__name { font-size: var(--text-h3); font-weight: var(--weight-bold); }
.is-fullscreen .queue__name { color: var(--color-white); }
.queue__sub { font-size: var(--text-caption); color: var(--color-text-secondary); }
.queue__badge {
  padding: var(--space-1) var(--space-3);
  background: var(--color-warning);
  color: var(--color-white);
  border-radius: var(--radius-full);
  font-size: var(--text-caption);
  font-weight: var(--weight-semibold);
}

@media (prefers-reduced-motion: reduce) {
  .stage__dice, .slot__reel, .queue__item { animation: none; }
  .slot__reel { transform: none; font-size: var(--text-h3); }
}
</style>
