<script setup lang="ts">
/**
 * Login — SSO entry (FR-AUTH-01). Chromeless full-page brand experience.
 */
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Lock, Building2, User, UserCog, Crown } from 'lucide-vue-next'
import { useUserStore, type UserRole } from '@/stores/user'
import AppButton from '@/components/ui/AppButton.vue'
import AppIcon from '@/components/ui/AppIcon.vue'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)

async function login(role: UserRole) {
  loading.value = true
  userStore.setRole(role)
  await new Promise((r) => setTimeout(r, 500))
  loading.value = false
  router.push('/')
}
</script>

<template>
  <main class="login" role="main">
    <div class="login__panel login__panel--hero" aria-hidden="true">
      <div class="login__art">
        <span class="login__mark">T</span>
        <h2 class="login__tag">Think together.<br />Grow together.</h2>
        <p class="login__lead">
          แพลตฟอร์มบริหารจัดการกิจกรรมภายใน Real Factory — ตั้งแต่ลงทะเบียน
          · โหวต · feedback · leaderboard
        </p>
      </div>
      <svg class="login__blob" viewBox="0 0 400 400" preserveAspectRatio="none">
        <circle cx="80" cy="80" r="120" fill="#FF7A4D" opacity="0.2" />
        <circle cx="340" cy="320" r="160" fill="#FFF0EB" opacity="0.6" />
        <circle cx="300" cy="80" r="60" fill="#F05A28" opacity="0.25" />
      </svg>
    </div>

    <div class="login__panel">
      <div class="login__card">
        <h1 class="login__title">Thinktank Events</h1>
        <p class="login__subtitle">เข้าสู่ระบบด้วย Real Factory SSO</p>

        <div class="login__trust">
          <AppIcon :icon="Lock" size="sm" aria-hidden="true" />
          Real Factory SSO · ปลอดภัย · ไม่เก็บรหัสผ่าน
        </div>

        <AppButton variant="primary" size="lg" full-width :loading="loading" @click="login('EMPLOYEE')">
          <AppIcon :icon="Building2" size="md" aria-hidden="true" />
          เข้าสู่ระบบด้วย Azure AD
        </AppButton>

        <div class="login__divider"><span>หรือเลือก role สำหรับ demo</span></div>

        <div class="login__demo">
          <button class="login__demo-btn" :disabled="loading" @click="login('EMPLOYEE')">
            <span class="login__demo-icon" aria-hidden="true">
              <AppIcon :icon="User" size="lg" />
            </span>
            <div>
              <strong>พนักงาน</strong>
              <small>Register · Vote · Feedback</small>
            </div>
          </button>
          <button class="login__demo-btn" :disabled="loading" @click="login('HR')">
            <span class="login__demo-icon" aria-hidden="true">
              <AppIcon :icon="UserCog" size="lg" />
            </span>
            <div>
              <strong>HR Admin</strong>
              <small>Dashboard · Scan QR · Groups</small>
            </div>
          </button>
          <button class="login__demo-btn" :disabled="loading" @click="login('C_LEVEL')">
            <span class="login__demo-icon" aria-hidden="true">
              <AppIcon :icon="Crown" size="lg" />
            </span>
            <div>
              <strong>ผู้บริหาร (C-Level)</strong>
              <small>Rate teams · Feedback</small>
            </div>
          </button>
        </div>

        <p class="login__legal">
          การเข้าสู่ระบบเท่ากับยอมรับ
          <a href="#terms">ข้อกำหนด</a> และ
          <a href="#privacy">นโยบายความเป็นส่วนตัว</a>
          ติดต่อ DPO: <a href="mailto:dpo@real-factory.co">dpo@real-factory.co</a>
        </p>
      </div>
    </div>
  </main>
</template>

<style scoped>
.login {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr;
  background: var(--color-bg-secondary);
}
@media (min-width: 1024px) {
  .login { grid-template-columns: 1fr 1fr; }
}

.login__panel { padding: var(--space-6); display: flex; align-items: center; justify-content: center; }
.login__panel--hero {
  display: none;
  position: relative;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: var(--color-white);
  overflow: hidden;
}
@media (min-width: 1024px) { .login__panel--hero { display: flex; } }

.login__art { position: relative; z-index: 1; max-width: 440px; }
.login__mark {
  font-size: 64px;
  font-weight: var(--weight-bold);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px; height: 80px;
  background: rgba(255,255,255,0.2);
  border-radius: var(--radius-xl);
  margin-bottom: var(--space-6);
  backdrop-filter: blur(8px);
}
.login__tag {
  font-size: var(--text-display);
  font-weight: var(--weight-bold);
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-snug);
  margin-bottom: var(--space-4);
}
.login__lead { font-size: var(--text-body); opacity: 0.9; line-height: var(--leading-relaxed); }
.login__blob { position: absolute; inset: 0; z-index: 0; opacity: 0.5; }

.login__card {
  width: 100%;
  max-width: 420px;
  background: var(--color-white);
  border-radius: var(--radius-xl);
  padding: var(--space-8) var(--space-6);
  box-shadow: var(--shadow-lg);
}
@media (min-width: 640px) { .login__card { padding: var(--space-10); } }

.login__title { font-size: var(--text-h2); font-weight: var(--weight-bold); text-align: center; margin-bottom: var(--space-2); }
.login__subtitle { font-size: var(--text-body-sm); color: var(--color-text-secondary); text-align: center; margin-bottom: var(--space-5); }

.login__trust {
  display: flex; align-items: center; gap: var(--space-2); justify-content: center;
  padding: var(--space-3);
  background: var(--color-success-subtle);
  color: var(--color-success-dark);
  border-radius: var(--radius-md);
  font-size: var(--text-caption);
  margin-bottom: var(--space-5);
}

.login__divider {
  display: flex; align-items: center; gap: var(--space-3);
  margin: var(--space-5) 0;
  color: var(--color-text-tertiary);
  font-size: var(--text-caption);
}
.login__divider::before, .login__divider::after {
  content: ''; flex: 1; height: 1px; background: var(--color-border-light);
}

.login__demo { display: flex; flex-direction: column; gap: var(--space-2); }
.login__demo-btn {
  display: flex; align-items: center; gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  text-align: left;
  background: var(--color-gray-50);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  min-height: var(--size-touch-target);
  transition: all var(--duration-fast);
  color: var(--color-text-primary);
}
.login__demo-btn:hover:not(:disabled) { border-color: var(--color-primary); background: var(--color-primary-subtle); }
.login__demo-icon {
  width: 40px; height: 40px;
  display: inline-flex; align-items: center; justify-content: center;
  background: var(--color-white);
  border-radius: var(--radius-lg);
  color: var(--color-primary);
  flex-shrink: 0;
}
.login__demo-btn strong { display: block; font-size: var(--text-body-sm); color: var(--color-text-primary); }
.login__demo-btn small { display: block; font-size: var(--text-caption); color: var(--color-text-secondary); margin-top: 2px; }

.login__legal { font-size: var(--text-caption); color: var(--color-text-tertiary); text-align: center; margin-top: var(--space-5); line-height: var(--leading-relaxed); }
</style>
