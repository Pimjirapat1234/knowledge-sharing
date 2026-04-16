<script setup lang="ts">
/**
 * Screen #4 — Registration Form (User Story E2, FR-REG, FR-PDPA-01).
 * PRD §12 design goals: ≤3 clicks, mobile-first, WCAG 2.2 AA, PDPA consent layers,
 * trust builders, delight on success.
 */
import { computed, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import {
  Check, Calendar, MapPin, ShieldCheck, AlertTriangle, Bell, Mail, MessageCircle,
  ArrowLeft, FileText,
} from 'lucide-vue-next'
import { useUserStore } from '@/stores/user'
import { useEventStore } from '@/stores/event'
import { useUiState } from '@/composables/useUiState'
import { useToast } from '@/composables/useToast'
import { formatDateTime, formatDateRange } from '@/composables/useFormat'
import AppIcon from '@/components/ui/AppIcon.vue'
import AppButton from '@/components/ui/AppButton.vue'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import RegistrationSuccessModal from '@/components/event/RegistrationSuccessModal.vue'

const userStore = useUserStore()
const eventStore = useEventStore()
const { user } = storeToRefs(userStore)
const { event } = storeToRefs(eventStore)
const ui = useUiState()
const router = useRouter()
const { success: toastSuccess } = useToast()

const phone = ref('')
const allergyText = ref('')
const notifyEmail = ref(true)
const notifyLine = ref(true)

const consentRequired = ref(false)
const consentAllergy = ref(false)
const consentNotify = ref(true)

type SubmitState = 'form' | 'submitting' | 'success'
const submitState = ref<SubmitState>('form')
const showValidation = ref(false)
const showSuccessModal = ref(false)

const canSubmit = computed(() => consentRequired.value)
const showAllergyBlock = computed(() => consentAllergy.value)

const deadlineText = computed(() => formatDateTime(event.value.registrationDeadline))
const eventDateText = computed(() => formatDateRange(event.value.startAt, event.value.endAt))
const capacityPct = computed(() => Math.min(100, Math.round((event.value.registeredCount / event.value.capacity) * 100)))
const spotsLeft = computed(() => event.value.capacity - event.value.registeredCount)

// Forced success state (via ?state=success)
const forceSuccess = computed(() => ui.isSuccess.value)

function handleSubmit() {
  showValidation.value = true
  if (!canSubmit.value) return
  submitState.value = 'submitting'
  setTimeout(() => {
    submitState.value = 'success'
    // Open success modal with QR
    showSuccessModal.value = true
    // Simulate email sent toast
    toastSuccess(
      `ส่ง QR ไปที่ ${user.value.email}`,
      'เช็คในกล่องจดหมาย · ใช้ QR นี้เช็คอินหน้างาน',
    )
  }, 900)
}

function closeSuccessModal() {
  showSuccessModal.value = false
  // Navigate back to event detail after closing modal
  router.push(`/events/${event.value.id}`)
}

// Allow state=success to force-open the modal (demo)
watchEffect(() => {
  if (forceSuccess.value) showSuccessModal.value = true
})

function handleCancel() {
  if (confirm('ยกเลิกการลงทะเบียน? · ข้อมูลที่กรอกจะหาย')) {
    window.history.back()
  }
}
</script>

<template>
  <div class="page">
    <!-- BLOCKING ERROR — 404/permission -->
    <ErrorState
      v-if="ui.isErrorBlocking.value"
      :recoverable="false"
      title="ไม่พบกิจกรรมนี้"
      message="กิจกรรมอาจถูกลบไปแล้ว หรือคุณไม่มีสิทธิ์เข้าถึง · ติดต่อ HR เพื่อสอบถามเพิ่มเติม"
    />

    <!-- RECOVERABLE ERROR -->
    <ErrorState
      v-else-if="ui.isError.value"
      title="ดึงข้อมูลกิจกรรมไม่ได้"
      message="เครือข่ายมีปัญหาชั่วคราว · ตรวจสอบอินเทอร์เน็ตแล้วลองใหม่"
    />

    <!-- EMPTY — no event available -->
    <EmptyState
      v-else-if="ui.isEmpty.value"
      title="ยังไม่มีกิจกรรมที่เปิดลงทะเบียน"
      message="HR จะส่งเชิญเมื่อมีงานใหม่ · ระหว่างนี้ดูประวัติได้ที่ My Events"
      cta-label="กลับหน้าหลัก"
    />

    <!-- LOADING — fetching event + SSO prefill -->
    <div v-else-if="ui.isLoading.value" class="loading-wrap">
      <LoadingSkeleton variant="block" height="200px" />
      <LoadingSkeleton variant="line" width="70%" height="28px" />
      <LoadingSkeleton variant="line" :count="3" />
      <LoadingSkeleton variant="card" :count="2" />
    </div>

    <!-- PARTIAL — event loaded, waiting for capacity data -->
    <template v-else-if="ui.isPartial.value">
      <nav class="crumbs" aria-label="breadcrumb">
        <a href="/">หน้าหลัก</a><span aria-hidden="true">›</span>
        <a href="/">กิจกรรม</a><span aria-hidden="true">›</span>
        <span aria-current="page">ลงทะเบียน</span>
      </nav>
      <section class="banner">
        <div class="banner__body">
          <p class="banner__tagline">{{ event.tagline }}</p>
          <h1 class="banner__title">{{ event.title }}</h1>
          <ul class="banner__meta">
            <li><AppIcon :icon="Calendar" size="sm" aria-hidden="true" /> {{ eventDateText }}</li>
            <li><AppIcon :icon="MapPin" size="sm" aria-hidden="true" /> {{ event.location }}</li>
          </ul>
          <div class="capacity">
            <LoadingSkeleton variant="line" height="8px" />
            <p class="capacity__text" style="opacity: 0.6">กำลังตรวจสอบจำนวนที่นั่ง...</p>
          </div>
        </div>
      </section>
    </template>

    <!-- FORM (happy path · modal handles success) -->
    <template v-else>
      <nav class="crumbs" aria-label="breadcrumb">
        <a href="/">หน้าหลัก</a><span aria-hidden="true">›</span>
        <a href="/events/evt-2026-q2">กิจกรรม</a><span aria-hidden="true">›</span>
        <span aria-current="page">ลงทะเบียน</span>
      </nav>

      <section class="banner" aria-labelledby="event-title">
        <div class="banner__image">
          <img :src="event.bannerUrl" :alt="event.title" loading="lazy" />
          <span class="banner__badge">เปิดลงทะเบียน</span>
        </div>
        <div class="banner__body">
          <p class="banner__tagline">{{ event.tagline }}</p>
          <h1 id="event-title" class="banner__title">{{ event.title }}</h1>
          <ul class="banner__meta" role="list">
            <li><AppIcon :icon="Calendar" size="sm" aria-hidden="true" /> {{ eventDateText }}</li>
            <li><AppIcon :icon="MapPin" size="sm" aria-hidden="true" /> {{ event.location }}</li>
          </ul>
          <div
            class="capacity"
            role="progressbar"
            :aria-valuenow="event.registeredCount"
            :aria-valuemax="event.capacity"
          >
            <div class="capacity__bar">
              <div class="capacity__fill" :style="`width: ${capacityPct}%`"></div>
            </div>
            <p class="capacity__text">
              <strong>{{ event.registeredCount }}</strong> จาก {{ event.capacity }} คนลงทะเบียนแล้ว · เหลือ
              <strong>{{ spotsLeft }}</strong> ที่
            </p>
          </div>
        </div>
      </section>

      <form class="form" @submit.prevent="handleSubmit" novalidate>
        <div class="alert alert--info" role="note">
          <AppIcon :icon="ShieldCheck" size="lg" class="alert__icon" aria-hidden="true" />
          <div>
            <p class="alert__title">ข้อมูลของคุณดึงจาก SSO Real Factory</p>
            <p class="alert__body">แก้ไขได้จนถึง <strong>{{ deadlineText }}</strong></p>
          </div>
        </div>

        <fieldset class="section">
          <legend class="section__title">ข้อมูลผู้เข้าร่วม</legend>
          <p class="section__desc">ดึงอัตโนมัติจาก SSO · ต้องการแก้ไข? ติดต่อ HR</p>
          <div class="field-grid">
            <div class="field">
              <label class="field__label" for="name">ชื่อ–นามสกุล</label>
              <input id="name" type="text" class="input" :value="user.name" readonly aria-readonly="true" />
            </div>
            <div class="field">
              <label class="field__label" for="email">อีเมล</label>
              <input id="email" type="email" class="input" :value="user.email" readonly aria-readonly="true" />
            </div>
            <div class="field">
              <label class="field__label" for="dept">แผนก</label>
              <input id="dept" type="text" class="input" :value="user.department" readonly aria-readonly="true" />
            </div>
            <div class="field">
              <label class="field__label" for="phone">
                เบอร์โทร <span class="field__hint">(ไม่บังคับ)</span>
              </label>
              <input
                id="phone"
                v-model="phone"
                type="tel"
                class="input"
                placeholder="เช่น 081-234-5678"
                autocomplete="tel"
                maxlength="20"
              />
              <p class="field__helper">ใช้ติดต่อในกรณีเร่งด่วนวันงานเท่านั้น</p>
            </div>
          </div>
        </fieldset>

        <fieldset class="section">
          <legend class="section__title">การแจ้งเตือน</legend>
          <p class="section__desc">เราจะส่งยืนยันและเตือนก่อนวันงาน T-1d + T-1h</p>
          <div class="toggle-list">
            <label class="tgx">
              <input v-model="notifyEmail" type="checkbox" />
              <span class="tgx__box"><AppIcon v-if="notifyEmail" :icon="Check" size="sm" :stroke-width="3" aria-hidden="true" /></span>
              <div class="tgx__body">
                <span class="tgx__row">
                  <AppIcon :icon="Mail" size="sm" aria-hidden="true" />
                  <span class="tgx__title">อีเมล</span>
                </span>
                <span class="tgx__desc">{{ user.email }}</span>
              </div>
            </label>
            <label class="tgx">
              <input v-model="notifyLine" type="checkbox" />
              <span class="tgx__box"><AppIcon v-if="notifyLine" :icon="Check" size="sm" :stroke-width="3" aria-hidden="true" /></span>
              <div class="tgx__body">
                <span class="tgx__row">
                  <AppIcon :icon="MessageCircle" size="sm" aria-hidden="true" />
                  <span class="tgx__title">LINE</span>
                </span>
                <span class="tgx__desc">ผ่าน Real Factory Official · เปิด notification ได้ในหน้า Profile</span>
              </div>
            </label>
          </div>
        </fieldset>

        <fieldset class="section section--consent">
          <legend class="section__title">ความยินยอมการใช้ข้อมูล (PDPA)</legend>
          <p class="section__desc">โปรดอ่านและเลือกการยินยอม · ดู <a href="#privacy">นโยบายความเป็นส่วนตัว</a></p>

          <div class="consent-list">
            <label class="consent" :class="{ 'consent--error': showValidation && !consentRequired }">
              <input v-model="consentRequired" type="checkbox" :aria-invalid="showValidation && !consentRequired" />
              <span class="consent__box"><AppIcon v-if="consentRequired" :icon="Check" size="sm" :stroke-width="3" aria-hidden="true" /></span>
              <div>
                <span class="consent__title">
                  ใช้ข้อมูลส่วนบุคคลเพื่อจัดงานนี้
                  <span class="consent__required" aria-label="จำเป็น">*</span>
                </span>
                <span class="consent__desc">
                  ชื่อ · อีเมล · แผนก — ใช้สำหรับจัดกลุ่ม · ส่งการแจ้งเตือน · สรุปผลงาน (เก็บ 90 วันหลังงาน)
                </span>
              </div>
            </label>

            <label class="consent consent--sensitive">
              <input v-model="consentAllergy" type="checkbox" />
              <span class="consent__box"><AppIcon v-if="consentAllergy" :icon="Check" size="sm" :stroke-width="3" aria-hidden="true" /></span>
              <div>
                <span class="consent__title">เก็บข้อมูลสุขภาพ (ประวัติแพ้อาหาร)</span>
                <span class="consent__desc">
                  ยินยอมเพื่อให้ทีม catering เตรียมอาหารปลอดภัย — HR เห็นเฉพาะแจ้งเตือนกรณีแพ้ ไม่ระบุชื่อ
                </span>
              </div>
            </label>

            <div v-if="showAllergyBlock" class="allergy-field">
              <label class="field__label" for="allergy">
                รายละเอียดการแพ้อาหาร <span class="field__hint">(สูงสุด 200 ตัวอักษร)</span>
              </label>
              <textarea
                id="allergy"
                v-model="allergyText"
                class="textarea"
                rows="3"
                maxlength="200"
                placeholder="เช่น แพ้กุ้ง · แพ้ถั่ว · ทานมังสวิรัติ"
              ></textarea>
              <p class="field__counter">{{ allergyText.length }} / 200</p>
            </div>

            <label class="consent">
              <input v-model="consentNotify" type="checkbox" />
              <span class="consent__box"><AppIcon v-if="consentNotify" :icon="Check" size="sm" :stroke-width="3" aria-hidden="true" /></span>
              <div>
                <span class="consent__title">
                  <AppIcon :icon="Bell" size="sm" aria-hidden="true" /> รับการแจ้งเตือนทาง email / LINE
                </span>
                <span class="consent__desc">
                  กำหนดการ · การเปลี่ยนแปลง · ผลโหวตและ leaderboard — ยกเลิกได้ทุกเมื่อในหน้า Profile
                </span>
              </div>
            </label>
          </div>

          <p v-if="showValidation && !consentRequired" class="form-error" role="alert">
            <AppIcon :icon="AlertTriangle" size="sm" aria-hidden="true" />
            ต้องให้ความยินยอมข้อแรกเพื่อลงทะเบียน · โปรดเลือก ☑ ช่องที่ทำเครื่องหมาย *
          </p>
        </fieldset>

        <div class="actions" role="group">
          <AppButton variant="secondary" size="lg" type="button" @click="handleCancel">
            <AppIcon :icon="ArrowLeft" size="md" aria-hidden="true" />
            ยกเลิก
          </AppButton>
          <AppButton
            variant="primary"
            size="lg"
            type="submit"
            :loading="submitState === 'submitting'"
          >
            <AppIcon :icon="FileText" size="md" aria-hidden="true" />
            {{ submitState === 'submitting' ? 'กำลังบันทึก...' : 'ยืนยันการลงทะเบียน' }}
          </AppButton>
        </div>

        <p class="legal-note">
          โดยการกดยืนยัน คุณยอมรับ <a href="#terms">ข้อกำหนด</a> และ
          <a href="#privacy">นโยบายความเป็นส่วนตัว</a> · ติดต่อ DPO ที่
          <a href="mailto:dpo@real-factory.co">dpo@real-factory.co</a>
        </p>
      </form>
    </template>

    <!-- Success modal with QR code -->
    <RegistrationSuccessModal
      :open="showSuccessModal"
      :user="user"
      :event="{ id: event.id, title: event.title, startAt: event.startAt, endAt: event.endAt, location: event.location }"
      :allergy="allergyText || undefined"
      @close="closeSuccessModal"
    />
  </div>
</template>

<style scoped>
.page {
  max-width: 720px;
  margin: 0 auto;
  padding: var(--space-4);
  padding-bottom: var(--space-16);
}
@media (min-width: 768px) { .page { padding: var(--space-8) var(--space-6); } }

.loading-wrap { display: flex; flex-direction: column; gap: var(--space-4); }

.crumbs {
  display: flex; align-items: center; gap: var(--space-2);
  font-size: var(--text-body-sm); color: var(--color-text-secondary);
  margin-bottom: var(--space-4); flex-wrap: wrap;
}
.crumbs a { color: var(--color-text-secondary); }
.crumbs a:hover { color: var(--color-text-link); }
.crumbs [aria-current='page'] { color: var(--color-text-primary); font-weight: var(--weight-medium); }

.banner {
  background: var(--color-white);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  margin-bottom: var(--space-6);
}
.banner__image {
  position: relative; aspect-ratio: 16/9;
  background: var(--color-gray-200); overflow: hidden;
}
.banner__image img { width: 100%; height: 100%; object-fit: cover; display: block; }
.banner__badge {
  position: absolute; top: var(--space-4); left: var(--space-4);
  background: var(--color-success); color: var(--color-white);
  font-size: var(--text-caption); font-weight: var(--weight-semibold);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  letter-spacing: var(--tracking-wide);
}
.banner__body { padding: var(--space-6); }
.banner__tagline {
  font-size: var(--text-caption); font-weight: var(--weight-semibold);
  text-transform: uppercase; letter-spacing: var(--tracking-wider);
  color: var(--color-primary); margin-bottom: var(--space-2);
}
.banner__title {
  font-size: var(--text-h2); font-weight: var(--weight-bold);
  line-height: var(--leading-snug); color: var(--color-text-primary);
  margin-bottom: var(--space-4);
}
@media (min-width: 768px) { .banner__title { font-size: var(--text-h1); } }

.banner__meta {
  list-style: none; display: flex; flex-direction: column; gap: var(--space-2);
  margin-bottom: var(--space-5);
}
.banner__meta li {
  display: flex; align-items: center; gap: var(--space-2);
  font-size: var(--text-body-sm); color: var(--color-text-secondary);
}

.capacity { padding-top: var(--space-4); border-top: 1px solid var(--color-border-light); }
.capacity__bar {
  height: 8px; background: var(--color-gray-200);
  border-radius: var(--radius-full); overflow: hidden; margin-bottom: var(--space-2);
}
.capacity__fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), var(--color-primary-light));
  border-radius: var(--radius-full);
  transition: width var(--duration-slow) var(--ease-out);
}
.capacity__text { font-size: var(--text-body-sm); color: var(--color-text-secondary); }
.capacity__text strong { color: var(--color-text-primary); font-weight: var(--weight-semibold); }

