<script setup lang="ts">
/**
 * Screen #9 — Team Leaderboard (PRD §11.1 #9 · FR-LEADER · Story E6/E8).
 * Podium top 3 · ranked list · my team highlight · positive-tone copy (no bottom shaming).
 */
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { Trophy, Medal, Award, Users, ArrowUp, ArrowDown, Minus } from 'lucide-vue-next'
import { useLeaderboardStore } from '@/stores/leaderboard'
import { useUiState } from '@/composables/useUiState'
import AppIcon from '@/components/ui/AppIcon.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'

const lb = useLeaderboardStore()
const { teams, personal, myUserId } = storeToRefs(lb)
const ui = useUiState()

const tab = ref<'team' | 'me'>('team')

const top3 = computed(() => teams.value.slice(0, 3))
const rest = computed(() => teams.value.slice(3))

const myTeamId = 'g1'
function isMyTeam(gid: string) { return gid === myTeamId }
function isMe(uid: string) { return uid === myUserId.value }
</script>

<template>
  <div class="page page--form lb-page">
    <ErrorState v-if="ui.isErrorBlocking.value" :recoverable="false" title="Leaderboard ยังไม่เปิด" message="เปิดให้ดูหลังจบงาน · HR review 10 นาที" />
    <ErrorState v-else-if="ui.isError.value" @retry="() => {}" />
    <EmptyState v-else-if="ui.isEmpty.value" :icon="Trophy" title="Leaderboard ยังไม่ได้ประกาศ" message="งานยังไม่จบ · เปิดดูได้หลัง 15 พ.ค. 18:00 น." />

    <template v-else-if="ui.isLoading.value">
      <LoadingSkeleton variant="line" width="50%" height="32px" />
      <LoadingSkeleton variant="block" height="280px" />
      <LoadingSkeleton variant="line" :count="5" />
    </template>

    <template v-else>
      <header class="head">
        <p class="head__tag">Leaderboard</p>
        <h1 class="head__title">{{ tab === 'team' ? 'อันดับทีม' : 'อันดับส่วนตัว' }}</h1>
        <p class="head__desc">จาก Thinktank Q2: Future of Work · ประกาศ 15 พ.ค. 19:00 น.</p>
      </header>

      <!-- Tabs -->
      <div class="tabs" role="tablist">
        <button
          class="tab"
          :class="{ 'is-active': tab === 'team' }"
          @click="tab = 'team'"
          role="tab"
          :aria-selected="tab === 'team'"
        >
          <AppIcon :icon="Users" size="sm" aria-hidden="true" />
          ทีม
        </button>
        <button
          class="tab"
          :class="{ 'is-active': tab === 'me' }"
          @click="tab = 'me'"
          role="tab"
          :aria-selected="tab === 'me'"
        >
          <AppIcon :icon="Trophy" size="sm" aria-hidden="true" />
          ส่วนตัว
        </button>
      </div>

      <!-- Team view -->
      <template v-if="tab === 'team'">
        <!-- Podium -->
        <section class="podium" aria-label="ทีมอันดับ 1-3">
          <div class="podium__slot podium__slot--2" v-if="top3[1]">
            <div class="podium__team" :style="{ '--c': top3[1].color }">
              <div class="podium__medal"><AppIcon :icon="Medal" size="xl" /></div>
              <div class="podium__name">{{ top3[1].name }}</div>
              <div class="podium__score">{{ top3[1].score }}</div>
            </div>
            <div class="podium__block podium__block--2">2</div>
          </div>

          <div class="podium__slot podium__slot--1" v-if="top3[0]">
            <div class="podium__team" :style="{ '--c': top3[0].color }">
              <div class="podium__crown"><AppIcon :icon="Trophy" size="xl" /></div>
              <div class="podium__medal"><AppIcon :icon="Award" size="xl" /></div>
              <div class="podium__name">{{ top3[0].name }}</div>
              <div class="podium__score">{{ top3[0].score }}</div>
            </div>
            <div class="podium__block podium__block--1">1</div>
          </div>

          <div class="podium__slot podium__slot--3" v-if="top3[2]">
            <div class="podium__team" :style="{ '--c': top3[2].color }">
              <div class="podium__medal"><AppIcon :icon="Medal" size="xl" /></div>
              <div class="podium__name">{{ top3[2].name }}</div>
              <div class="podium__score">{{ top3[2].score }}</div>
            </div>
            <div class="podium__block podium__block--3">3</div>
          </div>
        </section>

        <!-- Remaining teams -->
        <section v-if="rest.length" class="list">
          <h2 class="list__title">อันดับถัดไป</h2>
          <div v-for="(t, idx) in rest" :key="t.groupId" class="row" :class="{ 'is-me': isMyTeam(t.groupId) }">
            <span class="row__rank">#{{ idx + 4 }}</span>
            <span class="row__dot" :style="{ backgroundColor: t.color }" aria-hidden="true"></span>
            <span class="row__name">{{ t.name }} <AppBadge v-if="isMyTeam(t.groupId)" variant="primary" size="sm">ทีมของคุณ</AppBadge></span>
            <span class="row__delta" :class="{ 'is-pos': t.delta > 0, 'is-neg': t.delta < 0 }">
              <AppIcon :icon="t.delta > 0 ? ArrowUp : t.delta < 0 ? ArrowDown : Minus" size="sm" aria-hidden="true" />
              {{ Math.abs(t.delta) }}
            </span>
            <span class="row__score">{{ t.score }}</span>
          </div>
        </section>
      </template>

      <!-- Personal view -->
      <template v-else>
        <section class="list">
          <h2 class="list__title">Top 10 และตัวคุณ</h2>
          <div
            v-for="p in personal.slice(0, 10)"
            :key="p.userId"
            class="row"
            :class="{ 'is-me': isMe(p.userId), 'is-top3': p.rank <= 3 }"
          >
            <span class="row__rank">#{{ p.rank }}</span>
            <span class="row__avatar">{{ p.avatar }}</span>
            <span class="row__name">
              คุณ{{ p.nickname }}
              <AppBadge v-if="isMe(p.userId)" variant="primary" size="sm">คุณ</AppBadge>
            </span>
            <span class="row__delta" :class="{ 'is-pos': p.deltaRank > 0, 'is-neg': p.deltaRank < 0 }">
              <AppIcon :icon="p.deltaRank > 0 ? ArrowUp : p.deltaRank < 0 ? ArrowDown : Minus" size="sm" aria-hidden="true" />
              {{ Math.abs(p.deltaRank) }}
            </span>
            <span class="row__score">{{ p.score }}</span>
          </div>
        </section>
      </template>

      <!-- Encouragement (positive tone — no bottom shame §15 risk) -->
      <aside class="cheer" role="note">
        <p>🎉 ทุกทีมเก่งมากในงานครั้งนี้ · Feedback ทุกชิ้นจะส่งถึงทีม · เจอกันงานหน้า!</p>
      </aside>
    </template>
  </div>
