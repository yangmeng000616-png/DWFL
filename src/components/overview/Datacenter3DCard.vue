<template>
  <div class="tech-panel rounded-xl p-3 flex flex-col justify-between h-full relative overflow-hidden group shadow-[0_8px_32px_rgba(0,0,0,0.6)] select-none">
    <!-- 1. Card Top Control Bar -->
    <div class="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#184682]/60 relative z-20">
      <!-- Title & Facility Badge -->
      <div class="flex items-center gap-2">
        <div class="w-6 h-6 rounded-md bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_6px_rgba(6,182,212,0.3)]">
          <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M13 2L3 14h8l-1 8 11-12h-8l1-8z" />
          </svg>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h3 class="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
              <span>星云计算中心 · 三维数字孪生</span>
            </h3>
            <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-950/80 text-cyan-300 border border-blue-500/40">
              82m×54m 主机房 · PBR仿真
            </span>
          </div>
        </div>
      </div>

      <!-- Quick Control Actions -->
      <div class="flex items-center gap-1.5 text-xs flex-wrap">
        <!-- View Preset Dropdown / Quick Switcher -->
        <div class="relative">
          <button
            @click="showPresetMenu = !showPresetMenu"
            class="h-6.5 px-2.5 rounded-md bg-[#092960]/90 hover:bg-[#123e84] border border-[#2461b2]/70 text-[11px] font-medium text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="切换漫游预设视角"
          >
            <svg class="w-3 h-3 text-cyan-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 10l-3 3-3-3" />
              <circle cx="12" cy="12" r="9" />
            </svg>
            <span class="text-cyan-300 font-semibold">{{ currentPresetLabel }}</span>
          </button>

          <!-- Preset Menu Popover -->
          <div
            v-if="showPresetMenu"
            class="absolute top-8 left-0 z-50 w-52 bg-[#081c3c]/95 border border-cyan-500/50 rounded-lg shadow-2xl p-1.5 backdrop-blur-md grid grid-cols-2 gap-1 text-[11px]"
          >
            <button
              v-for="p in VIEW_PRESETS"
              :key="p.id"
              @click="selectPreset(p.id)"
              class="px-2 py-1.5 rounded text-left transition-colors flex flex-col cursor-pointer"
              :class="activePresetId === p.id ? 'bg-cyan-600/30 text-cyan-200 border border-cyan-400/50 font-bold' : 'text-slate-300 hover:bg-white/10'"
            >
              <span>{{ p.label }}</span>
            </button>
          </div>
        </div>

        <!-- Layer Control Drawer Toggle -->
        <button
          @click="showLayerDrawer = !showLayerDrawer"
          class="h-6.5 px-2 rounded-md border text-[11px] font-medium flex items-center gap-1 transition-all cursor-pointer"
          :class="showLayerDrawer ? 'bg-cyan-600 text-white border-cyan-400' : 'bg-[#092960]/90 hover:bg-[#123e84] text-slate-200 border-[#2461b2]/70'"
          title="图层管理：建筑/供配电/冷却/防雷/地网"
        >
          <svg class="w-3 h-3 text-cyan-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
          <span>图层 ({{ activeLayerCount }})</span>
        </button>

        <!-- X-Ray Translucent Toggle -->
        <button
          @click="toggleXRay"
          class="h-6.5 px-2 rounded-md border text-[11px] font-medium flex items-center gap-1 transition-all cursor-pointer"
          :class="isXRayEnabled ? 'bg-indigo-600 text-white border-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'bg-[#092960]/90 hover:bg-[#123e84] text-slate-200 border-[#2461b2]/70'"
          title="透视穿透模式：建筑外立面半透明，透视内部服务器机房、监控值班室与地下地网"
        >
          <svg class="w-3 h-3 text-indigo-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M3 12h3m12 0h3M12 3v3m0 12v3" />
          </svg>
          <span>{{ isXRayEnabled ? '透视开' : '透视' }}</span>
        </button>

        <!-- Interior Server Room Quick Button -->
        <button
          @click="selectPreset('interior_server_room')"
          class="h-6.5 px-2 rounded-md border text-[11px] font-medium flex items-center gap-1 transition-all cursor-pointer"
          :class="activePresetId === 'interior_server_room' ? 'bg-cyan-600 text-white border-cyan-400' : 'bg-[#092960]/90 hover:bg-[#123e84] text-cyan-200 border-[#2461b2]/70'"
          title="直接进入 2F 核心高密服务器冷通道机房"
        >
          <svg class="w-3 h-3 text-cyan-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
            <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
            <line x1="6" y1="6" x2="6.01" y2="6" />
            <line x1="6" y1="18" x2="6.01" y2="18" />
          </svg>
          <span>2F机房</span>
        </button>

        <!-- Interior Duty Room Quick Button -->
        <button
          @click="selectPreset('interior_duty_room')"
          class="h-6.5 px-2 rounded-md border text-[11px] font-medium flex items-center gap-1 transition-all cursor-pointer"
          :class="activePresetId === 'interior_duty_room' ? 'bg-cyan-600 text-white border-cyan-400' : 'bg-[#092960]/90 hover:bg-[#123e84] text-cyan-200 border-[#2461b2]/70'"
          title="直接进入 1F 运维监控调度值班大厅"
        >
          <svg class="w-3 h-3 text-emerald-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
          <span>1F值班室</span>
        </button>

        <!-- Lightning Simulation Button -->
        <button
          @click="triggerLightning"
          :disabled="isLightningFiring"
          class="h-6.5 px-2 rounded-md border text-[11px] font-semibold flex items-center gap-1 transition-all shadow-[0_0_8px_rgba(0,240,255,0.2)] disabled:opacity-50 cursor-pointer"
          :class="isLightningFiring ? 'bg-amber-600 text-white border-amber-400 animate-pulse' : 'bg-[#0f3b7d] hover:bg-[#184ea0] text-cyan-200 border-cyan-400/50'"
          title="触发模拟雷击与地网泄流"
        >
          <svg class="w-3 h-3 fill-current text-amber-300" viewBox="0 0 24 24">
            <path d="M13 2L3 14h8l-1 8 11-12h-8l1-8z" />
          </svg>
          <span>{{ isLightningFiring ? '放电泄流中' : '模拟防雷' }}</span>
        </button>

        <!-- Auto Patrol Toggle -->
        <button
          @click="toggleAutoPatrol"
          class="h-6.5 px-2 rounded-md border text-[11px] font-medium flex items-center gap-1 transition-all cursor-pointer"
          :class="isPatrolling ? 'bg-cyan-600/30 text-cyan-200 border-cyan-400' : 'bg-[#092960]/90 hover:bg-[#123e84] text-slate-300 border-[#2461b2]/70'"
          title="自动环绕漫游巡检"
        >
          <span>{{ isPatrolling ? '巡航中' : '巡航' }}</span>
        </button>

        <!-- Switch to GIS Map (when in Emergency mode) -->
        <button
          v-if="allowMapSwitch"
          @click="emit('switch-to-map')"
          class="h-6.5 px-2 rounded-md bg-[#0f356e] hover:bg-[#194c96] border border-cyan-400/60 text-[11px] font-semibold text-cyan-300 flex items-center gap-1 transition-colors cursor-pointer"
          title="切换至雷电活动实时电子地图"
        >
          <svg class="w-3 h-3 text-cyan-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="3" />
            <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
          </svg>
          <span>切地图</span>
        </button>

        <!-- Reset Camera -->
        <button
          @click="resetCamera"
          class="h-6.5 px-2 rounded-md bg-[#092960]/90 hover:bg-[#123e84] border border-[#2461b2]/70 text-[11px] text-slate-300 transition-colors cursor-pointer"
          title="复位默认鸟瞰视角"
        >
          复位
        </button>
      </div>
    </div>

    <!-- 2. Center 3D WebGL Canvas Viewport -->
    <div class="relative flex-1 min-h-[340px] flex items-center justify-center overflow-hidden my-1 rounded-lg border border-[#163a6b]/60 bg-[#06142a]">
      <!-- Canvas Mount Container -->
      <div ref="canvasContainer" class="w-full h-full cursor-grab active:cursor-grabbing"></div>

      <!-- Quick Preset Buttons Pill Overlay (Bottom Center of 3D Scene) -->
      <div class="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 bg-[#071d3e]/90 p-1 rounded-full border border-cyan-500/40 backdrop-blur-md shadow-lg shadow-black/60 overflow-x-auto max-w-[95%]">
        <button
          v-for="preset in VIEW_PRESETS"
          :key="preset.id"
          @click="selectPreset(preset.id)"
          class="px-2.5 py-1 rounded-full text-[10px] font-medium transition-all whitespace-nowrap cursor-pointer"
          :class="activePresetId === preset.id
            ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-[0_0_8px_rgba(6,182,212,0.6)]'
            : 'text-slate-300 hover:text-white hover:bg-white/10'"
          :title="preset.description"
        >
          {{ preset.shortLabel }}
        </button>
      </div>

      <!-- Navigation & Compass Guide Overlay (Top Left of 3D Scene) -->
      <div class="absolute top-2.5 left-2.5 z-20 pointer-events-none flex flex-col gap-1 text-[10px] text-slate-300 bg-[#06193d]/85 px-2 py-1.5 rounded border border-[#194883]/60 backdrop-blur-sm">
        <div class="flex items-center gap-1.5 font-mono text-cyan-300 font-bold">
          <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>星云计算中心 · 三维数字孪生底座</span>
        </div>
        <div class="text-[9px] text-slate-400">
          左键旋转 · 右键平移 · 滚轮缩放 · 单击设备检视
        </div>
      </div>

      <!-- Hover Tooltip HUD (Follows or Anchors Hovered Device) -->
      <transition name="fade">
        <div
          v-if="hoveredObject"
          class="absolute top-2.5 right-2.5 z-20 bg-[#071f45]/90 border border-cyan-400/60 rounded-lg p-2.5 shadow-2xl backdrop-blur-md max-w-xs text-xs pointer-events-none"
        >
          <div class="flex items-center justify-between gap-2 pb-1 border-b border-cyan-500/30">
            <span class="font-bold text-white tracking-wide text-xs">{{ hoveredObject.name }}</span>
            <span
              class="px-1.5 py-0.2 rounded text-[10px] font-mono"
              :class="hoveredObject.statusType === 'warning' ? 'bg-amber-950 text-amber-300 border border-amber-500/40' : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'"
            >
              {{ hoveredObject.status || '正常' }}
            </span>
          </div>
          <div class="text-[11px] text-slate-300 mt-1.5 space-y-0.5">
            <div class="flex justify-between text-slate-400">
              <span>系统:</span>
              <span class="text-cyan-200">{{ hoveredObject.system || '综合系统' }}</span>
            </div>
            <div v-if="hoveredObject.location" class="flex justify-between text-slate-400">
              <span>位置:</span>
              <span class="text-slate-200 text-right truncate max-w-[170px]">{{ hoveredObject.location }}</span>
            </div>
            <div v-if="hoveredObject.realtimeValue" class="flex justify-between font-mono text-cyan-300 pt-0.5 font-semibold">
              <span>实时遥测:</span>
              <span>{{ hoveredObject.realtimeValue }}</span>
            </div>
          </div>
          <div class="text-[9px] text-cyan-400/80 pt-1 text-right">
            单击可展开设备工况与技术档案 →
          </div>
        </div>
      </transition>

      <!-- 3. Layer Management Drawer Panel (Left Slide-in) -->
      <transition name="slide-left">
        <div
          v-if="showLayerDrawer"
          class="absolute top-0 left-0 bottom-0 z-30 w-72 bg-[#071a38]/95 border-r border-cyan-500/40 shadow-2xl backdrop-blur-md p-3 flex flex-col text-xs"
        >
          <div class="flex items-center justify-between pb-2 border-b border-cyan-500/30">
            <div class="flex items-center gap-1.5 font-bold text-white">
              <svg class="w-4 h-4 text-cyan-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
              </svg>
              <span>数字孪生独立图层管理</span>
            </div>
            <button
              @click="showLayerDrawer = false"
              class="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-white rounded hover:bg-white/10"
            >
              ✕
            </button>
          </div>

          <!-- Layer Quick Presets -->
          <div class="grid grid-cols-2 gap-1 my-2">
            <button
              @click="applyLayerPreset('all')"
              class="px-2 py-1 rounded bg-[#0b2b60] hover:bg-[#12428c] text-cyan-200 text-[10px] text-center border border-cyan-500/30"
            >
              全景综合
            </button>
            <button
              @click="applyLayerPreset('interior')"
              class="px-2 py-1 rounded bg-indigo-900/80 hover:bg-indigo-800 text-indigo-200 text-[10px] text-center border border-indigo-400/40 font-medium"
            >
              机房室内透视
            </button>
            <button
              @click="applyLayerPreset('lightning_ground')"
              class="px-2 py-1 rounded bg-[#0b2b60] hover:bg-[#12428c] text-cyan-200 text-[10px] text-center border border-cyan-500/30"
            >
              防雷接地专项
            </button>
            <button
              @click="applyLayerPreset('power_hvac')"
              class="px-2 py-1 rounded bg-[#0b2b60] hover:bg-[#12428c] text-cyan-200 text-[10px] text-center border border-cyan-500/30"
            >
              动力暖通运维
            </button>
            <button
              @click="applyLayerPreset('underground')"
              class="col-span-2 px-2 py-1 rounded bg-[#0b2b60] hover:bg-[#12428c] text-cyan-200 text-[10px] text-center border border-cyan-500/30"
            >
              地下地网透视
            </button>
          </div>

          <!-- Layer Switch List -->
          <div class="flex-1 overflow-y-auto space-y-1 pr-1 custom-scroll">
            <div
              v-for="layer in layerList"
              :key="layer.id"
              class="flex items-center justify-between p-1.5 rounded hover:bg-white/5 border transition-colors"
              :class="layer.visible ? 'border-cyan-500/20 bg-[#092247]/60' : 'border-transparent opacity-60'"
            >
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full" :style="{ backgroundColor: layer.color }"></span>
                <div>
                  <div class="font-medium text-slate-100 text-[11px]">{{ layer.name }}</div>
                  <div class="text-[9px] text-slate-400">{{ layer.description }}</div>
                </div>
              </div>

              <!-- Toggle Eye Icon -->
              <button
                @click="toggleLayer(layer.id)"
                class="w-6 h-6 flex items-center justify-center rounded hover:bg-cyan-500/20 text-cyan-300 transition-colors"
                :title="layer.visible ? '隐藏图层' : '显示图层'"
              >
                <svg v-if="layer.visible" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <svg v-else class="w-3.5 h-3.5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </transition>

      <!-- 4. Selected Device Inspector Bottom Bar / Modal -->
      <transition name="slide-up">
        <div
          v-if="selectedDevice"
          class="absolute bottom-12 left-4 right-4 z-30 bg-[#071f45]/95 border border-cyan-400/80 rounded-xl p-3 shadow-2xl backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs"
        >
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 flex-shrink-0">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
                <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
                <line x1="6" y1="6" x2="6.01" y2="6" />
                <line x1="6" y1="18" x2="6.01" y2="18" />
              </svg>
            </div>

            <div>
              <div class="flex items-center gap-2">
                <span class="font-bold text-white text-sm tracking-wide">{{ selectedDevice.name }}</span>
                <span class="font-mono text-[10px] text-cyan-300 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-500/40">
                  {{ selectedDevice.code || selectedDevice.id }}
                </span>
                <span
                  class="px-2 py-0.5 rounded text-[10px] font-bold"
                  :class="selectedDevice.statusType === 'warning' ? 'bg-amber-950 text-amber-300 border border-amber-500/50' : 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'"
                >
                  {{ selectedDevice.status || '状态正常' }}
                </span>
              </div>
              <div class="text-[11px] text-slate-300 mt-1 flex flex-wrap gap-x-4 gap-y-0.5">
                <span>位置: <strong class="text-slate-100 font-normal">{{ selectedDevice.location }}</strong></span>
                <span>所属系统: <strong class="text-cyan-300 font-normal">{{ selectedDevice.system }}</strong></span>
                <span v-if="selectedDevice.specs">技术规格: <strong class="text-slate-300 font-normal">{{ selectedDevice.specs }}</strong></span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div v-if="selectedDevice.realtimeValue" class="bg-[#051633] px-3 py-1.5 rounded-lg border border-cyan-500/30 font-mono text-center">
              <div class="text-[10px] text-slate-400">实时遥测监测值</div>
              <div class="text-sm font-bold text-cyan-300">{{ selectedDevice.realtimeValue }}</div>
            </div>

            <button
              @click="openGlobalDetail"
              class="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-xs transition-all shadow-[0_0_10px_rgba(6,182,212,0.4)] cursor-pointer"
            >
              查看诊断档案
            </button>

            <button
              @click="selectedDevice = null"
              class="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10"
            >
              ✕
            </button>
          </div>
        </div>
      </transition>
    </div>

    <!-- 3. Bottom Status Bar with KPI Indicators -->
    <div class="pt-1.5 flex items-center justify-between text-[11px] text-slate-300 border-t border-[#184682]/40 relative z-20">
      <div class="flex items-center gap-3 font-mono">
        <span class="flex items-center gap-1.5 text-cyan-300">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>地网电阻: 0.52Ω</span>
        </span>
        <span class="text-slate-500">|</span>
        <span class="text-slate-300">空间电场: 12.4 kV/m</span>
        <span class="text-slate-500">|</span>
        <span class="text-amber-300">SPD-04 漏电关注: 0.18mA</span>
      </div>

      <div class="flex items-center gap-2 text-slate-400">
        <span>视角: {{ currentPresetLabel }}</span>
        <span>·</span>
        <span>园区工业仿真 1:1</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { DatacenterSceneManager, VIEW_PRESETS } from '@/components/datacenter3d/sceneManager';
