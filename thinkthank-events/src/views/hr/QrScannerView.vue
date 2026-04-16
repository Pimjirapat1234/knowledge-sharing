<script setup lang="ts">
/**
 * Screen #14 — QR Scanner (PRD §11.1 #14 · Story H4 · FR-CHECKIN).
 * Real flow:
 *   1. HR opens scanner · camera viewport + offline indicator
 *   2. "Simulate scan" picker (demo) OR camera (prod)
 *   3. On scan success → drawer opens with participant detail + allergy alert
 *   4. HR confirms check-in → audio/visual success feedback · counter increments
 *   5. Duplicate scan → warn with original time
 *   6. Recent scans list with undo option
 */
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import {
  Camera, CameraOff, Check, AlertTriangle, Search, WifiOff, Wifi,
  ClipboardList, ScanLine, Eye, X, User, UtensilsCrossed,
  Users, MapPin, Undo2, CheckCircle2,
} from 'lucide-vue-next'
import { useParticipantStore, type Participant } from '@/stores/participant'
import { useMenuStore } from '@/stores/menu'
import { useGroupStore } from '@/stores/group'
import { useUiState } from '@/composables/useUiState'
import { useToast } from '@/composables/useToast'
import { buildQrPayload, encodeQrPayload, parseQrPayload, type QrPayload } from '@/composables/useQr'
import { useEventStore } from '@/stores/event'
import AppIcon from '@/components/ui/AppIcon.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import ErrorState from '@/components/ui/ErrorState.vue'

const participantStore = useParticipantStore()
const { participants, checkedIn } = storeToRefs(participantStore)
const { menus } = storeToRefs(useMenuStore())
const { groups } = storeToRefs(useGroupStore())
const { event } = storeToRefs(useEventStore())
const ui = useUiState()
const { success, warning, error } = useToast()

// --- Scanner UI state ---
const cameraActive = ref(true)
const isOnline = ref(true)
const queuedScans = ref(0)
const search = ref('')

// --- Scan result drawer state ---
const scanResult = ref<{ payload: QrPayload; participant: Participant; isDuplicate: boolean; originalTime?: string } | null>(null)
const showPicker = ref(false)
const pickerSearch = ref('')

// --- Stats ---
const totalConfirmed = computed(() => participants.value.filter(p => p.status === 'confirmed').length)
const totalCheckedIn = computed(() => checkedIn.value.length)
const checkInPct = computed(() => Math.round((totalCheckedIn.value / Math.max(totalConfirmed.value, 1)) * 100))

// --- Recent scans (last 5) ---
const recentScans = computed(() =>
  [...checkedIn.value]
    .sort((a, b) => (b.checkedInAt ?? '').localeCompare(a.checkedInAt ?? ''))
    .slice(0, 5),
)

// --- Manual search results ---
const searchResults = computed(() => {
  if (!search.value) return []
  const q = search.value.toLowerCase()
  return participants.value.filter(p =>
    p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q) || p.nickname.toLowerCase().includes(q),
  ).slice(0, 5)
})

// --- Picker (dev simulate) ---
const pickerList = computed(() => {
  if (!pickerSearch.value) return participants.value
  const q = pickerSearch.value.toLowerCase()
  return participants.value.filter(p =>
    p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q) || p.nickname.toLowerCase().includes(q),
  )
})

// --- QR Scan handler ---
function handleScannedString(raw: string) {
  const payload = parseQrPayload(raw)
  if (!payload) {
    error('QR ไม่ถูกต้อง', 'อ่าน payload ไม่ได้ · ลองสแกนใหม่ หรือใช้ manual')
    return
  }
  if (payload.eventId !== event.value.id) {
    error('QR ไม่ใช่ของงานนี้', `QR นี้เป็นของ event ${payload.eventId} · กรุณาตรวจสอบ`)
    return
  }
  const participant = participants.value.find(p => p.id === payload.userId)
  if (!participant) {
    error('ไม่พบผู้ลงทะเบียน', `User ${payload.userId} ไม่อยู่ในรายชื่อ · อาจถูกยกเลิก`)
    return
  }

  const duplicate = !!participant.checkedInAt
  scanResult.value = {
    payload,
    participant,
    isDuplicate: duplicate,
    originalTime: participant.checkedInAt,
  }

  if (duplicate) {
    warning('เคย check-in แล้ว', `เมื่อ ${formatShortTime(participant.checkedInAt!)} · ไม่นับซ้ำ`)
  }
}