</template>

<style scoped>
/* layout via global .page .page--form */
.lb-page { padding-bottom: var(--space-12); }

.head { text-align: center; }
.head__tag { font-size: var(--text-caption); text-transform: uppercase; letter-spacing: var(--tracking-wider); color: var(--color-primary); font-weight: var(--weight-semibold); }
.head__title { font-size: var(--text-h1); font-weight: var(--weight-bold); margin: var(--space-1) 0; }
.head__desc { font-size: var(--text-body-sm); color: var(--color-text-secondary); }

.tabs { display: inline-flex; background: var(--color-gray-100); border-radius: var(--radius-full); padding: 4px; gap: 2px; align-self: center; margin: 0 auto; }
.tab {
  display: inline-flex; align-items: center; gap: var(--space-2);
  padding: var(--space-2) var(--space-5);
  min-height: 36px;
  border-radius: var(--radius-full);
  font-size: var(--text-body-sm); font-weight: var(--weight-medium);
  color: var(--color-text-secondary);
}
.tab.is-active { background: var(--color-white); color: var(--color-text-primary); box-shadow: var(--shadow-sm); }

.podium {
  display: grid; grid-template-columns: 1fr 1.2fr 1fr;
  gap: var(--space-3);
  align-items: flex-end;
  padding: var(--space-6) var(--space-3) 0;
  min-height: 320px;
}
.podium__slot { display: flex; flex-direction: column; align-items: center; gap: var(--space-2); }

