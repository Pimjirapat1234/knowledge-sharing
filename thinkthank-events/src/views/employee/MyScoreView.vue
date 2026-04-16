<script setup lang="ts">
/**
 * Screen #8 — My Score (PRD §11.1 #8 · FR-STATS · Story E7).
 * Bar chart · compare with team avg · trend line 3-5 events.
 */
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { BarChart3, TrendingUp, Trophy, Sparkles } from 'lucide-vue-next'
import { useLeaderboardStore } from '@/stores/leaderboard'
import { useUiState } from '@/composables/useUiState'
import AppIcon from '@/components/ui/AppIcon.vue'
import StatCard from '@/components/ui/StatCard.vue'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'

const lb = useLeaderboardStore()
const { myScore, myTrend, teamAvg } = storeToRefs(lb)
const ui = useUiState()

const eventLabels = ['Q4 2025', 'Q1 2026', 'Q2 2026', 'Q3 2026 (est)', 'Q4 2026 (est)']
const maxVal = computed(() => Math.max(...myTrend.value, ...teamAvg.value, 100))

function barH(v: number) { return Math.round((v / maxVal.value) * 100) }

const trendStart = computed(() => myTrend.value[0] ?? 0)
const trendEnd = computed(() => myTrend.value[myTrend.value.length - 1] ?? 0)
const trendDelta = computed(() => trendEnd.value - trendStart.value)
const teamAvgEnd = computed(() => teamAvg.value[teamAvg.value.length - 1] ?? 0)
const aboveAvg = computed(() => trendEnd.value - teamAvgEnd.value)
</script>

<template>
  <div class="page">
    <ErrorState v-if="ui.isErrorBlocking.value" :recoverable="false" title="ไม่พบคะแนน" />
    <ErrorState v-else-if="ui.isError.value" @retry="() => {}" />
    <EmptyState v-else-if="ui.isEmpty.value" :icon="BarChart3" title="ยังไม่มีคะแนนสำหรับคุณ" message="เข้าร่วมกิจกรรมและรับ feedback จาก C-Level เพื่อดูคะแนนของคุณ" />

    <template v-else-if="ui.isLoading.value">
      <LoadingSkeleton variant="block" height="160px" />
      <LoadingSkeleton variant="card" :count="2" />
    </template>

    <template v-else>
      <header class="head">
        <p class="head__tag">คะแนนของฉัน</p>
        <h1 class="head__title" v-if="myScore">{{ myScore.score }}<span>/100</span></h1>
        <p class="head__sub">ในงาน Thinktank Q2: Future of Work</p>
      </header>

      <!-- Key stats -->
      <section class="stats">
        <StatCard label="อันดับ" :value="myScore?.rank ?? 0" :delta="myScore?.deltaRank" :icon="Trophy" color="warning" />
        <StatCard label="คะแนน" :value="myScore?.score ?? 0" suffix="/100" :icon="Sparkles" color="primary" />
        <StatCard label="Trend" :value="trendDelta" suffix="คะแนน" :icon="TrendingUp" color="success" />
      </section>

      <!-- Trend chart -->
      <section class="chart">
        <div class="chart__header">
          <h2 class="chart__title">
            <AppIcon :icon="TrendingUp" size="md" aria-hidden="true" />
            Trend ย้อนหลัง 5 events
          </h2>
          <div class="chart__legend">
            <span class="chart__dot chart__dot--mine"></span> คุณ
            <span class="chart__dot chart__dot--team"></span> Avg ทีม
          </div>
        </div>

        <div class="chart__grid" :style="{ '--cols': myTrend.length }">
          <div v-for="(v, i) in myTrend" :key="i" class="chart__col">
            <div class="chart__bars">
              <div class="chart__bar chart__bar--team" :style="`height: ${barH(teamAvg[i] ?? 0)}%`" :title="`Team avg: ${teamAvg[i] ?? 0}`"></div>
              <div class="chart__bar chart__bar--mine" :style="`height: ${barH(v)}%`" :title="`You: ${v}`">
                <span class="chart__value">{{ v }}</span>
              </div>
            </div>
            <div class="chart__label">{{ eventLabels[i] ?? `E${i + 1}` }}</div>
          </div>
        </div>
      </section>

      <!-- Insight -->
      <section class="insight">
        <div class="insight__icon"><AppIcon :icon="Sparkles" size="lg" /></div>
        <div>
          <p class="insight__title">คุณทำได้ดีขึ้น {{ trendDelta }} คะแนน ตั้งแต่เริ่ม</p>
          <p class="insight__desc">
            คะแนนคุณสูงกว่า average ของทีม {{ aboveAvg }} คะแนน · keep it up!
          </p>
        </div>
      </section>

      <!-- Achievements placeholder (v2) -->
      <section class="badges">
        <h2 class="badges__title">Badges (v2)</h2>
        <div class="badges__grid">
          <div class="badge-item is-locked"><AppIcon :icon="Trophy" size="xl" />Top 3 Finisher</div>
          <div class="badge-item is-locked"><AppIcon :icon="Sparkles" size="xl" />Perfect Score</div>
          <div class="badge-item is-locked"><AppIcon :icon="TrendingUp" size="xl" />Most Improved</div>
        </div>
        <p class="badges__note">Achievement system จะเปิดตัวใน v1.1</p>
      </section>
    </template>
  </div>
