<template>
  <div class="space-y-4">
    <!-- View Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-5 h-5 rounded bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        </div>
        <h2 class="text-base font-bold text-white tracking-wide">实时监测 · 全参数多通道数据流</h2>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="togglePause"
          class="px-3 py-1.5 text-xs rounded-lg border font-medium flex items-center gap-1.5 transition-colors"
          :class="isPaused ? 'bg-amber-600 text-white border-amber-500' : 'bg-[#0a2046] hover:bg-[#0f2e64] text-cyan-300 border-cyan-500/40'"
        >
          <span>{{ isPaused ? '已暂停刷新' : '实时流更新中' }}</span>
          <span class="w-2 h-2 rounded-full" :class="isPaused ? 'bg-amber-300' : 'bg-emerald-400 animate-ping'"></span>
        </button>
        <button
          @click="resetAllChannels"
          class="px-3 py-1.5 text-xs rounded-lg bg-[#0e2752] hover:bg-[#163b78] border border-cyan-500/30 text-slate-200"
        >
          校准归零
        </button>
      </div>
    </div>

    <!-- 4 Real-time Live Telemetry Sensor Stream Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3.5">
      <!-- Channel 1: 大气电场强度 -->
      <div class="tech-panel rounded-xl p-4 flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-slate-300">CH-1 大气电场强度</span>
          <span class="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/40">在线</span>
        </div>
        <div class="my-2">
          <div class="text-2xl font-bold font-tech text-cyan-300">
            {{ (12.4 + sensorDrift).toFixed(2) }} <span class="text-xs font-normal text-slate-400 font-sans">kV/m</span>
          </div>
          <div class="text-[11px] text-slate-400 mt-1">采样率: 1000Hz · 极性: 负极性</div>
        </div>
        <!-- Sparkline -->
        <div class="h-10 w-full pt-1">
          <svg class="w-full h-full" viewBox="0 0 160 30" preserveAspectRatio="none">
            <path d="M 0 20 Q 20 15 40 18 T 80 12 T 120 22 T 160 14" fill="none" stroke="#00f0ff" stroke-width="2" />
          </svg>
        </div>
      </div>

      <!-- Channel 2: 静电电位 -->
      <div class="tech-panel rounded-xl p-4 flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-slate-300">CH-2 机房静电电位</span>
          <span class="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/40">在线</span>
        </div>
        <div class="my-2">
          <div class="text-2xl font-bold font-tech text-emerald-300">
            {{ (0.8 + sensorDrift * 0.05).toFixed(2) }} <span class="text-xs font-normal text-slate-400 font-sans">kV</span>
          </div>
          <div class="text-[11px] text-slate-400 mt-1">安全阈值: &lt; 2.0 kV · 离子平衡正常</div>
        </div>
        <!-- Sparkline -->
        <div class="h-10 w-full pt-1">
          <svg class="w-full h-full" viewBox="0 0 160 30" preserveAspectRatio="none">
            <path d="M 0 15 Q 30 8 60 18 T 110 12 T 160 16" fill="none" stroke="#10b981" stroke-width="2" />
          </svg>
        </div>
      </div>

      <!-- Channel 3: 接地网回路电阻 -->
      <div class="tech-panel rounded-xl p-4 flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-slate-300">CH-3 接地网回路电阻</span>
          <span class="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/40">在线</span>
        </div>
        <div class="my-2">
          <div class="text-2xl font-bold font-tech text-teal-300">
            {{ (0.52 + sensorDrift * 0.01).toFixed(3) }} <span class="text-xs font-normal text-slate-400 font-sans">Ω</span>
          </div>
          <div class="text-[11px] text-slate-400 mt-1">标准: &lt; 1.0 Ω · 四线法连续测量</div>
        </div>
        <!-- Sparkline -->
        <div class="h-10 w-full pt-1">
          <svg class="w-full h-full" viewBox="0 0 160 30" preserveAspectRatio="none">
            <path d="M 0 18 Q 40 16 80 19 T 130 17 T 160 18" fill="none" stroke="#14b8a6" stroke-width="2" />
          </svg>
        </div>
      </div>

      <!-- Channel 4: SPD浪涌泄漏电流 -->
      <div class="tech-panel rounded-xl p-4 flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-slate-300">CH-4 SPD漏电流</span>
          <span class="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/40">在线</span>
        </div>
        <div class="my-2">
          <div class="text-2xl font-bold font-tech text-cyan-300">
            {{ (6.2 + sensorDrift * 0.2).toFixed(1) }} <span class="text-xs font-normal text-slate-400 font-sans">µA</span>
          </div>
          <div class="text-[11px] text-slate-400 mt-1">预警阈值: &gt; 20 µA · 劣化指数 0.04%</div>
        </div>
        <!-- Sparkline -->
        <div class="h-10 w-full pt-1">
          <svg class="w-full h-full" viewBox="0 0 160 30" preserveAspectRatio="none">
            <path d="M 0 22 Q 35 24 70 20 T 120 23 T 160 21" fill="none" stroke="#38bdf8" stroke-width="2" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Main Live Multi-Trace Oscilloscope Panel -->
    <div class="tech-panel rounded-xl p-5">
      <div class="flex items-center justify-between pb-3 border-b border-[#1b3d75]/50">
        <div>
          <h3 class="text-sm font-bold text-white tracking-wide">高频雷电浪涌与暂态波形分析仪</h3>
          <p class="text-xs text-slate-400 mt-0.5">实时捕获 8/20µs 与 10/350µs 暂态冲击波形与电磁感应脉冲</p>
        </div>
        <div class="flex items-center gap-3 text-xs">
          <span class="flex items-center gap-1.5 text-cyan-300">
            <span class="w-2.5 h-1 bg-cyan-400 inline-block"></span> 雷电流暂态 (kA)
          </span>
          <span class="flex items-center gap-1.5 text-emerald-300">
            <span class="w-2.5 h-1 bg-emerald-400 inline-block"></span> 地电位反击 (V)
          </span>
          <span class="flex items-center gap-1.5 text-amber-300">
            <span class="w-2.5 h-1 bg-amber-400 inline-block"></span> 静电放电 ESD
          </span>
        </div>
      </div>

      <!-- Real-time Oscilloscope Grid -->
      <div class="relative h-[320px] w-full mt-4 bg-[#051126] rounded-lg border border-[#173e75] p-3 overflow-hidden">
        <svg class="w-full h-full" viewBox="0 0 800 300" preserveAspectRatio="none">
          <!-- Grid lines -->
          <defs>
            <pattern id="scopeGrid" width="40" height="30" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 30" fill="none" stroke="#0e2850" stroke-width="1" />
            </pattern>
          </defs>
          <rect width="800" height="300" fill="url(#scopeGrid)" />
          
          <!-- Center Zero Baseline -->
          <line x1="0" y1="150" x2="800" y2="150" stroke="#1d4b8e" stroke-width="1.5" stroke-dasharray="4 2" />

          <!-- Simulated Waveform Trace 1: Blue Transient -->
          <path
            d="M 0 150 
               L 100 150 L 150 148 L 220 152 
               L 260 40 L 275 80 L 290 120 L 310 160 L 340 145 L 380 152 
               L 500 150 L 530 110 L 550 165 L 580 148 L 800 150"
            fill="none"
            stroke="#00e5ff"
            stroke-width="2.2"
          />

          <!-- Trace 2: Green Ground Potential -->
          <path
            d="M 0 160 
               L 180 160 L 260 110 L 280 140 L 310 165 L 420 160 
               L 530 135 L 560 170 L 800 160"
            fill="none"
            stroke="#10b981"
            stroke-width="1.8"
            stroke-dasharray="6 3"
          />

          <!-- Waveform trigger point -->
          <circle cx="260" cy="40" r="5" fill="#f43f5e" />
          <text x="270" y="38" fill="#fda4af" font-size="11" font-family="monospace">PEAK: 58.7 kA / 12.6 µs</text>
        </svg>

        <!-- Dynamic scan line overlay -->
        <div class="absolute inset-y-0 w-1 bg-cyan-400/40 shadow-[0_0_10px_#00f0ff] pointer-events-none animate-pulse"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const isPaused = ref(false);
const sensorDrift = ref(0);
let intervalId: number | null = null;

const togglePause = () => {
  isPaused.value = !isPaused.value;
};

const resetAllChannels = () => {
  sensorDrift.value = 0;
  alert('所有传感器通道已完成硬件校准，基线电位归零！');
};

onMounted(() => {
  intervalId = window.setInterval(() => {
    if (!isPaused.value) {
      sensorDrift.value = (Math.random() - 0.5) * 0.4;
    }
  }, 1200);
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>
