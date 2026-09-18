<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-5 h-5 rounded bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="7" r="4" />
            <path d="M5.5 21v-2a4 4 0 0 1 4-4h5a4 4 0 0 1 4 4v2" />
          </svg>
        </div>
        <h2 class="text-base font-bold text-white tracking-wide">静电监测 · 防静电分区与人体放电控制</h2>
      </div>

      <div class="flex items-center gap-2 text-xs text-slate-300">
        <span>机房环境湿度：</span>
        <span class="font-tech text-cyan-300 font-bold">48.2% RH</span>
        <span class="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] border border-emerald-500/40">达标</span>
      </div>
    </div>

    <!-- 4 Zone ESD Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3.5">
      <div
        v-for="zone in esdZones"
        :key="zone.name"
        class="tech-panel rounded-xl p-4 flex flex-col justify-between"
      >
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-white">{{ zone.name }}</span>
          <span class="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/40">正常</span>
        </div>
        <div class="my-3">
          <div class="text-2xl font-bold font-tech text-cyan-300">
            {{ zone.voltage }} <span class="text-xs font-normal text-slate-400 font-sans">kV</span>
          </div>
          <div class="text-[11px] text-slate-400 mt-1">防静电地板阻值: {{ zone.floorRes }} MΩ</div>
        </div>
        <div class="pt-2 border-t border-[#1b3d75]/50 flex items-center justify-between text-[11px] text-slate-400">
          <span>离子风机：{{ zone.ionizer }}</span>
          <span class="text-emerald-400">平衡度 ±12V</span>
        </div>
      </div>
    </div>

    <!-- Detailed ESD Test Table & Gate Wrist Strap Monitor -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <!-- Human Body Wrist Strap Monitor (6 cols) -->
      <div class="lg:col-span-6 tech-panel rounded-xl p-4">
        <h3 class="text-xs font-bold text-white tracking-wide pb-3 border-b border-[#1b3d75]/50">
          机房通道人体静电与手腕带综合测试闸机
        </h3>
        <div class="divide-y divide-[#153466]/50 text-xs mt-2">
          <div
            v-for="p in staffPasses"
            :key="p.name"
            class="py-2.5 flex items-center justify-between"
          >
            <div>
              <div class="font-medium text-slate-200">{{ p.name }} ({{ p.role }})</div>
              <div class="text-[11px] text-slate-400 mt-0.5">测试阻值: {{ p.res }} MΩ · 人体电压: {{ p.volt }} V</div>
            </div>
            <span class="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/40">
              通过准入
            </span>
          </div>
        </div>
      </div>

      <!-- ESD Dissipation Time Curve (6 cols) -->
      <div class="lg:col-span-6 tech-panel rounded-xl p-4 flex flex-col justify-between">
        <h3 class="text-xs font-bold text-white tracking-wide pb-3 border-b border-[#1b3d75]/50">
          静电耗散时间特征衰减曲线 (1000V → 100V)
        </h3>
        <div class="h-[180px] w-full mt-3">
          <svg class="w-full h-full" viewBox="0 0 380 150">
            <line x1="30" y1="20" x2="360" y2="20" stroke="#163868" stroke-dasharray="2 2" />
            <line x1="30" y1="70" x2="360" y2="70" stroke="#163868" stroke-dasharray="2 2" />
            <line x1="30" y1="120" x2="360" y2="120" stroke="#163868" stroke-dasharray="2 2" />

            <text x="25" y="23" fill="#64748b" font-size="9" text-anchor="end">1000V</text>
            <text x="25" y="73" fill="#64748b" font-size="9" text-anchor="end">500V</text>
            <text x="25" y="123" fill="#64748b" font-size="9" text-anchor="end">100V</text>

            <!-- Exponential decay curve -->
            <path
              d="M 35 25 Q 70 85 140 115 T 350 122"
              fill="none"
              stroke="#00e5ff"
              stroke-width="2"
            />
            <circle cx="140" cy="115" r="4" fill="#00e5ff" />
            <text x="145" y="110" fill="#38bdf8" font-size="10">衰减耗时: 0.18s (标准&lt;1.0s)</text>
          </svg>
        </div>
        <div class="text-[11px] text-slate-400 mt-2 text-center bg-[#07193b] p-2 rounded-lg">
          符合 ANSI/ESD S20.20 与 SJ/T 10694 电子计算机机房防静电标准
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const esdZones = [
  { name: '核心机房 A 区 (AI算力柜)', voltage: '0.62', floorRes: '1.2', ionizer: '双头吹风' },
  { name: '核心机房 B 区 (存储集群)', voltage: '0.74', floorRes: '1.4', ionizer: '四头悬挂' },
  { name: 'UPS 配电动力电池室', voltage: '0.45', floorRes: '0.8', ionizer: '导电接地' },
  { name: 'NOC 运维调度中心', voltage: '0.88', floorRes: '2.1', ionizer: '桌面静电消除' },
];

const staffPasses = [
  { name: '张工', role: '基础设施架构师', res: '1.25', volt: '15' },
  { name: '李工', role: '网络安全值班员', res: '0.98', volt: '12' },
  { name: '王工', role: '硬件巡检工程师', res: '1.42', volt: '22' },
  { name: '赵工', role: '动环监控负责人', res: '1.10', volt: '18' },
];
</script>
