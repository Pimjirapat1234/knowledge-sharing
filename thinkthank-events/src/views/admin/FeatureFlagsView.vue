<script setup lang="ts">
/**
 * Super Admin · Feature Flags (PRD §15.8)
 * Kill switches · A/B tests · gradual rollout %
 */
import { storeToRefs } from 'pinia'
import { Shield, Flag, AlertTriangle } from 'lucide-vue-next'
import { useAdminStore } from '@/stores/admin'
import { useUiState } from '@/composables/useUiState'
import { useToast } from '@/composables/useToast'
import AppIcon from '@/components/ui/AppIcon.vue'
import AppToggle from '@/components/ui/AppToggle.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'

const { flags } = storeToRefs(useAdminStore())
const ui = useUiState()
const { success, warning } = useToast()

function toggleFlag(key: string) {
  const f = flags.value.find(x => x.key === key)
  if (!f) return
  if (f.key === 'enable_leaderboard' && f.enabled) {
    if (!confirm('ปิด Leaderboard? · พนักงานจะไม่เห็นผลอันดับทันที')) return
    warning('Kill switch activated', 'Leaderboard ปิดใช้งานทันที')
  } else {
    success('Flag toggled', `${f.label} · ${!f.enabled ? 'เปิด' : 'ปิด'}`)
  }
}
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
        <h1 class="head__title">Feature Flags</h1>
        <p class="head__desc">Kill switches · A/B tests · gradual rollout · ทุกการเปลี่ยนแปลงถูก log</p>
      </div>
    </header>

    <template v-if="ui.isLoading.value">
      <LoadingSkeleton variant="card" :count="5" />
    </template>

    <EmptyState
      v-else-if="ui.isEmpty.value || flags.length === 0"
      :icon="Flag"
      title="ยังไม่มี feature flags"
      message="เพิ่ม flag เพื่อทดลอง features ใหม่อย่างปลอดภัย"
    />

    <div v-else class="flags">
      <article v-for="f in flags" :key="f.key" class="flag" :class="{ 'is-off': !f.enabled }">
        <div class="flag__head">
          <div class="flag__info">
            <div class="flag__head-top">
              <h3 class="flag__title">{{ f.label }}</h3>
              <AppBadge :variant="f.enabled ? 'success' : 'neutral'" size="sm">
                {{ f.enabled ? 'ON' : 'OFF' }}
              </AppBadge>
              <AppBadge v-if="f.key === 'enable_leaderboard'" variant="warning" size="sm">
                <AppIcon :icon="AlertTriangle" size="sm" aria-hidden="true" />
                Kill switch
              </AppBadge>
            </div>
            <p class="flag__key"><code>{{ f.key }}</code></p>
            <p class="flag__desc">{{ f.description }}</p>
          </div>
          <AppToggle :model-value="f.enabled" @update:model-value="toggleFlag(f.key)" />
        </div>

        <div class="flag__rollout">
          <div class="flag__rollout-head">
            <span>Gradual rollout</span>
            <strong>{{ f.rolloutPct }}% users</strong>
          </div>
          <input
            type="range"
            min="0" max="100" step="10"
            :value="f.rolloutPct"
            :disabled="!f.enabled"
            class="flag__slider"
            :aria-label="`Rollout percentage for ${f.label}`"
          />
        </div>

        <footer class="flag__foot">
          <span class="flag__owner">Owner: <strong>{{ f.owner }}</strong></span>
        </footer>
      </article>
    </div>

    <aside class="privacy">
      <AppIcon :icon="Shield" size="sm" aria-hidden="true" />
      <p>
        <strong>Change audit:</strong> การ toggle flag ทุกครั้งบันทึก audit log พร้อม timestamp · ใช้ความระมัดระวังเมื่อปิด kill switches เพราะมีผลกับ user ทันที
      </p>
    </aside>
  </div>
</template>

<style scoped>
.page { max-width: 800px; padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-5); }
@media (min-width: 768px) { .page { padding: var(--space-6); } }

.head__breadcrumb { display: inline-flex; align-items: center; gap: var(--space-1); font-size: var(--text-caption); color: var(--color-danger-dark); font-weight: var(--weight-semibold); text-transform: uppercase; letter-spacing: var(--tracking-wide); }
.head__title { font-size: var(--text-h2); font-weight: var(--weight-bold); margin: 4px 0; }
.head__desc { font-size: var(--text-body-sm); color: var(--color-text-secondary); max-width: 640px; }

.flags { display: flex; flex-direction: column; gap: var(--space-3); }
.flag {
  padding: var(--space-5);
  background: var(--color-white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  display: flex; flex-direction: column; gap: var(--space-4);
}
.flag.is-off { opacity: 0.7; border-style: dashed; }

.flag__head { display: flex; justify-content: space-between; gap: var(--space-4); align-items: flex-start; }
.flag__info { flex: 1; min-width: 0; }
.flag__head-top { display: flex; align-items: center; gap: var(--space-2); flex-wrap: wrap; margin-bottom: 4px; }
.flag__title { font-size: var(--text-h4); font-weight: var(--weight-semibold); }
.flag__key { font-size: var(--text-caption); }
.flag__key code { background: var(--color-gray-100); color: var(--color-text-secondary); padding: 2px var(--space-2); border-radius: var(--radius-sm); font-family: var(--font-mono); font-size: var(--text-caption); }
.flag__desc { font-size: var(--text-body-sm); color: var(--color-text-secondary); margin-top: var(--space-2); line-height: var(--leading-relaxed); }

.flag__rollout { background: var(--color-gray-50); border-radius: var(--radius-md); padding: var(--space-3); }
.flag__rollout-head { display: flex; justify-content: space-between; font-size: var(--text-caption); color: var(--color-text-secondary); margin-bottom: var(--space-2); }
.flag__rollout-head strong { color: var(--color-primary); }
.flag__slider { width: 100%; accent-color: var(--color-primary); }
.flag__slider:disabled { opacity: 0.5; cursor: not-allowed; }

.flag__foot { padding-top: var(--space-3); border-top: 1px solid var(--color-border-light); font-size: var(--text-caption); color: var(--color-text-secondary); }
.flag__owner strong { color: var(--color-text-primary); }

.privacy { display: flex; gap: var(--space-2); align-items: flex-start; padding: var(--space-3); background: var(--color-warning-subtle); color: var(--color-warning-dark); border-radius: var(--radius-md); font-size: var(--text-caption); line-height: var(--leading-relaxed); }
</style>
