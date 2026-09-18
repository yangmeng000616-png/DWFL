<template>
  <aside
    class="flex-shrink-0 flex flex-col justify-between py-2.5 bg-[#071e49]/95 border-r border-[#1f569f]/75 select-none transition-all duration-200 shadow-md shadow-[#020b22]/40"
    :class="collapsed ? 'w-13 px-1.5' : 'w-32 px-2'"
  >
    <div class="flex flex-col gap-1">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        :title="collapsed ? item.label : ''"
        class="group relative flex items-center rounded-lg text-xs transition-all duration-150"
        :class="[
          collapsed ? 'justify-center py-2 px-1' : 'gap-2 px-2.5 py-1.5',
          isActive(item.path)
            ? 'bg-gradient-to-r from-cyan-500/30 via-[#13498f]/60 to-transparent text-cyan-200 border-l-2 border-cyan-400 font-semibold shadow-[inset_0_1px_0_rgba(56,189,248,0.3)]'
            : 'text-slate-300 hover:text-white hover:bg-[#0f3878]/50 font-medium border-l-2 border-transparent'
        ]"
      >
        <!-- Icon with custom glow on active -->
        <div
          class="w-4 h-4 flex items-center justify-center transition-transform group-hover:scale-105 flex-shrink-0"
          :class="isActive(item.path) ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(0,240,255,0.7)]' : 'text-slate-300 group-hover:text-cyan-300'"
        >
          <component :is="item.icon" class="w-4 h-4" />
        </div>

        <!-- Nav label -->
        <span v-if="!collapsed" class="tracking-wide whitespace-nowrap text-xs truncate">{{ item.label }}</span>
      </router-link>
    </div>

    <!-- Collapse / Expand toggle button at bottom -->
    <div class="pt-2 border-t border-[#1d4f94]/60">
      <button
        @click="collapsed = !collapsed"
        :title="collapsed ? '展开导航栏' : '收起导航栏'"
        class="w-full flex items-center justify-center py-1.5 rounded text-slate-300 hover:text-cyan-300 hover:bg-[#0f3878]/60 transition-colors text-xs gap-1 cursor-pointer"
      >
        <component :is="collapsed ? PanelLeftOpen : PanelLeftClose" class="w-4 h-4" />
        <span v-if="!collapsed" class="text-[11px]">收起导航</span>
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

const navItems = [
  { path: '/overview', label: '总览', icon: LayoutGrid },
  { path: '/realtime', label: '实时监测', icon: Activity },
  { path: '/warning', label: '雷电预警', icon: Zap },
  { path: '/electrostatic', label: '静电监测', icon: ShieldAlert },
  { path: '/devices', label: '设备管理', icon: SlidersHorizontal },
  { path: '/analytics', label: '数据分析', icon: BarChart3 },
  { path: '/history', label: '历史查询', icon: History },
  { path: '/reports', label: '报表中心', icon: FileText },
  { path: '/settings', label: '系统设置', icon: Settings },
];

const isActive = (path: string) => {
  if (path === '/overview' && (route.path === '/' || route.path === '/overview')) {
    return true;
  }
  return route.path.startsWith(path);
};
</script>
