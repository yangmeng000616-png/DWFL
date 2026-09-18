<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-2.5">
    <!-- Card 1: 雷电监测 -->
    <div
      @click="openDeviceInspection('atmospheric')"
      class="tech-panel tech-panel-hover rounded-xl p-3 flex flex-col justify-between relative overflow-hidden group cursor-pointer"
      title="点击查看大气电场与雷电监测装置详情"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-[#1c55aa] to-[#0f3b82] border border-cyan-400/60 flex items-center justify-center text-cyan-200 shadow-[0_0_10px_rgba(0,200,255,0.35)] group-hover:scale-105 transition-transform flex-shrink-0">
            <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M13 2L3 14h8l-1 8 11-12h-8l1-8z" />
            </svg>
          </div>
          <span class="text-xs text-white font-semibold group-hover:text-cyan-300 transition-colors">雷电监测</span>
        </div>
        <span class="px-2 py-0.5 rounded bg-emerald-900/80 border border-emerald-400/60 text-[11px] text-emerald-300 font-medium">
          正常
        </span>
      </div>

      <div class="mt-2 flex items-baseline justify-between">
        <div class="text-xl font-bold font-tech text-cyan-300 tracking-wide glow-text-cyan">
          23.6 <span class="text-xs font-normal text-slate-300 font-sans">kA</span>
        </div>
        <span class="text-[11px] text-slate-300 font-sans">预警阈值 30.0kA</span>
      </div>
      <div class="text-[11px] text-slate-300 mt-0.5">当前雷电电场强度</div>
    </div>

    <!-- Card 2: 静电监测 -->
    <div
      @click="openDeviceInspection('esd_terminal')"
      class="tech-panel tech-panel-hover rounded-xl p-3 flex flex-col justify-between relative overflow-hidden group cursor-pointer"
      title="点击查看静电监测与微环境防范详情"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-[#1c55aa] to-[#0f3b82] border border-cyan-400/60 flex items-center justify-center text-cyan-200 shadow-[0_0_10px_rgba(0,200,255,0.35)] group-hover:scale-105 transition-transform flex-shrink-0">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="7" r="4" />
              <path d="M5.5 21v-2a4 4 0 0 1 4-4h5a4 4 0 0 1 4 4v2" />
              <path d="M19 8l2 2-2 2" />
              <path d="M5 8l-2 2 2 2" />
            </svg>
          </div>
          <span class="text-xs text-white font-semibold group-hover:text-cyan-300 transition-colors">静电监测</span>
        </div>
        <span class="px-2 py-0.5 rounded bg-emerald-900/80 border border-emerald-400/60 text-[11px] text-emerald-300 font-medium">
          正常
        </span>
      </div>

      <div class="mt-2 flex items-baseline justify-between">
        <div class="text-xl font-bold font-tech text-emerald-300 tracking-wide glow-text-green">
          0.8 <span class="text-xs font-normal text-slate-300 font-sans">kV</span>
        </div>
        <span class="text-[11px] text-slate-300 font-sans">国标限值 &lt; 2.0kV</span>
      </div>
      <div class="text-[11px] text-slate-300 mt-0.5">机房表面静电电位</div>
    </div>

    <!-- Card 3: 接地系统 -->
    <div
      @click="openDeviceInspection('ground_res')"
      class="tech-panel tech-panel-hover rounded-xl p-3 flex flex-col justify-between relative overflow-hidden group cursor-pointer"
      title="点击查看地网接地电阻在线遥测详情"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-[#1c55aa] to-[#0f3b82] border border-cyan-400/60 flex items-center justify-center text-cyan-200 shadow-[0_0_10px_rgba(0,200,255,0.35)] group-hover:scale-105 transition-transform flex-shrink-0">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="4" x2="12" y2="15" />
              <line x1="4" y1="15" x2="20" y2="15" />
              <line x1="7" y1="18" x2="17" y2="18" />
              <line x1="10" y1="21" x2="14" y2="21" />
            </svg>
          </div>
          <span class="text-xs text-white font-semibold group-hover:text-cyan-300 transition-colors">接地系统</span>
        </div>
        <span class="px-2 py-0.5 rounded bg-emerald-900/80 border border-emerald-400/60 text-[11px] text-emerald-300 font-medium">
          正常
        </span>
      </div>

      <div class="mt-2 flex items-baseline justify-between">
        <div class="text-xl font-bold font-tech text-emerald-300 tracking-wide glow-text-green">
          0.52 <span class="text-xs font-normal text-slate-300 font-sans">Ω</span>
        </div>
        <span class="text-[11px] text-slate-300 font-sans">规约基线 ≤ 1.0Ω</span>
      </div>
      <div class="text-[11px] text-slate-300 mt-0.5">综合地网接地电阻</div>
    </div>

    <!-- Card 4: SPD状态 -->
    <div
      @click="openDeviceInspection('spd_terminal')"
      class="tech-panel tech-panel-hover rounded-xl p-3 flex flex-col justify-between relative overflow-hidden group cursor-pointer"
      title="点击查看智能SPD浪涌保护器群组状态"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-[#1c55aa] to-[#0f3b82] border border-cyan-400/60 flex items-center justify-center text-cyan-200 shadow-[0_0_10px_rgba(0,200,255,0.35)] group-hover:scale-105 transition-transform flex-shrink-0">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="5" y="3" width="14" height="18" rx="2" />
              <line x1="9" y1="7" x2="15" y2="7" />
              <line x1="9" y1="11" x2="15" y2="11" />
              <circle cx="12" cy="16" r="1.5" fill="currentColor" />
            </svg>
          </div>
          <span class="text-xs text-white font-semibold group-hover:text-cyan-300 transition-colors">SPD状态</span>
        </div>
        <span class="px-2 py-0.5 rounded bg-emerald-900/80 border border-emerald-400/60 text-[11px] text-emerald-300 font-medium">
          正常
        </span>
      </div>

      <div class="mt-2 flex items-baseline justify-between">
        <div class="text-xl font-bold font-tech text-emerald-300 tracking-wide glow-text-green">
          12 / 12
        </div>
        <span class="text-[11px] text-slate-300 font-sans">在网率 100%</span>
      </div>
      <div class="text-[11px] text-slate-300 mt-0.5">浪涌保护终端全部就绪</div>
    </div>

    <!-- Card 5: 电源质量 -->
    <div
      @click="openDeviceInspection('datacenter_zone')"
      class="tech-panel tech-panel-hover rounded-xl p-3 flex flex-col justify-between relative overflow-hidden group cursor-pointer"
      title="点击查看机房动力电源与屏蔽区质量"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-[#1c55aa] to-[#0f3b82] border border-cyan-400/60 flex items-center justify-center text-cyan-200 shadow-[0_0_10px_rgba(0,200,255,0.35)] group-hover:scale-105 transition-transform flex-shrink-0">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M7 15h2l2-6 2 6h2" />
            </svg>
          </div>
          <span class="text-xs text-white font-semibold group-hover:text-cyan-300 transition-colors">电源质量</span>
        </div>
        <span class="px-2 py-0.5 rounded bg-emerald-900/80 border border-emerald-400/60 text-[11px] text-emerald-300 font-medium">
          正常
        </span>
      </div>

      <div class="mt-2 flex items-baseline justify-between">
        <div class="text-lg font-bold font-tech text-emerald-300 tracking-wide glow-text-green whitespace-nowrap">
          220.4V / 12.6A
        </div>
        <span class="text-[11px] text-slate-300 font-sans">50.0Hz 标称</span>
      </div>
      <div class="text-[11px] text-slate-300 mt-0.5">配电相电压与负载电流</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { openDeviceInspection } from '@/composables/useCockpitState';
</script>
