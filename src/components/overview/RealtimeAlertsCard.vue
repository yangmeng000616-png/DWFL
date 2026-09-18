<template>
  <div class="tech-panel rounded-xl p-3 flex flex-col justify-between h-full shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
    <!-- Header -->
    <div class="flex items-center justify-between pb-2 border-b border-[#184682]/60">
      <div class="flex items-center gap-2">
        <div class="w-6 h-6 rounded-md bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-400 shadow-[0_0_6px_rgba(244,63,94,0.3)]">
          <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
          </svg>
        </div>
        <h3 class="text-sm font-bold text-white tracking-wide">实时预警信息</h3>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-[11px] text-slate-400 hidden xl:inline">点击定位孪生设备</span>
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

    <!-- Alert Table -->
    <div class="overflow-x-auto my-1 flex-1">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="text-xs text-slate-300 font-medium border-b border-[#13325e]/70">
            <th class="py-1.5 px-2 font-medium">时间</th>
            <th class="py-1.5 px-2 font-medium">类型</th>
            <th class="py-1.5 px-2 font-medium text-center">等级</th>
            <th class="py-1.5 px-2 font-medium">监测区域/设备</th>
            <th class="py-1.5 px-2 font-medium text-right">状态</th>
          </tr>
        </thead>
        <tbody class="text-sm divide-y divide-[#13325e]/50">
          <tr
            v-for="alert in alerts"
            :key="alert.id"
            @click="locateAndInspect(alert)"
            class="hover:bg-[#102d60]/70 cursor-pointer transition-all group"
            :class="selectedAlertId === alert.id ? 'bg-[#123877]/80 ring-1 ring-cyan-400/50' : ''"
            title="点击在三维数字孪生中定位此设备"
          >
            <!-- Time -->
            <td class="py-2 px-2 text-slate-300 font-tech text-xs whitespace-nowrap">
              {{ alert.time }}
            </td>

            <!-- Type -->
            <td class="py-2 px-2 text-white font-medium text-sm whitespace-nowrap flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full" :class="alert.dotClass"></span>
              <span>{{ alert.type }}</span>
            </td>

            <!-- Severity Level Badge -->
            <td class="py-2 px-2 text-center whitespace-nowrap">
              <span
                class="px-2 py-0.5 rounded text-xs font-semibold"
                :class="getLevelBadgeClass(alert.level)"
              >
                {{ alert.level }}
              </span>
            </td>

            <!-- Location -->
            <td class="py-2 px-2 text-cyan-300 group-hover:text-white whitespace-nowrap text-xs">
              <span class="underline decoration-cyan-500/40 decoration-dotted">{{ alert.location }}</span>
            </td>

            <!-- Status -->
            <td class="py-2 px-2 text-right whitespace-nowrap">
              <span
                class="px-2 py-0.5 rounded text-xs font-semibold"
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
</template>

<script setup lang="ts">
import { ref } from 'vue';
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
  }
]);

const locateAndInspect = (alert: AlertItem) => {
  selectedAlertId.value = alert.id;
  activeFocusHotspot.value = alert.deviceId;
  // Automatically trigger detail modal
  openDeviceInspection(alert.deviceId);
};

const getLevelBadgeClass = (level: string) => {
  switch (level) {
    case '黄色':
      return 'bg-[#2b2207] text-[#fbbf24] border border-[#f59e0b]/50';
    case '橙色':
      return 'bg-[#331c08] text-[#fb923c] border border-[#f97316]/50';
    case '红色':
      return 'bg-[#381014] text-[#f87171] border border-[#ef4444]/50';
    case '蓝色':
      return 'bg-[#0b244d] text-[#60a5fa] border border-[#3b82f6]/50';
    case '绿色':
    default:
      return 'bg-[#042820] text-[#34d399] border border-[#10b981]/50';
  }
};

const getStatusBadgeClass = (status: string) => {
  if (status.includes('正常') || status.includes('已处理') || status.includes('通过')) {
    return 'bg-[#042820] text-[#00e5a3] border border-[#00e5a3]/40';
  }
  if (status.includes('处理中')) {
    return 'bg-[#331c08] text-[#fb923c] border border-[#f97316]/40';
  }
  if (status.includes('提示')) {
    return 'bg-[#07244a] text-[#38bdf8] border border-cyan-500/40';
  }
  return 'bg-[#2b2207] text-[#fbbf24] border border-[#f59e0b]/40';
};
</script>
