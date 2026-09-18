<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-5 h-5 rounded bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
          <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M13 2L3 14h8l-1 8 11-12h-8l1-8z" />
          </svg>
        </div>
        <h2 class="text-base font-bold text-white tracking-wide">雷电预警 · 主动感知与应急联动</h2>
      </div>

      <!-- Action Button -->
      <button
        @click="triggerDefenseTest"
        class="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-semibold shadow-[0_0_12px_rgba(6,182,212,0.4)] transition-all flex items-center gap-1.5"
      >
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <span>执行防御联动测试</span>
      </button>
    </div>

    <!-- Top Alert Level Banner Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
      <div
        v-for="item in warningTiers"
        :key="item.name"
        class="tech-panel rounded-xl p-3.5 border transition-all"
        :class="item.active ? item.activeClass : 'border-[#18396c]/40 opacity-70'"
      >
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold" :class="item.color">{{ item.name }}</span>
          <span
            class="px-2 py-0.5 rounded text-[10px] font-semibold"
            :class="item.active ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/50 animate-pulse' : 'bg-slate-800 text-slate-400'"
          >
            {{ item.active ? '当前处于' : '未触发' }}
          </span>
        </div>
        <div class="text-sm font-semibold text-white mt-2">{{ item.condition }}</div>
        <div class="text-[11px] text-slate-400 mt-1">{{ item.action }}</div>
      </div>
    </div>

    <!-- Dual Column: Thunderstorm Radar Forecast & Defense Matrix -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <!-- Radar Forecast Card (7 cols) -->
      <div class="lg:col-span-7 tech-panel rounded-xl p-4 flex flex-col justify-between">
        <div class="flex items-center justify-between pb-3 border-b border-[#1b3d75]/50">
          <h3 class="text-xs font-bold text-white tracking-wide flex items-center gap-2">
            <span>雷云多普勒雷达测距与移向预测</span>
          </h3>
          <span class="text-xs text-cyan-300 font-tech">探测半径: 50 km</span>
        </div>

        <div class="relative h-[260px] flex items-center justify-center my-2">
          <!-- Concentric radar circles -->
          <svg class="w-full h-full" viewBox="0 0 400 260">
            <circle cx="200" cy="130" r="110" fill="none" stroke="#163868" stroke-dasharray="2 3" />
            <circle cx="200" cy="130" r="80" fill="none" stroke="#163868" stroke-dasharray="2 3" />
            <circle cx="200" cy="130" r="50" fill="none" stroke="#163868" stroke-dasharray="2 3" />
            <circle cx="200" cy="130" r="20" fill="none" stroke="#163868" />
            
            <line x1="90" y1="130" x2="310" y2="130" stroke="#163868" />
            <line x1="200" y1="20" x2="200" y2="240" stroke="#163868" />

            <!-- Range labels -->
            <text x="202" y="112" fill="#64748b" font-size="9">10km</text>
            <text x="202" y="82" fill="#64748b" font-size="9">25km</text>
            <text x="202" y="52" fill="#64748b" font-size="9">40km</text>

            <!-- Thunderstorm Cell Cluster A -->
            <ellipse cx="280" cy="90" rx="35" ry="25" fill="#f97316" fill-opacity="0.3" stroke="#f97316" stroke-width="1.5" />
            <circle cx="280" cy="90" r="8" fill="#ef4444" />
            <!-- Motion vector arrow towards datacenter -->
            <line x1="280" y1="90" x2="235" y2="115" stroke="#ef4444" stroke-width="2" marker-end="url(#arrow)" />

            <!-- Datacenter center icon -->
            <circle cx="200" cy="130" r="5" fill="#00f0ff" />
            <text x="180" y="148" fill="#38bdf8" font-size="10" font-weight="bold">算力中心</text>
          </svg>
        </div>

        <div class="grid grid-cols-3 gap-2 pt-2 border-t border-[#1b3d75]/50 text-center">
          <div class="bg-[#081838] p-2 rounded-lg">
            <div class="text-[10px] text-slate-400">最近对流中心距离</div>
            <div class="text-sm font-bold font-tech text-cyan-300 mt-0.5">38.4 km</div>
          </div>
          <div class="bg-[#081838] p-2 rounded-lg">
            <div class="text-[10px] text-slate-400">雷云移速 / 移向</div>
            <div class="text-sm font-bold font-tech text-amber-300 mt-0.5">24 km/h · 东北向</div>
          </div>
          <div class="bg-[#081838] p-2 rounded-lg">
            <div class="text-[10px] text-slate-400">预计影响窗口</div>
            <div class="text-sm font-bold font-tech text-slate-200 mt-0.5">约 95 分钟后</div>
          </div>
        </div>
      </div>

      <!-- Warning Response Playbook (5 cols) -->
      <div class="lg:col-span-5 tech-panel rounded-xl p-4 flex flex-col justify-between">
        <div class="flex items-center justify-between pb-3 border-b border-[#1b3d75]/50">
          <h3 class="text-xs font-bold text-white tracking-wide">主动防御联动策略状态</h3>
          <span class="text-[11px] text-emerald-400">自动化防御使能</span>
        </div>

        <div class="space-y-2.5 my-auto py-2 text-xs">
          <div
            v-for="policy in defensePolicies"
            :key="policy.title"
            class="p-2.5 rounded-lg bg-[#081b3d]/70 border border-[#173e72]/50 flex items-center justify-between"
          >
            <div>
              <div class="font-semibold text-slate-200">{{ policy.title }}</div>
              <div class="text-[11px] text-slate-400 mt-0.5">{{ policy.desc }}</div>
            </div>
            <span
              class="px-2 py-0.5 rounded text-[10px] font-medium"
              :class="policy.enabled ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40' : 'bg-slate-800 text-slate-400'"
            >
              {{ policy.enabled ? '已启用' : '待命' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const warningTiers = [
  { name: '四级蓝色预警 (注意)', condition: '电场强度 > 5 kV/m · 距离 < 30km', action: '平台广播预警，巡检外场地网', active: false, color: 'text-blue-400', activeClass: 'border-blue-500/80 bg-blue-950/40' },
  { name: '三级黄色预警 (戒备)', condition: '电场强度 > 15 kV/m · 距离 < 20km', action: '机房UPS切入抗扰滤波，巡视SPD', active: false, color: 'text-amber-400', activeClass: 'border-amber-500/80 bg-amber-950/40' },
  { name: '二级橙色预警 (警惕)', condition: '电场强度 > 25 kV/m · 距离 < 10km', action: '开启双流向截流装置，隔离外部弱电', active: false, color: 'text-orange-400', activeClass: 'border-orange-500/80 bg-orange-950/40' },
  { name: '一级红色预警 (应急)', condition: '电场强度 > 40 kV/m · 发生高频闪击', action: '全域电磁屏蔽密封，全站脱网自供电', active: false, color: 'text-rose-400', activeClass: 'border-rose-500/80 bg-rose-950/40' },
];

const defensePolicies = [
  { title: 'SPD瞬态抑制与旁路保护', desc: '雷电流动作阈值自动调谐，多级压敏电阻协同', enabled: true },
  { title: '接地网动态等电位均压', desc: '闭合地电位反击分流器，消除地电位差', enabled: true },
  { title: '外部光纤与弱电引入浪涌隔离', desc: '光电隔离模块与天馈避雷器状态锁止', enabled: true },
  { title: '自动化短信与企业微信告警推送', desc: '值班工程师与设施主管实时第一信道', enabled: true },
];

const triggerDefenseTest = () => {
  alert('【系统主动防御测试】指令已下发！SPD状态自检完成，等电位均压电磁继电器响应时间 18ms，全链路就绪！');
};
</script>
