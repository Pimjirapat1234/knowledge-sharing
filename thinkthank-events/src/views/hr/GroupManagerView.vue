<script setup lang="ts">
/**
 * Screen #15 — Group Manager (PRD §11.1 #15 · Story H5 · FR-GROUP).
 * Drag-drop grid · auto-balance · manual adjust · lock + notify.
 * Simplified drag-drop using HTML5 API.
 */
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import {
  Shuffle, Lock, Unlock, Users, Plus, Send, UserPlus, Check,
  Camera, AlertTriangle, ArrowRight,
} from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import { useGroupStore } from '@/stores/group'
import { useParticipantStore } from '@/stores/participant'
import { useEventStore } from '@/stores/event'
import { useUiState } from '@/composables/useUiState'
import { useToast } from '@/composables/useToast'
import AppIcon from '@/components/ui/AppIcon.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'

const groupStore = useGroupStore()
const { groups, locked } = storeToRefs(groupStore)
const participantStore = useParticipantStore()
const { participants, checkedIn } = storeToRefs(participantStore)
const { event } = storeToRefs(useEventStore())
const ui = useUiState()
const { success, warning } = useToast()

const dragId = ref<string | null>(null)

/** GATE: only checked-in participants are eligible for groups */
const eligible = computed(() => checkedIn.value)
const totalConfirmed = computed(() => participants.value.filter(p => p.status === 'confirmed').length)
const checkInPct = computed(() => Math.round((eligible.value.length / Math.max(totalConfirmed.value, 1)) * 100))

/** If someone is in a group but NOT checked in → they must be removed */
const ineligibleInGroups = computed(() => {
  const inGroups: string[] = []
  groups.value.forEach(g => {
    g.memberIds.forEach(id => {
      const p = participants.value.find(x => x.id === id)
      if (!p?.checkedInAt) inGroups.push(id)
    })
  })
  return inGroups
})

const unassigned = computed(() =>
  eligible.value.filter(p => !groups.value.some(g => g.memberIds.includes(p.id))),
)

function findParticipant(id: string) { return participants.value.find(p => p.id === id) }

function onDragStart(pid: string, e: DragEvent) {
  if (locked.value) { e.preventDefault(); return }
  dragId.value = pid
  e.dataTransfer?.setData('text/plain', pid)
}
function onDrop(gid: string | null, e: DragEvent) {
  e.preventDefault()
  if (locked.value || !dragId.value) return
  const pid = dragId.value
  // remove from all groups
  groups.value.forEach(g => { g.memberIds = g.memberIds.filter(id => id !== pid) })
  if (gid) {
    const g = groups.value.find(x => x.id === gid)
    g?.memberIds.push(pid)
  }
  dragId.value = null
}
function onDragOver(e: DragEvent) { if (!locked.value) e.preventDefault() }

function autoBalance() {
  if (eligible.value.length === 0) {
    warning('ยังไม่มีคนเช็คอิน', 'ให้ HR scan QR ก่อนจัดกลุ่ม')
    return
  }
  const all = eligible.value.map(p => p.id)
  groups.value.forEach(g => g.memberIds = [])
  all.forEach((id, i) => {
    const g = groups.value[i % groups.value.length]
    if (g) g.memberIds.push(id)
  })
  success('Auto-balance เสร็จ', `จัดกลุ่ม ${eligible.value.length} คนจากที่เช็คอิน`)
}

function removeIneligible() {
  if (ineligibleInGroups.value.length === 0) return
  if (!confirm(`ลบ ${ineligibleInGroups.value.length} คนที่ยังไม่เช็คอินออกจากกลุ่ม?`)) return
  groups.value.forEach(g => {
    g.memberIds = g.memberIds.filter(id => {
      const p = participants.value.find(x => x.id === id)
      return !!p?.checkedInAt
    })
  })
  success('อัปเดตกลุ่มแล้ว', `ลบ ${ineligibleInGroups.value.length} คนที่ไม่เช็คอินออก`)
}

