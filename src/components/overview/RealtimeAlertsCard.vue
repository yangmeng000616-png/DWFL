<template>
  <div class="tech-panel rounded-xl p-2 flex flex-col justify-between h-full shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-[#1b4382]/80">
    <!-- 1. Header: 标题 + 未闭环标识 + 处置入口 -->
    <div class="flex items-center justify-between pb-1.5 border-b border-[#184682]/60 flex-shrink-0">
      <div class="flex items-center gap-1.5">
        <div class="w-5 h-5 rounded-md bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_6px_rgba(6,182,212,0.3)] flex-shrink-0">
          <ShieldAlert class="w-3 h-3 text-cyan-300" />
        </div>
        <div class="flex items-center gap-1.5">
          <h3 class="text-xs sm:text-sm font-bold text-white tracking-wide">告警与风险总览</h3>
          <span class="px-1.5 py-0.2 rounded-full text-[9.5px] font-bold font-mono bg-amber-950/80 text-amber-300 border border-amber-500/40">
            {{ unclosedCount }} 起未闭环
          </span>
        </div>
      </div>

      <div class="flex items-center gap-1.5">
        <span class="text-[9.5px] text-slate-400 hidden xl:flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full" :class="isHovered ? 'bg-amber-400' : 'bg-cyan-400 animate-pulse'"></span>
          {{ isHovered ? '暂停' : '轮播' }}
        </span>
        <button
          @click="goToDisposal"
          class="px-2 py-0.5 rounded text-[10.5px] font-medium bg-[#0e3b7a] hover:bg-[#154fa0] text-cyan-200 hover:text-white border border-cyan-500/40 hover:border-cyan-400 transition-all flex items-center gap-1 cursor-pointer active:scale-95 shadow-sm"
          title="打开应急处置工作台查看趋势、处置流程与详细记录"
        >
          <span>处置工作台</span>
          <ArrowRight class="w-3 h-3 text-cyan-300" />
        </button>
      </div>
    </div>

    <!-- 2. 统计概览条 (风险等级 + 空间分布 + 闭环概况) -->
    <div class="py-1 px-1.5 my-1 bg-[#06152e]/85 rounded-lg border border-[#1a447c]/60 flex flex-col gap-1 flex-shrink-0 text-[10px]">
      <!-- 风险等级矩阵 (规范：红色严格保留给一级严重故障，当前受控为0，杜绝全屏大红失控感) -->
      <div class="flex items-center justify-between text-slate-300 border-b border-white/5 pb-0.5">
        <div class="flex items-center gap-2">
          <span class="text-slate-400 font-medium">风险等级:</span>
          <!-- 一级严重 (规范：严格为0，不闪烁) -->
          <span class="flex items-center gap-0.5 text-slate-400" title="一级严重 (系统受控，无严重故障)">
            <span class="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
            <span>一级(严重)</span>
            <strong class="font-mono text-slate-400 font-bold ml-0.5">0</strong>
          </span>
          <!-- 二级高危 -->
          <span class="flex items-center gap-0.5 text-amber-300" title="二级高危 (参数越限需排查)">
            <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span>二级(高危)</span>
            <strong class="font-mono text-amber-300 font-bold ml-0.5">1</strong>
          </span>
          <!-- 三级关注 -->
          <span class="flex items-center gap-0.5 text-yellow-300" title="三级关注 (早期劣化预防)">
            <span class="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
            <span>三级(关注)</span>
            <strong class="font-mono text-yellow-300 font-bold ml-0.5">1</strong>
          </span>
          <!-- 四级提示 -->
          <span class="flex items-center gap-0.5 text-cyan-300" title="四级提示 (气象及环境自检)">
            <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            <span>四级(提示)</span>
            <strong class="font-mono text-cyan-300 font-bold ml-0.5">1</strong>
          </span>
        </div>
        <div class="text-slate-400 text-[9.5px]">
          今日告警 <strong class="text-slate-200 font-mono">7</strong> · 闭环率 <strong class="text-emerald-300 font-mono">57%</strong>
        </div>
      </div>

      <!-- 空间分布分布条 -->
      <div class="flex items-center justify-between text-[9.5px] text-slate-400 pt-0.5">
        <div class="flex items-center gap-2">
          <span class="text-slate-400 flex items-center gap-0.5">
            <MapPin class="w-2.5 h-2.5 text-cyan-400 inline" />
            <span>空间分布:</span>
          </span>
          <span class="text-slate-300">
            2F配电房: <strong class="text-cyan-300 font-mono">1</strong>
          </span>
          <span class="text-slate-600">·</span>
          <span class="text-slate-300">
            -1F地网: <strong class="text-cyan-300 font-mono">1</strong>
          </span>
          <span class="text-slate-600">·</span>
          <span class="text-slate-300">
            天面塔群: <strong class="text-cyan-300 font-mono">1</strong>
          </span>
          <span class="text-slate-600">·</span>
          <span class="text-slate-400">
            机房A列: <strong class="text-slate-400 font-mono">0</strong>
          </span>
        </div>
        <span class="text-cyan-400/80 cursor-pointer hover:underline text-[9px]" @click="goToDisposal">
          查看空间热点 &rarr;
        </span>
      </div>
    </div>

    <!-- 3. 紧凑列表 (固定表头 + 匀速平滑滚动体) -->
    <div class="flex-1 flex flex-col min-h-0 overflow-hidden">
      <!-- 固定表头 -->
      <table class="w-full text-left border-collapse table-fixed flex-shrink-0">
        <thead>
          <tr class="text-[9.5px] text-slate-300 font-medium border-b border-[#215caa]/75 bg-[#0e3163]/50">
            <th class="py-1 px-1 font-medium whitespace-nowrap w-[20%]">时间</th>
            <th class="py-1 px-1 font-medium whitespace-nowrap w-[28%]">类型 / 设备</th>
            <th class="py-1 px-0.5 font-medium text-center whitespace-nowrap w-[13%]">等级</th>
            <th class="py-1 px-1 font-medium whitespace-nowrap w-[26%]">空间位置</th>
            <th class="py-1 px-1 font-medium text-right whitespace-nowrap w-[13%]">状态</th>
          </tr>
        </thead>
      </table>

      <!-- 垂直匀速平滑滚动体 -->
      <div
        ref="scrollContainer"
        class="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar relative select-none"
        @mouseenter="isHovered = true"
        @mouseleave="isHovered = false"
      >
        <table class="w-full text-left border-collapse table-fixed">
          <tbody class="divide-y divide-[#1b437c]/45">
            <tr
              v-for="(alert, idx) in displayAlerts"
              :key="`${alert.id}-${idx}`"
              @click="locateAndInspect(alert)"
              class="hover:bg-[#144288]/90 cursor-pointer transition-all group h-[25px]"
              :class="selectedAlertId === alert.id ? 'bg-[#1a519c]/90 ring-1 ring-cyan-400/80 shadow-[0_0_10px_rgba(0,240,255,0.25)]' : ''"
              :title="`【${alert.time}】${alert.type} - 点击定位设备并在3D模型中调阅`"
            >
              <!-- 时间 -->
              <td class="py-0.5 px-1 text-slate-400 font-tech text-[9.5px] whitespace-nowrap w-[20%]">
                {{ formatAlertTime(alert.time) }}
              </td>

              <!-- 类型 / 设备 -->
              <td class="py-0.5 px-1 text-white font-medium text-[10px] whitespace-nowrap w-[28%]">
                <div class="flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full flex-shrink-0" :class="alert.dotClass"></span>
                  <span class="truncate">{{ alert.type }}</span>
                </div>
              </td>

              <!-- 等级徽章 (色彩规范：严谨区分，不滥用爆红) -->
              <td class="py-0.5 px-0.5 text-center whitespace-nowrap w-[13%]">
                <span
                  class="px-1 py-0.2 rounded text-[9px] font-semibold inline-block"
                  :class="getLevelBadgeClass(alert.level)"
                >
                  {{ alert.level }}
                </span>
              </td>

              <!-- 空间位置 -->
              <td class="py-0.5 px-1 text-cyan-200 group-hover:text-white whitespace-nowrap text-[9.5px] w-[26%]">
                <span class="truncate block">{{ alert.location }}</span>
              </td>

              <!-- 闭环状态 -->
              <td class="py-0.5 px-1 text-right whitespace-nowrap w-[13%]">
                <span
                  class="px-1 py-0.2 rounded text-[8.5px] font-semibold inline-block font-mono"
                  :class="getStatusBadgeClass(alert.status)"
                >
                  {{ alert.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { ShieldAlert, ArrowRight, MapPin } from 'lucide-vue-next';
import { activeFocusHotspot, activeFocusedAlarmId, openDeviceInspection } from '@/composables/useCockpitState';

const router = useRouter();

interface AlertItem {
  id: number;
  time: string;
  type: string;
  level: string;
  location: string;
  status: string;
  deviceId: string;
  dotClass: string;
  scenarioKey?: string;
}

const selectedAlertId = ref<number | null>(null);
const scrollContainer = ref<HTMLElement | null>(null);
const isHovered = ref(false);
const scrollSpeed = ref(38); // px/s 紧凑流畅

// 基础告警列表（规范色彩，严禁滥用红色，红色严格对应严重停机事故）
const alerts = ref<AlertItem[]>([
  {
    id: 1,
    time: '2025-04-29 15:41',
    type: 'SPD早期漏电微变',
    level: '三级关注',
    location: '2F机房 配电A柜',
    status: '排查中',
    deviceId: 'spd_terminal',
    dotClass: 'bg-yellow-400',
    scenarioKey: 'spd'
  },
  {
    id: 2,
    time: '2025-04-29 15:38',
    type: '地网阻抗微浮动超标',
    level: '二级高危',
    location: '园区地下基准井',
    status: '已派单',
    deviceId: 'ground_res',
    dotClass: 'bg-amber-400',
    scenarioKey: 'ground'
  },
  {
    id: 3,
    time: '2025-04-29 15:35',
    type: '天面接闪塔电场突变',
    level: '四级提示',
    location: '科研楼天面12号塔',
    status: '待调度',
    deviceId: 'atmospheric',
    dotClass: 'bg-cyan-400',
    scenarioKey: 'lightning'
  },
  {
    id: 4,
    time: '2025-04-29 11:20',
    type: '防静电微电位浮动',
    level: '四级提示',
    location: '主机房A01列通道',
    status: '已闭环',
    deviceId: 'esd_terminal',
    dotClass: 'bg-slate-400'
  },
  {
    id: 5,
    time: '2025-04-29 09:16',
    type: '防雷拦截通道自检',
    level: '正常',
    location: '中央防雷基站',
    status: '已闭环',
    deviceId: 'dual_protection',
    dotClass: 'bg-emerald-400'
  },
  {
    id: 6,
    time: '2025-04-28 19:40',
    type: '直流母线防雷旁路复测',
    level: '三级关注',
    location: '模块化UPS动力室',
    status: '已闭环',
    deviceId: 'datacenter_zone',
    dotClass: 'bg-slate-400'
  },
  {
    id: 7,
    time: '2025-04-28 16:05',
    type: '外廓接闪引下线阻抗',
    level: '四级提示',
    location: '主楼西侧引下线-03',
    status: '已闭环',
    deviceId: 'ground_res',
    dotClass: 'bg-slate-400'
  }
]);

const unclosedCount = computed(() => {
  return alerts.value.filter(a => a.status !== '已闭环' && a.status !== '正常通过').length;
});

const displayAlerts = computed(() => {
  return [...alerts.value, ...alerts.value];
});

let animFrameId: number | null = null;
let lastTimestamp = 0;

const autoScroll = (timestamp: number) => {
  if (!lastTimestamp) lastTimestamp = timestamp;
  const elapsed = timestamp - lastTimestamp;
  lastTimestamp = timestamp;

  if (scrollContainer.value && !isHovered.value && elapsed < 200) {
    const el = scrollContainer.value;
    const halfHeight = el.scrollHeight / 2;
    if (halfHeight > 0) {
      el.scrollTop += (scrollSpeed.value * elapsed) / 1000;
      if (el.scrollTop >= halfHeight) {
        el.scrollTop -= halfHeight;
      }
    }
  }

  animFrameId = requestAnimationFrame(autoScroll);
};

onMounted(() => {
  animFrameId = requestAnimationFrame(autoScroll);
});

onUnmounted(() => {
  if (animFrameId) {
    cancelAnimationFrame(animFrameId);
  }
});

const locateAndInspect = (alert: AlertItem) => {
  selectedAlertId.value = alert.id;
  activeFocusHotspot.value = alert.deviceId;
  activeFocusedAlarmId.value = alert.scenarioKey || alert.deviceId;
  openDeviceInspection(alert.deviceId);
};

const goToDisposal = () => {
  // Navigate directly to the dedicated disposal workbench page
  router.push('/warning');
};

const formatAlertTime = (timeStr: string) => {
  if (!timeStr) return '';
  return timeStr.replace(/^\d{4}-/, '');
};

const getLevelBadgeClass = (level: string) => {
  switch (level) {
    case '二级高危':
    case '橙色':
      return 'bg-[#401b07] text-amber-300 border border-amber-500/60';
    case '三级关注':
    case '黄色':
      return 'bg-[#3b2b06] text-yellow-300 border border-yellow-500/60';
    case '四级提示':
    case '蓝色':
      return 'bg-[#0d2a58] text-cyan-300 border border-cyan-500/60';
    case '一级严重':
    case '红色':
      return 'bg-[#450a0a] text-red-300 border border-red-500/70';
    case '正常':
    default:
      return 'bg-[#0a3328] text-emerald-300 border border-emerald-500/60';
  }
};

const getStatusBadgeClass = (status: string) => {
  if (status === '已闭环') {
    return 'bg-[#082b21] text-emerald-400 border border-emerald-500/50';
  }
  if (status === '已派单' || status === '处置中') {
    return 'bg-[#3e1d08] text-amber-300 border border-amber-500/60';
  }
  if (status === '排查中') {
    return 'bg-[#153463] text-cyan-300 border border-cyan-400/60 animate-pulse';
  }
  return 'bg-[#291e07] text-yellow-300 border border-yellow-500/50';
};
</script>
