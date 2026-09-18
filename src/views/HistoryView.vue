<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <div class="w-6 h-6 rounded bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <div>
          <h2 class="text-base font-bold text-white tracking-wide">历史查询 · 雷击暂态与环境事件审计台账</h2>
          <p class="text-xs text-slate-400">支持多源设备按时间周期、事件分类与严重性等级精细化检索溯源</p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-xs text-slate-400 font-tech">检索到 {{ filteredLogs.length }} 条审计记录</span>
        <button
          @click="exportCSV"
          class="px-3.5 py-1.5 text-xs rounded-lg bg-gradient-to-r from-[#0d2a58] to-[#123975] hover:from-[#133d7d] hover:to-[#1a4f9e] border border-cyan-500/50 text-cyan-300 font-medium shadow-[0_0_12px_rgba(0,240,255,0.2)] flex items-center gap-1.5 transition-all"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>导出日志 (CSV)</span>
        </button>
      </div>
    </div>

    <!-- Filter Toolbar -->
    <div class="tech-panel rounded-xl p-3.5 flex flex-wrap items-center gap-4 text-xs">
      <div class="flex items-center gap-2">
        <span class="text-slate-400 font-medium">设备分类:</span>
        <select
          v-model="selectedDevice"
          class="bg-[#091e42] border border-[#1d4b92]/70 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-400"
        >
          <option value="全部">全部监测设备</option>
          <option value="大气电场仪">大气电场仪</option>
          <option value="双流向主动防雷">双流向主动防雷</option>
          <option value="SPD监测终端">智能SPD防雷器</option>
          <option value="接地电阻监测">地网接地电阻</option>
          <option value="静电终端">静电环境监测</option>
        </select>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-slate-400 font-medium">时间跨度:</span>
        <select
          v-model="selectedTime"
          class="bg-[#091e42] border border-[#1d4b92]/70 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-400"
        >
          <option value="全部">全部时间段</option>
          <option value="今日">今日 (2025-04-29)</option>
          <option value="近7天">近7天</option>
          <option value="本月">2025年4月 (本月)</option>
          <option value="上月">2025年3月</option>
        </select>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-slate-400 font-medium">告警等级:</span>
        <select
          v-model="selectedLevel"
          class="bg-[#091e42] border border-[#1d4b92]/70 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-400"
        >
          <option value="全部">全部告警等级</option>
          <option value="红色">一级红色 (严重/高风险)</option>
          <option value="橙色">二级橙色 (预警/处置中)</option>
          <option value="黄色">三级黄色 (需要关注)</option>
          <option value="蓝色">四级蓝色 (信息提示)</option>
          <option value="绿色">五级绿色 (自检正常)</option>
        </select>
      </div>

      <button
        @click="resetFilters"
        class="px-3 py-1.5 rounded-lg bg-[#0e2752] hover:bg-[#163b78] border border-cyan-500/30 text-slate-300 text-xs transition-colors ml-auto"
      >
        重置筛选
      </button>
    </div>

    <!-- Log Table -->
    <div class="tech-panel rounded-xl p-4 overflow-x-auto">
      <table class="w-full text-left text-xs border-collapse">
        <thead>
          <tr class="text-slate-400 border-b border-[#1b3d75]/50 pb-2">
            <th class="py-2.5 px-3 font-medium">事件编号</th>
            <th class="py-2.5 px-3 font-medium">记录时间</th>
            <th class="py-2.5 px-3 font-medium">关联设备</th>
            <th class="py-2.5 px-3 font-medium">事件详情描述</th>
            <th class="py-2.5 px-3 font-medium text-center">等级</th>
            <th class="py-2.5 px-3 font-medium">测量指标</th>
            <th class="py-2.5 px-3 font-medium">防御与自愈反馈</th>
            <th class="py-2.5 px-3 font-medium text-right">暂态波形</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#132e58]/50">
          <tr
            v-for="item in filteredLogs"
            :key="item.id"
            class="hover:bg-[#0f2c62]/50 transition-colors"
          >
            <td class="py-3 px-3 font-tech text-cyan-300 font-semibold whitespace-nowrap">{{ item.id }}</td>
            <td class="py-3 px-3 font-tech text-slate-300 whitespace-nowrap">{{ item.time }}</td>
            <td class="py-3 px-3 text-cyan-200 font-medium whitespace-nowrap">{{ item.device }}</td>
            <td class="py-3 px-3 text-slate-100">{{ item.desc }}</td>
            <td class="py-3 px-3 text-center whitespace-nowrap">
              <span class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold" :class="item.levelClass">
                {{ item.level }}
              </span>
            </td>
            <td class="py-3 px-3 font-tech text-cyan-300 font-semibold whitespace-nowrap">{{ item.value }}</td>
            <td class="py-3 px-3 text-emerald-400">{{ item.response }}</td>
            <td class="py-3 px-3 text-right whitespace-nowrap">
              <button
                @click="openWaveformModal(item)"
                class="px-2.5 py-1 rounded bg-[#133772] hover:bg-[#1c4e9e] text-cyan-300 border border-cyan-500/40 text-[11px] transition-colors"
              >
                波形回放
              </button>
            </td>
          </tr>

          <tr v-if="filteredLogs.length === 0">
            <td colspan="8" class="py-12 text-center text-slate-400 text-sm">
              未找到匹配筛选条件的暂态事件审计记录
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Waveform Playback Modal -->
    <div
      v-if="activeWaveformItem"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      @click.self="activeWaveformItem = null"
    >
      <div class="w-full max-w-2xl bg-[#06173a] border border-cyan-400/80 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.3)] overflow-hidden flex flex-col">
        <!-- Modal Top -->
        <div class="px-6 py-4 bg-gradient-to-r from-[#0b2452] to-[#06173a] border-b border-cyan-500/40 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/60 flex items-center justify-center text-cyan-300">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <div>
              <h3 class="text-sm font-bold text-white">
                暂态电涌波形回放 · {{ activeWaveformItem.id }}
              </h3>
              <p class="text-xs text-slate-400 font-tech">
                采样时间: {{ activeWaveformItem.time }} · 采样率: 100MHz 宽带数字示波模块
              </p>
            </div>
          </div>
          <button
            @click="activeWaveformItem = null"
            class="w-7 h-7 rounded bg-[#0d2a5a] text-slate-300 hover:text-white flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        <!-- Oscilloscope Screen -->
        <div class="p-6 space-y-4 text-xs">
          <div class="bg-[#020b1c] rounded-xl p-4 border border-cyan-500/50 shadow-inner">
            <div class="flex items-center justify-between text-[11px] text-slate-400 font-tech mb-2">
              <span>CH-1: 8/20μs 暂态放电波形 (标称峰值: {{ activeWaveformItem.value }})</span>
              <span class="text-emerald-400">电离击穿点捕获正常</span>
            </div>

            <!-- SVG Waveform -->
            <div class="h-44 w-full relative">
              <svg class="w-full h-full" viewBox="0 0 500 160">
                <!-- Grid background -->
                <defs>
                  <pattern id="oscGrid" width="50" height="32" patternUnits="userSpaceOnUse">
                    <path d="M 50 0 L 0 0 0 32" fill="none" stroke="#0a2a5e" stroke-width="0.7" />
                  </pattern>
                </defs>
                <rect width="500" height="160" fill="url(#oscGrid)" />
                <line x1="0" y1="130" x2="500" y2="130" stroke="#1b4582" stroke-width="1.5" />

                <!-- Wave curve -->
                <path
                  d="M 20 130 
                     L 80 130 
                     L 130 20 
                     L 160 35 
                     L 220 75 
                     L 300 110 
                     L 400 126 
                     L 480 130"
                  fill="none"
                  stroke="#00f0ff"
                  stroke-width="2.5"
                  filter="drop-shadow(0 0 8px #00f0ff)"
                />

                <!-- Wave Peak Point Marker -->
                <circle cx="130" cy="20" r="4.5" fill="#f59e0b" />
                <text x="140" y="25" fill="#f59e0b" font-family="'Chakra Petch', sans-serif" font-size="11">
                  Peak: {{ activeWaveformItem.value }}
                </text>

                <!-- Time parameters -->
                <text x="80" y="148" fill="#64748b" font-size="9" font-family="'Chakra Petch', sans-serif">T0=0μs</text>
                <text x="130" y="148" fill="#64748b" font-size="9" font-family="'Chakra Petch', sans-serif">T1=8.2μs</text>
                <text x="220" y="148" fill="#64748b" font-size="9" font-family="'Chakra Petch', sans-serif">T2=20.4μs</text>
              </svg>
            </div>
          </div>

          <!-- Technical Metrics Grid -->
          <div class="grid grid-cols-3 gap-3 font-tech">
            <div class="bg-[#091f46] p-2.5 rounded-lg border border-[#1c4580]">
              <div class="text-[11px] text-slate-400 font-sans">波前上升时间 (T1)</div>
              <div class="text-sm font-bold text-cyan-300 mt-1">8.2 μs (国标合规)</div>
            </div>
            <div class="bg-[#091f46] p-2.5 rounded-lg border border-[#1c4580]">
              <div class="text-[11px] text-slate-400 font-sans">半峰值衰减时间 (T2)</div>
              <div class="text-sm font-bold text-cyan-300 mt-1">20.4 μs</div>
            </div>
            <div class="bg-[#091f46] p-2.5 rounded-lg border border-[#1c4580]">
              <div class="text-[11px] text-slate-400 font-sans">地电位瞬态抬升峰值</div>
              <div class="text-sm font-bold text-emerald-400 mt-1">0.14 V (安全裕度大)</div>
            </div>
          </div>

          <div class="flex items-center justify-between pt-2">
            <span class="text-slate-400 text-xs">防御处置结论: {{ activeWaveformItem.response }}</span>
            <button
              @click="activeWaveformItem = null"
              class="px-4 py-1.5 rounded-lg bg-[#143166] hover:bg-[#1d4691] text-slate-200 transition-colors"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface HistoryItem {
  id: string;
  time: string;
  device: string;
  desc: string;
  level: string;
  levelClass: string;
  value: string;
  response: string;
}

