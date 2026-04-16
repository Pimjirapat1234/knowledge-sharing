<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import {
  Languages, Bell, Shield, LogOut, Download, Trash2, Mail, Phone,
} from 'lucide-vue-next'
import { useUserStore, ROLE_LABEL } from '@/stores/user'
import { useToast } from '@/composables/useToast'
import { useUiState } from '@/composables/useUiState'
import AppIcon from '@/components/ui/AppIcon.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppToggle from '@/components/ui/AppToggle.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton.vue'

const router = useRouter()
const { user, currentRole } = storeToRefs(useUserStore())
const { success, info } = useToast()
const ui = useUiState()

const language = ref<'th' | 'en'>('th')
const notifyEmail = ref(true)
const notifyLine = ref(true)
const notifyPush = ref(true)
const consentAllergy = ref(true)
const consentAnalytics = ref(true)

function logout() {
  if (confirm('ออกจากระบบ? · ข้อมูลที่กรอกค้างอยู่จะหาย')) {
    router.push('/login')
  }
}
function exportData() { success('ขอส่งข้อมูลแล้ว', 'ระบบจะส่ง JSON/PDF ไปที่อีเมลภายใน 24 ชม.') }
function deleteAccount() { info('ส่งคำขอลบข้อมูลแล้ว', 'ทีม DPO จะติดต่อยืนยันภายใน 7 วัน') }
</script>

<template>
  <div class="p">
    <ErrorState v-if="ui.isError.value" title="โหลดโปรไฟล์ไม่ได้" @retry="() => {}" />

    <template v-else-if="ui.isLoading.value">
      <LoadingSkeleton variant="block" height="120px" />
      <LoadingSkeleton variant="card" :count="3" />
    </template>

    <template v-else>
      <!-- Identity card -->
      <section class="id-card">
        <div class="id-card__avatar">{{ user.initials }}</div>
        <div class="id-card__body">
          <h1 class="id-card__name">{{ user.name }}</h1>
          <p class="id-card__role">{{ ROLE_LABEL[currentRole] }} · {{ user.department }}</p>
          <div class="id-card__meta">
            <span><AppIcon :icon="Mail" size="sm" aria-hidden="true" /> {{ user.email }}</span>
          </div>
        </div>
      </section>

      <!-- Preferences -->
      <section class="sect">
        <h2 class="sect__title"><AppIcon :icon="Languages" size="md" aria-hidden="true" /> ภาษา</h2>
        <div class="lang-switch">
          <button class="lang-btn" :class="{ 'is-active': language === 'th' }" @click="language = 'th'">ไทย</button>
          <button class="lang-btn" :class="{ 'is-active': language === 'en' }" @click="language = 'en'">English</button>
        </div>
      </section>

      <section class="sect">
        <h2 class="sect__title"><AppIcon :icon="Bell" size="md" aria-hidden="true" /> การแจ้งเตือน</h2>
        <div class="stack">
          <AppToggle v-model="notifyEmail" label="อีเมล" description="ยืนยันลงทะเบียน · reminder · รายงาน" />
          <AppToggle v-model="notifyLine" label="LINE" description="ผ่าน Real Factory Official" />
          <AppToggle v-model="notifyPush" label="Push notification" description="เฉพาะเมื่อเปิด Thinktank Events ในเบราว์เซอร์" />
        </div>
      </section>

      <section class="sect">
        <h2 class="sect__title"><AppIcon :icon="Shield" size="md" aria-hidden="true" /> ความเป็นส่วนตัว (PDPA)</h2>
        <div class="stack">
          <AppToggle v-model="consentAllergy" label="เก็บข้อมูลสุขภาพ (แพ้อาหาร)" description="ใช้กับ catering เท่านั้น · HR ไม่เห็นชื่อ" />
          <AppToggle v-model="consentAnalytics" label="Product analytics" description="ช่วยปรับปรุงระบบ · ไม่ระบุตัวตน" />
        </div>
        <div class="privacy-actions">
          <AppButton variant="secondary" size="md" @click="exportData">
            <AppIcon :icon="Download" size="sm" aria-hidden="true" />
            ดาวน์โหลดข้อมูลของฉัน (JSON/PDF)
          </AppButton>
          <AppButton variant="ghost" size="md" @click="deleteAccount">
            <AppIcon :icon="Trash2" size="sm" aria-hidden="true" />
            ขอลบข้อมูล (ภายใน 30 วัน)
          </AppButton>
        </div>
        <p class="dpo-note">
          ติดต่อ DPO: <a href="mailto:dpo@real-factory.co">dpo@real-factory.co</a> · <a href="mailto:support@real-factory.co"><AppIcon :icon="Phone" size="sm" aria-hidden="true" /> support</a>
        </p>
      </section>

      <section class="sect">
        <AppButton variant="destructive" size="lg" full-width @click="logout">
          <AppIcon :icon="LogOut" size="md" aria-hidden="true" />
          ออกจากระบบ
        </AppButton>
      </section>
    </template>
  </div>
</template>

<style scoped>
.p { max-width: 720px; margin: 0 auto; padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-5); }
@media (min-width: 768px) { .p { padding: var(--space-8) var(--space-6); } }

.id-card {
  display: flex; gap: var(--space-4); align-items: center;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: var(--color-white);
  padding: var(--space-6); border-radius: var(--radius-xl);
}
.id-card__avatar {
  width: 72px; height: 72px; border-radius: 50%;
  background: rgba(255,255,255,0.25);
  display: flex; align-items: center; justify-content: center;
  font-size: var(--text-h2); font-weight: var(--weight-bold);
  flex-shrink: 0;
}
.id-card__name { font-size: var(--text-h3); font-weight: var(--weight-bold); margin-bottom: 2px; }
.id-card__role { opacity: 0.9; font-size: var(--text-body-sm); margin-bottom: var(--space-2); }
.id-card__meta { display: flex; flex-direction: column; gap: 4px; font-size: var(--text-caption); opacity: 0.85; }
.id-card__meta span { display: inline-flex; align-items: center; gap: var(--space-2); }

.sect {
  background: var(--color-white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  padding: var(--space-5);
}
.sect__title {
  display: inline-flex; align-items: center; gap: var(--space-2);
  font-size: var(--text-h4); font-weight: var(--weight-semibold);
  margin-bottom: var(--space-4);
}
.stack { display: flex; flex-direction: column; gap: var(--space-3); }

.lang-switch { display: inline-flex; background: var(--color-gray-100); border-radius: var(--radius-md); padding: 4px; gap: 2px; }
.lang-btn {
  padding: var(--space-2) var(--space-4);
  min-height: 36px;
  font-size: var(--text-body-sm); font-weight: var(--weight-medium);
  color: var(--color-text-secondary);
  border-radius: var(--radius-sm);
}
.lang-btn.is-active { background: var(--color-white); color: var(--color-text-primary); box-shadow: var(--shadow-sm); }

.privacy-actions {
  margin-top: var(--space-4); display: flex; flex-direction: column; gap: var(--space-2);
}
@media (min-width: 640px) { .privacy-actions { flex-direction: row; } }
.dpo-note { font-size: var(--text-caption); color: var(--color-text-tertiary); margin-top: var(--space-3); }
.dpo-note a { display: inline-flex; align-items: center; gap: 4px; }
</style>
