<template>
  <transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div
      v-if="device"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
      @click.self="close"
    >
      <div
        class="w-full max-w-2xl bg-[#061533] border border-cyan-500/60 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.25)] overflow-hidden flex flex-col max-h-[90vh]"
      >
        <!-- Modal Top Bar -->
        <div class="px-6 py-4 bg-gradient-to-r from-[#0b2452] to-[#051433] border-b border-cyan-500/40 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/60 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.4)]">
              <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M13 2L3 14h8l-1 8 11-12h-8l1-8z" />
              </svg>
            </div>
            <div>
              <div class="flex items-center gap-2.5">
                <h3 class="text-base font-bold text-white tracking-wide">{{ device.name }}</h3>
                <span
                  class="px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wider border"
                  :class="getStatusBadgeClass(device.statusType)"
                >
                  {{ device.status }}
                </span>
              </div>
              <p class="text-xs text-slate-400 font-tech mt-0.5">
                编号: {{ device.code }} · 类别: {{ device.category }}
              </p>
            </div>
          </div>

          <button
            @click="close"
            class="w-8 h-8 rounded-lg bg-[#0e2c60] hover:bg-[#184898] border border-cyan-500/40 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <!-- Modal Body Content -->
        <div class="p-6 overflow-y-auto space-y-4 text-xs select-none">
          <!-- Real-time Key Value Banner -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div class="bg-[#0a1f44] border border-[#1b437e] rounded-xl p-3.5">
              <div class="text-slate-400 text-[11px]">当前遥测实时指标</div>
              <div class="text-xl font-bold font-tech text-cyan-300 mt-1 glow-text-cyan">
                {{ device.realtimeValue }}
              </div>
              <div class="text-[11px] text-slate-400 mt-1">正常区间: {{ device.normalRange }}</div>
            </div>

            <div class="bg-[#0a1f44] border border-[#1b437e] rounded-xl p-3.5">
              <div class="text-slate-400 text-[11px]">设备健康度指数</div>
              <div class="text-xl font-bold font-tech text-emerald-300 mt-1 flex items-baseline gap-1">
                {{ device.healthScore }}<span class="text-xs font-normal text-slate-400">/ 100 分</span>
              </div>
              <div class="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  class="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400"
                  :style="{ width: `${device.healthScore}%` }"
                ></div>
              </div>
            </div>

            <div class="bg-[#0a1f44] border border-[#1b437e] rounded-xl p-3.5">
              <div class="text-slate-400 text-[11px]">通信状态 / 轮询协议</div>
              <div class="text-base font-bold text-white mt-1">
                {{ device.protocol }}
              </div>
              <div class="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                IP: {{ device.ipAddress }}
              </div>
            </div>
          </div>

          <!-- Position & Structural Integration -->
          <div class="bg-[#091b3b] border border-[#163d75] rounded-xl p-4">
            <h4 class="text-xs font-bold text-cyan-300 mb-2 flex items-center gap-1.5">
              <svg class="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              空间部署位置与建筑防护结构关系
            </h4>
            <div class="text-slate-200 text-xs leading-relaxed">
              {{ device.location }}
            </div>
            <div class="text-slate-400 text-[11px] mt-1.5 leading-relaxed">
              {{ device.desc }}
            </div>
          </div>

          <!-- Recent Trend Sparkline Chart -->
          <div class="bg-[#091b3b] border border-[#163d75] rounded-xl p-4">
            <div class="flex items-center justify-between mb-2">
              <h4 class="text-xs font-bold text-slate-200">近6个采样周期波动趋势回放</h4>
              <span class="text-slate-400 font-tech text-[11px]">更新频率: 1000Hz 动态滤波</span>
            </div>
            <div class="h-24 w-full bg-[#05122b] rounded-lg p-2 flex items-end justify-between border border-[#133364]">
              <div
                v-for="(val, idx) in device.recentTrends"
                :key="idx"
                class="flex-1 flex flex-col items-center gap-1 group"
              >
                <span class="text-[10px] font-tech text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity">
                  {{ val }}
                </span>
                <div
                  class="w-4/5 rounded-t bg-gradient-to-t from-[#0e4896] to-cyan-400 transition-all duration-300 group-hover:from-cyan-500 group-hover:to-cyan-200"
                  :style="{ height: `${Math.max(15, Math.min(80, (val / Math.max(...device.recentTrends, 1)) * 70))}px` }"
                ></div>
                <span class="text-[9px] text-slate-500 font-tech">T-{{ 5 - idx }}</span>
              </div>
            </div>
          </div>

          <!-- Self Check & Actions Bar -->
          <div class="flex items-center justify-between pt-2 border-t border-[#133364]">
            <span class="text-[11px] text-slate-400">上次自动联检: {{ device.lastCheckTime }}</span>
            <div class="flex items-center gap-2">
              <button
                @click="runSelfCheck"
                :disabled="isChecking"
                class="px-3.5 py-1.5 rounded-lg bg-[#0e326c] hover:bg-[#164a9e] border border-cyan-500/50 text-cyan-300 font-medium transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                <span v-if="isChecking" class="w-3 h-3 rounded-full border border-cyan-400 border-t-transparent animate-spin"></span>
                <span>{{ isChecking ? '遥测自检中...' : '发起指令自检' }}</span>
              </button>
              <button
                @click="close"
                class="px-3.5 py-1.5 rounded-lg bg-[#142340] hover:bg-[#1d325a] text-slate-300 transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { activeInspectionDevice, closeDeviceInspection } from '@/composables/useCockpitState';

const device = activeInspectionDevice;
const isChecking = ref(false);

const close = () => {
  closeDeviceInspection();
};

const getStatusBadgeClass = (type: string) => {
  switch (type) {
    case 'success':
      return 'bg-emerald-950/90 text-[#00e5a3] border-emerald-500/50 shadow-[0_0_8px_rgba(0,229,163,0.3)]';
    case 'warning':
      return 'bg-amber-950/90 text-amber-300 border-amber-500/50 shadow-[0_0_8px_rgba(245,158,11,0.3)]';
    case 'orange':
      return 'bg-orange-950/90 text-orange-300 border-orange-500/50 shadow-[0_0_8px_rgba(249,115,22,0.3)]';
    case 'danger':
      return 'bg-rose-950/90 text-rose-300 border-rose-500/50 shadow-[0_0_8px_rgba(244,63,94,0.3)]';
    default:
      return 'bg-cyan-950/90 text-cyan-300 border-cyan-500/50';
  }
};

const runSelfCheck = () => {
  isChecking.value = true;
  setTimeout(() => {
    isChecking.value = false;
  }, 1200);
};
</script>
