<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ShieldCheck } from 'lucide-vue-next'
import { useUserStore } from '@/stores/user'
import { usePermissionsStore, type MenuDef } from '@/stores/permissions'
import AppIcon from '@/components/ui/AppIcon.vue'

const { effectiveRole } = storeToRefs(useUserStore())
const permStore = usePermissionsStore()

interface Group { label: string; items: MenuDef[] }

const groups = computed<Group[]>(() => {
  const visible = permStore.visibleMenus(effectiveRole.value)
  const groupMap = new Map<string, MenuDef[]>()
  visible.forEach(m => {
    if (!groupMap.has(m.group)) groupMap.set(m.group, [])
    groupMap.get(m.group)!.push(m)
  })
  return Array.from(groupMap.entries()).map(([label, items]) => ({ label, items }))
})
</script>

<template>
  <aside class="sb" aria-label="เมนูนำทาง">
    <div class="sb__inner">
      <div v-for="g in groups" :key="g.label" class="sb__group">
        <p class="sb__label">
          <AppIcon v-if="g.label === 'System Admin'" :icon="ShieldCheck" size="sm" aria-hidden="true" />
          {{ g.label }}
        </p>
        <ul class="sb__list">
          <li v-for="i in g.items" :key="i.key">
            <RouterLink :to="i.path" class="sb__link" active-class="is-active">
              <AppIcon :icon="i.icon" size="sm" aria-hidden="true" />
              <span>{{ i.label }}</span>
            </RouterLink>
          </li>
        </ul>
      </div>

      <p v-if="groups.length === 0" class="sb__empty">
        ไม่มีเมนูเปิดใช้งาน · <br />
        ติดต่อ Admin
      </p>
    </div>
  </aside>
</template>

<style scoped>
.sb {
  display: none;
  width: var(--size-sidebar);
  flex-shrink: 0;
  background: var(--color-white);
  border-right: 1px solid var(--color-border-light);
  height: calc(100vh - var(--size-topbar));
  position: sticky;
  top: var(--size-topbar);
  overflow-y: auto;
}
@media (min-width: 1024px) { .sb { display: block; } }

.sb__inner { padding: var(--space-5) var(--space-3); display: flex; flex-direction: column; gap: var(--space-5); }

.sb__label {
  display: inline-flex; align-items: center; gap: var(--space-1);
  font-size: 10px;
  font-weight: var(--weight-bold);
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
  padding: 0 var(--space-3) var(--space-2);
}
.sb__list { list-style: none; display: flex; flex-direction: column; gap: 2px; }
.sb__link {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  font-size: var(--text-body-sm);
  font-weight: var(--weight-medium);
  min-height: var(--size-touch-target);
}
.sb__link:hover { background: var(--color-gray-100); color: var(--color-text-primary); text-decoration: none; }
.sb__link.is-active { background: var(--color-primary-subtle); color: var(--color-primary-dark); }

.sb__empty {
  padding: var(--space-6) var(--space-3);
  text-align: center;
  color: var(--color-text-tertiary);
  font-size: var(--text-caption);
  line-height: var(--leading-relaxed);
}
</style>
