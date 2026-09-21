<template>
  <div class="space-y-3">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-5 h-5 rounded bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
          <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M13 2L3 14h8l-1 8 11-12h-8l1-8z" />
          </svg>
        </div>
        <h2 class="text-sm sm:text-base font-bold text-white tracking-wide">雷电预警 · 感知研判与协同处置</h2>
      </div>

      <!-- Action Button -->
      <div class="flex items-center gap-2">
        <button
          @click="openDisposalMode"
          class="px-3 py-1.5 rounded-lg bg-[#0e3b7a] hover:bg-[#154fa0] border border-cyan-500/50 text-cyan-200 text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          title="切换至全屏三维孪生应急处置工作台"
        >
          <Activity class="w-3.5 h-3.5 text-cyan-300" />
          <span>进入三维应急处置模式</span>
        </button>

        <button
          @click="triggerDefenseTest"
          class="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-semibold shadow-[0_0_12px_rgba(6,182,212,0.4)] transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
        >
          <Shield class="w-3.5 h-3.5" />
          <span>执行防御联动测试</span>
        </button>
      </div>
    </div>

    <!-- Feedback Toast -->
    <div
      v-if="feedbackNotice"
      class="bg-[#0b2d56] border border-cyan-400/70 text-cyan-200 px-3 py-1.5 rounded-lg text-xs flex items-center justify-between animate-fadeIn shadow-lg"
    >
      <div class="flex items-center gap-2">
        <CheckCircle2 class="w-4 h-4 text-emerald-400 flex-shrink-0" />
        <span>{{ feedbackNotice }}</span>
      </div>
      <button @click="feedbackNotice = ''" class="text-slate-400 hover:text-white text-sm font-mono">&times;</button>
    </div>

    <!-- Top Alert Level Banner Cards (严格色彩体系规范：红色仅对应一级严重，不滥用) -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-2.5">
      <div
        v-for="item in warningTiers"
        :key="item.name"
        class="tech-panel rounded-xl p-3 border transition-all"
        :class="item.active ? item.activeClass : 'border-[#18396c]/40 opacity-80'"
      >
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold" :class="item.color">{{ item.name }}</span>
          <span
            class="px-2 py-0.5 rounded text-[10px] font-semibold"
            :class="item.active ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50' : 'bg-slate-800 text-slate-400'"
          >
            {{ item.active ? '当前处于' : '常态监控' }}
          </span>
        </div>
        <div class="text-xs font-semibold text-white mt-1.5">{{ item.condition }}</div>
        <div class="text-[11px] text-slate-400 mt-1 leading-snug">{{ item.action }}</div>
      </div>
    </div>

    <!-- Middle: Thunderstorm Radar Forecast & Defense Matrix -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-3">
      <!-- Radar Forecast Card (7 cols) -->
      <div class="lg:col-span-7 tech-panel rounded-xl p-3.5 flex flex-col justify-between">
        <div class="flex items-center justify-between pb-2 border-b border-[#1b3d75]/50">
          <h3 class="text-xs font-bold text-white tracking-wide flex items-center gap-2">
            <span>雷云多普勒雷达测距与移向预测</span>
          </h3>
          <span class="text-xs text-cyan-300 font-tech">探测半径: 50 km</span>
        </div>

        <div class="relative h-[220px] flex items-center justify-center my-1">
          <!-- Concentric radar circles -->
          <svg class="w-full h-full" viewBox="0 0 400 220">
            <circle cx="200" cy="110" r="95" fill="none" stroke="#163868" stroke-dasharray="2 3" />
            <circle cx="200" cy="110" r="70" fill="none" stroke="#163868" stroke-dasharray="2 3" />
            <circle cx="200" cy="110" r="45" fill="none" stroke="#163868" stroke-dasharray="2 3" />
            <circle cx="200" cy="110" r="20" fill="none" stroke="#163868" />
            
            <line x1="90" y1="110" x2="310" y2="110" stroke="#163868" />
            <line x1="200" y1="15" x2="200" y2="205" stroke="#163868" />

            <!-- Range labels -->
            <text x="202" y="93" fill="#64748b" font-size="9">10km</text>
            <text x="202" y="68" fill="#64748b" font-size="9">25km</text>
            <text x="202" y="43" fill="#64748b" font-size="9">40km</text>

            <!-- Thunderstorm Cell Cluster A -->
            <ellipse cx="270" cy="75" rx="30" ry="20" fill="#f59e0b" fill-opacity="0.25" stroke="#f59e0b" stroke-width="1.5" />
            <circle cx="270" cy="75" r="6" fill="#f59e0b" />
            <!-- Motion vector arrow towards datacenter -->
            <line x1="270" y1="75" x2="230" y2="95" stroke="#38bdf8" stroke-width="1.8" stroke-dasharray="3 2" />

            <!-- Datacenter center icon -->
            <circle cx="200" cy="110" r="5" fill="#00f0ff" />
            <text x="180" y="128" fill="#38bdf8" font-size="10" font-weight="bold">算力中心</text>
          </svg>
        </div>

        <div class="grid grid-cols-3 gap-2 pt-2 border-t border-[#1b3d75]/50 text-center">
          <div class="bg-[#081838] p-2 rounded-lg">
            <div class="text-[10px] text-slate-400">最近对流中心距离</div>
            <div class="text-xs sm:text-sm font-bold font-tech text-cyan-300 mt-0.5">38.4 km</div>
          </div>
          <div class="bg-[#081838] p-2 rounded-lg">
            <div class="text-[10px] text-slate-400">雷云移速 / 移向</div>
            <div class="text-xs sm:text-sm font-bold font-tech text-amber-300 mt-0.5">24 km/h · 东北向</div>
          </div>
          <div class="bg-[#081838] p-2 rounded-lg">
            <div class="text-[10px] text-slate-400">预计影响窗口</div>
            <div class="text-xs sm:text-sm font-bold font-tech text-slate-200 mt-0.5">约 95 分钟后</div>
          </div>
        </div>
      </div>

      <!-- Warning Response Playbook (5 cols) -->
      <div class="lg:col-span-5 tech-panel rounded-xl p-3.5 flex flex-col justify-between">
        <div class="flex items-center justify-between pb-2 border-b border-[#1b3d75]/50">
          <h3 class="text-xs font-bold text-white tracking-wide">主动防御联动策略状态</h3>
          <span class="text-[10.5px] text-emerald-400 font-mono">联动策略就绪 (4/4)</span>
        </div>

        <div class="space-y-2 my-auto py-1 text-xs">
          <div
            v-for="policy in defensePolicies"
            :key="policy.title"
            class="p-2 rounded-lg bg-[#081b3d]/70 border border-[#173e72]/50 flex items-center justify-between"
          >
            <div>
              <div class="font-semibold text-slate-200 text-xs">{{ policy.title }}</div>
              <div class="text-[10.5px] text-slate-400 mt-0.5">{{ policy.desc }}</div>
            </div>
            <span
              class="px-2 py-0.5 rounded text-[10px] font-medium"
              :class="policy.enabled ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40' : 'bg-slate-800 text-slate-400'"
            >
              {{ policy.enabled ? '已启用' : '待命' }}
            </span>
          </div>
        </div>

        <div class="pt-2 border-t border-[#1b3d75]/50 flex items-center justify-between text-[11px] text-slate-400">
          <span>应急预案响应等级: <strong class="text-cyan-300">L2 (预防性戒备)</strong></span>
          <span class="text-emerald-400 flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            自动化防护使能
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Activity, Shield, CheckCircle2 } from 'lucide-vue-next';
import { enterEmergencyMode } from '@/composables/useEmergencyMode';