import { LayerId, ViewPresetId, LayerConfig } from '@/components/datacenter3d/types';
import {
  openDeviceInspection,
  activeFocusHotspot,
  simulatedLightningActive,
  triggerSimulatedLightning,
} from '@/composables/useCockpitState';

interface AlarmTarget {
  id: string;
  title: string;
  deviceCode?: string;
  location?: string;
  severity: string;
  realtimeValue: string;
  threshold?: string;
  overValue?: string;
}

const props = withDefaults(
  defineProps<{
    activeAlarms?: AlarmTarget[];
    focusedAlarmId?: string;
    allowMapSwitch?: boolean;
  }>(),
  {
    allowMapSwitch: false,
  }
);

const emit = defineEmits<{
  (e: 'switch-to-map'): void;
}>();

// Template Refs & Scene Instances
const canvasContainer = ref<HTMLElement | null>(null);
let sceneManager: DatacenterSceneManager | null = null;

// UI State
const showPresetMenu = ref(false);
const showLayerDrawer = ref(false);
const isXRayEnabled = ref(false);
const isPatrolling = ref(false);
const isLightningFiring = ref(false);
const activePresetId = ref<ViewPresetId>('birds_eye');

const hoveredObject = ref<any | null>(null);
const selectedDevice = ref<any | null>(null);

