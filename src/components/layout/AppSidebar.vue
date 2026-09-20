<template>
  <aside
    class="flex-shrink-0 flex flex-col justify-between py-2.5 bg-[#061c47]/95 border-r border-[#1f569f]/75 select-none transition-all duration-200 shadow-md shadow-[#020b22]/40"
    :class="collapsed ? 'w-14 px-1.5' : 'w-40 px-2'"
  >
    <!-- Top Navigation Groups -->
    <div class="flex flex-col gap-1 overflow-y-auto no-scrollbar">
      <div v-for="(group, gIndex) in navGroups" :key="group.name" class="flex flex-col gap-0.5">
        <!-- Group Divider & Title (When expanded) -->
        <div v-if="!collapsed && gIndex > 0" class="my-1.5 mx-1 border-t border-[#1a4985]/50"></div>
        <div
          v-if="!collapsed"
          class="px-2 pt-1 pb-1 text-[9.5px] font-semibold text-slate-400/90 tracking-wider flex items-center justify-between select-none"
        >
          <span>{{ group.name }}</span>
        </div>

        <!-- Group Nav Items -->
        <router-link
          v-for="item in group.items"
          :key="item.path"
          :to="item.path"
          :title="collapsed ? item.label : ''"
          class="group relative flex items-center rounded-lg text-xs transition-all duration-150 overflow-hidden"
          :class="[
            collapsed ? 'justify-center py-2 px-1' : 'gap-2 px-2.5 py-1.5 justify-between',
            isActive(item.path)
              ? 'bg-gradient-to-r from-cyan-500/25 via-[#13498f]/60 to-[#0c316a]/30 text-cyan-200 font-semibold border border-cyan-400/40 shadow-[0_0_12px_rgba(6,182,212,0.18)]'
              : 'text-slate-300 hover:text-white hover:bg-[#0e3670]/50 border border-transparent font-medium'
          ]"
        >
          <!-- Active Left Glowing Indicator -->
          <span
            v-if="isActive(item.path)"
            class="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]"
          ></span>

          <div class="flex items-center gap-2 min-w-0">
            <!-- Icon with custom glow on active -->
            <div
              class="w-4 h-4 flex items-center justify-center transition-transform group-hover:scale-110 flex-shrink-0"
              :class="isActive(item.path) ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]' : 'text-slate-300 group-hover:text-cyan-300'"
            >
              <component :is="item.icon" class="w-4 h-4" />
            </div>

            <!-- Nav label -->
            <span v-if="!collapsed" class="tracking-wide whitespace-nowrap text-xs truncate">{{ item.label }}</span>
          </div>

          <!-- Badges / Dots on right side -->
          <div v-if="!collapsed" class="flex items-center gap-1 flex-shrink-0">
            <!-- Live Pulse Dot -->
            <span v-if="item.dot" class="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981] animate-pulse"></span>

            <!-- Count Badge -->
            <span
              v-if="item.badge"
              class="px-1.5 py-0.2 rounded text-[9px] font-tech font-bold"
              :class="[
                item.badgeColor === 'amber' ? 'bg-amber-500/20 border border-amber-400/50 text-amber-300 shadow-[0_0_6px_rgba(245,158,11,0.3)]' : '',
                item.badgeColor === 'blue' ? 'bg-[#0a285e] border border-[#2461b2]/60 text-cyan-300' : '',
                item.badgeColor === 'emerald' ? 'bg-emerald-500/20 border border-emerald-400/50 text-emerald-300' : ''
              ]"
            >
              {{ item.badge }}
            </span>

            <!-- Active Point -->
            <span v-if="isActive(item.path) && !item.badge && !item.dot" class="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]"></span>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Bottom System Telemetry & Link Status Widget -->
    <div class="pt-2 flex flex-col gap-2 border-t border-[#1d4f94]/60 flex-shrink-0">
      <!-- Status Card (Expanded Mode) -->
      <div v-if="!collapsed" class="p-2 rounded-lg bg-[#09265c]/85 border border-[#2058a5]/60 flex flex-col gap-1.5 text-[10.5px]">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981] animate-pulse"></span>
            <span class="text-slate-200 font-medium">系统守护</span>
          </div>
          <span class="text-[9px] px-1 py-0.2 rounded bg-emerald-950/80 border border-emerald-400/50 text-emerald-300 font-tech font-bold">在线</span>
        </div>

        <div class="flex items-center justify-between text-[9.5px] text-slate-400 pt-0.5 border-t border-[#184682]/40">
          <span>通信延迟</span>
          <span class="font-tech text-cyan-300 font-bold">3.8ms</span>
        </div>
        <div class="flex items-center justify-between text-[9.5px] text-slate-400">
          <span>在网节点</span>
          <span class="font-tech text-emerald-300 font-bold">37/37</span>
        </div>
      </div>

      <!-- Status Mini Icon (Collapsed Mode) -->
      <div v-else class="flex flex-col items-center justify-center py-1">
        <div class="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981] animate-pulse" title="系统运行正常 (37/37 在线)"></div>
      </div>

      <!-- Collapse / Expand toggle button -->
      <button
        @click="collapsed = !collapsed"
        :title="collapsed ? '展开导航栏' : '收起导航栏'"
        class="w-full flex items-center justify-center py-1.5 rounded-lg text-slate-300 hover:text-cyan-300 hover:bg-[#0f3878]/60 transition-colors text-xs gap-1.5 cursor-pointer"
      >
        <component :is="collapsed ? PanelLeftOpen : PanelLeftClose" class="w-4 h-4" />
        <span v-if="!collapsed" class="text-[11px] font-medium">收起导航</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import {
  LayoutGrid,
  Activity,
  Zap,
  ShieldAlert,
  SlidersHorizontal,
  BarChart3,
  History,
  FileText,
  Settings,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-vue-next';

const route = useRoute();
const collapsed = ref(false);

interface NavItem {
  path: string;
  label: string;
  icon: any;
  badge?: string;
  badgeColor?: 'amber' | 'emerald' | 'blue';
  dot?: boolean;
}

interface NavGroup {
  name: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    name: '主控监视',
    items: [
      { path: '/overview', label: '总览', icon: LayoutGrid },
      { path: '/realtime', label: '实时监测', icon: Activity, dot: true },
    ]
  },
  {
    name: '防御感知',
    items: [
      { path: '/warning', label: '雷电预警', icon: Zap, badge: '2', badgeColor: 'amber' },
      { path: '/electrostatic', label: '静电监测', icon: ShieldAlert },
      { path: '/devices', label: '设备管理', icon: SlidersHorizontal, badge: '37', badgeColor: 'blue' },
    ]
  },
  {
    name: '数据与运维',
    items: [
      { path: '/analytics', label: '数据分析', icon: BarChart3 },
      { path: '/history', label: '历史查询', icon: History },
      { path: '/reports', label: '报表中心', icon: FileText },
      { path: '/settings', label: '系统设置', icon: Settings },
    ]
  }
];

const isActive = (path: string) => {
  if (path === '/overview' && (route.path === '/' || route.path === '/overview')) {
    return true;
  }
  return route.path.startsWith(path);
};
</script>
