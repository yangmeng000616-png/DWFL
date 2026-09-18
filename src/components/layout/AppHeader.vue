<template>
  <header class="relative z-30 flex items-center justify-between px-4 py-2 bg-[#09224f]/95 border-b border-[#215caa]/80 backdrop-blur-md shadow-lg shadow-[#020b22]/50">
    <!-- Top Left Title and Platform Branding -->
    <div class="flex items-center gap-2.5">
      <!-- Shield Logo Icon with Lightning -->
      <div class="relative flex items-center justify-center w-7 h-7 rounded-md bg-gradient-to-b from-[#257dfb] to-[#00a6ff] p-[1px] shadow-[0_0_12px_rgba(37,125,251,0.6)]">
        <div class="w-full h-full rounded-md bg-gradient-to-b from-[#185bc0] to-[#093078] flex items-center justify-center">
          <svg class="w-4 h-4 text-cyan-300 drop-shadow-[0_0_4px_rgba(0,240,255,0.8)]" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L4 5.5v6.2c0 5.4 3.4 10.4 8 11.8 4.6-1.4 8-6.4 8-11.8V5.5L12 2z" fill="url(#shieldGrad)" stroke="#00f0ff" stroke-width="1.5" />
            <path d="M13 6l-5 7h4l-1 6 6-8h-4l1-5z" fill="#00f0ff" />
            <defs>
              <linearGradient id="shieldGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#1e68d7" />
                <stop offset="100%" stop-color="#092866" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div class="flex items-center gap-2.5">
        <h1 class="text-base font-bold tracking-wide text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.35)]">
          算力中心雷电静电智能监测与防护平台
        </h1>
        <span class="text-[11px] font-medium text-cyan-300 bg-cyan-900/60 border border-cyan-400/40 px-2 py-0.5 rounded tracking-wider hidden lg:inline-block shadow-[0_0_6px_rgba(0,240,255,0.2)]">
          智算集群基础设施主动防御系统
        </span>
      </div>
    </div>

    <!-- Top Right Status Indicators & Live Clock -->
    <div class="flex items-center gap-4 text-xs">
      <!-- System Health Badge -->
      <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-900/70 border border-emerald-400/50 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span class="font-medium tracking-wide text-xs">全系统运行正常</span>
      </div>

      <!-- Real-time Clock & Weather -->
      <div class="flex items-center gap-3 text-slate-200 text-xs font-tech">
        <span class="text-slate-200 tracking-wider">{{ formattedDate }}</span>
        <span class="text-cyan-300 font-bold tracking-widest text-sm drop-shadow-[0_0_6px_rgba(0,240,255,0.5)]">{{ formattedTime }}</span>
        
        <div class="flex items-center gap-1.5 pl-2.5 border-l border-[#24589e]/80 text-slate-200">
          <svg class="w-3.5 h-3.5 text-cyan-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
          <span class="font-sans text-[11px]">多云 22℃</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const currentTime = ref(new Date());

const formattedDate = ref('2025-04-29');
const formattedTime = ref('15:42:36');

let timer: number | null = null;

const updateClock = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  formattedDate.value = `${year}-${month}-${day}`;
  formattedTime.value = `${hours}:${minutes}:${seconds}`;
};

onMounted(() => {
  updateClock();
  timer = window.setInterval(updateClock, 1000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>