function toggleLock() {
  locked.value = !locked.value
  if (locked.value) success('Lock กลุ่มแล้ว', 'แจ้งสมาชิกทาง email แล้ว')
  else success('ปลดล็อกกลุ่ม', 'สามารถแก้ไขได้')
}

function addGroup() {
  const colors = ['#EF4444', '#8B5CF6', '#EC4899', '#14B8A6']
  groups.value.push({
    id: `g${Date.now()}`,
    name: `Team ${groups.value.length + 1}`,
    color: colors[groups.value.length % colors.length] ?? '#6C757D',
    memberIds: [],
  })
}
</script>

<template>
  <div class="page" style="--page-gap: var(--space-4)">
    <ErrorState v-if="ui.isErrorBlocking.value" :recoverable="false" />
    <ErrorState v-else-if="ui.isError.value" @retry="() => {}" />

    <header class="head">
      <div>
        <p class="head__tag">จัดกลุ่ม · เฉพาะคนที่เช็คอินแล้วเท่านั้น</p>
        <h1 class="head__title">{{ groups.length }} ทีม · {{ eligible.length }} คน eligible</h1>
        <p class="head__desc">Drag & drop เพื่อย้ายสมาชิก · auto-balance แบ่งเท่าๆ กัน · จัดกลุ่มได้เฉพาะคนที่สแกน QR เข้างานเท่านั้น</p>
      </div>
      <div class="head__actions">
        <AppButton variant="secondary" size="md" :disabled="locked || eligible.length === 0" @click="autoBalance">
          <AppIcon :icon="Shuffle" size="sm" aria-hidden="true" />
          Auto-balance
        </AppButton>
        <AppButton :variant="locked ? 'primary' : 'destructive'" size="md" @click="toggleLock">
          <AppIcon :icon="locked ? Unlock : Lock" size="sm" aria-hidden="true" />
          {{ locked ? 'ปลดล็อก' : 'Lock + Notify' }}
        </AppButton>
      </div>
    </header>

    <!-- Check-in status banner -->
    <section class="checkin-banner" :class="{ 'is-empty': eligible.length === 0 }">
      <div class="checkin-banner__icon">
        <AppIcon :icon="Camera" size="md" aria-hidden="true" />
      </div>
      <div class="checkin-banner__body">
        <div class="checkin-banner__stats">
          <span class="stat-big"><strong>{{ eligible.length }}</strong> / {{ totalConfirmed }}</span>
          <span class="stat-label">เช็คอินแล้ว ({{ checkInPct }}%)</span>
        </div>
        <div class="checkin-banner__bar">
          <div class="checkin-banner__fill" :style="`width: ${checkInPct}%`"></div>
        </div>
        <p v-if="eligible.length === 0" class="checkin-banner__msg">
          ยังไม่มีใครเช็คอิน · ให้ HR ไปที่หน้า <RouterLink :to="`/events/${event.id}/admin/check-in`">Scan QR</RouterLink> ก่อน
        </p>
        <p v-else class="checkin-banner__msg">
          <strong>{{ totalConfirmed - eligible.length }}</strong> คน ลงทะเบียนแต่ยังไม่มา · รอจนกว่าจะสแกน QR ก่อนจัดกลุ่ม
        </p>
      </div>
      <RouterLink :to="`/events/${event.id}/admin/check-in`" class="checkin-banner__cta">
        <AppIcon :icon="Camera" size="sm" aria-hidden="true" />
        ไปที่ Scanner
        <AppIcon :icon="ArrowRight" size="sm" aria-hidden="true" />
      </RouterLink>
    </section>

    <!-- Warning: ineligible people in groups -->
    <div v-if="ineligibleInGroups.length > 0" class="warn-banner">
      <AppIcon :icon="AlertTriangle" size="md" aria-hidden="true" />
      <div>
        <p class="warn-banner__title">{{ ineligibleInGroups.length }} คนในกลุ่มยังไม่เช็คอิน</p>
        <p class="warn-banner__desc">อาจจะ no-show · แนะนำให้ลบออกและรอสมาชิกจริง</p>
      </div>
      <AppButton variant="secondary" size="sm" @click="removeIneligible">ลบออก</AppButton>
    </div>

    <template v-if="ui.isLoading.value">
      <LoadingSkeleton variant="card" :count="4" />
    </template>

    <EmptyState
      v-else-if="ui.isEmpty.value || groups.length === 0"
      :icon="Users"
      title="ยังไม่มีกลุ่ม"
      message="สร้างกลุ่มแรกเพื่อจัดสมาชิก · แนะนำ 3-6 คน/กลุ่มเพื่อ discussion"
      cta-label="สร้างกลุ่มแรก"
      @cta="addGroup"
    />

    <template v-else>
      <!-- Lock banner -->
      <div v-if="locked" class="lock-banner">
        <AppIcon :icon="Lock" size="md" aria-hidden="true" />
        <div>
          <p class="lock-banner__title">กลุ่มถูก lock แล้ว</p>
          <p class="lock-banner__desc">ต้องปลดล็อกก่อนแก้ไข · การปลดล็อกจะ invalidate คิว present</p>
        </div>
      </div>

      <!-- Unassigned pool -->
      <section
        class="pool"
        @drop="onDrop(null, $event)"
        @dragover="onDragOver"
        :class="{ 'is-locked': locked }"
      >
        <h2 class="pool__title">
          <AppIcon :icon="UserPlus" size="md" aria-hidden="true" />
          ยังไม่ได้จัดกลุ่ม ({{ unassigned.length }})
        </h2>
        <div class="chips">
          <span
            v-for="p in unassigned"
            :key="p.id"
            class="chip"
            :draggable="!locked"
            @dragstart="onDragStart(p.id, $event)"
          >
            <span class="chip__avatar">{{ p.nickname.charAt(0) }}</span>
            {{ p.nickname }}
          </span>
          <p v-if="unassigned.length === 0" class="pool__empty">ทุกคนถูกจัดเข้ากลุ่มแล้ว</p>
        </div>
      </section>

      <!-- Groups grid -->
      <section class="auto-grid" style="--min: 240px; gap: var(--space-3)">
        <article
          v-for="g in groups"
          :key="g.id"
          class="group"
          :class="{ 'is-locked': locked }"
          :style="{ '--c': g.color }"
          @drop="onDrop(g.id, $event)"
          @dragover="onDragOver"
        >
          <div class="group__head">
            <span class="group__dot" :style="{ backgroundColor: g.color }" aria-hidden="true"></span>
            <h3 class="group__name">{{ g.name }}</h3>
            <AppBadge variant="neutral" size="sm">{{ g.memberIds.length }} คน</AppBadge>
          </div>
          <ul class="group__members">
            <li
              v-for="pid in g.memberIds"
              :key="pid"
              class="member"
              :draggable="!locked"
              @dragstart="onDragStart(pid, $event)"
            >
              <span class="member__avatar">{{ findParticipant(pid)?.nickname.charAt(0) }}</span>
              <div class="member__body">
                <strong>{{ findParticipant(pid)?.nickname }}</strong>
                <small>{{ findParticipant(pid)?.department }}</small>
              </div>
            </li>
            <li v-if="g.memberIds.length === 0" class="member-empty">
              ลากใส่ที่นี่
            </li>
          </ul>
        </article>

        <button class="group-add" @click="addGroup" :disabled="locked">
          <AppIcon :icon="Plus" size="xl" aria-hidden="true" />
          <span>เพิ่มกลุ่ม</span>
        </button>
      </section>

      <!-- Save / Notify -->
      <div class="actions" v-if="!locked && eligible.length > 0">
        <AppButton variant="primary" size="lg" @click="toggleLock">
          <AppIcon :icon="Send" size="md" aria-hidden="true" />
          Lock + Notify สมาชิก ({{ eligible.length }} คน)
        </AppButton>
      </div>
    </template>
  </div>
