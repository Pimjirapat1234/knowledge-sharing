<script setup lang="ts">
/**
 * Super Admin · System Settings · SSO config, data retention, org-level
 */
import { ref } from 'vue'
import {
  Shield, Server, Lock, Database, Globe, Cog, CheckCircle2,
} from 'lucide-vue-next'
import { useUiState } from '@/composables/useUiState'
import { useToast } from '@/composables/useToast'
import AppIcon from '@/components/ui/AppIcon.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppToggle from '@/components/ui/AppToggle.vue'
import ErrorState from '@/components/ui/ErrorState.vue'

const ui = useUiState()
const { success } = useToast()

const retentionRegistration = ref(90)
const retentionFeedback = ref(90)
const retentionAudit = ref(1825) // 5 years
const autoArchive = ref(true)
const ssoOnly = ref(true)
const hsts = ref(true)
const offlineQueue = ref(true)

function save() { success('บันทึกการตั้งค่า', 'การเปลี่ยนแปลงมีผลทันที · audit log บันทึกแล้ว') }
</script>

<template>
  <div class="page">
    <ErrorState v-if="ui.isErrorBlocking.value" :recoverable="false" />
    <ErrorState v-else-if="ui.isError.value" @retry="() => {}" />

    <header class="head">
      <div>
        <div class="head__breadcrumb">
          <AppIcon :icon="Shield" size="sm" aria-hidden="true" />
          System Admin
        </div>
        <h1 class="head__title">System Settings</h1>
        <p class="head__desc">SSO · security · data retention · infrastructure</p>
      </div>
      <AppButton variant="primary" size="md" @click="save">บันทึก</AppButton>
    </header>

    <!-- SSO -->
    <section class="sect">
      <div class="sect__head">
        <div class="sect__icon"><AppIcon :icon="Server" size="lg" /></div>
        <div>
          <h2 class="sect__title">Single Sign-On (SSO)</h2>
          <p class="sect__desc">Azure AD integration · Real Factory corporate</p>
        </div>
        <AppBadge variant="success" size="md">
          <AppIcon :icon="CheckCircle2" size="sm" aria-hidden="true" />
          Connected
        </AppBadge>
      </div>
      <dl class="kv">
        <div><dt>Provider</dt><dd>Microsoft Azure AD</dd></div>
        <div><dt>Tenant ID</dt><dd><code>real-factory.onmicrosoft.com</code></dd></div>
        <div><dt>App ID</dt><dd><code>9b4f3e21-xxxx-xxxx-xxxx-xxxxxxxxxxxx</code></dd></div>
        <div><dt>Session timeout</dt><dd>8 ชั่วโมง (FR-AUTH-03)</dd></div>
      </dl>
      <AppToggle v-model="ssoOnly" label="SSO only" description="บังคับใช้ SSO · ปิด password-based login" />
    </section>

    <!-- Security -->
    <section class="sect">
      <div class="sect__head">
        <div class="sect__icon"><AppIcon :icon="Lock" size="lg" /></div>
        <div>
          <h2 class="sect__title">Security</h2>
          <p class="sect__desc">HTTPS · encryption · WCAG · browser policy</p>
        </div>
      </div>
      <div class="stack">
        <AppToggle v-model="hsts" label="HSTS" description="HTTP Strict Transport Security · ป้องกัน downgrade attack" />
        <AppToggle v-model="offlineQueue" label="Offline QR scan queue" description="เก็บ scan ใน localStorage · sync เมื่อมี network" />
      </div>
      <p class="note">
        Data encryption at rest: <strong>AES-256</strong> (feedback text) · TLS 1.3 in transit · RBAC enforced
      </p>
    </section>

    <!-- Data retention -->
    <section class="sect">
      <div class="sect__head">
        <div class="sect__icon"><AppIcon :icon="Database" size="lg" /></div>
        <div>
          <h2 class="sect__title">Data Retention</h2>
          <p class="sect__desc">PRD §9.7.3 · PDPA compliance</p>
        </div>
      </div>
      <div class="ret">
        <label class="ret__row">
          <span>Registration data</span>
          <input v-model.number="retentionRegistration" type="number" min="1" />
          <small>วัน</small>
        </label>
        <label class="ret__row">
          <span>Feedback (identified)</span>
          <input v-model.number="retentionFeedback" type="number" min="1" />
          <small>วัน</small>
        </label>
        <label class="ret__row">
          <span>Audit log</span>
          <input v-model.number="retentionAudit" type="number" min="1" />
          <small>วัน (= {{ Math.round(retentionAudit / 365) }} ปี)</small>
        </label>
      </div>
      <AppToggle v-model="autoArchive" label="Auto-archive" description="ย้าย data เก่าเข้า cold storage อัตโนมัติ" />
    </section>

    <!-- Hosting -->
    <section class="sect">
      <div class="sect__head">
        <div class="sect__icon"><AppIcon :icon="Globe" size="lg" /></div>
        <div>
          <h2 class="sect__title">Hosting & Region</h2>
          <p class="sect__desc">§9.7.4 · in-region compliance</p>
        </div>
      </div>
      <dl class="kv">
        <div><dt>Primary region</dt><dd>AWS Singapore (ap-southeast-1)</dd></div>
        <div><dt>Cross-border</dt><dd>ห้าม US region สำหรับ employee data</dd></div>
        <div><dt>CDN</dt><dd>CloudFront (Asia POPs)</dd></div>
        <div><dt>Backup</dt><dd>ทุก 6 ชม. · RTO ≤ 4 ชม.</dd></div>
      </dl>
    </section>

    <!-- DPO -->
    <aside class="dpo">
      <AppIcon :icon="Cog" size="md" aria-hidden="true" />
      <div>
        <p class="dpo__title">Data Protection Officer</p>
        <p><a href="mailto:dpo@real-factory.co">dpo@real-factory.co</a> · ติดต่อสำหรับคำขอ access/delete ข้อมูลส่วนบุคคล · ต้องตอบสนองภายใน 30 วัน (PDPA)</p>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.page { max-width: 800px; padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-4); }
