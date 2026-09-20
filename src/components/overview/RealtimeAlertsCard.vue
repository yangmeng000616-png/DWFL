<template>
  <div class="tech-panel rounded-xl p-2.5 flex flex-col justify-between h-full shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
    <!-- Header -->
    <div class="flex items-center justify-between pb-1.5 border-b border-[#184682]/60 flex-shrink-0">
      <div class="flex items-center gap-1.5">
        <div class="w-5 h-5 rounded-md bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-400 shadow-[0_0_6px_rgba(244,63,94,0.3)] flex-shrink-0">
          <svg class="w-3 h-3 fill-current" viewBox="0 0 24 24">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
          </svg>
        </div>
        <h3 class="text-xs sm:text-sm font-bold text-white tracking-wide">实时预警信息</h3>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-[10px] text-cyan-400/90 hidden xl:flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          {{ isHovered ? '已暂停(悬停)' : '自动轮播中' }}
        </span>
        <router-link
          to="/warning"
          class="text-xs text-cyan-400 hover:text-cyan-200 flex items-center gap-0.5 transition-colors font-semibold"
        >
          <span>更多</span>
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </router-link>
      </div>
    </div>

    <!-- Alert Table (Fixed Header + Auto-scrolling Body) -->
    <div class="my-0.5 flex-1 flex flex-col min-h-0 overflow-hidden">
      <!-- Fixed Table Header -->
      <table class="w-full text-left border-collapse table-fixed flex-shrink-0">
        <thead>
          <tr class="text-[10px] text-slate-300 font-medium border-b border-[#215caa]/75 bg-[#0e3163]/40">
            <th class="py-1 px-1 font-medium whitespace-nowrap w-[22%]">时间</th>
            <th class="py-1 px-1 font-medium whitespace-nowrap w-[26%]">类型</th>
            <th class="py-1 px-0.5 font-medium text-center whitespace-nowrap w-[11%]">等级</th>
            <th class="py-1 px-1 font-medium whitespace-nowrap w-[29%]">监测区域/设备</th>
            <th class="py-1 px-1 font-medium text-right whitespace-nowrap w-[12%]">状态</th>
          </tr>
        </thead>
      </table>

      <!-- Vertical Auto-scrolling Body -->
      <div
        ref="scrollContainer"
        class="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar relative select-none"
        @mouseenter="isHovered = true"
        @mouseleave="isHovered = false"
      >
        <table class="w-full text-left border-collapse table-fixed">
          <tbody class="divide-y divide-[#1e4e8c]/50">
            <tr
              v-for="(alert, idx) in displayAlerts"
              :key="`${alert.id}-${idx}`"
              @click="locateAndInspect(alert)"
              class="hover:bg-[#144288]/90 cursor-pointer transition-all group"
              :class="selectedAlertId === alert.id ? 'bg-[#1a519c]/90 ring-1 ring-cyan-400/80 shadow-[0_0_12px_rgba(0,240,255,0.3)]' : ''"
              :title="`【${alert.time}】${alert.type} - 点击定位三维设备 (悬停已暂停)`"
            >
              <!-- Time -->
              <td class="py-1 px-1 text-slate-300 font-tech text-[10px] whitespace-nowrap w-[22%]">
                {{ formatAlertTime(alert.time) }}
              </td>

              <!-- Type -->
              <td class="py-1 px-1 text-white font-medium text-[10px] whitespace-nowrap w-[26%]">
                <div class="flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full flex-shrink-0" :class="alert.dotClass"></span>
                  <span class="truncate">{{ alert.type }}</span>
                </div>
              </td>

              <!-- Severity Level Badge -->
              <td class="py-1 px-0.5 text-center whitespace-nowrap w-[11%]">
                <span
                  class="px-1 py-0.2 rounded text-[9px] font-semibold inline-block"
                  :class="getLevelBadgeClass(alert.level)"
                >
                  {{ alert.level }}
                </span>
              </td>

              <!-- Location -->
              <td class="py-1 px-1 text-cyan-200 group-hover:text-white whitespace-nowrap text-[10px] w-[29%]">
                <span class="underline decoration-cyan-400/50 decoration-dotted truncate block">{{ alert.location }}</span>
              </td>

              <!-- Status -->
              <td class="py-1 px-1 text-right whitespace-nowrap w-[12%]">
                <span
                  class="px-1 py-0.2 rounded text-[9px] font-semibold inline-block"
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
import { activeFocusHotspot, openDeviceInspection } from '@/composables/useCockpitState';