// Layer Configuration
const layerList = ref<LayerConfig[]>([
  { id: 'building', name: '建筑主体 (82m×54m)', category: '建筑与土建', color: '#c4cdd9', visible: true, transparent: false, opacity: 1.0, description: '三层数据机房金属幕墙、夹芯板、雨棚及门窗' },
  { id: 'interior', name: '机房室内 (服务器/值班室/储能)', category: '机房室内', color: '#00f0ff', visible: true, transparent: false, opacity: 1.0, description: '1F运维监控大厅8K大屏与值班台、2F核心高密冷通道机柜排、3F分布式智算与动力电池间' },
  { id: 'roads', name: '场地道路与硬化铺装', category: '建筑与土建', color: '#151c27', visible: true, transparent: false, opacity: 1.0, description: '环形消防车道、货运通道、标线与出入口' },
  { id: 'power', name: '变配电系统 (110kV/10kV)', category: '动力暖通', color: '#243242', visible: true, transparent: false, opacity: 1.0, description: '变配电附属用房、双主变、防爆墙及封闭桥架' },
  { id: 'cooling', name: '冷却设备区 (水冷机房)', category: '动力暖通', color: '#1d4ed8', visible: true, transparent: false, opacity: 1.0, description: '4台离心水机、循环水泵、多色保温管廊及步道' },
  { id: 'emergency', name: '应急动力 (柴油发电机)', category: '动力暖通', color: '#1e2e42', visible: true, transparent: false, opacity: 1.0, description: '4台2000kW柴发机组、消音立管与日用燃油围堰' },
  { id: 'lightning', name: '防雷接闪设施', category: '防雷防静电', color: '#38bdf8', visible: true, transparent: false, opacity: 1.0, description: '女儿墙接闪带、10m网格、避雷短针及主动避雷塔' },
  { id: 'grounding', name: '接地系统与测试点', category: '防雷防静电', color: '#eab308', visible: true, transparent: false, opacity: 1.0, description: '引下线、断接卡箱、MEB等电位箱及深井测试井' },
  { id: 'underground', name: '地下数字孪生接地网', category: '防雷防静电', color: '#f97316', visible: true, transparent: false, opacity: 1.0, description: '地下-3.5m 10m×10m闭合铜质网格与垂直接地极' },
  { id: 'spd', name: '智能浪涌保护器 (SPD)', category: '防雷防静电', color: '#00f0ff', visible: true, transparent: false, opacity: 1.0, description: '高压进线、机房配电、变频冷水及柴发SPD' },
  { id: 'esd', name: '静电防护与监测 (ESD)', category: '防雷防静电', color: '#06b6d4', visible: true, transparent: false, opacity: 1.0, description: '微环境静电传感器、门禁测试台及卸油接地' },
  { id: 'sensors', name: '雷电监测传感器', category: '防雷防静电', color: '#a855f7', visible: true, transparent: false, opacity: 1.0, description: '天面大气电场仪AEFM-01及雷电峰值感应' },
]);

