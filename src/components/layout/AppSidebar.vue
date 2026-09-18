<template>
  <aside class="w-44 flex-shrink-0 flex flex-col gap-1 p-2.5 bg-[#030919]/90 border-r border-[#102d5a]/60 select-none">
    <router-link
      v-for="item in navItems"
      :key="item.path"
      :to="item.path"
      class="group relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all duration-150"
      :class="[
        isActive(item.path)
          ? 'bg-gradient-to-r from-cyan-500/20 via-[#0a2f64]/40 to-transparent text-cyan-300 border-l-2 border-cyan-400 font-semibold shadow-[inset_0_1px_0_rgba(56,189,248,0.2)]'
          : 'text-slate-400 hover:text-slate-100 hover:bg-[#081f44]/40 font-medium border-l-2 border-transparent'
      ]"
    >
      <!-- Icon with custom glow on active -->
      <div
        class="w-4.5 h-4.5 flex items-center justify-center transition-transform group-hover:scale-105 flex-shrink-0"
        :class="isActive(item.path) ? 'text-cyan-400 drop-shadow-[0_0_6px_rgba(0,240,255,0.6)]' : 'text-slate-400 group-hover:text-cyan-300'"
      >
        <component :is="item.icon" class="w-4 h-4" />
      </div>

      <!-- Nav label -->
      <span class="tracking-wide whitespace-nowrap text-xs">{{ item.label }}</span>
    </router-link>
  </aside>
</template>

<script setup lang="ts">
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
  Settings
} from 'lucide-vue-next';

const route = useRoute();

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
