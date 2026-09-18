<template>
  <div class="tech-panel rounded-xl p-3 flex flex-col justify-between h-full shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
    <!-- Header with title & time range tabs -->
    <div class="flex items-center justify-between pb-2 border-b border-[#184682]/60">
      <div class="flex items-center gap-2">
        <div class="w-6 h-6 rounded-md bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_6px_rgba(6,182,212,0.3)]">
          <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M13 2L3 14h8l-1 8 11-12h-8l1-8z" />
          </svg>
        </div>
        <h3 class="text-sm font-bold text-white tracking-wide">雷电监测概览</h3>
      </div>

      <!-- Filter pills -->
      <div class="flex items-center bg-[#092960]/90 p-0.5 rounded-md border border-[#2461b2]/70 text-xs">
        <button
          v-for="tab in ['实时', '近1小时', '近24小时']"
          :key="tab"
          @click="activeTab = tab"
          class="px-2 py-0.5 rounded transition-all font-medium text-[11px] cursor-pointer"
          :class="activeTab === tab ? 'bg-gradient-to-r from-[#217bf8] to-[#00a6ff] text-white shadow-[0_0_10px_rgba(33,123,248,0.7)] font-semibold' : 'text-slate-300 hover:text-white'"
        >
          {{ tab }}
        </button>
      </div>
    </div>

    <!-- Chart Container with Full-Height SVG Rendering -->
    <div class="relative flex-1 min-h-[220px] my-1.5 flex flex-col justify-between">
      <div class="flex items-center justify-between text-xs text-slate-300 mb-1">
        <span class="flex items-center gap-1.5">
          <span>电场强度变化</span>
          <span class="text-[10px] text-slate-400 font-mono">(kA)</span>
        </span>
        <span class="text-[11px] text-cyan-300 font-mono font-medium bg-cyan-950/70 border border-cyan-500/30 px-1.5 py-0.5 rounded">
          MAX 58.7 kA @ 12:36
        </span>
      </div>

      <!-- SVG Line Chart with Responsive Height, Gradient and Full Grid -->
      <div class="w-full flex-1 min-h-[170px] relative">
        <svg class="w-full h-full overflow-visible" viewBox="0 0 420 200" preserveAspectRatio="none">
          <defs>
            <linearGradient id="cyanAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#00e5ff" stop-opacity="0.45" />
              <stop offset="60%" stop-color="#0284c7" stop-opacity="0.18" />
              <stop offset="100%" stop-color="#0369a1" stop-opacity="0.0" />
            </linearGradient>
            <filter id="glowLine" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.2" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <!-- Horizontal Grid Lines -->
          <line x1="30" y1="25" x2="410" y2="25" stroke="#1d4d8c" stroke-dasharray="3 3" />
          <line x1="30" y1="65" x2="410" y2="65" stroke="#1d4d8c" stroke-dasharray="3 3" />
          <line x1="30" y1="105" x2="410" y2="105" stroke="#1d4d8c" stroke-dasharray="3 3" />
          <line x1="30" y1="145" x2="410" y2="145" stroke="#1d4d8c" stroke-dasharray="3 3" />
          <line x1="30" y1="180" x2="410" y2="180" stroke="#1d4d8c" stroke-dasharray="3 3" />

          <!-- Y-Axis Ticks -->
          <text x="22" y="29" fill="#94a3b8" font-size="10" text-anchor="end" font-family="'Chakra Petch', sans-serif">80</text>
          <text x="22" y="69" fill="#94a3b8" font-size="10" text-anchor="end" font-family="'Chakra Petch', sans-serif">60</text>
          <text x="22" y="109" fill="#94a3b8" font-size="10" text-anchor="end" font-family="'Chakra Petch', sans-serif">40</text>
          <text x="22" y="149" fill="#94a3b8" font-size="10" text-anchor="end" font-family="'Chakra Petch', sans-serif">20</text>
          <text x="22" y="184" fill="#94a3b8" font-size="10" text-anchor="end" font-family="'Chakra Petch', sans-serif">0</text>

          <!-- Area Fill -->
          <path
            d="M 35 170 
               L 45 162 L 55 150 L 65 156 L 75 142 L 85 148 L 95 132 L 105 144 L 115 124 L 125 136 
               L 135 116 L 145 124 L 155 104 L 165 112 L 175 84 L 185 114 L 195 96 L 205 124 L 215 45 
               L 225 106 L 235 78 L 245 120 L 255 102 L 265 128 L 275 110 L 285 138 L 295 120 L 305 140 
               L 315 126 L 325 146 L 335 132 L 345 152 L 355 136 L 365 154 L 375 142 L 385 158 L 395 150 L 405 162
               L 405 180 L 35 180 Z"
            fill="url(#cyanAreaGrad)"
          />

          <!-- Main Wave Line -->
          <path
            d="M 35 170 
               L 45 162 L 55 150 L 65 156 L 75 142 L 85 148 L 95 132 L 105 144 L 115 124 L 125 136 
               L 135 116 L 145 124 L 155 104 L 165 112 L 175 84 L 185 114 L 195 96 L 205 124 L 215 45 
               L 225 106 L 235 78 L 245 120 L 255 102 L 265 128 L 275 110 L 285 138 L 295 120 L 305 140 
               L 315 126 L 325 146 L 335 132 L 345 152 L 355 136 L 365 154 L 375 142 L 385 158 L 395 150 L 405 162"
            fill="none"
            stroke="#00f0ff"
            stroke-width="2"
            filter="url(#glowLine)"
          />

          <!-- Peak highlight point at (215, 45) -->
          <circle cx="215" cy="45" r="4" fill="#00f0ff" />
          <circle cx="215" cy="45" r="8" fill="none" stroke="#38bdf8" stroke-width="1.5" class="animate-ping origin-center" />

          <!-- X-Axis Labels -->
          <text x="35" y="196" fill="#64748b" font-size="10" text-anchor="middle" font-family="'Chakra Petch', sans-serif">00:00</text>
          <text x="95" y="196" fill="#64748b" font-size="10" text-anchor="middle" font-family="'Chakra Petch', sans-serif">04:00</text>
          <text x="155" y="196" fill="#64748b" font-size="10" text-anchor="middle" font-family="'Chakra Petch', sans-serif">08:00</text>
          <text x="215" y="196" fill="#64748b" font-size="10" text-anchor="middle" font-family="'Chakra Petch', sans-serif">12:00</text>
          <text x="285" y="196" fill="#64748b" font-size="10" text-anchor="middle" font-family="'Chakra Petch', sans-serif">16:00</text>
          <text x="365" y="196" fill="#64748b" font-size="10" text-anchor="middle" font-family="'Chakra Petch', sans-serif">20:00</text>
        </svg>
      </div>
    </div>

    <!-- Middle Telemetry Metrics Breakdown (Enriches card height and fills empty void) -->
    <div class="my-2 grid grid-cols-2 gap-1.5">
      <div class="bg-[#092557]/80 border border-[#1e529a]/70 rounded-lg px-2.5 py-1.5 flex items-center justify-between">
        <span class="text-[11px] text-slate-300">24h放电频次</span>
        <span class="font-tech text-cyan-300 font-bold text-xs">14 <span class="text-[10px] text-slate-400 font-normal">次</span></span>
      </div>
      <div class="bg-[#092557]/80 border border-[#1e529a]/70 rounded-lg px-2.5 py-1.5 flex items-center justify-between">
        <span class="text-[11px] text-slate-300">平均雷电幅值</span>
        <span class="font-tech text-white font-bold text-xs">23.6 <span class="text-[10px] text-slate-400 font-normal">kA</span></span>
      </div>
      <div class="bg-[#092557]/80 border border-[#1e529a]/70 rounded-lg px-2.5 py-1.5 flex items-center justify-between">
        <span class="text-[11px] text-slate-300">空间电场梯度</span>
        <span class="font-tech text-emerald-400 font-bold text-xs">+1.2 <span class="text-[10px] text-slate-400 font-normal">kV/m·s</span></span>
      </div>
      <div class="bg-[#092557]/80 border border-[#1e529a]/70 rounded-lg px-2.5 py-1.5 flex items-center justify-between">
        <span class="text-[11px] text-slate-300">雷击综合风险</span>
        <span class="text-emerald-400 font-bold text-xs flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> 安全可控
        </span>
      </div>
    </div>

    <!-- Bottom Status Metrics Grid (Structured & Compact) -->
    <div class="pt-2 border-t border-[#215caa]/70 grid grid-cols-3 gap-1.5 text-center">
      <div class="p-1.5 rounded-lg bg-[#0a285e]/85 border border-[#235eae]/60">
        <div class="text-[10px] text-slate-300 truncate font-medium">预警等级</div>
        <div class="mt-0.5 flex items-center justify-center gap-1 text-emerald-300 font-bold text-[11px] whitespace-nowrap">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          无预警
        </div>
      </div>
      <div class="p-1.5 rounded-lg bg-[#0a285e]/85 border border-[#235eae]/60">
        <div class="text-[10px] text-slate-300 truncate font-medium">活动概率</div>
        <div class="mt-0.5 font-tech font-bold text-[11px] text-cyan-300 whitespace-nowrap">5% (低)</div>
      </div>
      <div class="p-1.5 rounded-lg bg-[#0a285e]/85 border border-[#235eae]/60">
        <div class="text-[10px] text-slate-300 truncate font-medium">电场强度</div>
        <div class="mt-0.5 font-tech font-bold text-[11px] text-white whitespace-nowrap">12.4 kV/m</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const activeTab = ref('实时');
</script>