// Simulate scanning by picking a participant → generate their QR → parse back
function simulateScan(p: Participant) {
  showPicker.value = false
  const payload = buildQrPayload({
    eventId: event.value.id,
    userId: p.id,
    name: p.name,
    email: p.email,
    dept: p.department,
    eventTitle: event.value.title,
    eventStart: event.value.startAt,
    eventLocation: event.value.location,
    menuId: p.menuId,
    allergy: p.allergy,
    groupId: p.groupId,
  })
  handleScannedString(encodeQrPayload(payload))
}

function confirmCheckIn() {
  if (!scanResult.value) return
  const { participant, isDuplicate } = scanResult.value
  if (isDuplicate) {
    scanResult.value = null
    return
  }
  const res = participantStore.checkIn(participant.id, 'qr')
  if (res.ok) {
    success(`ยินดีต้อนรับ คุณ${participant.nickname}`, `${participant.department} · เข้างานแล้ว`)
    // Play audio cue (skip in reduced motion / or silent)
    playDing()
  }
  scanResult.value = null
}

function closeResult() { scanResult.value = null }

function undoLastScan() {
  const last = recentScans.value[0]
  if (!last) return
  if (!confirm(`ยกเลิก check-in ของ คุณ${last.nickname}?`)) return
  participantStore.undoCheckIn(last.id)
  warning('ยกเลิก check-in แล้ว', `คุณ${last.nickname} · audit log บันทึกแล้ว`)
}

function manualCheckIn(p: Participant) {
  if (p.checkedInAt) {
    warning('เคย check-in แล้ว', `เมื่อ ${formatShortTime(p.checkedInAt)}`)
    return
  }
  const res = participantStore.checkIn(p.id, 'manual')
  if (res.ok) {
    success(`Check-in manual: คุณ${p.nickname}`, `บันทึก mode=manual ใน audit log`)
    search.value = ''
  }
}

function toggleCamera() { cameraActive.value = !cameraActive.value }
function toggleNetwork() {
  isOnline.value = !isOnline.value
  if (!isOnline.value) queuedScans.value = 3
  else queuedScans.value = 0
}

function playDing() {
  // Web Audio API beep — respect reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain); gain.connect(ctx.destination)
    osc.frequency.value = 880
    osc.type = 'sine'
    gain.gain.setValueAtTime(0.15, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)
    osc.start(); osc.stop(ctx.currentTime + 0.2)
  } catch { /* ignore */ }
}

