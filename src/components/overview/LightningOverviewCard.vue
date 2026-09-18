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
      <div class="flex items-center bg-[#051634] p-0.5 rounded-md border border-[#1d4b92]/50 text-xs">
        <button
          v-for="tab in ['实时', '近1小时', '近24小时']"
          :key="tab"
          @click="activeTab = tab"
          class="px-2 py-0.5 rounded transition-all font-medium text-[11px]"
          :class="activeTab === tab ? 'bg-gradient-to-r from-[#1872f6] to-[#0091ff] text-white shadow-[0_0_8px_rgba(24,114,246,0.6)] font-semibold' : 'text-slate-400 hover:text-slate-200'"
        >
          {{ tab }}
        </button>
      </div>
    </div>

    <!-- Chart Container with SVG Rendering -->
    <div class="relative flex-1 min-h-[160px] my-1.5 flex flex-col justify-center">
      <div class="flex items-center justify-between text-xs text-slate-400 mb-1">
        <span>电场强度变化 (kA)</span>
        <span class="text-[11px] text-cyan-400/80 font-mono">MAX 58.7 kA @ 12:36</span>
      </div>

      <!-- SVG Line Chart with Gradient and Grid -->
      <div class="w-full h-[140px] relative">
        <svg class="w-full h-full overflow-visible" viewBox="0 0 420 150" preserveAspectRatio="none">
          <defs>
            <linearGradient id="cyanAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#00e5ff" stop-opacity="0.4" />
              <stop offset="60%" stop-color="#0284c7" stop-opacity="0.12" />
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
          <line x1="30" y1="20" x2="410" y2="20" stroke="#123058" stroke-dasharray="3 3" />
          <line x1="30" y1="50" x2="410" y2="50" stroke="#123058" stroke-dasharray="3 3" />
          <line x1="30" y1="80" x2="410" y2="80" stroke="#123058" stroke-dasharray="3 3" />
          <line x1="30" y1="110" x2="410" y2="110" stroke="#123058" stroke-dasharray="3 3" />

          <!-- Y-Axis Ticks -->
          <text x="22" y="24" fill="#64748b" font-size="10" text-anchor="end" font-family="'Chakra Petch', sans-serif">80</text>
          <text x="22" y="54" fill="#64748b" font-size="10" text-anchor="end" font-family="'Chakra Petch', sans-serif">60</text>
          <text x="22" y="84" fill="#64748b" font-size="10" text-anchor="end" font-family="'Chakra Petch', sans-serif">40</text>
          <text x="22" y="114" fill="#64748b" font-size="10" text-anchor="end" font-family="'Chakra Petch', sans-serif">20</text>
          <text x="22" y="140" fill="#64748b" font-size="10" text-anchor="end" font-family="'Chakra Petch', sans-serif">0</text>

          <!-- Area Fill -->
          <path
            d="M 35 130 
               L 45 125 L 55 115 L 65 120 L 75 110 L 85 115 L 95 102 L 105 112 L 115 95 L 125 105 
               L 135 90 L 145 96 L 155 80 L 165 86 L 175 65 L 185 88 L 195 74 L 205 95 L 215 35 
               L 225 82 L 235 60 L 245 92 L 255 78 L 265 98 L 275 84 L 285 106 L 295 92 L 305 108 
               L 315 96 L 325 112 L 335 102 L 345 116 L 355 104 L 365 118 L 375 108 L 385 120 L 395 114 L 405 124
               L 405 140 L 35 140 Z"
            fill="url(#cyanAreaGrad)"
          />

          <!-- Main Wave Line -->
          <path
            d="M 35 130 
               L 45 125 L 55 115 L 65 120 L 75 110 L 85 115 L 95 102 L 105 112 L 115 95 L 125 105 
               L 135 90 L 145 96 L 155 80 L 165 86 L 175 65 L 185 88 L 195 74 L 205 95 L 215 35 
               L 225 82 L 235 60 L 245 92 L 255 78 L 265 98 L 275 84 L 285 106 L 295 92 L 305 108 
               L 315 96 L 325 112 L 335 102 L 345 116 L 355 104 L 365 118 L 375 108 L 385 120 L 395 114 L 405 124"
            fill="none"
            stroke="#00f0ff"
            stroke-width="1.8"
            filter="url(#glowLine)"
          />

          <!-- Peak highlight point at (215, 35) -->
          <circle cx="215" cy="35" r="3.5" fill="#00f0ff" />
          <circle cx="215" cy="35" r="7" fill="none" stroke="#38bdf8" stroke-width="1.5" class="animate-ping origin-center" />

          <!-- X-Axis Labels -->
          <text x="35" y="152" fill="#64748b" font-size="10" text-anchor="middle" font-family="'Chakra Petch', sans-serif">00:00</text>
          <text x="95" y="152" fill="#64748b" font-size="10" text-anchor="middle" font-family="'Chakra Petch', sans-serif">04:00</text>
          <text x="155" y="152" fill="#64748b" font-size="10" text-anchor="middle" font-family="'Chakra Petch', sans-serif">08:00</text>
          <text x="215" y="152" fill="#64748b" font-size="10" text-anchor="middle" font-family="'Chakra Petch', sans-serif">12:00</text>
          <text x="285" y="152" fill="#64748b" font-size="10" text-anchor="middle" font-family="'Chakra Petch', sans-serif">16:00</text>
          <text x="365" y="152" fill="#64748b" font-size="10" text-anchor="middle" font-family="'Chakra Petch', sans-serif">20:00</text>
        </svg>
      </div>
    </div>

    <!-- Bottom Status Metrics Grid (Structured & Compact) -->
    <div class="pt-2 border-t border-[#184682]/60 grid grid-cols-3 gap-2 text-center">
      <div class="p-2 rounded-lg bg-[#051634]/80 border border-[#133c77]/50">
        <div class="text-[11px] text-slate-400">预警等级</div>
        <div class="mt-1 flex items-center justify-center gap-1 text-emerald-400 font-bold text-xs">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          无预警
        </div>
      </div>
      <div class="p-2 rounded-lg bg-[#051634]/80 border border-[#133c77]/50">
        <div class="text-[11px] text-slate-400">活动概率</div>
        <div class="mt-1 font-tech font-bold text-xs text-cyan-300">5% (低)</div>
      </div>
      <div class="p-2 rounded-lg bg-[#051634]/80 border border-[#133c77]/50">
        <div class="text-[11px] text-slate-400">电场强度</div>
        <div class="mt-1 font-tech font-bold text-xs text-white">12.4 kV/m</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const activeTab = ref('实时');
</script>