</template>

<style scoped>
/* layout via global .page */

.head { display: flex; justify-content: space-between; align-items: flex-end; gap: var(--space-4); flex-wrap: wrap; }
.head__tag { font-size: var(--text-caption); color: var(--color-text-secondary); }
.head__title { font-size: var(--text-h2); font-weight: var(--weight-bold); margin: 4px 0; }
.head__desc { font-size: var(--text-body-sm); color: var(--color-text-secondary); max-width: 520px; }
.head__actions { display: flex; gap: var(--space-2); flex-wrap: wrap; }

.lock-banner {
  display: flex; gap: var(--space-3); align-items: center;
  padding: var(--space-3) var(--space-4);
  background: var(--color-warning-subtle);
  color: var(--color-warning-dark);
  border: 1px solid var(--color-warning-light);
  border-radius: var(--radius-lg);
}

/* Check-in status banner */
.checkin-banner {
  display: flex; align-items: center; gap: var(--space-4);
  padding: var(--space-4) var(--space-5);
  background: linear-gradient(90deg, var(--color-success-subtle) 0%, var(--color-white) 100%);
  border: 1px solid var(--color-success-light);
  border-left: 4px solid var(--color-success);
  border-radius: var(--radius-xl);
  flex-wrap: wrap;
}
.checkin-banner.is-empty {
  background: linear-gradient(90deg, var(--color-warning-subtle) 0%, var(--color-white) 100%);
  border-color: var(--color-warning-light);
  border-left-color: var(--color-warning);
}
.checkin-banner__icon {
  width: 48px; height: 48px; border-radius: var(--radius-lg);
  background: var(--color-success); color: var(--color-white);
  display: inline-flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.is-empty .checkin-banner__icon { background: var(--color-warning); }
.checkin-banner__body { flex: 1; min-width: 220px; }
.checkin-banner__stats { display: flex; align-items: baseline; gap: var(--space-2); }
.stat-big { font-size: var(--text-h3); font-weight: var(--weight-bold); }
.stat-big strong { color: var(--color-success-dark); font-size: var(--text-h2); }
.is-empty .stat-big strong { color: var(--color-warning-dark); }
.stat-label { font-size: var(--text-caption); color: var(--color-text-secondary); }
.checkin-banner__bar {
  height: 6px; background: var(--color-gray-200);
  border-radius: var(--radius-full); overflow: hidden;
  margin: var(--space-2) 0 var(--space-1);
}
.checkin-banner__fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-success), var(--color-success-dark));
  border-radius: var(--radius-full);
  transition: width var(--duration-slow);
}
.is-empty .checkin-banner__fill { background: var(--color-warning); }
.checkin-banner__msg { font-size: var(--text-caption); color: var(--color-text-secondary); }
.checkin-banner__msg strong { color: var(--color-text-primary); }
.checkin-banner__msg a { color: var(--color-primary); font-weight: var(--weight-semibold); }
.checkin-banner__cta {
  display: inline-flex; align-items: center; gap: var(--space-1);
  padding: var(--space-2) var(--space-3);
  background: var(--color-success);
  color: var(--color-white);
  border-radius: var(--radius-md);
  font-size: var(--text-body-sm);
  font-weight: var(--weight-semibold);
  min-height: var(--size-touch-target);
}
.checkin-banner__cta:hover { background: var(--color-success-dark); text-decoration: none; color: var(--color-white); }
.is-empty .checkin-banner__cta { background: var(--color-warning); }
.is-empty .checkin-banner__cta:hover { background: var(--color-warning-dark); }

