<template>
  <div class="flex-1 flex flex-col min-h-0">
    <!-- ======================================================== -->
    <!-- 模式分支 A：应急告警模式 (全屏极简 4 区域) -->
    <!-- ======================================================== -->
    <EmergencyAlarmMode v-if="isEmergencyMode" class="flex-1" />

    <!-- ======================================================== -->
    <!-- 模式分支 B：常态浏览模式 (原版大屏，完全不改动，信息完备) -->
    <!-- ======================================================== -->
    <div v-else class="space-y-3">
      <!-- 1. Top 5 KPI Cards Row -->
      <KpiCards />

      <!-- 2. Middle Section: Adjusted column proportions -->
      <div class="grid grid-cols-1 lg:grid-cols-[22%_43%_1fr] gap-2.5 min-h-[440px]">
        <!-- Left Column: 雷电监测概览 -->
        <div class="flex flex-col min-w-0">
          <LightningOverviewCard />
        </div>

        <!-- Center Column: 机房三维态势图 OR 雷电活动地图 -->
        <div class="flex flex-col min-w-0">
          <Datacenter3DCard
            v-if="normalCenterView === '3d'"
            @switch-to-map="normalCenterView = 'map'"
          />
          <LightningMapCard
            v-else
            :can-switch-to-3d="true"
            @switch-to-3d="normalCenterView = '3d'"
          />
        </div>

        <!-- Right Column: 实时预警信息 + 雷电活动实时地图 -->
        <div class="flex flex-col gap-2.5 min-w-0">
          <div class="h-[185px] flex-shrink-0">
            <RealtimeAlertsCard />
          </div>
          <div class="flex-1 min-h-[220px]">
            <LightningMapCard />
          </div>
        </div>
      </div>

      <!-- 3. Bottom Row: 4 Metric Trend & Status Cards -->
      <BottomCards />
    </div>

    <!-- ======================================================== -->
    <!-- 黄色预警提示弹窗 (业务规则：弹窗提醒，不强制切换) -->
    <!-- ======================================================== -->
    <div
      v-if="showYellowModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn"
    >
      <div class="w-full max-w-md bg-[#071c3f] border border-yellow-500/70 rounded-xl p-4 shadow-2xl shadow-yellow-500/10 flex flex-col gap-3">
        <div class="flex items-center gap-2.5 text-yellow-300 font-bold">
          <AlertCircle class="w-5 h-5 flex-shrink-0" />
          <h3 class="text-sm font-bold">黄色预警提示 (三级关注)</h3>
        </div>

        <div class="bg-yellow-950/40 border border-yellow-500/30 rounded-lg p-3 text-xs text-yellow-100/90 leading-relaxed space-y-1.5">
          <div class="flex items-center justify-between font-mono text-[11px] text-yellow-400">
            <span>点位: 园区外围电场探头 (AEFM-02)</span>
            <span>15:43:10</span>
          </div>
          <p>
            监测到园区周边雷云电场出现微弱波动 (18.2 kV/m)，低于橙色告警线 (25.0 kV/m)。依据处置规范，<strong>黄色预警仅做弹窗提醒，不强制切换大屏</strong>。
          </p>
          <p class="text-slate-300 text-[11px]">
            如需专注查看该点位单一时序曲线与定位，您可手动切换至应急极简模式。
          </p>
        </div>

        <div class="flex items-center justify-end gap-2.5 pt-1">
          <button
            @click="showYellowModal = false"
            class="px-3 py-1.5 rounded text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            保持常态浏览 (仅提醒)
          </button>
          <button
            @click="handleYellowSwitch"
            class="px-3.5 py-1.5 rounded text-xs font-bold bg-yellow-600 hover:bg-yellow-500 text-black shadow-md shadow-yellow-600/30 transition-all cursor-pointer"
          >
            切换到极简模式
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  AlertCircle
} from 'lucide-vue-next';
import {
  isEmergencyMode,
  enterEmergencyMode
} from '@/composables/useEmergencyMode';

import EmergencyAlarmMode from '@/components/overview/EmergencyAlarmMode.vue';
import KpiCards from '@/components/overview/KpiCards.vue';
import LightningOverviewCard from '@/components/overview/LightningOverviewCard.vue';
import Datacenter3DCard from '@/components/overview/Datacenter3DCard.vue';
import RealtimeAlertsCard from '@/components/overview/RealtimeAlertsCard.vue';
import LightningMapCard from '@/components/overview/LightningMapCard.vue';
import BottomCards from '@/components/overview/BottomCards.vue';

const showYellowModal = ref(false);
const normalCenterView = ref<'3d' | 'map'>('3d');

const handleYellowSwitch = () => {
  showYellowModal.value = false;
  enterEmergencyMode('lightning', false);
};
</script>