@media (min-width: 768px) { .page { padding: var(--space-6); } }

.head { display: flex; justify-content: space-between; align-items: flex-end; gap: var(--space-4); flex-wrap: wrap; }
.head__breadcrumb { display: inline-flex; align-items: center; gap: var(--space-1); font-size: var(--text-caption); color: var(--color-danger-dark); font-weight: var(--weight-semibold); text-transform: uppercase; letter-spacing: var(--tracking-wide); }
.head__title { font-size: var(--text-h2); font-weight: var(--weight-bold); margin: 4px 0; }
.head__desc { font-size: var(--text-body-sm); color: var(--color-text-secondary); }

.sect {
  background: var(--color-white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  padding: var(--space-5);
  display: flex; flex-direction: column; gap: var(--space-4);
}
.sect__head { display: flex; gap: var(--space-3); align-items: flex-start; }
.sect__icon { width: 48px; height: 48px; border-radius: var(--radius-lg); background: var(--color-primary-subtle); color: var(--color-primary); display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
.sect__title { font-size: var(--text-h4); font-weight: var(--weight-semibold); }
.sect__desc { font-size: var(--text-caption); color: var(--color-text-secondary); }

.stack { display: flex; flex-direction: column; gap: var(--space-3); }

.kv { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: var(--space-3); font-size: var(--text-body-sm); }
.kv > div { background: var(--color-gray-50); padding: var(--space-3); border-radius: var(--radius-md); }
.kv dt { font-size: var(--text-caption); color: var(--color-text-tertiary); text-transform: uppercase; letter-spacing: var(--tracking-wide); margin-bottom: 2px; }
.kv dd { color: var(--color-text-primary); font-weight: var(--weight-medium); }
.kv code { font-family: var(--font-mono); font-size: var(--text-caption); background: var(--color-white); padding: 2px var(--space-2); border-radius: var(--radius-sm); }

.note { font-size: var(--text-caption); color: var(--color-text-secondary); padding: var(--space-3); background: var(--color-gray-50); border-radius: var(--radius-md); }

.ret { display: flex; flex-direction: column; gap: var(--space-2); }
.ret__row { display: grid; grid-template-columns: 1fr 100px auto; gap: var(--space-3); align-items: center; }
.ret__row span { font-size: var(--text-body-sm); color: var(--color-text-primary); }
.ret__row input { padding: var(--space-2); border: 1px solid var(--color-border-default); border-radius: var(--radius-md); font-family: inherit; min-height: var(--size-input-md); text-align: right; }
.ret__row small { font-size: var(--text-caption); color: var(--color-text-tertiary); }

.dpo { display: flex; gap: var(--space-3); align-items: flex-start; padding: var(--space-4); background: var(--color-info-subtle); color: var(--color-info-dark); border-radius: var(--radius-xl); }
.dpo__title { font-weight: var(--weight-semibold); margin-bottom: 2px; }
.dpo p { font-size: var(--text-body-sm); line-height: var(--leading-relaxed); }
</style>
