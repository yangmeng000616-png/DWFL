<template>
  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2.5">
    <!-- Bottom Card 1: 监测趋势联动分析 -->
    <div class="tech-panel rounded-xl p-3 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      <div class="flex items-center justify-between pb-2 border-b border-[#184682]/60">
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 rounded-md bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_6px_rgba(6,182,212,0.3)]">
            <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M13 2L3 14h8l-1 8 11-12h-8l1-8z" />
            </svg>
          </div>
          <h3 class="text-sm font-bold text-white tracking-wide">多参数趋势联动</h3>
        </div>

        <!-- Metric Switcher -->
        <div class="flex items-center bg-[#051634] p-0.5 rounded-md border border-[#184682]/60 text-xs">
          <button
            v-for="m in metricChannels"
            :key="m.id"
            @click="activeMetric = m.id"
            class="px-2 py-0.5 rounded transition-all font-medium text-[11px]"
            :class="activeMetric === m.id ? 'bg-[#1872f6] text-white font-semibold shadow' : 'text-slate-400 hover:text-slate-200'"
          >
            {{ m.label }}
          </button>
        </div>
      </div>

      <!-- Trend Chart with Realtime Dynamic Values -->
      <div class="relative mt-1 flex-1 min-h-[90px]">
        <div class="flex items-center justify-between text-xs text-slate-400 mb-0.5">
          <span>{{ currentMetricConfig.unitLabel }}</span>
          <span class="font-tech text-cyan-300 font-semibold">当前: {{ currentMetricConfig.currentVal }}</span>
        </div>
        <div class="h-[80px] w-full">
          <svg class="w-full h-full overflow-visible" viewBox="0 0 320 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="trendCyanGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#00f0ff" stop-opacity="0.45" />
                <stop offset="100%" stop-color="#0284c7" stop-opacity="0.0" />
              </linearGradient>
            </defs>

            <!-- Horizontal Grid lines -->
            <line x1="25" y1="15" x2="310" y2="15" stroke="#133360" stroke-dasharray="2 2" />
            <line x1="25" y1="45" x2="310" y2="45" stroke="#133360" stroke-dasharray="2 2" />
            <line x1="25" y1="75" x2="310" y2="75" stroke="#133360" stroke-dasharray="2 2" />

            <!-- Y-Axis ticks -->
            <text x="20" y="18" fill="#64748b" font-size="11" text-anchor="end" font-family="'Chakra Petch', sans-serif">
              {{ currentMetricConfig.yMax }}
            </text>
            <text x="20" y="48" fill="#64748b" font-size="11" text-anchor="end" font-family="'Chakra Petch', sans-serif">
              {{ currentMetricConfig.yMid }}
            </text>
            <text x="20" y="78" fill="#64748b" font-size="11" text-anchor="end" font-family="'Chakra Petch', sans-serif">
              {{ currentMetricConfig.yMin }}
            </text>

            <!-- Trend Area & Stroke -->
            <path :d="currentMetricConfig.areaPath" fill="url(#trendCyanGrad)" />
            <path :d="currentMetricConfig.strokePath" fill="none" stroke="#00f0ff" stroke-width="2" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Bottom Card 2: 设备运行状态 -->
    <div class="tech-panel rounded-xl p-3 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      <div class="flex items-center justify-between pb-2 border-b border-[#184682]/60">
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 rounded-md bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300 shadow-[0_0_6px_rgba(59,130,246,0.3)]">
            <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
            </svg>
          </div>
          <h3 class="text-sm font-bold text-white tracking-wide">设备在线与健康度</h3>
        </div>
        <span class="text-xs text-slate-400 font-tech">在线率 100%</span>
      </div>

      <!-- 2x2 Device Grid (Clickable to inspect) -->
      <div class="grid grid-cols-2 gap-2 my-1.5 flex-1">
        <div
          @click="openDeviceInspection('atmospheric')"
          class="bg-[#051634]/80 hover:bg-[#0c2452] border border-[#133c77]/50 hover:border-cyan-400/60 rounded-lg p-2.5 flex items-center justify-between cursor-pointer transition-colors group"
          title="点击查看雷电探测详情"
        >
          <div>
            <div class="text-xs text-slate-400 group-hover:text-slate-200">雷电监测</div>
            <div class="text-sm font-bold font-tech text-cyan-300 mt-0.5">3 / 3</div>
          </div>
          <span class="px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/40 text-[11px] font-medium text-emerald-400">正常</span>
        </div>

        <div
          @click="openDeviceInspection('spd_terminal')"
          class="bg-[#051634]/80 hover:bg-[#0c2452] border border-[#133c77]/50 hover:border-cyan-400/60 rounded-lg p-2.5 flex items-center justify-between cursor-pointer transition-colors group"
          title="点击查看SPD终端组"
        >
          <div>
            <div class="text-xs text-slate-400 group-hover:text-slate-200">SPD终端</div>
            <div class="text-sm font-bold font-tech text-cyan-300 mt-0.5">12 / 12</div>
          </div>
          <span class="px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/40 text-[11px] font-medium text-emerald-400">正常</span>
        </div>

        <div
          @click="openDeviceInspection('ground_res')"
          class="bg-[#051634]/80 hover:bg-[#0c2452] border border-[#133c77]/50 hover:border-cyan-400/60 rounded-lg p-2.5 flex items-center justify-between cursor-pointer transition-colors group"
          title="点击查看接地监测终端"
        >
          <div>
            <div class="text-xs text-slate-400 group-hover:text-slate-200">接地监测</div>
            <div class="text-sm font-bold font-tech text-cyan-300 mt-0.5">4 / 4</div>
          </div>
          <span class="px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/40 text-[11px] font-medium text-emerald-400">正常</span>
        </div>

        <div
          @click="openDeviceInspection('esd_terminal')"
          class="bg-[#051634]/80 hover:bg-[#0c2452] border border-[#133c77]/50 hover:border-cyan-400/60 rounded-lg p-2.5 flex items-center justify-between cursor-pointer transition-colors group"
          title="点击查看微环境静电探针"
        >
          <div>
            <div class="text-xs text-slate-400 group-hover:text-slate-200">静电传感器</div>
            <div class="text-sm font-bold font-tech text-cyan-300 mt-0.5">18 / 18</div>
          </div>
          <span class="px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/40 text-[11px] font-medium text-emerald-400">正常</span>
        </div>
      </div>
    </div>

    <!-- Bottom Card 3: 运行数据统计 -->
    <div class="tech-panel rounded-xl p-3 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      <div class="flex items-center justify-between pb-2 border-b border-[#184682]/60">
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 rounded-md bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shadow-[0_0_6px_rgba(99,102,241,0.3)]">
            <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
            </svg>
          </div>
          <h3 class="text-sm font-bold text-white tracking-wide">运行数据统计</h3>
        </div>

        <!-- Time Range Selector -->
        <div class="flex items-center bg-[#051634] p-0.5 rounded-md border border-[#184682]/60 text-xs">
          <button
            v-for="t in ['今日', '本周', '本月']"
            :key="t"
            @click="statsPeriod = t"
            class="px-2 py-0.5 rounded transition-all font-medium text-[11px]"
            :class="statsPeriod === t ? 'bg-gradient-to-r from-[#1872f6] to-[#0091ff] text-white font-semibold' : 'text-slate-400 hover:text-slate-200'"
          >
            {{ t }}
          </button>
        </div>
      </div>

      <!-- 2x2 Metric Stat Boxes -->
      <div class="grid grid-cols-2 gap-2 my-1.5 flex-1">
        <div class="bg-[#051634]/80 border border-[#133c77]/50 rounded-lg p-2">
          <div class="text-[11px] text-slate-400">雷击事件计数</div>
          <div class="text-sm font-bold font-tech text-white mt-0.5">
            {{ currentPeriodData.lightningCount }} <span class="text-[11px] font-sans text-slate-400">次</span>
          </div>
          <div class="text-[10px] text-emerald-400 font-medium mt-0.5">较同期 ↓ 50%</div>
        </div>

        <div class="bg-[#051634]/80 border border-[#133c77]/50 rounded-lg p-2">
          <div class="text-[11px] text-slate-400">峰值泄流电流</div>
          <div class="text-sm font-bold font-tech text-cyan-300 mt-0.5">
            {{ currentPeriodData.maxCurrent }} <span class="text-[11px] font-sans text-slate-400">kA</span>
          </div>
          <div class="text-[10px] text-cyan-300 font-medium mt-0.5">截获率 100%</div>
        </div>

        <div class="bg-[#051634]/80 border border-[#133c77]/50 rounded-lg p-2">
          <div class="text-[11px] text-slate-400">静电超限告警</div>
          <div class="text-sm font-bold font-tech text-white mt-0.5">
            {{ currentPeriodData.esdAlerts }} <span class="text-[11px] font-sans text-slate-400">次</span>
          </div>
          <div class="text-[10px] text-emerald-400 mt-0.5">平稳受控</div>
        </div>

        <div class="bg-[#051634]/80 border border-[#133c77]/50 rounded-lg p-2">
          <div class="text-[11px] text-slate-400">设备主动维保</div>
          <div class="text-sm font-bold font-tech text-white mt-0.5">
            {{ currentPeriodData.maintenanceCount }} <span class="text-[11px] font-sans text-slate-400">次</span>
          </div>
          <div class="text-[10px] text-cyan-400 font-medium mt-0.5">已处置闭环</div>
        </div>
      </div>
    </div>

    <!-- Bottom Card 4: 系统运行情况与自检 -->
    <div class="tech-panel rounded-xl p-3 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      <div class="flex items-center justify-between pb-2 border-b border-[#184682]/60">
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 rounded-md bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-[0_0_6px_rgba(16,185,129,0.3)]">
            <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
            </svg>
          </div>
          <h3 class="text-sm font-bold text-white tracking-wide">系统综合可用度</h3>
        </div>
      </div>

      <!-- Circular Gauge & List -->
      <div class="flex items-center gap-3.5 my-1.5 flex-1">
        <!-- SVG Gauge -->
        <div class="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
          <svg class="w-full h-full -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="32" fill="none" stroke="#082046" stroke-width="6" />
            <circle
              cx="40"
              cy="40"
              r="32"
              fill="none"
              stroke="#00e5a3"
              stroke-width="6"
              stroke-dasharray="201"
              stroke-dashoffset="1"
              stroke-linecap="round"
              class="drop-shadow-[0_0_6px_rgba(0,229,163,0.8)]"
            />
          </svg>
          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <span class="text-base font-bold font-tech text-white">99.8%</span>
            <span class="text-[10px] text-[#00e5a3] font-medium">稳定运行</span>
          </div>
        </div>

        <!-- 5 Status checklist items -->
        <div class="flex flex-col gap-1.5 text-xs flex-1">
          <div class="flex items-center justify-between text-slate-200">
            <span>空间雷电感知链</span>
            <span class="text-[#00e5a3] font-medium flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-[#00e5a3]"></span> 正常
            </span>
          </div>
          <div class="flex items-center justify-between text-slate-200">
            <span>机房微环境屏蔽</span>
            <span class="text-[#00e5a3] font-medium flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-[#00e5a3]"></span> 正常
            </span>
          </div>
          <div class="flex items-center justify-between text-slate-200">
            <span>深埋人工地网</span>
            <span class="text-[#00e5a3] font-medium flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-[#00e5a3]"></span> 0.52Ω
            </span>
          </div>
          <div class="flex items-center justify-between text-slate-200">
            <span>浪涌主动分流通道</span>
            <span class="text-[#00e5a3] font-medium flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-[#00e5a3]"></span> 正常
            </span>
          </div>
          <div class="flex items-center justify-between text-slate-200">
            <span>数字孪生通信总线</span>
            <span class="text-[#00e5a3] font-medium flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-[#00e5a3]"></span> 正常
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { openDeviceInspection } from '@/composables/useCockpitState';

const activeMetric = ref('lightning');
const statsPeriod = ref('今日');

const metricChannels = [
  { id: 'lightning', label: '雷电流' },
  { id: 'esd', label: '静电电位' },
  { id: 'ground', label: '地网电阻' }
];

const currentMetricConfig = computed(() => {
  if (activeMetric.value === 'esd') {
    return {
      unitLabel: '静电电位波动 (kV)',
      currentVal: '0.80 kV',
      yMax: '2.0',
      yMid: '1.0',
      yMin: '0.0',
      areaPath: 'M 28 90 L 50 82 L 80 85 L 110 75 L 140 70 L 170 78 L 200 68 L 230 72 L 260 80 L 290 75 L 305 76 L 305 95 L 28 95 Z',
      strokePath: 'M 28 90 L 50 82 L 80 85 L 110 75 L 140 70 L 170 78 L 200 68 L 230 72 L 260 80 L 290 75 L 305 76'
    };
  }
  if (activeMetric.value === 'ground') {
    return {
      unitLabel: '地网阻抗微变化 (Ω)',
      currentVal: '0.52 Ω',
      yMax: '1.0',
      yMid: '0.6',
      yMin: '0.2',
      areaPath: 'M 28 80 L 50 78 L 80 82 L 110 80 L 140 81 L 170 80 L 200 79 L 230 80 L 260 79 L 290 80 L 305 80 L 305 95 L 28 95 Z',
      strokePath: 'M 28 80 L 50 78 L 80 82 L 110 80 L 140 81 L 170 80 L 200 79 L 230 80 L 260 79 L 290 80 L 305 80'
    };
  }
  return {
    unitLabel: '雷电电场强度 (kA)',
    currentVal: '23.6 kA',
    yMax: '80',
    yMid: '40',
    yMin: '0',
    areaPath: 'M 28 92 L 40 88 L 60 85 L 80 82 L 100 86 L 120 78 L 140 82 L 160 70 L 180 85 L 200 60 L 220 45 L 240 75 L 260 80 L 280 88 L 305 85 L 305 95 L 28 95 Z',
    strokePath: 'M 28 92 L 40 88 L 60 85 L 80 82 L 100 86 L 120 78 L 140 82 L 160 70 L 180 85 L 200 60 L 220 45 L 240 75 L 260 80 L 280 88 L 305 85'
  };
});

const currentPeriodData = computed(() => {
  if (statsPeriod.value === '本周') {
    return {
      lightningCount: 5,
      maxCurrent: 64.2,
      esdAlerts: 1,
      maintenanceCount: 3
    };
  }
  if (statsPeriod.value === '本月') {
    return {
      lightningCount: 12,
      maxCurrent: 78.5,
      esdAlerts: 2,
      maintenanceCount: 6
    };
  }
  return {
    lightningCount: 2,
    maxCurrent: 58.7,
    esdAlerts: 0,
    maintenanceCount: 1
  };
});
</script>