function formatShortTime(iso: string) {
  const d = new Date(iso)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function menuName(id?: string) {
  return menus.value.find(m => m.id === id)?.name ?? '—'
}
function groupName(id?: string) {
  return groups.value.find(g => g.id === id)?.name ?? '—'
}
</script>

<template>
  <div class="page">
    <ErrorState
      v-if="ui.isErrorBlocking.value"
      :icon="CameraOff"
      :recoverable="false"
      title="ไม่สามารถเข้าถึงกล้อง"
      message="อนุญาต camera permission หรือใช้ manual check-in ด้านล่าง · audit log จะบันทึก mode ที่ใช้"
    />
    <ErrorState v-else-if="ui.isError.value" @retry="() => {}" title="Camera หลุด" />

    <!-- Header -->
    <header class="qr-head">
      <div>
        <p class="qr-head__tag">QR Check-in</p>
        <h1 class="qr-head__title">สแกนเช็คอิน</h1>
      </div>
      <div class="qr-head__meta">
        <AppBadge :variant="isOnline ? 'success' : 'warning'" size="md">
          <AppIcon :icon="isOnline ? Wifi : WifiOff" size="sm" aria-hidden="true" />
          {{ isOnline ? 'Online' : `Offline · คิว ${queuedScans}` }}
        </AppBadge>
        <button class="dev-btn" @click="toggleNetwork" title="Demo: toggle offline">net</button>
      </div>
    </header>

    <!-- Live counter -->
    <section class="counter">
      <div class="counter__big">
        <span class="counter__now">{{ totalCheckedIn }}</span>
        <span class="counter__sep">/</span>
        <span class="counter__total">{{ totalConfirmed }}</span>
      </div>
      <p class="counter__label">Check-in แล้ว · {{ checkInPct }}%</p>
      <div class="counter__bar">
        <div class="counter__fill" :style="`width: ${checkInPct}%`"></div>
      </div>
      <p v-if="checkInPct === 100" class="counter__full">เต็มห้อง! 100% เข้างานแล้ว</p>
    </section>

    <!-- Scanner viewport -->
    <section v-if="!ui.isErrorBlocking.value" class="viewport">
      <div class="viewport__frame">
        <div class="viewport__camera" v-if="cameraActive">
          <AppIcon :icon="Camera" size="xl" />
          <p>กำลังสแกน QR code...</p>
          <div class="viewport__corners" aria-hidden="true">
            <span></span><span></span><span></span><span></span>
          </div>
          <div class="viewport__line" aria-hidden="true"></div>
        </div>
        <div class="viewport__off" v-else>
          <AppIcon :icon="CameraOff" size="xl" />
          <p>ปิดกล้องแล้ว</p>
        </div>
      </div>

      <div class="viewport__actions">
        <AppButton variant="secondary" size="md" @click="toggleCamera">
          <AppIcon :icon="cameraActive ? CameraOff : Camera" size="sm" aria-hidden="true" />
          {{ cameraActive ? 'ปิดกล้อง' : 'เปิดกล้อง' }}
        </AppButton>
        <AppButton variant="primary" size="md" @click="showPicker = true">
          <AppIcon :icon="ScanLine" size="sm" aria-hidden="true" />
          Demo: สแกน QR
        </AppButton>
        <AppButton v-if="recentScans.length > 0" variant="ghost" size="md" @click="undoLastScan" title="Undo last scan">
          <AppIcon :icon="Undo2" size="sm" aria-hidden="true" />
          Undo
        </AppButton>
      </div>
    </section>

    <!-- Manual mode -->
    <section class="manual">
      <div class="manual__head">
        <h2 class="manual__title">
          <AppIcon :icon="Search" size="md" aria-hidden="true" />
          Manual check-in (ถ้ากล้องมีปัญหา)
        </h2>
        <p class="manual__desc">ค้นหาและ check-in ด้วยตนเอง · log mode=manual</p>
      </div>
      <input
        v-model="search"
        type="search"
        class="manual__input"
        placeholder="ค้นหาชื่อหรืออีเมล..."
        aria-label="ค้นหาผู้ลงทะเบียน"
      />
      <ul v-if="searchResults.length" class="manual__results">
        <li v-for="p in searchResults" :key="p.id">
          <div class="search-info">
            <strong>{{ p.name }}</strong>
            <small>{{ p.department }} · {{ p.email }}</small>
          </div>
          <AppBadge v-if="p.checkedInAt" variant="success" size="sm">
            <AppIcon :icon="Check" size="sm" aria-hidden="true" />
            {{ formatShortTime(p.checkedInAt) }}
          </AppBadge>
          <AppButton v-else variant="primary" size="sm" @click="manualCheckIn(p)">
            Check in
          </AppButton>
        </li>
      </ul>
    </section>

    <!-- Recent scans -->
    <section class="recent">
      <h2 class="recent__title">
        <AppIcon :icon="ClipboardList" size="md" aria-hidden="true" />
        Check-in ล่าสุด
      </h2>
      <ul v-if="recentScans.length" class="recent__list">
        <li v-for="p in recentScans" :key="p.id" class="recent__item">
          <span class="recent__avatar">{{ p.nickname.charAt(0) }}</span>
          <div class="recent__info">
            <strong>คุณ{{ p.nickname }}</strong>
            <small>{{ p.department }} · <AppBadge :variant="p.checkInMode === 'manual' ? 'warning' : 'success'" size="sm">{{ p.checkInMode === 'manual' ? 'manual' : 'QR' }}</AppBadge></small>
          </div>
          <span class="recent__time">{{ formatShortTime(p.checkedInAt!) }} น.</span>
        </li>
      </ul>
      <p v-else class="recent__empty">ยังไม่มี check-in · รอ scan แรก</p>
    </section>

    <!-- Scan Picker Modal (simulate scan) -->
    <div v-if="showPicker" class="modal" role="dialog" aria-modal="true" aria-labelledby="picker-title">
      <div class="modal__bg" @click="showPicker = false"></div>
      <div class="modal__body">
        <header class="modal__head">
          <div>
            <h2 id="picker-title" class="modal__title">เลือก QR ที่จะสแกน (Demo)</h2>
            <p class="modal__sub">คลิก participant เพื่อจำลองการสแกน QR ของเขา</p>
          </div>
          <button class="modal__close" aria-label="ปิด" @click="showPicker = false">
            <AppIcon :icon="X" size="md" />
          </button>
        </header>
        <div class="picker__search">
          <AppIcon :icon="Search" size="sm" aria-hidden="true" />
          <input v-model="pickerSearch" type="search" placeholder="ค้นหา..." aria-label="ค้นหา participant" />
        </div>
        <ul class="picker__list">
          <li v-for="p in pickerList" :key="p.id">
            <button class="picker__item" @click="simulateScan(p)">
              <span class="picker__avatar">{{ p.nickname.charAt(0) }}</span>
              <div class="picker__body">
                <strong>{{ p.name }}</strong>
                <small>{{ p.department }} · {{ p.email }}</small>
              </div>
              <AppBadge v-if="p.checkedInAt" variant="success" size="sm">
                <AppIcon :icon="Check" size="sm" aria-hidden="true" />
                เข้าแล้ว
              </AppBadge>
            </button>
          </li>
        </ul>
      </div>
    </div>

    <!-- Scan Result Drawer -->
    <div v-if="scanResult" class="drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
      <div class="drawer__bg" @click="closeResult"></div>
      <div
        class="drawer__body"
        :class="{ 'drawer__body--duplicate': scanResult.isDuplicate }"
      >
        <header class="drawer__head">
          <div class="drawer__status">
            <div
              class="drawer__status-icon"
              :class="scanResult.isDuplicate ? 'is-warning' : 'is-success'"
              aria-hidden="true"
            >
              <AppIcon :icon="scanResult.isDuplicate ? AlertTriangle : CheckCircle2" size="xl" :stroke-width="3" />
            </div>
            <div>
              <h2 id="drawer-title" class="drawer__title">
                {{ scanResult.isDuplicate ? 'เคย check-in แล้ว' : 'QR ถูกต้อง' }}
              </h2>
              <p v-if="scanResult.isDuplicate" class="drawer__dup">
                เข้าเมื่อ <strong>{{ formatShortTime(scanResult.originalTime!) }} น.</strong>
              </p>
            </div>
          </div>
          <button class="modal__close" aria-label="ปิด" @click="closeResult">
            <AppIcon :icon="X" size="md" />
          </button>
        </header>

        <!-- Participant details -->
        <section class="drawer__content">
          <div class="participant-hero">
            <span class="participant-hero__avatar">{{ scanResult.participant.nickname.charAt(0) }}</span>
            <div>
              <h3 class="participant-hero__name">คุณ{{ scanResult.participant.nickname }}</h3>
              <p class="participant-hero__full">{{ scanResult.participant.name }}</p>
              <p class="participant-hero__dept">{{ scanResult.participant.department }}</p>
            </div>
          </div>

          <!-- Allergy alert (high priority · red) -->
          <div v-if="scanResult.participant.allergy" class="allergy-alert">
            <AppIcon :icon="AlertTriangle" size="md" aria-hidden="true" />
            <div>
              <p class="allergy-alert__title">แพ้อาหาร / ข้อจำกัด</p>
              <p class="allergy-alert__text">{{ scanResult.participant.allergy }}</p>
            </div>
          </div>

          <!-- Details grid -->
          <dl class="details">
            <div>
              <dt><AppIcon :icon="UtensilsCrossed" size="sm" aria-hidden="true" /> เมนู</dt>
              <dd>{{ menuName(scanResult.participant.menuId) }}</dd>
            </div>
            <div>
              <dt><AppIcon :icon="Users" size="sm" aria-hidden="true" /> ทีม</dt>
              <dd>{{ groupName(scanResult.participant.groupId) }}</dd>
            </div>
            <div>
              <dt><AppIcon :icon="MapPin" size="sm" aria-hidden="true" /> Reg ID</dt>
              <dd><code>{{ scanResult.payload.regId }}</code></dd>
            </div>
            <div>
              <dt><AppIcon :icon="User" size="sm" aria-hidden="true" /> อีเมล</dt>
              <dd>{{ scanResult.participant.email }}</dd>
            </div>
          </dl>
        </section>

        <!-- Actions -->
        <footer class="drawer__foot">
          <AppButton variant="secondary" size="lg" @click="closeResult">
            {{ scanResult.isDuplicate ? 'ปิด' : 'ยกเลิก' }}
          </AppButton>
          <AppButton
            v-if="!scanResult.isDuplicate"
            variant="primary"
            size="lg"
            @click="confirmCheckIn"
          >
            <AppIcon :icon="Check" size="md" aria-hidden="true" />
            ยืนยัน Check-in
          </AppButton>
        </footer>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page { max-width: 640px; margin: 0 auto; padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-4); padding-bottom: var(--space-12); }
