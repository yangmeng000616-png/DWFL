<template>
  <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
    <!-- Card 0: 在线设备 -->
    <div
      @click="openDeviceInspection('datacenter_zone')"
      class="tech-panel tech-panel-hover rounded-xl py-2 px-2.5 flex flex-col justify-between relative overflow-hidden group cursor-pointer"
      title="点击查看全域感知设备在线与链路健康状态"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-1.5">
          <div class="w-6 h-6 rounded-md bg-gradient-to-br from-[#1c55aa] to-[#0f3b82] border border-cyan-400/60 flex items-center justify-center text-cyan-200 shadow-[0_0_8px_rgba(0,200,255,0.3)] group-hover:scale-105 transition-transform flex-shrink-0">
            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
              <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
              <line x1="6" y1="6" x2="6.01" y2="6" />
              <line x1="6" y1="18" x2="6.01" y2="18" />
            </svg>
          </div>
          <span class="text-xs text-white font-semibold group-hover:text-cyan-300 transition-colors">在线设备</span>
        </div>
        <span class="px-1.5 py-0.2 rounded bg-emerald-900/80 border border-emerald-400/60 text-[10px] text-emerald-300 font-medium flex items-center gap-1">
          <span class="w-1 h-1 rounded-full bg-emerald-400 animate-pulse"></span>
          正常
        </span>
      </div>

      <div class="mt-1 flex items-baseline justify-between">
        <div class="text-lg font-bold font-tech text-emerald-300 tracking-wide glow-text-green">
          99.4 <span class="text-xs font-normal text-slate-300 font-sans">%</span>
        </div>
        <span class="text-[10px] text-cyan-300 font-mono">156 / 157</span>
      </div>
      <div class="text-[10px] text-slate-400 mt-0.5 leading-tight">联机率</div>
    </div>

    <!-- Card 1: 雷电监测 -->
    <div
      @click="openDeviceInspection('atmospheric')"
      class="tech-panel tech-panel-hover rounded-xl py-2 px-2.5 flex flex-col justify-between relative overflow-hidden group cursor-pointer"
      title="大气电场监测"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-1.5">
          <div class="w-6 h-6 rounded-md bg-gradient-to-br from-[#1c55aa] to-[#0f3b82] border border-cyan-400/60 flex items-center justify-center text-cyan-200 shadow-[0_0_8px_rgba(0,200,255,0.3)] group-hover:scale-105 transition-transform flex-shrink-0">
            <svg class="w-3 h-3 fill-current" viewBox="0 0 24 24">
              <path d="M13 2L3 14h8l-1 8 11-12h-8l1-8z" />
            </svg>
          </div>
          <span class="text-xs text-white font-semibold group-hover:text-cyan-300 transition-colors">雷电监测</span>
        </div>
        <span
          class="px-1.5 py-0.2 rounded border text-[10px] font-medium"
          :class="hasLightningAlarm
            ? 'bg-amber-950/80 border-amber-400/60 text-amber-300 animate-pulse'
            : 'bg-emerald-900/80 border-emerald-400/60 text-emerald-300'"
        >
          {{ hasLightningAlarm ? '预警' : '正常' }}
        </span>
      </div>

      <div class="mt-1 flex items-baseline justify-between">
        <div
          class="text-lg font-bold font-tech tracking-wide"
          :class="hasLightningAlarm ? 'text-amber-300 glow-text-amber' : 'text-cyan-300 glow-text-cyan'"
        >
          23.6 <span class="text-xs font-normal text-slate-300 font-sans">kA</span>
        </div>
        <span class="text-[10px] text-slate-400 font-sans">阈值 30kA</span>
      </div>
      <div class="text-[10px] text-slate-400 mt-0.5 leading-tight">
        {{ hasLightningAlarm ? '电场畸变' : '电场强度' }}
      </div>
    </div>

    <!-- Card 2: 静电监测 -->
    <div
      @click="openDeviceInspection('esd_terminal')"
      class="tech-panel tech-panel-hover rounded-xl py-2 px-2.5 flex flex-col justify-between relative overflow-hidden group cursor-pointer"
      title="静电监测"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-1.5">
          <div class="w-6 h-6 rounded-md bg-gradient-to-br from-[#1c55aa] to-[#0f3b82] border border-cyan-400/60 flex items-center justify-center text-cyan-200 shadow-[0_0_8px_rgba(0,200,255,0.3)] group-hover:scale-105 transition-transform flex-shrink-0">
            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="7" r="4" />
              <path d="M5.5 21v-2a4 4 0 0 1 4-4h5a4 4 0 0 1 4 4v2" />
              <path d="M19 8l2 2-2 2" />
              <path d="M5 8l-2 2 2 2" />
            </svg>
          </div>
          <span class="text-xs text-white font-semibold group-hover:text-cyan-300 transition-colors">静电监测</span>
        </div>
        <span class="px-1.5 py-0.2 rounded bg-emerald-900/80 border border-emerald-400/60 text-[10px] text-emerald-300 font-medium">
          正常
        </span>
      </div>

      <div class="mt-1 flex items-baseline justify-between">
        <div class="text-lg font-bold font-tech text-emerald-300 tracking-wide glow-text-green">
          0.8 <span class="text-xs font-normal text-slate-300 font-sans">kV</span>
        </div>
        <span class="text-[10px] text-slate-400 font-sans">限值 &lt; 2kV</span>
      </div>
      <div class="text-[10px] text-slate-400 mt-0.5 leading-tight">表面静电</div>
    </div>

    <!-- Card 3: 接地系统 -->
    <div
      @click="openDeviceInspection('ground_res')"
      class="tech-panel tech-panel-hover rounded-xl py-2 px-2.5 flex flex-col justify-between relative overflow-hidden group cursor-pointer"
      title="地网电阻在线监测"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-1.5">
          <div class="w-6 h-6 rounded-md bg-gradient-to-br from-[#1c55aa] to-[#0f3b82] border border-cyan-400/60 flex items-center justify-center text-cyan-200 shadow-[0_0_8px_rgba(0,200,255,0.3)] group-hover:scale-105 transition-transform flex-shrink-0">
            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="4" x2="12" y2="15" />
              <line x1="4" y1="15" x2="20" y2="15" />
              <line x1="7" y1="18" x2="17" y2="18" />
              <line x1="10" y1="21" x2="14" y2="21" />
            </svg>
          </div>
          <span class="text-xs text-white font-semibold group-hover:text-cyan-300 transition-colors">接地系统</span>
        </div>
        <span
          class="px-1.5 py-0.2 rounded border text-[10px] font-medium"
          :class="hasGroundAlarm
            ? 'bg-amber-950/80 border-amber-400/60 text-amber-300 animate-pulse'
            : 'bg-emerald-900/80 border-emerald-400/60 text-emerald-300'"
        >
          {{ hasGroundAlarm ? '超标' : '正常' }}
        </span>
      </div>

      <div class="mt-1 flex items-baseline justify-between">
        <div
          class="text-lg font-bold font-tech tracking-wide"
          :class="hasGroundAlarm ? 'text-amber-300 glow-text-amber' : 'text-emerald-300 glow-text-green'"
        >
          {{ hasGroundAlarm ? '1.28' : '0.52' }} <span class="text-xs font-normal text-slate-300 font-sans">Ω</span>
        </div>
        <span class="text-[10px] font-sans" :class="hasGroundAlarm ? 'text-amber-300 font-medium' : 'text-slate-400'">
          {{ hasGroundAlarm ? '限值 ≤ 1Ω' : '基线 ≤ 1Ω' }}
        </span>
      </div>
      <div class="text-[10px] text-slate-400 mt-0.5 leading-tight">
        {{ hasGroundAlarm ? '阻抗超标' : '地网电阻' }}
      </div>
    </div>

    <!-- Card 4: SPD状态 -->
    <div
      @click="openDeviceInspection('spd_terminal')"
      class="tech-panel tech-panel-hover rounded-xl py-2 px-2.5 flex flex-col justify-between relative overflow-hidden group cursor-pointer"
      title="SPD群组状态"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-1.5">
          <div class="w-6 h-6 rounded-md bg-gradient-to-br from-[#1c55aa] to-[#0f3b82] border border-cyan-400/60 flex items-center justify-center text-cyan-200 shadow-[0_0_8px_rgba(0,200,255,0.3)] group-hover:scale-105 transition-transform flex-shrink-0">
            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="5" y="3" width="14" height="18" rx="2" />
              <line x1="9" y1="7" x2="15" y2="7" />
              <line x1="9" y1="11" x2="15" y2="11" />
              <circle cx="12" cy="16" r="1.5" fill="currentColor" />
            </svg>
          </div>
          <span class="text-xs text-white font-semibold group-hover:text-cyan-300 transition-colors">SPD状态</span>
        </div>
        <span
          class="px-1.5 py-0.2 rounded border text-[10px] font-medium"
          :class="hasSpdAlarm
            ? 'bg-amber-950/80 border-amber-400/60 text-amber-300'
            : 'bg-emerald-900/80 border-emerald-400/60 text-emerald-300'"
        >
          {{ hasSpdAlarm ? '三级' : '正常' }}
        </span>
      </div>

      <div class="mt-1 flex items-baseline justify-between">
        <div
          class="text-lg font-bold font-tech tracking-wide"
          :class="hasSpdAlarm ? 'text-amber-300 glow-text-amber' : 'text-emerald-300 glow-text-green'"
        >
          {{ hasSpdAlarm ? '11 / 12' : '12 / 12' }}
        </div>
        <span class="text-[10px] font-sans" :class="hasSpdAlarm ? 'text-amber-300' : 'text-slate-400'">
          {{ hasSpdAlarm ? '91.7%' : '100%' }}
        </span>
      </div>
      <div class="text-[10px] text-slate-400 mt-0.5 leading-tight">
        {{ hasSpdAlarm ? 'SPD-04 漏电' : '终端就绪' }}
      </div>
    </div>

    <!-- Card 5: 电源质量 -->
    <div
      @click="openDeviceInspection('datacenter_zone')"
      class="tech-panel tech-panel-hover rounded-xl py-2 px-2.5 flex flex-col justify-between relative overflow-hidden group cursor-pointer"
      title="动力电源质量"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-1.5">
          <div class="w-6 h-6 rounded-md bg-gradient-to-br from-[#1c55aa] to-[#0f3b82] border border-cyan-400/60 flex items-center justify-center text-cyan-200 shadow-[0_0_8px_rgba(0,200,255,0.3)] group-hover:scale-105 transition-transform flex-shrink-0">
            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M7 15h2l2-6 2 6h2" />
            </svg>
          </div>
          <span class="text-xs text-white font-semibold group-hover:text-cyan-300 transition-colors">电源质量</span>
        </div>
        <span class="px-1.5 py-0.2 rounded bg-emerald-900/80 border border-emerald-400/60 text-[10px] text-emerald-300 font-medium">
          正常
        </span>
      </div>

      <div class="mt-1 flex items-baseline justify-between">
        <div class="text-base font-bold font-tech text-emerald-300 tracking-wide glow-text-green whitespace-nowrap">
          220.4V / 12.6A
        </div>
        <span class="text-[10px] text-slate-400 font-sans">50.0Hz</span>
      </div>
      <div class="text-[10px] text-slate-400 mt-0.5 leading-tight">电压 / 电流</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { openDeviceInspection } from '@/composables/useCockpitState';
import { isEmergencyMode } from '@/composables/useEmergencyMode';

interface AlarmItem {
  id: string;
  [key: string]: any;
}

const props = defineProps<{
  activeAlarms?: AlarmItem[];
}>();

const hasGroundAlarm = computed(() => {
  if (props.activeAlarms !== undefined) {
    return props.activeAlarms.some(a => a.id === 'ground');
  }
  return isEmergencyMode.value;
});

const hasSpdAlarm = computed(() => {
  if (props.activeAlarms !== undefined) {
    return props.activeAlarms.some(a => a.id === 'spd');
  }
  return isEmergencyMode.value;
});

const hasLightningAlarm = computed(() => {
  if (props.activeAlarms !== undefined) {
    return props.activeAlarms.some(a => a.id === 'lightning');
  }
  return false;
});
</script>