const activeLayerCount = computed(() => {
  return layerList.value.filter((l) => l.visible).length;
});

const currentPresetLabel = computed(() => {
  const p = VIEW_PRESETS.find((preset) => preset.id === activePresetId.value);
  return p ? p.label : '视角预设';
});

// Select Preset Viewpoint
function selectPreset(presetId: ViewPresetId) {
  activePresetId.value = presetId;
  showPresetMenu.value = false;
  if (
    presetId === 'xray_datacenter' ||
    presetId === 'interior_server_room' ||
    presetId === 'interior_duty_room' ||
    presetId === 'underground_grid'
  ) {
    isXRayEnabled.value = true;
    const interiorLayer = layerList.value.find((l) => l.id === 'interior');
    if (interiorLayer) interiorLayer.visible = true;
  } else {
    isXRayEnabled.value = false;
  }

  if (sceneManager) {
    sceneManager.setViewPreset(presetId);
  }
}

// Layer Toggle
function toggleLayer(layerId: LayerId) {
  const layer = layerList.value.find((l) => l.id === layerId);
  if (!layer) return;
  layer.visible = !layer.visible;
  if (sceneManager) {
    sceneManager.setLayerVisibility(layerId, layer.visible);
  }
}

// Apply Layer Preset combinations
function applyLayerPreset(mode: 'all' | 'interior' | 'lightning_ground' | 'power_hvac' | 'underground') {
  if (mode === 'all') {
    layerList.value.forEach((l) => (l.visible = true));
    isXRayEnabled.value = false;
    if (sceneManager) {
      layerList.value.forEach((l) => sceneManager!.setLayerVisibility(l.id, true));
      sceneManager.setBuildingXRay(false);
    }
  } else if (mode === 'interior') {
    layerList.value.forEach((l) => {
      l.visible = ['building', 'interior', 'lightning'].includes(l.id);
    });
    isXRayEnabled.value = true;
    if (sceneManager) {
      layerList.value.forEach((l) => sceneManager!.setLayerVisibility(l.id, l.visible));
      sceneManager.setBuildingXRay(true);
      sceneManager.setViewPreset('interior_server_room');
    }
  } else if (mode === 'lightning_ground') {
    layerList.value.forEach((l) => {
      l.visible = ['building', 'lightning', 'grounding', 'underground', 'spd', 'esd', 'sensors'].includes(l.id);
    });
    isXRayEnabled.value = true;
    if (sceneManager) {
      layerList.value.forEach((l) => sceneManager!.setLayerVisibility(l.id, l.visible));
      sceneManager.setBuildingXRay(true);
      sceneManager.setViewPreset('roof_lightning');
    }
  } else if (mode === 'power_hvac') {
    layerList.value.forEach((l) => {
      l.visible = ['building', 'roads', 'power', 'cooling', 'emergency'].includes(l.id);
    });
    isXRayEnabled.value = false;
    if (sceneManager) {
      layerList.value.forEach((l) => sceneManager!.setLayerVisibility(l.id, l.visible));
      sceneManager.setBuildingXRay(false);
      sceneManager.setViewPreset('cooling_yard_detail');
    }
  } else if (mode === 'underground') {
    layerList.value.forEach((l) => {
      l.visible = ['underground', 'grounding', 'lightning', 'building'].includes(l.id);
    });
    isXRayEnabled.value = true;
    if (sceneManager) {
      layerList.value.forEach((l) => sceneManager!.setLayerVisibility(l.id, l.visible));
      sceneManager.setBuildingXRay(true);
      sceneManager.setViewPreset('underground_grid');
    }
  }
}

