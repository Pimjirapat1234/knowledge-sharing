<script setup lang="ts">
import { ref, computed, type Component } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  SlidersHorizontal, ChevronDown, Check,
  CheckCircle2, Loader, Inbox, RefreshCw, AlertTriangle, Ban, PartyPopper,
} from 'lucide-vue-next'
import type { UiState } from '@/composables/useUiState'
import AppIcon from '@/components/ui/AppIcon.vue'

const route = useRoute()
const router = useRouter()
const open = ref(false)

const current = computed(() => (route.query.state as UiState | undefined) ?? null)

const states: Array<{ value: UiState | null; label: string; icon: Component }> = [
  { value: null, label: 'Happy path', icon: CheckCircle2 },
  { value: 'loading', label: 'Loading', icon: Loader },
  { value: 'empty', label: 'Empty', icon: Inbox },
  { value: 'partial', label: 'Partial', icon: RefreshCw },
  { value: 'error', label: 'Error (recoverable)', icon: AlertTriangle },
  { value: 'error-blocking', label: 'Error (blocking)', icon: Ban },
  { value: 'success', label: 'Success toast', icon: PartyPopper },
]

const currentLabel = computed(() =>
  states.find((s) => s.value === current.value)?.label ?? 'Happy path',
)

function select(v: UiState | null) {
  const q = { ...route.query }
  if (v) q.state = v
  else delete q.state
  router.replace({ path: route.path, query: q })
  open.value = false
}
</script>

<template>
  <div class="ss">
    <button
      type="button"
      class="ss__trigger"
      :aria-expanded="open"
      aria-haspopup="listbox"
      @click="open = !open"
    >
      <AppIcon :icon="SlidersHorizontal" size="sm" aria-hidden="true" />
      <span class="ss__label">State: {{ currentLabel }}</span>
      <AppIcon :icon="ChevronDown" size="sm" aria-hidden="true" />
    </button>

    <div v-if="open" class="ss__backdrop" @click="open = false" />

    <ul v-if="open" class="ss__menu" role="listbox">
      <li v-for="s in states" :key="String(s.value)">
        <button
          type="button"
          class="ss__option"
          :class="{ 'is-active': s.value === current }"
          @click="select(s.value)"
        >
          <AppIcon :icon="s.icon" size="sm" aria-hidden="true" />
          <span>{{ s.label }}</span>
          <AppIcon v-if="s.value === current" :icon="Check" size="sm" class="ss__check" aria-hidden="true" />
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.ss { position: fixed; bottom: var(--space-4); right: var(--space-4); z-index: var(--z-popover); }
.ss__trigger {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background: var(--color-secondary);
  color: var(--color-white);
  border-radius: var(--radius-full);
  font-size: var(--text-caption);
  font-weight: var(--weight-medium);
  box-shadow: var(--shadow-lg);
  min-height: var(--size-touch-target);
}
.ss__trigger:hover { background: var(--color-secondary-hover); }
.ss__label { font-family: var(--font-mono); font-size: 11px; }

.ss__backdrop { position: fixed; inset: 0; background: transparent; }
.ss__menu {
  position: absolute;
  bottom: calc(100% + 8px); right: 0;
  min-width: 240px;
  background: var(--color-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  padding: var(--space-1);
  list-style: none;
  max-height: 60vh;
  overflow-y: auto;
}
.ss__option {
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-sm);
  font-size: var(--text-body-sm);
  text-align: left;
  min-height: 36px;
  color: var(--color-text-primary);
}
.ss__option:hover { background: var(--color-gray-100); }
.ss__option.is-active { background: var(--color-primary-subtle); color: var(--color-primary-dark); font-weight: var(--weight-medium); }
.ss__check { margin-left: auto; color: var(--color-primary); }
</style>