.podium__team {
  text-align: center;
  background: linear-gradient(180deg, color-mix(in srgb, var(--c) 20%, white) 0%, white 100%);
  border: 2px solid var(--c);
  border-radius: var(--radius-xl);
  padding: var(--space-4) var(--space-3);
  width: 100%;
  animation: drop 0.6s var(--ease-out) both;
}
.podium__slot--2 .podium__team { animation-delay: 0.3s; }
.podium__slot--3 .podium__team { animation-delay: 0.6s; }
@keyframes drop {
  0% { opacity: 0; transform: translateY(-40px); }
  60% { transform: translateY(4px); }
  100% { opacity: 1; transform: translateY(0); }
}

.podium__crown {
  width: 36px; height: 36px;
  background: var(--color-warning); color: var(--color-white);
  border-radius: 50%; margin: calc(var(--space-3) * -1) auto var(--space-2);
  display: inline-flex; align-items: center; justify-content: center;
  box-shadow: var(--shadow-sm);
}
.podium__medal { color: var(--c); margin-bottom: var(--space-2); }
.podium__name { font-weight: var(--weight-semibold); font-size: var(--text-body-sm); }
.podium__score {
  font-size: var(--text-h2); font-weight: var(--weight-bold);
  color: var(--c); line-height: 1; margin-top: var(--space-2);
}

.podium__block { width: 100%; display: flex; align-items: center; justify-content: center; font-weight: var(--weight-bold); color: var(--color-white); border-radius: var(--radius-md) var(--radius-md) 0 0; }
.podium__block--1 { height: 100px; background: linear-gradient(180deg, var(--color-warning), var(--color-warning-dark)); font-size: var(--text-h1); }
.podium__block--2 { height: 70px; background: linear-gradient(180deg, var(--color-gray-400), var(--color-gray-500)); font-size: var(--text-h2); }
.podium__block--3 { height: 50px; background: linear-gradient(180deg, #CD7F32, #965A1A); font-size: var(--text-h3); }

.list {
  background: var(--color-white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  padding: var(--space-5);
}
.list__title { font-size: var(--text-h4); font-weight: var(--weight-semibold); margin-bottom: var(--space-3); }
.row {
  display: grid;
  grid-template-columns: 40px 40px 1fr auto auto;
  gap: var(--space-3);
  align-items: center;
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--color-border-light);
}
.row:last-child { border-bottom: none; }
.row.is-me {
  background: var(--color-primary-subtle);
  margin: 0 calc(var(--space-5) * -1);
  padding-left: var(--space-5);
  padding-right: var(--space-5);
  border-bottom: 1px solid var(--color-primary-muted);
}
.row__rank { font-family: var(--font-mono); font-weight: var(--weight-bold); color: var(--color-text-tertiary); }
.row__dot { width: 24px; height: 24px; border-radius: var(--radius-md); }
.row__avatar { width: 32px; height: 32px; border-radius: 50%; background: var(--color-gray-100); display: inline-flex; align-items: center; justify-content: center; font-weight: var(--weight-semibold); font-size: var(--text-body-sm); }
.row__name { display: inline-flex; align-items: center; gap: var(--space-2); font-weight: var(--weight-medium); min-width: 0; }
.row__delta { display: inline-flex; align-items: center; gap: 2px; font-size: var(--text-caption); color: var(--color-text-tertiary); font-weight: var(--weight-semibold); }
.row__delta.is-pos { color: var(--color-success-dark); }
.row__delta.is-neg { color: var(--color-danger-dark); }
.row__score { font-weight: var(--weight-bold); font-size: var(--text-body); color: var(--color-text-primary); }

.cheer {
  text-align: center;
  padding: var(--space-4);
  background: var(--color-primary-subtle);
  color: var(--color-primary-dark);
  border-radius: var(--radius-lg);
  font-size: var(--text-body-sm);
}

@media (prefers-reduced-motion: reduce) {
  .podium__team { animation: none !important; }
}
</style>