const router = useRouter();
const feedbackNotice = ref('');

const warningTiers = [
  { name: '四级蓝色预警 (提示)', condition: '电场强度 > 5 kV/m · 距离 < 30km', action: '平台广播预警，例行巡检外场地网与接闪塔', active: false, color: 'text-cyan-400', activeClass: 'border-cyan-500/60 bg-[#061e40]' },
  { name: '三级黄色预警 (关注)', condition: '电场强度 > 15 kV/m · 距离 < 20km', action: '机房UPS切入抗扰滤波，巡视各级SPD漏电', active: true, color: 'text-yellow-400', activeClass: 'border-yellow-500/60 bg-[#291e07]' },
  { name: '二级橙色预警 (高危)', condition: '电场强度 > 25 kV/m · 距离 < 10km', action: '开启双流向主动截流，阻隔外部弱电反击浪涌', active: false, color: 'text-amber-400', activeClass: 'border-amber-500/60 bg-[#2d1706]' },
  { name: '一级红色预警 (严重)', condition: '电场强度 > 40 kV/m · 击穿或短路事故', action: '全域电磁屏蔽密封，全站断开市电切独立自备电', active: false, color: 'text-red-400', activeClass: 'border-red-500/60 bg-[#350b0b]' },
];

const defensePolicies = [
  { title: 'SPD瞬态抑制与旁路保护', desc: '雷电流动作阈值自动调谐，多级压敏电阻协同', enabled: true },
  { title: '接地网动态等电位均压', desc: '闭合地电位反击分流器，消除地电位差', enabled: true },
  { title: '外部光纤与弱电引入浪涌隔离', desc: '光电隔离模块与天馈避雷器状态锁止', enabled: true },
  { title: '自动化短信与企业微信告警推送', desc: '值班工程师与设施主管实时第一信道', enabled: true },
];

const triggerDefenseTest = () => {
  feedbackNotice.value = '【主动防御测试成功】指令已执行！SPD状态自检通过，等电位均压继电器响应 18ms，全链路就绪。';
  setTimeout(() => {
    feedbackNotice.value = '';
  }, 4500);
};

const openDisposalMode = () => {
  enterEmergencyMode('ground');
  router.push('/');
};
</script>
