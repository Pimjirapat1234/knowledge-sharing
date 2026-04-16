<script setup lang="ts">
/**
 * Registration Success Modal — shown after user confirms registration.
 * Contains: QR code · event details · email confirmation · download/calendar CTAs.
 * Blocking modal — forces user to acknowledge (so QR doesn't get lost).
 */
import { ref, watch, computed } from 'vue'
import {
  Check, X, Download, CalendarPlus, Mail, MapPin, Clock,
  Lightbulb, Sparkles, Copy,
} from 'lucide-vue-next'
import { buildQrPayload, qrToDataUrl, type QrPayload } from '@/composables/useQr'
import { useToast } from '@/composables/useToast'
import { formatDateRange } from '@/composables/useFormat'
import AppIcon from '@/components/ui/AppIcon.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppBadge from '@/components/ui/AppBadge.vue'

const props = defineProps<{
  open: boolean
  user: { id: string; name: string; nickname: string; email: string; department: string }
  event: { id: string; title: string; startAt: string; endAt: string; location: string }
  menuId?: string
  allergy?: string
}>()

const emit = defineEmits<{ close: [] }>()
const { success } = useToast()

const qrDataUrl = ref<string>('')
const payload = ref<QrPayload | null>(null)
const generating = ref(false)

const eventDateText = computed(() => formatDateRange(props.event.startAt, props.event.endAt))

async function regenerate() {
  generating.value = true
  const p = buildQrPayload({
    eventId: props.event.id,
    userId: props.user.id,
    name: props.user.name,
    email: props.user.email,
    dept: props.user.department,
    eventTitle: props.event.title,
    eventStart: props.event.startAt,
    eventLocation: props.event.location,
    menuId: props.menuId,
    allergy: props.allergy,
  })
  payload.value = p
  qrDataUrl.value = await qrToDataUrl(p, { size: 560 })
  generating.value = false
}

watch(() => props.open, (isOpen) => { if (isOpen) regenerate() })

function downloadQr() {
  if (!qrDataUrl.value) return
  const link = document.createElement('a')
  link.href = qrDataUrl.value
  link.download = `QR-${props.event.id}-${props.user.nickname}.png`
  link.click()
  success('บันทึก QR แล้ว', 'ไฟล์ .png ถูกดาวน์โหลด')
}

function copyQrText() {
  if (!payload.value) return
  const text = `Thinktank Event Check-in
งาน: ${props.event.title}
ชื่อ: ${props.user.name}
วันที่: ${eventDateText.value}
สถานที่: ${props.event.location}
Reg ID: ${payload.value.regId}`
  navigator.clipboard.writeText(text).then(() => {
    success('คัดลอกแล้ว', 'ข้อมูลการลงทะเบียน')
  })
}

function addToCalendar() {
  success('เพิ่มลงปฏิทินแล้ว', 'ไฟล์ .ics ส่งไปยังอีเมลพร้อม QR')
}
</script>

