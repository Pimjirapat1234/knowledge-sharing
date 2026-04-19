<script setup lang="ts">
/**
 * Super Admin · Audit Log (PRD §9.3)
 * Filter by user/action/date · export · 5-year retention per compliance
 */
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import {
  Shield, Download, Search, FileSearch,
  Eye, Save, MessageSquare, Camera, Flag, Settings,
} from 'lucide-vue-next'
import { useAdminStore } from '@/stores/admin'
import { useUiState } from '@/composables/useUiState'
import { useToast } from '@/composables/useToast'
import AppIcon from '@/components/ui/AppIcon.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'

const { auditEntries } = storeToRefs(useAdminStore())
const ui = useUiState()
const { success } = useToast()

const query = ref('')
const actionFilter = ref('')

const actions = computed(() => Array.from(new Set(auditEntries.value.map(a => a.action))).sort())

const filtered = computed(() => [...auditEntries.value].sort((a, b) => b.timestamp.localeCompare(a.timestamp)).filter(a => {
  if (query.value && !(a.userName.toLowerCase().includes(query.value.toLowerCase()) || a.resource.includes(query.value))) return false
  if (actionFilter.value && a.action !== actionFilter.value) return false
  return true
}))

const actionIcon = (a: string) => {
  if (a.startsWith('impersonate')) return Eye
  if (a.startsWith('export')) return Download
  if (a.startsWith('submit') || a.startsWith('register')) return Save
  if (a.startsWith('qr_scan')) return Camera
  if (a.startsWith('feature_flag')) return Flag
  if (a.startsWith('event_')) return Settings
  return MessageSquare
}

function exportLog() { success('Export audit log', `${filtered.value.length} entries · ส่งเข้าอีเมล · encrypted zip`) }

function formatTime(iso: string) {
  const d = new Date(iso)
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}
</script>

<template>
  <div class="page" style="--page-gap: var(--space-5)">
    <ErrorState v-if="ui.isErrorBlocking.value" :recoverable="false" />
    <ErrorState v-else-if="ui.isError.value" @retry="() => {}" />

    <header class="head">
      <div>
        <div class="head__breadcrumb">
          <AppIcon :icon="Shield" size="sm" aria-hidden="true" />
          System Admin
        </div>
        <h1 class="head__title">Audit Log</h1>
        <p class="head__desc">บันทึก action ทั้งระบบ · retention 5 ปี (PRD §9.7.3) · ข้อมูลเข้ารหัส AES-256</p>
      </div>
      <AppButton variant="primary" size="md" @click="exportLog">
        <AppIcon :icon="Download" size="sm" aria-hidden="true" />
        Export (encrypted)
      </AppButton>
    </header>

    <section class="filter">
      <div class="filter__search">
        <AppIcon :icon="Search" size="sm" aria-hidden="true" />
        <input v-model="query" type="search" placeholder="ค้นหา user หรือ resource..." />
      </div>
      <select v-model="actionFilter" class="select">
        <option value="">ทุก action</option>
        <option v-for="a in actions" :key="a" :value="a">{{ a }}</option>
      </select>
    </section>

    <template v-if="ui.isLoading.value">
      <LoadingSkeleton variant="line" :count="8" height="56px" />
    </template>

    <EmptyState
      v-else-if="ui.isEmpty.value || auditEntries.length === 0"
      :icon="FileSearch"
      title="ยังไม่มี audit entries"
      message="ทุก action ของ HR/C-Level/Super Admin จะปรากฏที่นี่"
    />

    <EmptyState
      v-else-if="filtered.length === 0"
      title="ไม่พบผลที่ตรงกับ filter"
      message="ลองเปลี่ยน keyword หรือ action type"
    />

    <ol v-else class="timeline">
      <li v-for="entry in filtered" :key="entry.id" class="timeline__item">
        <div class="timeline__icon"><AppIcon :icon="actionIcon(entry.action)" size="md" aria-hidden="true" /></div>
        <div class="timeline__body">
          <div class="timeline__head">
            <strong class="timeline__user">{{ entry.userName }}</strong>
            <AppBadge v-if="entry.mode" variant="danger" size="sm">
              <AppIcon :icon="Eye" size="sm" aria-hidden="true" />
              impersonated
            </AppBadge>
            <span class="timeline__time">{{ formatTime(entry.timestamp) }}</span>
          </div>
          <p class="timeline__action">
            <span class="timeline__tag">{{ entry.action }}</span>
            <span class="timeline__arrow">→</span>
            <code class="timeline__resource">{{ entry.resource }}</code>
          </p>
          <p class="timeline__ip" v-if="entry.ip">IP: {{ entry.ip }}</p>
        </div>
      </li>
    </ol>

    <aside class="privacy">
      <AppIcon :icon="Shield" size="sm" aria-hidden="true" />
      <p>
        <strong>Compliance note:</strong> audit log เป็นไฟล์ immutable · ไม่สามารถแก้ไข/ลบจาก UI ได้ ·
        ใช้สำหรับ PDPA compliance · legal review · incident investigation
      </p>
    </aside>
  </div>