// X-Ray Building Translucency
function toggleXRay() {
  isXRayEnabled.value = !isXRayEnabled.value;
  if (sceneManager) {
    sceneManager.setBuildingXRay(isXRayEnabled.value);
    if (isXRayEnabled.value) {
      sceneManager.setLayerVisibility('interior', true);
      const interiorLayer = layerList.value.find((l) => l.id === 'interior');
      if (interiorLayer) interiorLayer.visible = true;
    }
  }
}

// Auto Patrol
function toggleAutoPatrol() {
  isPatrolling.value = !isPatrolling.value;
  if (sceneManager) {
    sceneManager.isAutoRotate = isPatrolling.value;
  }
}

// Reset Camera
function resetCamera() {
  selectPreset('birds_eye');
  if (isPatrolling.value) {
    toggleAutoPatrol();
  }
}

// Trigger Lightning Strike Simulation
function triggerLightning() {
  isLightningFiring.value = true;
  triggerSimulatedLightning();
  if (sceneManager) {
    sceneManager.triggerLightningStrike();
  }
  setTimeout(() => {
    isLightningFiring.value = false;
  }, 2500);
}

// Open Global Device Inspection Modal
function openGlobalDetail() {
  if (selectedDevice.value && selectedDevice.value.id) {
    openDeviceInspection(selectedDevice.value.id);
  }
}

