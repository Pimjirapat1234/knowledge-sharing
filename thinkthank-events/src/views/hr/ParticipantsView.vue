<script setup lang="ts">
/**
 * Screen #11 — Participants Table (PRD §11.1 #11 · Story H1).
 * Sortable · filter · export CSV · send reminder.
 */
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import {
  Search, Download, Filter, Send, Check, Clock, X, AlertTriangle,
} from 'lucide-vue-next'
import { useParticipantStore, type RegStatus } from '@/stores/participant'
import { useUiState } from '@/composables/useUiState'
import { useToast } from '@/composables/useToast'
import AppIcon from '@/components/ui/AppIcon.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'

const { participants } = storeToRefs(useParticipantStore())
const ui = useUiState()
const { success } = useToast()

const query = ref('')
const deptFilter = ref<string>('')
const statusFilter = ref<RegStatus | ''>('')

const depts = computed(() => Array.from(new Set(participants.value.map(p => p.department))).sort())

const filtered = computed(() => participants.value.filter(p => {
  if (query.value && !(p.name.toLowerCase().includes(query.value.toLowerCase()) || p.email.includes(query.value))) return false
  if (deptFilter.value && p.department !== deptFilter.value) return false
  if (statusFilter.value && p.status !== statusFilter.value) return false
  return true
}))

function exportCsv() { success('Export CSV เรียบร้อย', `${filtered.value.length} รายการ · ส่งไปยังอีเมล`) }
function sendReminder() { success('ส่ง reminder แล้ว', `ถึง ${filtered.value.filter(p => p.status === 'pending').length} คนที่ยังไม่ยืนยัน`) }

const statusMeta: Record<RegStatus, { variant: 'success' | 'warning' | 'danger' | 'neutral'; label: string; icon: typeof Check }> = {
  confirmed: { variant: 'success', label: 'ยืนยันแล้ว', icon: Check },
  pending: { variant: 'warning', label: 'รอยืนยัน', icon: Clock },
  no_show: { variant: 'danger', label: 'ไม่มางาน', icon: X },
  cancelled: { variant: 'neutral', label: 'ยกเลิก', icon: X },
}
</script>

<template>
  <div class="page" style="--page-gap: var(--space-4)">
    <ErrorState v-if="ui.isErrorBlocking.value" :recoverable="false" />
    <ErrorState v-else-if="ui.isError.value" @retry="() => {}" />

    <header class="head">
      <div>
        <p class="head__tag">ผู้ลงทะเบียน</p>
        <h1 class="head__title">{{ filtered.length }} <span>/ {{ participants.length }} คน</span></h1>
      </div>
      <div class="head__actions">
        <AppButton variant="secondary" size="md" @click="sendReminder">
          <AppIcon :icon="Send" size="sm" aria-hidden="true" />
          ส่ง reminder
        </AppButton>
        <AppButton variant="primary" size="md" @click="exportCsv">
          <AppIcon :icon="Download" size="sm" aria-hidden="true" />
          Export CSV
        </AppButton>
      </div>
    </header>

    <!-- Filter bar -->
    <section class="filter">
      <div class="filter__search">
        <AppIcon :icon="Search" size="sm" aria-hidden="true" />
        <input v-model="query" type="search" placeholder="ค้นหาจากชื่อหรืออีเมล..." />
      </div>
      <select v-model="deptFilter" class="select" aria-label="กรองตามแผนก">
        <option value="">ทุกแผนก</option>
        <option v-for="d in depts" :key="d" :value="d">{{ d }}</option>
      </select>
      <select v-model="statusFilter" class="select" aria-label="กรองตามสถานะ">
        <option value="">ทุกสถานะ</option>
        <option value="confirmed">ยืนยันแล้ว</option>
        <option value="pending">รอยืนยัน</option>
        <option value="no_show">ไม่มางาน</option>
      </select>
    </section>

    <template v-if="ui.isLoading.value">
      <LoadingSkeleton variant="line" :count="6" height="56px" />
    </template>

    <EmptyState
      v-else-if="ui.isEmpty.value || participants.length === 0"
      title="ยังไม่มีคนลงทะเบียน"
      message="ส่งเชิญพนักงานผ่าน email/LINE · เริ่มจากลิงก์ลงทะเบียน"
      cta-label="Copy ลิงก์ลงทะเบียน"
    />

    <EmptyState
      v-else-if="filtered.length === 0"
      :icon="Filter"
      title="ไม่พบผลที่ตรงกับ filter"
      message="ลองเปลี่ยน keyword หรือปิด filter เพื่อดูทั้งหมด"
    />

    <template v-else>
      <!-- Desktop table -->
      <div class="table-wrap">
        <table class="table" role="table">
          <thead>
            <tr>
              <th scope="col">ชื่อ</th>
              <th scope="col">แผนก</th>
              <th scope="col">เมนู</th>
              <th scope="col">แพ้อาหาร</th>
              <th scope="col">กลุ่ม</th>
              <th scope="col">สถานะ</th>
              <th scope="col">Check-in</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in filtered" :key="p.id" :class="{ 'is-allergy': p.allergy }">
              <td>
                <div class="name">
                  <span class="name__avatar" aria-hidden="true">{{ p.nickname.charAt(0) }}</span>
                  <div>
                    <div class="name__name">{{ p.name }}</div>
                    <div class="name__email">{{ p.email }}</div>
                  </div>
                </div>
              </td>
              <td>{{ p.department }}</td>
              <td>{{ p.menuId ?? '—' }}</td>
              <td>
                <span v-if="p.allergy" class="allergy-cell">
                  <AppIcon :icon="AlertTriangle" size="sm" aria-hidden="true" />
                  {{ p.allergy }}
                </span>
                <span v-else>—</span>
              </td>
              <td>{{ p.groupId ?? '—' }}</td>
              <td>
                <AppBadge :variant="statusMeta[p.status].variant" size="sm">
                  <AppIcon :icon="statusMeta[p.status].icon" size="sm" aria-hidden="true" />
                  {{ statusMeta[p.status].label }}
                </AppBadge>
              </td>
              <td>
                <AppBadge v-if="p.checkedInAt" variant="success" size="sm">
                  <AppIcon :icon="Check" size="sm" aria-hidden="true" />
                  เข้างาน
                </AppBadge>
                <span v-else class="muted">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <!-- Partial state -->
    <div v-if="ui.isPartial.value" class="partial">
      <LoadingSkeleton variant="line" :count="3" height="44px" />
      <p style="text-align: center; font-size: var(--text-caption); color: var(--color-text-tertiary);">กำลังโหลดข้อมูลเพิ่ม...</p>
    </div>

    <!-- Privacy note -->
    <aside class="privacy-note" role="note">
      <AppIcon :icon="AlertTriangle" size="sm" aria-hidden="true" />
      ข้อมูล food allergy เป็น sensitive data · ใช้เฉพาะกับ catering · ไม่แชร์กับบุคคลภายนอก · audit log บันทึกทุกครั้งที่ดู
    </aside>
  </div>