<template>
  <div v-if="open" class="mdl" role="dialog" aria-modal="true" aria-labelledby="mdl-title">
    <div class="mdl__bg" @click="emit('close')"></div>

    <div class="mdl__body">
      <!-- Confetti decoration -->
      <div class="mdl__confetti" aria-hidden="true">
        <span v-for="i in 24" :key="i" :style="`--i:${i}`"></span>
      </div>

      <!-- Close -->
      <button class="mdl__close" aria-label="ปิด" @click="emit('close')">
        <AppIcon :icon="X" size="md" />
      </button>

      <!-- Header -->
      <header class="mdl__head">
        <div class="mdl__check" aria-hidden="true">
          <AppIcon :icon="Check" size="xl" :stroke-width="3" />
        </div>
        <h1 id="mdl-title" class="mdl__title">
          ลงทะเบียนเรียบร้อย
          <span class="mdl__sparkle" aria-hidden="true"><AppIcon :icon="Sparkles" size="md" /></span>
        </h1>
        <p class="mdl__lead">ยินดีต้อนรับ คุณ{{ user.nickname }} · เจอกันในงาน</p>
      </header>

      <!-- QR display -->
      <section class="mdl__qr-section" aria-labelledby="qr-head">
        <div class="mdl__qr-head" id="qr-head">
          <h2 class="mdl__section-title">QR สำหรับเช็คอินหน้างาน</h2>
          <AppBadge variant="success" size="md">
            <AppIcon :icon="Mail" size="sm" aria-hidden="true" />
            ส่งไปอีเมลแล้ว
          </AppBadge>
        </div>

        <div class="qr-wrap">
          <div class="qr-box">
            <div v-if="generating" class="qr-loading" aria-busy="true">
              <div class="qr-loading__shimmer"></div>
              <p>กำลังสร้าง QR...</p>
            </div>
            <img v-else :src="qrDataUrl" :alt="`QR สำหรับ ${user.name}`" class="qr-img" />
          </div>

          <div class="qr-info">
            <div class="reg-id">
              <span>REG ID</span>
              <code>{{ payload?.regId || '…' }}</code>
            </div>
            <p class="qr-hint">
              <AppIcon :icon="Lightbulb" size="sm" aria-hidden="true" />
              แสดง QR นี้หน้าประตูวันงาน · ใช้เช็คอินได้ 1 ครั้ง
            </p>
          </div>
        </div>
      </section>

      <!-- Email confirmation -->
      <section class="mdl__email">
        <div class="email-icon"><AppIcon :icon="Mail" size="md" aria-hidden="true" /></div>
        <div>
          <p class="email-to">ส่ง QR + ICS ไปที่ <strong>{{ user.email }}</strong></p>
          <p class="email-sub">เช็คในกล่องจดหมาย · ถ้าไม่เจอ ลอง Spam · <a href="#">ส่งใหม่</a></p>
        </div>
      </section>

      <!-- Event summary -->
      <section class="mdl__event">
        <h2 class="mdl__section-title">รายละเอียดงาน</h2>
        <div class="event-card">
          <h3 class="event-card__title">{{ event.title }}</h3>
          <ul class="event-card__list">
            <li>
              <AppIcon :icon="Clock" size="sm" aria-hidden="true" />
              <span>{{ eventDateText }}</span>
            </li>
            <li>
              <AppIcon :icon="MapPin" size="sm" aria-hidden="true" />
              <span>{{ event.location }}</span>
            </li>
          </ul>
        </div>
      </section>

      <!-- Actions -->
      <footer class="mdl__foot">
        <AppButton variant="secondary" size="md" @click="copyQrText">
          <AppIcon :icon="Copy" size="sm" aria-hidden="true" />
          Copy ข้อมูล
        </AppButton>
        <AppButton variant="secondary" size="md" @click="addToCalendar">
          <AppIcon :icon="CalendarPlus" size="sm" aria-hidden="true" />
          เพิ่มปฏิทิน
        </AppButton>
        <AppButton variant="primary" size="md" @click="downloadQr">
          <AppIcon :icon="Download" size="sm" aria-hidden="true" />
          บันทึก QR (.png)
        </AppButton>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.mdl {
  position: fixed; inset: 0;
  z-index: var(--z-modal);
  display: flex; align-items: center; justify-content: center;
  padding: var(--space-4);
}
.mdl__bg {
  position: absolute; inset: 0;
  background: rgba(35, 31, 32, 0.55);
  backdrop-filter: blur(6px);
  animation: fade-in var(--duration-normal) var(--ease-out);
}