@media (min-width: 768px) { .page { padding: var(--space-6); } }

.qr-head { display: flex; justify-content: space-between; align-items: flex-end; gap: var(--space-3); flex-wrap: wrap; }
.qr-head__tag { font-size: var(--text-caption); color: var(--color-text-secondary); }
.qr-head__title { font-size: var(--text-h2); font-weight: var(--weight-bold); }
.qr-head__meta { display: flex; gap: var(--space-2); align-items: center; }
.dev-btn { font-size: 10px; color: var(--color-text-tertiary); padding: 2px 6px; border-radius: 4px; background: var(--color-gray-100); font-family: var(--font-mono); }

.counter {
  text-align: center;
  padding: var(--space-5);
  background: linear-gradient(135deg, var(--color-success) 0%, var(--color-success-dark) 100%);
  color: var(--color-white);
  border-radius: var(--radius-xl);
  position: relative; overflow: hidden;
}
.counter__big { font-size: 64px; font-weight: var(--weight-bold); line-height: 1; }
.counter__now { color: var(--color-white); transition: transform var(--duration-slow) var(--ease-out); }
.counter__sep { margin: 0 var(--space-2); opacity: 0.6; }
.counter__total { opacity: 0.8; font-size: 48px; }
.counter__label { font-size: var(--text-body-sm); opacity: 0.9; margin: var(--space-3) 0 var(--space-2); }
.counter__bar { height: 8px; background: rgba(255,255,255,0.25); border-radius: var(--radius-full); overflow: hidden; }
.counter__fill { height: 100%; background: var(--color-white); border-radius: var(--radius-full); transition: width var(--duration-slow); }
.counter__full { margin-top: var(--space-3); font-weight: var(--weight-semibold); }

