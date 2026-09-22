<template>
  <div
    class="relative w-full h-full rounded-xl overflow-hidden flex flex-col transition-all duration-300 border shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
    :class="[
      isNightWatchMode
        ? 'bg-[#030a16] border-[#102a54]/70 text-slate-400'
        : 'bg-[#040f26] border-[#1b4382]/80 text-slate-200'
    ]"
  >
    <!-- ======================================================== -->
    <!-- 区域 1：顶部状态监控卡片 (总览同款 5 大 KPI 监控卡片 + 返回常态) -->
    <!-- ======================================================== -->
    <div class="w-full relative z-20 p-2 pb-0 flex items-stretch gap-2 flex-shrink-0">
      <div class="flex-1 min-w-0">
        <KpiCards :active-alarms="alarmCards" />
      </div>

      <!-- 右侧：返回常态快捷卡片按钮 -->
      <button
        @click="exitEmergencyMode"
        class="tech-panel tech-panel-hover rounded-xl py-2 px-3 flex flex-col items-center justify-center gap-1 text-slate-300 hover:text-white border border-[#1e4d8c] hover:border-cyan-400 cursor-pointer transition-all flex-shrink-0 group shadow-sm min-w-[76px]"
        title="返回常态"
      >
        <div class="w-6 h-6 rounded-md bg-gradient-to-br from-[#1c55aa] to-[#0f3b82] border border-cyan-400/60 flex items-center justify-center text-cyan-200 shadow-[0_0_8px_rgba(0,200,255,0.3)] group-hover:scale-105 transition-transform flex-shrink-0">
          <LogOut class="w-3 h-3" />
        </div>
        <span class="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">返回常态</span>
      </button>
    </div>

    <!-- 告警销号后 30秒自动回切常态提示条 -->
    <div
      v-if="allResolved"
      class="bg-emerald-950/90 border-b border-emerald-500/60 px-4 py-1.5 flex items-center justify-between text-xs text-emerald-200 animate-fadeIn"
    >
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        <span>告警已全部闭环，<strong class="font-tech text-cyan-300 text-sm font-bold">{{ autoRecoverSeconds }}</strong> 秒后返回常态</span>
      </div>
      <button
        @click="exitEmergencyMode"
        class="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] cursor-pointer"
      >
        返回
      </button>
    </div>

    <!-- ======================================================== -->
    <!-- 中间主视图区：左侧 68%~70% 三维数字孪生/地图；右侧 30%~32% 紧凑告警选择器 + 设备详情与处置工作台 -->
    <!-- ======================================================== -->
    <div class="flex-1 grid grid-cols-1 lg:grid-cols-[68%_32%] xl:grid-cols-[70%_30%] gap-2 p-2 overflow-hidden">
      <!-- 左侧：三维数字孪生 OR 雷电活动实时地图展示区 -->
      <div class="relative min-w-0 h-full rounded-xl overflow-hidden border border-[#1d4d8c]/80 shadow-lg bg-[#040f24]">
        <!-- 顶部常驻双模式切换胶囊栏 (3D vs 地图) -->
        <div class="absolute top-2.5 right-3 z-30 pointer-events-auto flex items-center bg-[#071d3e]/95 border border-cyan-500/60 rounded-lg p-0.5 shadow-[0_0_15px_rgba(6,182,212,0.35)] backdrop-blur-md">
          <button
            @click="switchMainView('3d')"
            class="px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            :class="activeMainView === '3d' ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_0_8px_rgba(6,182,212,0.6)]' : 'text-slate-300 hover:text-white'"
            title="三维孪生"
          >
            <Box class="w-3.5 h-3.5" :class="activeMainView === '3d' ? 'text-white' : 'text-cyan-400'" />
            <span>3D</span>
          </button>
          <button
            @click="switchMainView('map')"
            class="px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            :class="activeMainView === 'map' ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_0_8px_rgba(6,182,212,0.6)]' : 'text-slate-300 hover:text-white'"
            title="雷电地图"
          >
            <MapPin class="w-3.5 h-3.5" :class="activeMainView === 'map' ? 'text-white' : 'text-cyan-400'" />
            <span>地图</span>
          </button>
        </div>

        <!-- 视图 A：三维数字孪生卡片组件 (保持挂载，切换零延迟) -->
        <div v-show="activeMainView === '3d'" class="h-full w-full">
          <Datacenter3DCard
            ref="datacenter3DCardRef"
            class="h-full w-full"
            :active-alarms="alarmCards"
            :focused-alarm-id="focusedId"
            :allow-map-switch="true"
            @switch-to-map="switchMainView('map')"
          />
        </div>

        <!-- 视图 B：雷电活动实时地图 (保持挂载，平滑切换) -->
        <div v-show="activeMainView === 'map'" class="h-full w-full">
          <LightningMapCard
            ref="lightningMapCardRef"
            class="h-full w-full"
            :can-switch-to-3d="true"
            @switch-to-3d="switchMainView('3d')"
          />
        </div>
      </div>

      <!-- ======================================================== -->
      <!-- 右侧：结构化处置工作台 -->
      <!-- ======================================================== -->
      <div class="flex flex-col gap-2 min-w-0 h-full overflow-hidden justify-between">
        <template v-if="alarmCards.length > 0">
          <!-- 1. 顶部：待处置告警紧凑选择列表 -->
          <div class="tech-panel rounded-xl p-2 flex flex-col gap-1.5 flex-shrink-0 border border-[#1d4d8c]/70">
            <div class="flex items-center justify-between pb-1 border-b border-white/10 text-xs">
              <div class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span class="font-bold text-white">待处置 ({{ alarmCards.length }})</span>
              </div>
            </div>

            <!-- 紧凑单行选择器 -->
            <div class="flex flex-col gap-1 max-h-[115px] overflow-y-auto no-scrollbar">
              <div
                v-for="item in alarmCards"
                :key="item.id"
                @click="manualSelect(item.id)"
                class="px-2 py-1.5 rounded-lg border flex items-center justify-between gap-2 transition-all cursor-pointer group"
                :class="[
                  focusedId === item.id
                    ? 'bg-[#0f2e5c] border-cyan-400 text-white shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                    : 'bg-[#06152d]/90 border-slate-700/60 text-slate-300 hover:border-slate-500 hover:bg-[#0b2042]'
                ]"
              >
                <!-- 左侧：等级微标 + 简略标题 + 测点编码 -->
                <div class="flex items-center gap-1.5 min-w-0 flex-1">
                  <span
                    class="px-1 py-0.2 rounded text-[9px] font-semibold flex-shrink-0 whitespace-nowrap"
                    :class="getSeverityBadgeClass(item.severity)"
                  >
                    {{ item.severityText }}
                  </span>
                  <span class="font-medium text-[11px] truncate" :class="focusedId === item.id ? 'text-white font-bold' : 'text-slate-300'">
                    {{ item.title }}
                  </span>
                </div>

                <!-- 右侧：实时值与处置步进 -->
                <div class="flex items-center gap-2 flex-shrink-0">
                  <span class="font-tech text-xs font-bold" :class="getSeverityTextClass(item.severity)">
                    {{ item.realtimeValue }}
                  </span>
                  <span
                    class="px-1.5 py-0.2 rounded text-[9px] font-medium font-mono"
                    :class="item.step >= 3 ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40' : item.step === 2 ? 'bg-amber-950 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-slate-400'"
                  >
                    {{ item.step === 1 ? '待派单' : item.step === 2 ? '已派单' : '排查中' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. 下部：选中告警的【设备详情与处置工作台】 -->
          <div
            v-if="focusedCard"
            class="tech-panel rounded-xl p-2.5 flex-1 flex flex-col justify-between overflow-hidden border border-[#1e4e8e]/80 shadow-md gap-2"
          >
            <!-- A. 设备详情与测点参数看板 -->
            <div class="flex flex-col gap-1 pb-1.5 border-b border-white/10 flex-shrink-0">
              <div class="flex items-start justify-between gap-2">
                <div class="flex flex-col min-w-0">
                  <div class="flex items-center gap-1.5">
                    <span class="px-1.5 py-0.2 rounded bg-cyan-950/80 border border-cyan-400/50 text-[10px] text-cyan-300 font-mono font-bold">
                      {{ focusedCard.deviceCode }}
                    </span>
                    <h4 class="text-xs sm:text-sm font-bold text-white truncate">{{ focusedCard.deviceName }}</h4>
                  </div>
                  <div class="flex items-center gap-1 text-[10.5px] text-slate-400 mt-0.5 truncate">
                    <MapPin class="w-3 h-3 text-cyan-400 flex-shrink-0" />
                    <span class="text-slate-300 truncate">{{ focusedCard.location }}</span>
                  </div>
                </div>

                <!-- 右侧超限量化看板 -->
                <div class="flex flex-col items-end flex-shrink-0 bg-[#071d42] px-2 py-1 rounded border border-[#1b4885]">
                  <div class="text-xs font-tech font-bold" :class="getSeverityTextClass(focusedCard.severity)">
                    {{ focusedCard.realtimeValue }}
                  </div>
                  <div class="text-[9.5px] text-slate-300 font-mono mt-0.5">
                    限值 ≤ {{ focusedCard.threshold }}
                  </div>
                  <div class="text-[9px] font-medium" :class="getSeverityTextClass(focusedCard.severity)">
                    {{ focusedCard.overValue }}
                  </div>
                </div>
              </div>

              <!-- 工程电气技术规格 -->
              <div class="mt-1 px-2 py-1 rounded bg-[#05132b]/80 border border-white/5 text-[10px] text-slate-400 flex items-center justify-between">
                <span class="truncate">规格: <span class="text-slate-300">{{ focusedCard.specs }}</span></span>
                <span class="text-cyan-300/80 cursor-pointer hover:underline text-[9.5px] whitespace-nowrap ml-2" @click="openDeviceDetail">
                  台账 &rarr;
                </span>
              </div>
            </div>

            <!-- B. 异常趋势时序监测 -->
            <div class="flex flex-col gap-1 flex-shrink-0 bg-[#041228]/80 p-2 rounded-lg border border-white/5">
              <div class="flex items-center justify-between text-[10.5px]">
                <span class="text-slate-300 font-medium flex items-center gap-1">
                  <Activity class="w-3 h-3 text-cyan-400" />
                  <span>时序趋势</span>
                </span>
                <span class="text-[9.5px] text-slate-400 font-mono">
                  {{ focusedCard.durationText }} · {{ focusedCard.trendDesc }}
                </span>
              </div>

              <!-- 趋势图 -->
              <div class="h-10 w-full relative px-1 bg-black/40 rounded border border-white/5 overflow-hidden">
                <svg class="w-full h-full" viewBox="0 0 320 40" preserveAspectRatio="none">
                  <!-- 安全基准阈值虚线 (Y=20) -->
                  <line x1="5" y1="20" x2="315" y2="20" stroke="#f59e0b" stroke-width="1" stroke-dasharray="4 2" />
                  
                  <!-- 越限突变阴影区 -->
                  <path
                    :d="focusedCard.sparklineOverArea"
                    :fill="focusedCard.severity === 'red' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(245, 158, 11, 0.25)'"
                  />

                  <!-- 历史常态线 -->
                  <path
                    :d="focusedCard.sparklineStrokeBefore"
                    fill="none"
                    stroke="#38bdf8"
                    stroke-width="1.8"
                  />

                  <!-- 越限抬升线 -->
                  <path
                    :d="focusedCard.sparklineStrokeOver"
                    fill="none"
                    :stroke="focusedCard.severity === 'red' ? '#ef4444' : focusedCard.severity === 'orange' ? '#f59e0b' : '#eab308'"
                    stroke-width="2.2"
                  />

                  <!-- 突变点 -->
                  <circle cx="180" cy="20" r="2.5" fill="#f59e0b" stroke="#ffffff" stroke-width="1" />
                  <!-- 实时测点 -->
                  <circle cx="280" :cy="focusedCard.endY" r="3" :fill="focusedCard.severity === 'red' ? '#ef4444' : '#f59e0b'" stroke="#ffffff" stroke-width="1.5" />
                </svg>
              </div>
            </div>

            <!-- C. 标准处置流程与责任人 -->
            <div class="flex flex-col gap-1.5 py-1 border-t border-b border-white/10 flex-shrink-0">
              <div class="flex items-center justify-between text-[10.5px]">
                <span class="text-slate-300 font-medium">处置流程</span>
                <span class="text-cyan-300 text-[10px]">
                  责任人: <strong class="text-white font-medium">{{ focusedCard.assignee }}</strong>
                </span>
              </div>

              <!-- 4 步流转步进指示器 -->
              <div class="grid grid-cols-4 gap-1 text-[10px]">
                <!-- 1. 触发 -->
                <div
                  class="px-1.5 py-1 rounded border flex flex-col items-center justify-center text-center transition-colors"
                  :class="focusedCard.step >= 1 ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-300' : 'bg-slate-900/60 border-slate-800 text-slate-500'"
                >
                  <span class="font-bold">1. 触发</span>
                  <span class="text-[8.5px] text-slate-400">{{ focusedCard.dispatchTime }}</span>
                </div>

                <!-- 2. 派单 -->
                <div
                  class="px-1.5 py-1 rounded border flex flex-col items-center justify-center text-center transition-colors"
                  :class="focusedCard.step >= 2 ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-300' : 'bg-slate-900/60 border-slate-800 text-slate-500'"
                >
                  <span class="font-bold">2. 派单</span>
                  <span class="text-[8.5px] text-slate-400">{{ focusedCard.step >= 2 ? '已下发' : '待调度' }}</span>
                </div>

                <!-- 3. 排查 -->
                <div
                  class="px-1.5 py-1 rounded border flex flex-col items-center justify-center text-center transition-colors"
                  :class="focusedCard.step >= 3 ? 'bg-cyan-950/90 border-cyan-400 text-cyan-200 ring-1 ring-cyan-400/50' : 'bg-slate-900/60 border-slate-800 text-slate-500'"
                >
                  <span class="font-bold flex items-center gap-1">
                    <span>3. 排查</span>
                    <span v-if="focusedCard.step === 3" class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                  </span>
                  <span class="text-[8.5px] text-slate-400">{{ focusedCard.step >= 3 ? '核验中' : '待响应' }}</span>
                </div>

                <!-- 4. 销号 -->
                <div class="px-1.5 py-1 rounded border border-slate-800 bg-slate-900/60 text-slate-500 flex flex-col items-center justify-center text-center">
                  <span class="font-bold">4. 销号</span>
                  <span class="text-[8.5px] text-slate-500">待完成</span>
                </div>
              </div>
            </div>

            <!-- D. 操作记录流水 -->
            <div class="flex-1 flex flex-col min-h-0 bg-[#041026]/70 p-1.5 rounded-lg border border-white/5 overflow-hidden">
              <div class="text-[10px] text-slate-400 mb-1 flex items-center justify-between flex-shrink-0">
                <span class="flex items-center gap-1">
                  <FileText class="w-3 h-3 text-cyan-400" />
                  <span class="font-medium text-slate-300">处置记录</span>
                </span>
              </div>
              <div class="flex-1 overflow-y-auto no-scrollbar space-y-1 text-[10px]">
                <div
                  v-for="(log, lIdx) in focusedCard.logs"
                  :key="lIdx"
                  class="flex items-start gap-1.5 text-slate-300 leading-tight"
                >
                  <span class="text-cyan-400/80 font-mono text-[9px] flex-shrink-0 mt-0.5">{{ log.time }}</span>
                  <span class="text-slate-400 font-medium flex-shrink-0">[{{ log.user }}]</span>
                  <span class="text-slate-200">{{ log.text }}</span>
                </div>
              </div>
            </div>

            <!-- E. 处置操作按键栏 -->
            <div class="flex items-center justify-between gap-2 pt-1 border-t border-white/10 flex-shrink-0">
              <button
                @click="openDeviceDetail"
                class="px-2.5 py-1 rounded-lg bg-[#0c244d] hover:bg-[#13356e] text-cyan-200 text-xs border border-cyan-500/40 transition-all cursor-pointer flex items-center gap-1"
                title="设备台账"
              >
                <Sliders class="w-3 h-3" />
                <span>台账</span>
              </button>

              <div class="flex items-center gap-1.5">
                <button
                  v-if="focusedCard.step === 1"
                  @click="advanceStep(focusedCard.id)"
                  class="px-3 py-1 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white cursor-pointer transition-all active:scale-95 shadow flex items-center gap-1"
                >
                  <Send class="w-3 h-3" />
                  <span>派单</span>
                </button>
                <button
                  v-else-if="focusedCard.step === 2"
                  @click="advanceStep(focusedCard.id)"
                  class="px-3 py-1 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer transition-all active:scale-95 shadow flex items-center gap-1"
                >
                  <MapPin class="w-3 h-3" />
                  <span>到场排查</span>
                </button>
                <button
                  v-else-if="focusedCard.step === 3"
                  @click="resolveAndRemove(focusedCard.id)"
                  class="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer transition-all active:scale-95 shadow flex items-center gap-1"
                  title="闭环销号"
                >
                  <Check class="w-3.5 h-3.5" />
                  <span>闭环销号</span>
                </button>
              </div>
            </div>
          </div>
        </template>

        <!-- 所有告警全部消除后的清空状态 -->
        <div v-else class="flex-1 flex flex-col items-center justify-center p-6 rounded-xl border border-emerald-500/50 bg-[#041d18]/90 text-center gap-3 animate-fadeIn">
          <div class="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300">
            <CheckCircle2 class="w-7 h-7 animate-bounce" />
          </div>
          <div>
            <h4 class="text-sm font-bold text-white mb-1">所有告警排查完毕，已全量销号</h4>
            <p class="text-xs text-emerald-300/80">在网所有防雷测点恢复绿色受控状态，无残留安全隐患</p>
          </div>
          <button
            @click="exitEmergencyMode"
            class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md cursor-pointer transition-all"
          >
            返回常态监控大屏
          </button>
        </div>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- 区域 4：底部极简单行状态栏 -->
    <!-- ======================================================== -->
    <div
      class="w-full relative z-20 px-4 py-1.5 flex items-center justify-between border-t text-[11px] backdrop-blur-md"
      :class="isNightWatchMode ? 'bg-[#020611] border-[#0e2344]/80 text-slate-500' : 'bg-[#04122d]/95 border-[#173d72]/80 text-slate-400'"
    >
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>在网测点: <strong class="text-slate-300 font-mono">37/37 (100%)</strong></span>
        </div>
        <div class="h-3 w-px bg-slate-700"></div>
        <div class="flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full" :class="activeCount > 0 ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'"></span>
          <span>待处置告警: <strong class="text-amber-300">{{ activeCount }} 项</strong></span>
        </div>
        <div class="h-3 w-px bg-slate-700"></div>
        <div class="flex items-center gap-1.5 text-slate-400">
          <span>值班责任人: <strong class="text-slate-300">周工 (工号 #8201)</strong></span>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="toggleNightWatchMode"
          class="flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] border transition-colors cursor-pointer"
          :class="isNightWatchMode
            ? 'bg-indigo-950/80 border-indigo-400 text-indigo-200'
            : 'bg-transparent border-slate-700 text-slate-400 hover:text-slate-200'"
        >
          <Moon class="w-3 h-3" />
          <span>{{ isNightWatchMode ? '夜间模式: 开' : '夜间模式:关' }}</span>
        </button>
        <span class="text-[10px] text-slate-500">
          工业防雷管控中枢 · 异常排查与标准化销号流转
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
import {
  Box,
  MapPin,
  Send,
  LogOut,
  Moon,
  Check,
  CheckCircle2,
  Activity,
  FileText,
  Sliders
} from 'lucide-vue-next';
import {
  isNightWatchMode,
  autoRecoverSeconds,
  exitEmergencyMode,
  toggleNightWatchMode
} from '@/composables/useEmergencyMode';

import Datacenter3DCard from '@/components/overview/Datacenter3DCard.vue';
import LightningMapCard from '@/components/overview/LightningMapCard.vue';
import KpiCards from '@/components/overview/KpiCards.vue';
import { openDeviceInspection } from '@/composables/useCockpitState';

// 主视图切换：'3d' (三维孪生) OR 'map' (雷电地图)
const activeMainView = ref<'3d' | 'map'>('3d');
const datacenter3DCardRef = ref<InstanceType<typeof Datacenter3DCard> | null>(null);
const lightningMapCardRef = ref<InstanceType<typeof LightningMapCard> | null>(null);

function switchMainView(view: '3d' | 'map') {
  activeMainView.value = view;
  nextTick(() => {
    if (view === '3d') {
      datacenter3DCardRef.value?.resize();
    } else {
      lightningMapCardRef.value?.invalidateSize();
    }
  });
}

// 告警卡片列表：严格规范色彩（红色严格保留给一级严重故障，当前不滥用红色）
const alarmCards = ref([
  {
    id: 'ground',
    title: '地网测试井阻抗超限',
    deviceCode: 'GW-01#',
    deviceName: '地网电阻在线监测仪',
    location: '-1F 人工地网基准井',
    severity: 'orange',
    severityText: '二级',
    realtimeValue: '0.88 Ω',
    threshold: '0.80 Ω',
    overValue: '+0.08 Ω (+10%)',
    specs: '基准 ≤ 0.80Ω · 铜排 50×5mm',
    trendDesc: '持续抬升 +0.06 Ω/h',
    durationText: '持续 28 分钟',
    timeTag: '15:10',
    endY: 10,
    sparklineOverArea: 'M 180,20 Q 230,14 280,10 L 280,20 L 180,20 Z',
    sparklineStrokeBefore: 'M 10,28 Q 90,26 140,24 T 180,20',
    sparklineStrokeOver: 'M 180,20 Q 230,14 280,10',
    step: 2, // 已派单
    assignee: '张工',
    phone: '138-0021-8104',
    dispatchTime: '15:12',
    logs: [
      { time: '15:10', user: '系统', text: '电阻越过 0.80Ω 限值' },
      { time: '15:12', user: '调度', text: '下发抢修工单至张工' },
      { time: '15:20', user: '张工', text: '接单，正前往现场' }
    ]
  },
  {
    id: 'spd',
    title: '2F动力SPD漏电劣化',
    deviceCode: 'SPD-04#',
    deviceName: '浪涌保护器监测终端',
    location: '2F 配电室 A-02柜',
    severity: 'yellow',
    severityText: '三级',
    realtimeValue: '0.28 mA',
    threshold: '0.20 mA',
    overValue: '+0.08 mA (+40%)',
    specs: '标称 40kA · 残压 ≤ 1.5kV',
    trendDesc: '温升 +3.2℃，早期衰减',
    durationText: '持续 25 分钟',
    timeTag: '15:15',
    endY: 8,
    sparklineOverArea: 'M 180,20 Q 230,12 280,8 L 280,20 L 180,20 Z',
    sparklineStrokeBefore: 'M 10,27 Q 90,25 140,22 T 180,20',
    sparklineStrokeOver: 'M 180,20 Q 230,12 280,8',
    step: 3, // 现场排查中
    assignee: '李工',
    phone: '139-1102-8201',
    dispatchTime: '15:16',
    logs: [
      { time: '15:15', user: '系统', text: '漏电流 0.28mA 触发预警' },
      { time: '15:16', user: '调度', text: '派单至李工' },
      { time: '15:24', user: '李工', text: '现场排查，温升 3.2℃' }
    ]
  },
  {
    id: 'lightning',
    title: '12号塔电场突变预警',
    deviceCode: 'AEFM-01#',
    deviceName: '大气电场监测探针',
    location: '科研楼天面 12号塔',
    severity: 'blue',
    severityText: '四级',
    realtimeValue: '38.6 kV/m',
    threshold: '25.0 kV/m',
    overValue: '+13.6 kV/m',
    specs: '量程 ±50 kV/m · 100Hz',
    trendDesc: '电场跃变，雷云临近',
    durationText: '持续 30 分钟',
    timeTag: '15:18',
    endY: 12,
    sparklineOverArea: 'M 180,20 Q 230,15 280,12 L 280,20 L 180,20 Z',
    sparklineStrokeBefore: 'M 10,26 Q 90,24 140,22 T 180,20',
    sparklineStrokeOver: 'M 180,20 Q 230,15 280,12',
    step: 1, // 待调度
    assignee: '赵工',
    phone: '137-0019-8302',
    dispatchTime: '15:18',
    logs: [
      { time: '15:18', user: '系统', text: '探针感应雷云先导电荷' },
      { time: '15:18', user: '策略', text: '接闪器进入就绪拦截态' }
    ]
  }
]);

// 当前选中的告警
const focusedId = ref('ground');

const focusedCard = computed(() => {
  return alarmCards.value.find(c => c.id === focusedId.value) || alarmCards.value[0];
});

// 手动点选
const manualSelect = (id: string) => {
  focusedId.value = id;
};

// 推进单步流程
const advanceStep = (id: string) => {
  const card = alarmCards.value.find(c => c.id === id);
  if (card && card.step < 3) {
    card.step++;
    const stepLabel = card.step === 2 ? '已派发工单' : '现场排查中';
    card.logs.push({
      time: new Date().toTimeString().slice(0, 8),
      user: '值班调度',
      text: `工单进度推进至 [${stepLabel}]`
    });
  }
};

// 复测合格并销号
const resolveAndRemove = (id: string) => {
  const targetIndex = alarmCards.value.findIndex(c => c.id === id);
  if (targetIndex !== -1) {
    alarmCards.value.splice(targetIndex, 1);

    if (alarmCards.value.length > 0) {
      focusedId.value = alarmCards.value[0].id;
    }

    if (alarmCards.value.length === 0) {
      setTimeout(() => {
        exitEmergencyMode();
      }, 2000);
    }
  }
};

// 打开设备台账弹窗
const openDeviceDetail = () => {
  if (!focusedCard.value) return;
  const devMap: Record<string, string> = {
    spd: 'spd_terminal',
    ground: 'ground_res',
    lightning: 'atmospheric'
  };
  openDeviceInspection(devMap[focusedCard.value.id] || 'datacenter_zone');
};

const activeCount = computed(() => alarmCards.value.length);
const allResolved = computed(() => alarmCards.value.length === 0);

// 色彩规范函数
const getSeverityBadgeClass = (severity: string) => {
  switch (severity) {
    case 'red':
      return 'bg-[#450a0a] text-red-300 border border-red-500/70';
    case 'orange':
      return 'bg-[#401b07] text-amber-300 border border-amber-500/60';
    case 'yellow':
      return 'bg-[#3b2b06] text-yellow-300 border border-yellow-500/60';
    case 'blue':
    default:
      return 'bg-[#0d2a58] text-cyan-300 border border-cyan-500/60';
  }
};

const getSeverityTextClass = (severity: string) => {
  switch (severity) {
    case 'red':
      return 'text-red-400';
    case 'orange':
      return 'text-amber-400';
    case 'yellow':
      return 'text-yellow-300';
    case 'blue':
    default:
      return 'text-cyan-300';
  }
};

const getSeverityDotClass = (severity: string) => {
  switch (severity) {
    case 'red':
      return 'bg-red-500 animate-ping';
    case 'orange':
      return 'bg-amber-400 animate-pulse';
    case 'yellow':
      return 'bg-yellow-400';
    case 'blue':
    default:
      return 'bg-cyan-400';
  }
};
</script>