// Watch bidirectional focus alarms
watch(
  () => props.focusedAlarmId,
  (newId) => {
    if (!newId || !sceneManager) return;

    if (newId === 'spd') {
      sceneManager.focusByEquipmentId('spd_terminal');
      selectedDevice.value = {
        id: 'spd_terminal',
        code: 'DEV-SPD-004',
        name: '智能浪涌保护器SPD监测终端 (SPD-04)',
        type: '电源配电二级浪涌监测',
        system: '浪涌保护SPD',
        location: '2F 数据机房动力配电室低压柜 A-02',
        status: '关注',
        statusType: 'warning',
        realtimeValue: '漏电流 0.18 mA · 动作累计 12次',
        specs: '冲击电流 Iimp 25kA · 漏电流监测 · CAN-Bus',
      };
    } else if (newId === 'ground') {
      sceneManager.focusByEquipmentId('ground_res');
      selectedDevice.value = {
        id: 'ground_res',
        code: 'DEV-GND-001',
        name: '地网电阻在线监测终端 (GW-01#)',
        type: '联合接地电网基准测试井',
        system: '接地网',
        location: '园区室外 -1F 人工地网基准测试井',
        status: '正常',
        statusType: 'success',
        realtimeValue: '0.52 Ω (国标 ≤ 1.0 Ω)',
        specs: '四极交流异频抗干扰注入法 · 测量范围 0.001~100Ω',
      };
    } else if (newId === 'lightning') {
      sceneManager.focusByEquipmentId('atmospheric');
      selectedDevice.value = {
        id: 'atmospheric',
        code: 'DEV-ENV-001',
        name: '大气电场仪 (AEFM-01)',
        type: '空间电场监测',
        system: '防雷接闪',
        location: '主建筑屋面 12号接闪塔顶端',
        status: '正常',
        statusType: 'success',
        realtimeValue: '12.4 kV/m (正常阈值 ±15.0 kV/m)',
        specs: '动态范围 ±50kV/m · 采样率 1000Hz · Modbus-TCP',
      };
    }
  },
  { immediate: true }
);