/* Warning: ineligible in groups */
.warn-banner {
  display: flex; gap: var(--space-3); align-items: center;
  padding: var(--space-3) var(--space-4);
  background: var(--color-danger-subtle);
  border: 1px solid var(--color-danger-light);
  border-radius: var(--radius-lg);
  color: var(--color-danger-dark);
}
.warn-banner__title { font-size: var(--text-body-sm); font-weight: var(--weight-semibold); }
.warn-banner__desc { font-size: var(--text-caption); color: var(--color-text-secondary); margin-top: 2px; }
.lock-banner__title { font-size: var(--text-body-sm); font-weight: var(--weight-semibold); }
.lock-banner__desc { font-size: var(--text-caption); color: var(--color-text-secondary); }

.pool {
  background: var(--color-gray-50);
  border: 2px dashed var(--color-border-default);
  border-radius: var(--radius-xl);
  padding: var(--space-4);
}
.pool.is-locked { opacity: 0.6; }
.pool__title { display: inline-flex; align-items: center; gap: var(--space-2); font-size: var(--text-body); font-weight: var(--weight-semibold); margin-bottom: var(--space-3); }
.chips { display: flex; flex-wrap: wrap; gap: var(--space-2); min-height: 40px; }
.chip {
  display: inline-flex; align-items: center; gap: var(--space-2);
  padding: var(--space-1) var(--space-3);
  background: var(--color-white);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-full);
  font-size: var(--text-caption);
  cursor: grab;
  user-select: none;
}
.chip:active { cursor: grabbing; }
.chip__avatar {
  width: 24px; height: 24px; border-radius: 50%;
  background: var(--color-primary-muted); color: var(--color-primary-dark);
  display: inline-flex; align-items: center; justify-content: center;
  font-weight: var(--weight-semibold); font-size: 10px;
}
.pool__empty { color: var(--color-text-tertiary); font-size: var(--text-caption); padding: var(--space-2); }