.viewport {
  background: var(--color-white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  padding: var(--space-4);
  display: flex; flex-direction: column; gap: var(--space-3);
}
.viewport__frame {
  position: relative; aspect-ratio: 1;
  background: var(--color-secondary);
  border-radius: var(--radius-lg); overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  color: var(--color-white);
}
.viewport__camera { text-align: center; display: flex; flex-direction: column; gap: var(--space-2); align-items: center; }
.viewport__camera p { opacity: 0.7; font-size: var(--text-body-sm); }
.viewport__off { text-align: center; display: flex; flex-direction: column; gap: var(--space-2); align-items: center; color: var(--color-gray-500); }

.viewport__corners span { position: absolute; width: 32px; height: 32px; border: 4px solid var(--color-primary); }
.viewport__corners span:nth-child(1) { top: 16%; left: 16%; border-right: 0; border-bottom: 0; border-radius: 4px 0 0 0; }
.viewport__corners span:nth-child(2) { top: 16%; right: 16%; border-left: 0; border-bottom: 0; border-radius: 0 4px 0 0; }
.viewport__corners span:nth-child(3) { bottom: 16%; left: 16%; border-right: 0; border-top: 0; border-radius: 0 0 0 4px; }
.viewport__corners span:nth-child(4) { bottom: 16%; right: 16%; border-left: 0; border-top: 0; border-radius: 0 0 4px 0; }

.viewport__line {
  position: absolute; top: 50%; left: 18%; right: 18%;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--color-primary), transparent);
  box-shadow: 0 0 12px rgba(240, 90, 40, 0.8);
  animation: scan 2s linear infinite;
}
@keyframes scan { 0%, 100% { top: 18%; } 50% { top: 82%; } }

.viewport__actions { display: flex; gap: var(--space-2); flex-wrap: wrap; }
.viewport__actions > * { flex: 1; min-width: 120px; }

