<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-5 h-5 rounded bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
        </div>
        <h2 class="text-base font-bold text-white tracking-wide">数据分析 · 雷电频谱特征与地网劣化趋势</h2>
      </div>

      <div class="flex items-center bg-[#091b3d] p-0.5 rounded-lg border border-[#1d4b92]/50 text-xs">
        <button
          v-for="p in ['近30天', '近90天', '近1年']"
          :key="p"
          @click="timeSpan = p"
          class="px-2.5 py-1 rounded transition-all"
          :class="timeSpan === p ? 'bg-[#1872f6] text-white font-semibold' : 'text-slate-400 hover:text-slate-200'"
        >
          {{ p }}
        </button>
      </div>
    </div>

    <!-- 3 Big Analytics Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- Chart 1: 雷电流强度概率分布 (kA) -->
      <div class="tech-panel rounded-xl p-4 flex flex-col justify-between">
        <div class="flex items-center justify-between pb-3 border-b border-[#1b3d75]/50">
          <h3 class="text-xs font-bold text-white tracking-wide">雷击电流幅值正态概率分布</h3>
          <span class="text-xs text-cyan-300 font-tech">样本容量 N = 124</span>
        </div>
        <div class="h-[220px] w-full mt-3">
          <svg class="w-full h-full" viewBox="0 0 400 180">
            <!-- Bars -->
            <rect x="50" y="140" width="30" height="20" fill="#0284c7" opacity="0.6" rx="2" />
            <rect x="90" y="110" width="30" height="50" fill="#0284c7" opacity="0.75" rx="2" />
            <rect x="130" y="70" width="30" height="90" fill="#0ea5e9" opacity="0.85" rx="2" />
            <rect x="170" y="35" width="30" height="125" fill="#00f0ff" rx="2" />
            <rect x="210" y="60" width="30" height="100" fill="#0ea5e9" opacity="0.85" rx="2" />
            <rect x="250" y="95" width="30" height="65" fill="#0284c7" opacity="0.75" rx="2" />
            <rect x="290" y="130" width="30" height="30" fill="#0284c7" opacity="0.6" rx="2" />
            <rect x="330" y="145" width="30" height="15" fill="#0284c7" opacity="0.5" rx="2" />

            <!-- Gaussian curve -->
            <path
              d="M 50 150 Q 185 10 350 150"
              fill="none"
              stroke="#f59e0b"
              stroke-width="2"
              stroke-dasharray="4 2"
            />

            <!-- X-Axis text -->
            <text x="65" y="172" fill="#64748b" font-size="9" text-anchor="middle">10kA</text>
            <text x="145" y="172" fill="#64748b" font-size="9" text-anchor="middle">30kA</text>
            <text x="185" y="172" fill="#64748b" font-size="9" text-anchor="middle">50kA</text>
            <text x="265" y="172" fill="#64748b" font-size="9" text-anchor="middle">70kA</text>
            <text x="345" y="172" fill="#64748b" font-size="9" text-anchor="middle">100kA</text>
          </svg>
        </div>
        <div class="text-[11px] text-slate-400 mt-1 flex justify-between">
          <span>中位值雷电流：<strong class="text-cyan-300">42.3 kA</strong></span>
          <span>设计耐受极值：<strong class="text-emerald-400">100 kA (通过校验)</strong></span>
        </div>
      </div>

      <!-- Chart 2: 地网电阻长期漂移曲线 -->
      <div class="tech-panel rounded-xl p-4 flex flex-col justify-between">
        <div class="flex items-center justify-between pb-3 border-b border-[#1b3d75]/50">
          <h3 class="text-xs font-bold text-white tracking-wide">地网接地电阻年际趋势与含水率关联</h3>
          <span class="text-xs text-teal-300 font-tech">均值 0.52 Ω</span>
        </div>
        <div class="h-[220px] w-full mt-3">
          <svg class="w-full h-full" viewBox="0 0 400 180">
            <!-- Upper limit threshold (1.0 Ω) -->
            <line x1="30" y1="40" x2="380" y2="40" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4 2" />
            <text x="380" y="36" fill="#ef4444" font-size="9" text-anchor="end">国家标准上限 1.0 Ω</text>

            <!-- Measured curve -->
            <path
              d="M 40 120 L 90 115 L 140 100 L 190 95 L 240 110 L 290 105 L 340 102 L 370 100"
              fill="none"
              stroke="#10b981"
              stroke-width="2"
            />
            <circle cx="370" cy="100" r="4" fill="#10b981" />

            <text x="40" y="170" fill="#64748b" font-size="9">1月</text>
            <text x="140" y="170" fill="#64748b" font-size="9">4月</text>
            <text x="240" y="170" fill="#64748b" font-size="9">7月</text>
            <text x="340" y="170" fill="#64748b" font-size="9">10月</text>
          </svg>
        </div>
        <div class="text-[11px] text-slate-400 mt-1 flex justify-between">
          <span>当前地网阻值：<strong class="text-emerald-400">0.52 Ω</strong></span>
          <span>安全裕度：<strong class="text-cyan-300">48%</strong></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const timeSpan = ref('近30天');
</script>