// Watch activeFocusHotspot from composable
watch(
  () => activeFocusHotspot.value,
  (hotspotId) => {
    if (hotspotId && sceneManager) {
      sceneManager.focusByEquipmentId(hotspotId);
    }
  }
);

onMounted(() => {
  if (canvasContainer.value) {
    sceneManager = new DatacenterSceneManager(canvasContainer.value, {
      onHoverObject: (userData) => {
        hoveredObject.value = userData;
      },
      onClickObject: (userData) => {
        selectedDevice.value = userData;
        if (userData && userData.id) {
          openDeviceInspection(userData.id);
        }
      },
    });

    // If there is an initial focused alarm, handle it
    if (props.focusedAlarmId) {
      setTimeout(() => {
        if (props.focusedAlarmId === 'spd') {
          sceneManager?.focusByEquipmentId('spd_terminal');
        } else if (props.focusedAlarmId === 'ground') {
          sceneManager?.focusByEquipmentId('ground_res');
        } else if (props.focusedAlarmId === 'lightning') {
          sceneManager?.focusByEquipmentId('atmospheric');
        }
      }, 500);
    }
  }
});

onUnmounted(() => {
  if (sceneManager) {
    sceneManager.dispose();
    sceneManager = null;
  }
});
</script>

<style scoped>
.custom-scroll::-webkit-scrollbar {
  width: 4px;
}
.custom-scroll::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
}
.custom-scroll::-webkit-scrollbar-thumb {
  background: rgba(6, 182, 212, 0.4);
  border-radius: 2px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}
.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