.manual { background: var(--color-white); border: 1px solid var(--color-border-light); border-radius: var(--radius-xl); padding: var(--space-4); }
.manual__head { margin-bottom: var(--space-3); }
.manual__title { display: inline-flex; align-items: center; gap: var(--space-2); font-size: var(--text-body); font-weight: var(--weight-semibold); }
.manual__desc { font-size: var(--text-caption); color: var(--color-text-secondary); margin-top: 2px; }
.manual__input {
  width: 100%; padding: var(--space-3);
  border: 1px solid var(--color-border-default); border-radius: var(--radius-md);
  font-size: var(--text-body); font-family: inherit;
  min-height: var(--size-input-lg);
}
.manual__input:focus { outline: none; border-color: var(--color-border-focus); box-shadow: var(--shadow-focus); }
.manual__results { list-style: none; margin-top: var(--space-3); display: flex; flex-direction: column; gap: var(--space-2); }
.manual__results li {
  display: flex; justify-content: space-between; align-items: center; gap: var(--space-3);
  padding: var(--space-3);
  background: var(--color-gray-50); border-radius: var(--radius-md);
}
.search-info { flex: 1; min-width: 0; }
.search-info small { display: block; font-size: var(--text-caption); color: var(--color-text-tertiary); margin-top: 2px; }

.recent { background: var(--color-white); border: 1px solid var(--color-border-light); border-radius: var(--radius-xl); padding: var(--space-4); }
.recent__title { display: inline-flex; align-items: center; gap: var(--space-2); font-size: var(--text-body); font-weight: var(--weight-semibold); margin-bottom: var(--space-3); }
.recent__list { list-style: none; display: flex; flex-direction: column; gap: var(--space-2); }
.recent__item { display: flex; align-items: center; gap: var(--space-3); padding: var(--space-2); border-radius: var(--radius-md); }
.recent__item:hover { background: var(--color-gray-50); }
.recent__avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--color-primary-muted); color: var(--color-primary-dark); display: inline-flex; align-items: center; justify-content: center; font-weight: var(--weight-semibold); font-size: var(--text-body-sm); }
.recent__info { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.recent__info small { font-size: var(--text-caption); color: var(--color-text-tertiary); display: inline-flex; align-items: center; gap: 4px; }
.recent__time { font-family: var(--font-mono); font-size: var(--text-caption); color: var(--color-text-secondary); }
.recent__empty { font-size: var(--text-body-sm); color: var(--color-text-tertiary); text-align: center; padding: var(--space-6); }

/* Modal base */
.modal, .drawer { position: fixed; inset: 0; z-index: var(--z-modal); display: flex; }
.modal { align-items: center; justify-content: center; padding: var(--space-4); }
.modal__bg, .drawer__bg { position: absolute; inset: 0; background: rgba(35,31,32,0.55); backdrop-filter: blur(4px); }
.modal__body {
  position: relative;
  width: 100%; max-width: 560px; max-height: 80vh;
  background: var(--color-white); border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  display: flex; flex-direction: column;
  animation: slide-up 0.3s var(--ease-out);
}
@keyframes slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: none; opacity: 1; } }

.modal__head {
  display: flex; justify-content: space-between; align-items: flex-start; gap: var(--space-3);
  padding: var(--space-4) var(--space-5); border-bottom: 1px solid var(--color-border-light);
}
.modal__title { font-size: var(--text-h4); font-weight: var(--weight-bold); }
.modal__sub { font-size: var(--text-caption); color: var(--color-text-secondary); margin-top: 2px; }
.modal__close { width: 36px; height: 36px; border-radius: var(--radius-md); color: var(--color-text-secondary); display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
.modal__close:hover { background: var(--color-gray-100); color: var(--color-text-primary); }

/* Picker */
.picker__search {
  display: flex; align-items: center; gap: var(--space-2);
  padding: 0 var(--space-3); margin: var(--space-3) var(--space-5);
  background: var(--color-gray-50); border-radius: var(--radius-md);
  color: var(--color-text-tertiary);
}
.picker__search input { flex: 1; border: none; background: transparent; padding: var(--space-2) 0; min-height: var(--size-input-md); font-family: inherit; font-size: var(--text-body-sm); }
.picker__search input:focus { outline: none; }
.picker__list { list-style: none; overflow-y: auto; padding: 0 var(--space-3) var(--space-3); flex: 1; }
.picker__item {
  width: 100%; display: flex; align-items: center; gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md); text-align: left;
}
.picker__item:hover { background: var(--color-primary-subtle); }
.picker__avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--color-primary-muted); color: var(--color-primary-dark); display: inline-flex; align-items: center; justify-content: center; font-weight: var(--weight-semibold); font-size: var(--text-body-sm); flex-shrink: 0; }
.picker__body { flex: 1; min-width: 0; }
.picker__body strong { display: block; font-size: var(--text-body-sm); }
.picker__body small { display: block; font-size: var(--text-caption); color: var(--color-text-tertiary); }