.mdl__body {
  position: relative;
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  overflow: auto;
  background: var(--color-white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  padding: var(--space-6);
  animation: pop 0.5s var(--ease-out);
}
@media (min-width: 640px) { .mdl__body { padding: var(--space-8); } }

@keyframes pop {
  0% { opacity: 0; transform: scale(0.9) translateY(16px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }

/* Confetti */
.mdl__confetti { position: absolute; inset: 0; pointer-events: none; overflow: hidden; border-radius: var(--radius-xl); }
.mdl__confetti span {
  position: absolute; top: 20%; left: 50%;
  width: 8px; height: 12px;
  border-radius: 2px; opacity: 0;
  animation: confetti 2.5s var(--ease-out) forwards;
  animation-delay: calc(var(--i, 0) * 50ms);
}
.mdl__confetti span:nth-child(5n) { background: var(--color-primary); }
.mdl__confetti span:nth-child(5n + 1) { background: var(--color-success); }
.mdl__confetti span:nth-child(5n + 2) { background: var(--color-warning); }
.mdl__confetti span:nth-child(5n + 3) { background: var(--color-info); }
.mdl__confetti span:nth-child(5n + 4) { background: var(--color-primary-light); }
@keyframes confetti {
  0% { transform: translate(-50%, 0) rotate(0deg); opacity: 1; }
  100% { transform: translate(calc(-50% + (var(--i, 0) * 18px - 216px)), 100vh) rotate(720deg); opacity: 0; }
}

.mdl__close {
  position: absolute; top: var(--space-3); right: var(--space-3);
  width: 40px; height: 40px; border-radius: var(--radius-md);
  display: inline-flex; align-items: center; justify-content: center;
  color: var(--color-text-secondary);
  background: var(--color-gray-100);
  z-index: 2;
}
.mdl__close:hover { background: var(--color-gray-200); color: var(--color-text-primary); }

/* Header */
.mdl__head { text-align: center; margin-bottom: var(--space-5); position: relative; z-index: 1; }
.mdl__check {
  width: 72px; height: 72px; border-radius: 50%;
  background: var(--color-success); color: var(--color-white);
  display: inline-flex; align-items: center; justify-content: center;
  margin-bottom: var(--space-3);
  animation: bounce 0.6s var(--ease-out) 0.2s both;
}
@keyframes bounce {
  0% { transform: scale(0); }
  60% { transform: scale(1.15); }
  100% { transform: scale(1); }
}
.mdl__title {
  font-size: var(--text-h2); font-weight: var(--weight-bold);
  line-height: var(--leading-snug);
  display: inline-flex; align-items: center; gap: var(--space-2);
}
.mdl__sparkle { color: var(--color-warning); animation: spin-slow 3s linear infinite; }
@keyframes spin-slow { from { transform: rotate(0); } to { transform: rotate(360deg); } }
.mdl__lead { font-size: var(--text-body); color: var(--color-text-secondary); margin-top: var(--space-2); }

.mdl__section-title {
  font-size: var(--text-body);
  font-weight: var(--weight-semibold);
  color: var(--color-text-primary);
}

/* QR section */
.mdl__qr-section { margin-bottom: var(--space-4); position: relative; z-index: 1; }
.mdl__qr-head { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-2); margin-bottom: var(--space-3); }

.qr-wrap {
  display: flex; flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-5);
  background: linear-gradient(135deg, var(--color-primary-subtle) 0%, var(--color-white) 100%);
  border: 2px solid var(--color-primary-muted);
  border-radius: var(--radius-xl);
}
.qr-box {
  padding: var(--space-2);
  background: var(--color-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}
.qr-img { display: block; width: 280px; height: 280px; max-width: 100%; image-rendering: pixelated; }

.qr-loading { width: 280px; height: 280px; background: var(--color-gray-100); border-radius: var(--radius-md); display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--color-text-tertiary); font-size: var(--text-caption); gap: var(--space-2); position: relative; overflow: hidden; }
.qr-loading__shimmer { position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent); animation: shimmer 1.4s infinite; }
@keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }

.qr-info { text-align: center; width: 100%; }
.reg-id { display: flex; justify-content: center; align-items: center; gap: var(--space-2); margin-bottom: var(--space-2); font-size: var(--text-caption); color: var(--color-text-secondary); }
.reg-id code { font-family: var(--font-mono); background: var(--color-white); padding: 2px var(--space-2); border-radius: var(--radius-sm); color: var(--color-text-primary); font-weight: var(--weight-semibold); font-size: 11px; }

.qr-hint {
  display: inline-flex; align-items: center; gap: var(--space-2); justify-content: center;
  font-size: var(--text-caption);
  color: var(--color-primary-dark);
  font-weight: var(--weight-medium);
}

/* Email section */
.mdl__email {
  display: flex; gap: var(--space-3); align-items: center;
  padding: var(--space-4);
  background: var(--color-success-subtle);
  border: 1px solid var(--color-success-light);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-4);
  position: relative; z-index: 1;
}
.email-icon {
  width: 40px; height: 40px; border-radius: 50%;
  background: var(--color-success); color: var(--color-white);
  display: inline-flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.email-to { font-size: var(--text-body-sm); color: var(--color-text-primary); }
.email-to strong { color: var(--color-success-dark); }
.email-sub { font-size: var(--text-caption); color: var(--color-text-secondary); margin-top: 2px; }

/* Event summary */
.mdl__event { margin-bottom: var(--space-5); position: relative; z-index: 1; }
.event-card {
  padding: var(--space-4);
  background: var(--color-gray-50);
  border-radius: var(--radius-lg);
  margin-top: var(--space-2);
}
.event-card__title { font-size: var(--text-body); font-weight: var(--weight-semibold); margin-bottom: var(--space-2); }
.event-card__list { list-style: none; display: flex; flex-direction: column; gap: var(--space-1); }
.event-card__list li { display: inline-flex; align-items: center; gap: var(--space-2); font-size: var(--text-body-sm); color: var(--color-text-secondary); }

/* Footer actions */
.mdl__foot {
  display: flex; flex-wrap: wrap; gap: var(--space-2);
  position: relative; z-index: 1;
}
.mdl__foot > * { flex: 1; min-width: 110px; }

@media (prefers-reduced-motion: reduce) {
  .mdl__body, .mdl__check, .mdl__sparkle, .mdl__confetti, .qr-loading__shimmer { animation: none !important; }
}
</style>