/* .groups grid via .auto-grid in template */

.group {
  background: var(--color-white);
  border: 2px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  padding: var(--space-4);
  min-height: 200px;
  border-top: 4px solid var(--c);
}
.group.is-locked { opacity: 0.7; }
.group__head { display: flex; align-items: center; gap: var(--space-2); margin-bottom: var(--space-3); }
.group__dot { width: 12px; height: 12px; border-radius: 50%; }
.group__name { font-size: var(--text-body); font-weight: var(--weight-semibold); flex: 1; }

.group__members { list-style: none; display: flex; flex-direction: column; gap: var(--space-2); }
.member {
  display: flex; align-items: center; gap: var(--space-2);
  padding: var(--space-2);
  background: var(--color-gray-50);
  border-radius: var(--radius-md);
  cursor: grab;
  user-select: none;
}
.member:active { cursor: grabbing; }
.member__avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: var(--c, var(--color-primary-muted)); color: var(--color-white);
  display: inline-flex; align-items: center; justify-content: center;
  font-weight: var(--weight-semibold); font-size: var(--text-body-sm);
  filter: saturate(0.8);
}
.member__body { display: flex; flex-direction: column; min-width: 0; }
.member__body strong { font-size: var(--text-body-sm); }
.member__body small { font-size: 10px; color: var(--color-text-tertiary); }
.member-empty { font-size: var(--text-caption); color: var(--color-text-tertiary); text-align: center; padding: var(--space-3); border: 1px dashed var(--color-border-default); border-radius: var(--radius-md); }

.group-add {
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: var(--space-2);
  min-height: 200px;
  border: 2px dashed var(--color-border-default);
  border-radius: var(--radius-xl);
  color: var(--color-text-tertiary);
  font-size: var(--text-body-sm);
  background: transparent;
}
.group-add:hover:not(:disabled) { border-color: var(--color-primary); color: var(--color-primary); }

.actions { display: flex; justify-content: flex-end; }
</style>