interface AlertItem {
  id: number;
  time: string;
  type: string;
  level: string;
  location: string;
  status: string;
  deviceId: string;
  dotClass: string;
}

const selectedAlertId = ref<number | null>(null);
const scrollContainer = ref<HTMLElement | null>(null);
const isHovered = ref(false);
const scrollSpeed = ref(45); // px/s, dynamic & brisk

const alerts = ref<AlertItem[]>([
  {
    id: 1,
    time: '2025-04-29 14:32',
    type: 'SPD劣化预警',
    level: '黄色',
    location: '2F机房 低压配电A柜',
    status: '关注中',
    deviceId: 'spd_terminal',
    dotClass: 'bg-amber-400'
  },
  {
    id: 2,
    time: '2025-04-29 11:15',
    type: '接地阻抗微浮动',
    level: '橙色',
    location: '园区基准测试井 (GW-01)',
    status: '处理中',
    deviceId: 'ground_res',
    dotClass: 'bg-orange-400'
  },
  {
    id: 3,
    time: '2025-04-29 08:47',
    type: '防静电地板微电位',
    level: '黄色',
    location: '主机房A01列通道',
    status: '已处理',
    deviceId: 'esd_terminal',
    dotClass: 'bg-amber-400'
  },
  {
    id: 4,
    time: '2025-04-29 06:22',
    type: '雷云活动增强提示',
    level: '蓝色',
    location: '科研楼天面12号塔',
    status: '实时提示',
    deviceId: 'atmospheric',
    dotClass: 'bg-cyan-400'
  },
  {
    id: 5,
    time: '2025-04-28 22:16',
    type: '防雷拦截通道自检',
    level: '绿色',
    location: '中央防雷基站',
    status: '正常通过',
    deviceId: 'dual_protection',
    dotClass: 'bg-emerald-400'
  },
  {
    id: 6,
    time: '2025-04-28 19:40',
    type: '直流母线纹波波动',
    level: '黄色',
    location: '模块化UPS动力室',
    status: '已排查',
    deviceId: 'datacenter_zone',
    dotClass: 'bg-amber-400'
  },
  {
    id: 7,
    time: '2025-04-28 16:05',
    type: '外廓接闪引下线阻抗',
    level: '蓝色',
    location: '主楼西侧引下线-03',
    status: '例行自检',
    deviceId: 'ground_res',
    dotClass: 'bg-cyan-400'
  }
]);

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
      // dynamic and fluent scrolling at 45 px/s
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
  // Automatically trigger detail modal
  openDeviceInspection(alert.deviceId);
};

const formatAlertTime = (timeStr: string) => {
  if (!timeStr) return '';
  return timeStr.replace(/^\d{4}-/, '');
};

const getLevelBadgeClass = (level: string) => {
  switch (level) {
    case '黄色':
      return 'bg-[#42320b] text-[#fde047] border border-[#f59e0b]/70';
    case '橙色':
      return 'bg-[#4d2209] text-[#fdba74] border border-[#f97316]/70';
    case '红色':
      return 'bg-[#52171e] text-[#fca5a5] border border-[#ef4444]/70';
    case '蓝色':
      return 'bg-[#123875] text-[#93c5fd] border border-[#3b82f6]/70';
    case '绿色':
    default:
      return 'bg-[#0a3d31] text-[#6ee7b7] border border-[#10b981]/70';
  }
};

const getStatusBadgeClass = (status: string) => {
  if (status.includes('正常') || status.includes('已处理') || status.includes('通过') || status.includes('已排查')) {
    return 'bg-[#0a3d31] text-[#6ee7b7] border border-[#10b981]/70';
  }
  if (status.includes('处理中')) {
    return 'bg-[#4d2209] text-[#fdba74] border border-[#f97316]/70';
  }
  if (status.includes('提示') || status.includes('例行')) {
    return 'bg-[#0d346c] text-[#67e8f9] border border-cyan-400/60';
  }
  return 'bg-[#42320b] text-[#fde047] border border-[#f59e0b]/70';
};
</script>