.form { display: flex; flex-direction: column; gap: var(--space-5); }

.alert {
  display: flex; gap: var(--space-3);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  background: var(--color-primary-subtle);
  border: 1px solid var(--color-primary-muted);
}
.alert__icon { color: var(--color-primary); flex-shrink: 0; }
.alert__title { font-size: var(--text-body-sm); font-weight: var(--weight-semibold); color: var(--color-text-primary); margin-bottom: 2px; }
.alert__body { font-size: var(--text-body-sm); color: var(--color-text-secondary); }

.section {
  background: var(--color-white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  padding: var(--space-5);
  display: flex; flex-direction: column; gap: var(--space-4);
}
@media (min-width: 768px) { .section { padding: var(--space-6); } }
.section--consent { border-left: 4px solid var(--color-primary); }
.section__title { font-size: var(--text-h4); font-weight: var(--weight-semibold); color: var(--color-text-primary); padding: 0; }
.section__desc { font-size: var(--text-body-sm); color: var(--color-text-secondary); margin-top: calc(var(--space-3) * -1); }

.field-grid { display: grid; grid-template-columns: 1fr; gap: var(--space-4); }
@media (min-width: 640px) { .field-grid { grid-template-columns: 1fr 1fr; } }
.field { display: flex; flex-direction: column; gap: var(--space-2); }
.field__label { font-size: var(--text-body-sm); font-weight: var(--weight-medium); color: var(--color-text-primary); }
.field__hint { font-weight: var(--weight-regular); color: var(--color-text-tertiary); }
.field__helper { font-size: var(--text-caption); color: var(--color-text-secondary); }
.field__counter { font-size: var(--text-caption); color: var(--color-text-tertiary); text-align: right; }

.input, .textarea {
  width: 100%;
  min-height: var(--size-input-lg);
  padding: var(--space-input-y) var(--space-input-x);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  font-size: var(--text-body);
  color: var(--color-text-primary);
  background: var(--color-white);
  transition: border-color var(--duration-fast), box-shadow var(--duration-fast);
  font-family: inherit;
}
.input[readonly] { background: var(--color-gray-100); color: var(--color-text-secondary); cursor: not-allowed; }
.input:focus, .textarea:focus { outline: none; border-color: var(--color-border-focus); box-shadow: var(--shadow-focus); }
.textarea { min-height: 88px; resize: vertical; line-height: var(--leading-relaxed); }

.toggle-list, .consent-list { display: flex; flex-direction: column; gap: var(--space-2); }

.tgx, .consent {
  display: flex; align-items: flex-start; gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  cursor: pointer;
  background: var(--color-white);
  min-height: var(--size-touch-target);
  transition: all var(--duration-fast);
}
.tgx:hover, .consent:hover { background: var(--color-gray-50); }
.consent { padding: var(--space-4); }
.consent--sensitive { background: var(--color-warning-subtle); border-color: var(--color-warning-light); }
.consent--error { border-color: var(--color-danger); background: var(--color-danger-subtle); }

.tgx input, .consent input { position: absolute; opacity: 0; pointer-events: none; }

.tgx__box, .consent__box {
  flex-shrink: 0;
  width: 22px; height: 22px;
  border: 2px solid var(--color-border-strong);
  border-radius: var(--radius-sm);
  background: var(--color-white);
  margin-top: 2px;
  display: inline-flex; align-items: center; justify-content: center;
  color: var(--color-white);
  transition: all var(--duration-fast);
}
.tgx input:checked + .tgx__box,
.consent input:checked + .consent__box {
  background: var(--color-primary); border-color: var(--color-primary);
}
.tgx input:focus-visible + .tgx__box,
.consent input:focus-visible + .consent__box { box-shadow: var(--shadow-focus); }

.tgx__body, .consent div { display: flex; flex-direction: column; gap: 2px; }
.tgx__row { display: inline-flex; align-items: center; gap: var(--space-2); color: var(--color-text-primary); }
.tgx__title { font-size: var(--text-body); font-weight: var(--weight-medium); }
.tgx__desc { font-size: var(--text-caption); color: var(--color-text-secondary); }

.consent__title {
  display: inline-flex; align-items: center; gap: var(--space-2);
  font-size: var(--text-body); font-weight: var(--weight-medium);
  color: var(--color-text-primary);
  margin-bottom: var(--space-1);
}
.consent__required { color: var(--color-danger); font-weight: var(--weight-bold); }
.consent__desc { font-size: var(--text-body-sm); color: var(--color-text-secondary); line-height: var(--leading-relaxed); }

.allergy-field {
  display: flex; flex-direction: column; gap: var(--space-2);
  padding: var(--space-4);
  background: var(--color-warning-subtle);
  border: 1px solid var(--color-warning-light);
  border-radius: var(--radius-lg);
}

.form-error {
  display: flex; gap: var(--space-2); align-items: center;
  font-size: var(--text-body-sm); color: var(--color-danger-dark);
  padding: var(--space-3);
  background: var(--color-danger-subtle);
  border-radius: var(--radius-md);
  animation: shake var(--duration-slow) var(--ease-out);
}
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

.actions {
  display: flex; flex-direction: column-reverse; gap: var(--space-3); padding-top: var(--space-2);
}
@media (min-width: 640px) { .actions { flex-direction: row; justify-content: flex-end; } }

.legal-note {
  font-size: var(--text-caption); color: var(--color-text-tertiary);
  text-align: center; line-height: var(--leading-relaxed);
}

/* Success state */
.success { position: relative; min-height: 60vh; display: flex; align-items: center; justify-content: center; padding: var(--space-4); }
.success__card {
  position: relative; width: 100%; max-width: 560px;
  background: var(--color-white);
  border-radius: var(--radius-xl);
  padding: var(--space-8) var(--space-6);
  text-align: center;
  box-shadow: var(--shadow-lg);
  animation: pop 0.6s var(--ease-out);
}
@media (min-width: 640px) { .success__card { padding: var(--space-12) var(--space-10); } }
@keyframes pop {
  0% { opacity: 0; transform: scale(0.9); }
  100% { opacity: 1; transform: scale(1); }
}
.success__icon {
  width: 72px; height: 72px; border-radius: 50%;
  background: var(--color-success); color: var(--color-white);
  display: inline-flex; align-items: center; justify-content: center;
  margin-bottom: var(--space-4);
  animation: check-bounce 0.5s var(--ease-out) 0.2s both;
}
@keyframes check-bounce {
  0% { transform: scale(0); }
  60% { transform: scale(1.15); }
  100% { transform: scale(1); }
}
.success__title {
  font-size: var(--text-h2); font-weight: var(--weight-bold);
  color: var(--color-text-primary); margin-bottom: var(--space-3);
  line-height: var(--leading-snug);
}
.success__lead { font-size: var(--text-body); color: var(--color-text-secondary); line-height: var(--leading-relaxed); margin-bottom: var(--space-5); }
.success__email { color: var(--color-primary); font-weight: var(--weight-medium); }
.success__info {
  background: var(--color-gray-50); border-radius: var(--radius-lg);
  padding: var(--space-4); margin-bottom: var(--space-5); text-align: left;
  display: flex; flex-direction: column; gap: var(--space-3);
}
.success__info-row { display: flex; justify-content: space-between; gap: var(--space-4); font-size: var(--text-body-sm); }
.success__info-label { color: var(--color-text-secondary); flex-shrink: 0; }
.success__info-value { color: var(--color-text-primary); font-weight: var(--weight-medium); text-align: right; }
.success__note {
  display: inline-flex; align-items: center; gap: var(--space-2);
  font-size: var(--text-body-sm); color: var(--color-success-dark);
  background: var(--color-success-subtle);
  padding: var(--space-3) var(--space-4); border-radius: var(--radius-md);
  margin-bottom: var(--space-6);
}
.success__actions {
  display: flex; flex-direction: column; gap: var(--space-3); margin-bottom: var(--space-5);
}
@media (min-width: 640px) { .success__actions { flex-direction: row; justify-content: center; } }
.success__next { font-size: var(--text-caption); color: var(--color-text-tertiary); line-height: var(--leading-relaxed); }

.success__confetti { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.success__confetti span {
  position: absolute; top: 20%; left: 50%;
  width: 8px; height: 14px;
  border-radius: 2px; opacity: 0;
  animation: confetti 2.2s var(--ease-out) forwards;
  animation-delay: calc(var(--i, 0) * 30ms);
}
.success__confetti span:nth-child(5n) { background: var(--color-primary); }
.success__confetti span:nth-child(5n + 1) { background: var(--color-success); }
.success__confetti span:nth-child(5n + 2) { background: var(--color-warning); }
.success__confetti span:nth-child(5n + 3) { background: var(--color-info); }
.success__confetti span:nth-child(5n + 4) { background: var(--color-primary-light); }
@keyframes confetti {
  0% { transform: translate(-50%, 0) rotate(0deg); opacity: 1; }
  100% { transform: translate(calc(-50% + (var(--i, 0) * 12px - 180px)), 120vh) rotate(720deg); opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .success__confetti, .form-error, .success__card, .success__icon { animation: none !important; }
}
</style>