</template>

<style scoped>
/* layout via global .page */

.head { display: flex; justify-content: space-between; align-items: flex-end; gap: var(--space-4); flex-wrap: wrap; }
.head__breadcrumb { display: inline-flex; align-items: center; gap: var(--space-1); font-size: var(--text-caption); color: var(--color-danger-dark); font-weight: var(--weight-semibold); text-transform: uppercase; letter-spacing: var(--tracking-wide); }
.head__title { font-size: var(--text-h2); font-weight: var(--weight-bold); margin: 4px 0; }
.head__desc { font-size: var(--text-body-sm); color: var(--color-text-secondary); max-width: 640px; }

.filter { display: flex; gap: var(--space-2); flex-wrap: wrap; background: var(--color-white); border: 1px solid var(--color-border-light); border-radius: var(--radius-lg); padding: var(--space-2); }
.filter__search { flex: 1; min-width: 200px; display: flex; align-items: center; gap: var(--space-2); padding: 0 var(--space-3); background: var(--color-gray-50); border-radius: var(--radius-md); color: var(--color-text-tertiary); }
.filter__search input { flex: 1; border: none; background: transparent; padding: var(--space-2) 0; min-height: var(--size-input-md); font-family: inherit; font-size: var(--text-body-sm); }
.filter__search input:focus { outline: none; }
.select { padding: 0 var(--space-3); min-height: var(--size-input-md); border: 1px solid var(--color-border-default); border-radius: var(--radius-md); background: var(--color-white); font-family: inherit; font-size: var(--text-body-sm); }

.timeline { list-style: none; display: flex; flex-direction: column; gap: var(--space-3); }
.timeline__item {
  display: flex; gap: var(--space-3);
  padding: var(--space-4);
  background: var(--color-white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
}
.timeline__icon {
  width: 40px; height: 40px; border-radius: var(--radius-lg);
  background: var(--color-primary-subtle); color: var(--color-primary);
  display: inline-flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.timeline__body { flex: 1; min-width: 0; }
.timeline__head { display: flex; align-items: center; gap: var(--space-2); flex-wrap: wrap; margin-bottom: var(--space-1); }
.timeline__user { font-weight: var(--weight-semibold); }
.timeline__time { margin-left: auto; font-family: var(--font-mono); font-size: var(--text-caption); color: var(--color-text-tertiary); }
.timeline__action { display: flex; gap: var(--space-2); align-items: center; flex-wrap: wrap; font-size: var(--text-body-sm); }
.timeline__tag { background: var(--color-gray-100); color: var(--color-text-secondary); padding: 2px var(--space-2); border-radius: var(--radius-sm); font-family: var(--font-mono); font-size: var(--text-caption); }
.timeline__arrow { color: var(--color-text-tertiary); }
.timeline__resource { color: var(--color-primary); font-family: var(--font-mono); font-size: var(--text-caption); background: var(--color-primary-subtle); padding: 2px var(--space-2); border-radius: var(--radius-sm); }
.timeline__ip { margin-top: var(--space-1); font-size: var(--text-caption); color: var(--color-text-tertiary); font-family: var(--font-mono); }

.privacy { display: flex; gap: var(--space-2); align-items: flex-start; padding: var(--space-3); background: var(--color-info-subtle); color: var(--color-info-dark); border-radius: var(--radius-md); font-size: var(--text-caption); line-height: var(--leading-relaxed); }
</style>