/* Drawer (scan result) */
.drawer { align-items: flex-end; justify-content: center; padding: 0; }
@media (min-width: 640px) { .drawer { align-items: center; padding: var(--space-4); } }
.drawer__body {
  position: relative;
  width: 100%; max-width: 520px;
  max-height: 85vh;
  background: var(--color-white);
  border-top: 6px solid var(--color-success);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  box-shadow: var(--shadow-xl);
  display: flex; flex-direction: column;
  animation: slide-up 0.3s var(--ease-out);
}
@media (min-width: 640px) { .drawer__body { border-radius: var(--radius-xl); } }
.drawer__body--duplicate { border-top-color: var(--color-warning); }

.drawer__head {
  display: flex; justify-content: space-between; align-items: flex-start;
  padding: var(--space-5);
}
.drawer__status { display: flex; gap: var(--space-3); align-items: center; }
.drawer__status-icon {
  width: 56px; height: 56px; border-radius: 50%;
  display: inline-flex; align-items: center; justify-content: center;
  color: var(--color-white); flex-shrink: 0;
  animation: pop 0.4s var(--ease-out);
}
.drawer__status-icon.is-success { background: var(--color-success); }
.drawer__status-icon.is-warning { background: var(--color-warning); }
@keyframes pop { 0% { transform: scale(0.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }

.drawer__title { font-size: var(--text-h3); font-weight: var(--weight-bold); }
.drawer__dup { font-size: var(--text-body-sm); color: var(--color-warning-dark); margin-top: 2px; }

.drawer__content { padding: 0 var(--space-5) var(--space-4); flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: var(--space-4); }

.participant-hero { display: flex; gap: var(--space-4); align-items: center; padding: var(--space-4); background: var(--color-primary-subtle); border-radius: var(--radius-lg); }
.participant-hero__avatar {
  width: 56px; height: 56px; border-radius: 50%;
  background: var(--color-primary); color: var(--color-white);
  display: inline-flex; align-items: center; justify-content: center;
  font-weight: var(--weight-bold); font-size: var(--text-h3);
  flex-shrink: 0;
}
.participant-hero__name { font-size: var(--text-h3); font-weight: var(--weight-bold); line-height: 1.2; }
.participant-hero__full { font-size: var(--text-body-sm); color: var(--color-text-secondary); margin-top: 2px; }
.participant-hero__dept { font-size: var(--text-caption); color: var(--color-text-tertiary); margin-top: 2px; }

.allergy-alert {
  display: flex; gap: var(--space-3); align-items: flex-start;
  padding: var(--space-4);
  background: var(--color-danger-subtle);
  border: 2px solid var(--color-danger);
  border-radius: var(--radius-lg);
  color: var(--color-danger-dark);
}
.allergy-alert > :first-child { color: var(--color-danger); flex-shrink: 0; margin-top: 2px; }
.allergy-alert__title { font-size: var(--text-body); font-weight: var(--weight-bold); margin-bottom: 4px; }
.allergy-alert__text { font-size: var(--text-body-sm); color: var(--color-text-primary); line-height: var(--leading-relaxed); }

.details { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-2); }
.details > div { padding: var(--space-3); background: var(--color-gray-50); border-radius: var(--radius-md); }
.details dt { font-size: var(--text-caption); color: var(--color-text-tertiary); display: inline-flex; align-items: center; gap: 4px; margin-bottom: 2px; }
.details dd { font-size: var(--text-body-sm); color: var(--color-text-primary); font-weight: var(--weight-medium); }
.details code { font-family: var(--font-mono); font-size: var(--text-caption); }

.drawer__foot {
  display: flex; gap: var(--space-2); padding: var(--space-4) var(--space-5);
  border-top: 1px solid var(--color-border-light);
  background: var(--color-gray-50);
  border-radius: 0 0 var(--radius-xl) var(--radius-xl);
}
.drawer__foot > * { flex: 1; }

@media (prefers-reduced-motion: reduce) {
  .viewport__line, .drawer__status-icon, .drawer__body, .modal__body { animation: none !important; top: 50% !important; }
}
</style>