</template>

<style scoped>
.page { max-width: 720px; margin: 0 auto; padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-5); padding-bottom: var(--space-12); }
@media (min-width: 768px) { .page { padding: var(--space-8) var(--space-6); } }

.head { text-align: center; padding: var(--space-6); background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%); color: var(--color-white); border-radius: var(--radius-xl); }
.head__tag { font-size: var(--text-caption); text-transform: uppercase; letter-spacing: var(--tracking-wider); opacity: 0.85; }
.head__title { font-size: 72px; font-weight: var(--weight-bold); line-height: 1; margin: var(--space-2) 0; }
.head__title span { font-size: var(--text-h3); opacity: 0.8; font-weight: var(--weight-regular); }
.head__sub { font-size: var(--text-body-sm); opacity: 0.9; }

.stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-3); }

.chart {
  background: var(--color-white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  padding: var(--space-5);
}
.chart__header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: var(--space-3); margin-bottom: var(--space-4); }
.chart__title { display: inline-flex; align-items: center; gap: var(--space-2); font-size: var(--text-h4); font-weight: var(--weight-semibold); }
.chart__legend { display: flex; gap: var(--space-3); font-size: var(--text-caption); color: var(--color-text-secondary); align-items: center; }
.chart__dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; margin-right: 4px; }
.chart__dot--mine { background: var(--color-primary); }
.chart__dot--team { background: var(--color-gray-400); }

.chart__grid { display: grid; grid-template-columns: repeat(var(--cols), 1fr); gap: var(--space-2); height: 240px; align-items: flex-end; }
.chart__col { display: flex; flex-direction: column; gap: var(--space-2); height: 100%; }
.chart__bars { flex: 1; display: flex; align-items: flex-end; gap: 4px; padding: 0 2px; }
.chart__bar { flex: 1; min-height: 4px; border-radius: var(--radius-sm) var(--radius-sm) 0 0; position: relative; transition: height var(--duration-slow); }
.chart__bar--team { background: var(--color-gray-300); }
.chart__bar--mine { background: linear-gradient(180deg, var(--color-primary-light), var(--color-primary)); }
.chart__value { position: absolute; top: -20px; left: 50%; transform: translateX(-50%); font-size: 10px; font-weight: var(--weight-bold); color: var(--color-primary); }
.chart__label { font-size: 10px; text-align: center; color: var(--color-text-tertiary); }

.insight {
  display: flex; gap: var(--space-4); align-items: flex-start;
  padding: var(--space-5);
  background: var(--color-success-subtle);
  border: 1px solid var(--color-success-light);
  border-radius: var(--radius-xl);
}
.insight__icon {
  width: 48px; height: 48px; border-radius: var(--radius-lg);
  background: var(--color-success); color: var(--color-white);
  display: inline-flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.insight__title { font-size: var(--text-body); font-weight: var(--weight-semibold); color: var(--color-success-dark); margin-bottom: var(--space-1); }
.insight__desc { font-size: var(--text-body-sm); color: var(--color-text-secondary); line-height: var(--leading-relaxed); }

.badges {
  background: var(--color-white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  padding: var(--space-5);
}
.badges__title { font-size: var(--text-h4); font-weight: var(--weight-semibold); margin-bottom: var(--space-3); }
.badges__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: var(--space-3); margin-bottom: var(--space-3); }
.badge-item {
  display: flex; flex-direction: column; align-items: center; gap: var(--space-2);
  padding: var(--space-4); border-radius: var(--radius-lg);
  background: var(--color-gray-50); color: var(--color-gray-400);
  font-size: var(--text-caption); text-align: center;
  opacity: 0.6;
  filter: grayscale(1);
}
.badges__note { font-size: var(--text-caption); color: var(--color-text-tertiary); text-align: center; }
</style>