const selectedDevice = ref('全部');
const selectedTime = ref('全部');
const selectedLevel = ref('全部');

const activeWaveformItem = ref<HistoryItem | null>(null);

const historyLogs = ref<HistoryItem[]>([
  {
    id: 'EV-20250429-01',
    time: '2025-04-29 14:32:10',
    device: 'SPD监测终端',
    desc: '总配电柜SPD压敏电阻漏电流微幅上升至 18.2µA',
    level: '黄色',
    levelClass: 'bg-amber-950 text-amber-300 border border-amber-500/50',
    value: '18.2 µA',
    response: '触发预防性维护工单，器件性能衰减指标可控'
  },
  {
    id: 'EV-20250429-02',
    time: '2025-04-29 12:36:44',
    device: '双流向主动防雷',
    desc: '主建筑天面捕获雷击先导，双流向截流消能装置主动提前放电',
    level: '橙色',
    levelClass: 'bg-orange-950 text-orange-300 border border-orange-500/50',
    value: '58.7 kA',
    response: '主动等电位均压泄流完成，算力主机房零过电压冲击'
  },
  {
    id: 'EV-20250429-03',
    time: '2025-04-29 11:15:02',
    device: '接地电阻监测',
    desc: '外场地网基准井电阻因地表干燥瞬时升至 0.88Ω',
    level: '橙色',
    levelClass: 'bg-orange-950 text-orange-300 border border-orange-500/50',
    value: '0.88 Ω',
    response: '地网活性离子灌注泵自愈启动，阻值快速降至 0.52Ω'
  },
  {
    id: 'EV-20250429-04',
    time: '2025-04-29 08:47:19',
    device: '静电终端',
    desc: '主机房A01列冷通道微环境静电电位偏高',
    level: '黄色',
    levelClass: 'bg-amber-950 text-amber-300 border border-amber-500/50',
    value: '1.45 kV',
    response: '微环境离子风机增容运行，已平稳回落至 0.8kV'
  },
  {
    id: 'EV-20250428-05',
    time: '2025-04-28 22:16:30',
    device: 'SPD监测终端',
    desc: '外部电网微秒级雷电感应过电压毛刺冲击',
    level: '绿色',
    levelClass: 'bg-emerald-950 text-emerald-300 border border-emerald-500/50',
    value: '420 V / 1.2kA',
    response: '二级SPD瞬态钳位吸收，母线输出电压波形平滑正常'
  },
  {
    id: 'EV-20250428-06',
    time: '2025-04-28 16:04:12',
    device: '大气电场仪',
    desc: '雷暴云团过境雷电先导电场梯度达到 14.8 kV/m',
    level: '蓝色',
    levelClass: 'bg-blue-950 text-blue-300 border border-blue-500/50',
    value: '14.8 kV/m',
    response: '联动触发算力中心雷电三级黄色防御响应态势'
  },
  {
    id: 'EV-20250427-07',
    time: '2025-04-27 10:20:15',
    device: '双流向主动防雷',
    desc: '全系统防雷引下线通道高频阻抗自检',
    level: '绿色',
    levelClass: 'bg-emerald-950 text-emerald-300 border border-emerald-500/50',
    value: '0.04 Ω',
    response: '自检回路闭合导通良好，各项物理指标优级'
  }
]);

const filteredLogs = computed(() => {
  return historyLogs.value.filter(item => {
    // Device Filter
    if (selectedDevice.value !== '全部' && item.device !== selectedDevice.value) {
      return false;
    }
    // Level Filter
    if (selectedLevel.value !== '全部' && !item.level.includes(selectedLevel.value)) {
      return false;
    }
    // Time Filter
    if (selectedTime.value === '今日' && !item.time.startsWith('2025-04-29')) {
      return false;
    }
    if (selectedTime.value === '本月' && !item.time.startsWith('2025-04')) {
      return false;
    }
    return true;
  });
});

const resetFilters = () => {
  selectedDevice.value = '全部';
  selectedTime.value = '全部';
  selectedLevel.value = '全部';
};

const openWaveformModal = (item: HistoryItem) => {
  activeWaveformItem.value = item;
};

const exportCSV = () => {
  const headers = ['事件编号', '记录时间', '关联设备', '事件描述', '等级', '测量指标', '防御反馈'];
  const rows = filteredLogs.value.map(item => [
    item.id,
    item.time,
    item.device,
    `"${item.desc}"`,
    item.level,
    `"${item.value}"`,
    `"${item.response}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `算力中心雷电静电历史审计台账_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
</script>
