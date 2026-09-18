<template>
  <div class="space-y-4 max-w-4xl">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-5 h-5 rounded bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </div>
        <h2 class="text-base font-bold text-white tracking-wide">系统设置 · 预警阈值与自动化联动参数</h2>
      </div>

      <button
        @click="saveSettings"
        class="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow transition-all"
      >
        保存配置
      </button>
    </div>

    <!-- Threshold Form Panels -->
    <div class="tech-panel rounded-xl p-5 space-y-4 text-xs">
      <h3 class="text-sm font-bold text-white tracking-wide pb-2 border-b border-[#1b3d75]/50">
        1. 安全预警与触发阈值设置
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-slate-300 mb-1">大气电场四级预警上限 (kV/m)</label>
          <input
            v-model="settings.fieldThreshold"
            type="number"
            class="w-full bg-[#081b3c] border border-[#1d4a8e] rounded-lg px-3 py-2 text-slate-100 font-tech focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div>
          <label class="block text-slate-300 mb-1">地网电阻报警阈值 (Ω)</label>
          <input
            v-model="settings.groundThreshold"
            type="number"
            step="0.1"
            class="w-full bg-[#081b3c] border border-[#1d4a8e] rounded-lg px-3 py-2 text-slate-100 font-tech focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div>
          <label class="block text-slate-300 mb-1">SPD压敏元件漏电流预警阈值 (µA)</label>
          <input
            v-model="settings.spdLeakThreshold"
            type="number"
            class="w-full bg-[#081b3c] border border-[#1d4a8e] rounded-lg px-3 py-2 text-slate-100 font-tech focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div>
          <label class="block text-slate-300 mb-1">机房允许静电电位极值 (kV)</label>
          <input
            v-model="settings.esdThreshold"
            type="number"
            step="0.1"
            class="w-full bg-[#081b3c] border border-[#1d4a8e] rounded-lg px-3 py-2 text-slate-100 font-tech focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>
    </div>

    <!-- Notification Rules -->
    <div class="tech-panel rounded-xl p-5 space-y-4 text-xs">
      <h3 class="text-sm font-bold text-white tracking-wide pb-2 border-b border-[#1b3d75]/50">
        2. 告警推送与通信联动通道
      </h3>

      <div class="space-y-3">
        <label class="flex items-center gap-3 text-slate-200 cursor-pointer">
          <input type="checkbox" v-model="settings.enableSms" class="rounded bg-[#081b3c] border-[#1d4a8e] text-cyan-500" />
          <span>启用极端雷击与地网告警短信通知值班工程师</span>
        </label>
        <label class="flex items-center gap-3 text-slate-200 cursor-pointer">
          <input type="checkbox" v-model="settings.enableWechat" class="rounded bg-[#081b3c] border-[#1d4a8e] text-cyan-500" />
          <span>企业微信 / 钉钉 Webhook 群机器人即时播报</span>
        </label>
        <label class="flex items-center gap-3 text-slate-200 cursor-pointer">
          <input type="checkbox" v-model="settings.enableSound" class="rounded bg-[#081b3c] border-[#1d4a8e] text-cyan-500" />
          <span>监控中心大屏声光报警蜂鸣器使能</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const settings = ref({
  fieldThreshold: 30,
  groundThreshold: 1.0,
  spdLeakThreshold: 20,
  esdThreshold: 2.0,
  enableSms: true,
  enableWechat: true,
  enableSound: true,
});

const saveSettings = () => {
  alert('【系统配置已保存】新预警阈值与通知规则已下发至分布式传感器总线！');
};
</script>