</template>

<style scoped>
/* layout via global .page */

.head { display: flex; justify-content: space-between; align-items: flex-end; gap: var(--space-4); flex-wrap: wrap; }
.head__tag { font-size: var(--text-caption); color: var(--color-text-secondary); }
.head__title { font-size: var(--text-h2); font-weight: var(--weight-bold); }
.head__title span { font-size: var(--text-body); color: var(--color-text-tertiary); font-weight: var(--weight-regular); }
.head__actions { display: flex; gap: var(--space-2); flex-wrap: wrap; }

.filter {
  display: flex; gap: var(--space-2); flex-wrap: wrap;
  background: var(--color-white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  padding: var(--space-2);
}
.filter__search {
  flex: 1; min-width: 200px;
  display: flex; align-items: center; gap: var(--space-2);
  padding: 0 var(--space-3);
  background: var(--color-gray-50);
  border-radius: var(--radius-md);
  color: var(--color-text-tertiary);
}
.filter__search input {
  flex: 1; border: none; background: transparent;
  padding: var(--space-2) 0;
  min-height: var(--size-input-md);
  font-family: inherit; font-size: var(--text-body-sm);
}
.filter__search input:focus { outline: none; }

.select {
  padding: 0 var(--space-3); min-height: var(--size-input-md);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  background: var(--color-white);
  font-family: inherit; font-size: var(--text-body-sm);
}

.table-wrap {
  background: var(--color-white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  overflow-x: auto;
}
.table { width: 100%; border-collapse: collapse; font-size: var(--text-body-sm); }
.table th, .table td { padding: var(--space-3) var(--space-4); text-align: left; }
.table th {
  background: var(--color-gray-50);
  font-size: var(--text-caption);
  font-weight: var(--weight-semibold);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  border-bottom: 1px solid var(--color-border-default);
  white-space: nowrap;
}
.table td { border-bottom: 1px solid var(--color-border-light); vertical-align: middle; }
.table tr:last-child td { border-bottom: none; }
.table tr:hover { background: var(--color-gray-50); }
.table tr.is-allergy { background: var(--color-warning-subtle); }
.table tr.is-allergy:hover { background: color-mix(in srgb, var(--color-warning-subtle) 80%, var(--color-warning-light)); }

.name { display: flex; gap: var(--space-2); align-items: center; }
.name__avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: var(--color-primary-muted); color: var(--color-primary-dark);
  display: inline-flex; align-items: center; justify-content: center;
  font-weight: var(--weight-semibold); font-size: var(--text-body-sm);
}
.name__name { font-weight: var(--weight-medium); color: var(--color-text-primary); }
.name__email { font-size: var(--text-caption); color: var(--color-text-tertiary); }

.allergy-cell { display: inline-flex; align-items: center; gap: var(--space-1); color: var(--color-warning-dark); font-weight: var(--weight-medium); }
.muted { color: var(--color-text-tertiary); }

.partial { display: flex; flex-direction: column; gap: var(--space-2); padding: var(--space-3); }

.privacy-note {
  display: flex; gap: var(--space-2); align-items: flex-start;
  padding: var(--space-3);
  background: var(--color-info-subtle);
  color: var(--color-info-dark);
  border-radius: var(--radius-md);
  font-size: var(--text-caption);
  line-height: var(--leading-relaxed);
}
</style>
