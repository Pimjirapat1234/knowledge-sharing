<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import TopBar from '@/components/layout/TopBar.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import BottomNav from '@/components/layout/BottomNav.vue'
import StateSwitcher from '@/components/layout/StateSwitcher.vue'
import ImpersonationBanner from '@/components/layout/ImpersonationBanner.vue'
import ToastContainer from '@/components/ui/ToastContainer.vue'

const route = useRoute()
const isChromeless = computed(() => route.name === 'login')
</script>

<template>
  <div v-if="isChromeless" class="app-plain">
    <RouterView />
    <ToastContainer />
  </div>

  <div v-else class="app">
    <TopBar />
    <ImpersonationBanner />
    <div class="app__body">
      <Sidebar />
      <main class="app__main">
        <RouterView />
      </main>
    </div>
    <BottomNav />
    <StateSwitcher />
    <ToastContainer />
    <footer class="footer">
      <p>© 2026 Real Factory · ติดต่อ DPO: <a href="mailto:dpo@real-factory.co">dpo@real-factory.co</a> · <a href="#privacy">นโยบายความเป็นส่วนตัว</a></p>
    </footer>
  </div>
</template>

<style scoped>
.app-plain { min-height: 100vh; }
.app { min-height: 100vh; display: flex; flex-direction: column; }
.app__body { flex: 1; display: flex; width: 100%; }
.app__main {
  flex: 1;
  min-width: 0;
  padding-bottom: var(--space-8);
}
.footer {
  padding: var(--space-5) var(--space-4);
  text-align: center;
  font-size: var(--text-caption);
  color: var(--color-text-tertiary);
  border-top: 1px solid var(--color-border-light);
  background: var(--color-white);
}
</style>
