<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-5 h-5 rounded bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="5" y="3" width="14" height="18" rx="2" />
            <line x1="9" y1="8" x2="15" y2="8" />
          </svg>
        </div>
        <h2 class="text-base font-bold text-white tracking-wide">设备管理 · 防雷与静电硬件物联资产</h2>
      </div>

      <div class="flex items-center gap-2">
        <input
          v-model="searchQuery"
          placeholder="搜索设备名称、编号或位置..."
          class="px-3 py-1.5 text-xs bg-[#091e42] border border-[#1d4b92]/60 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-56"
        />
        <button
          @click="pingAllDevices"
          class="px-3 py-1.5 text-xs rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium"
        >
          全网轮询测试
        </button>
      </div>
    </div>

    <!-- Device Type Tabs -->
    <div class="flex items-center gap-2 border-b border-[#1b3d75]/50 pb-2 text-xs">
      <button
        v-for="cat in ['全部设备 (37)', 'SPD浪涌保护器 (12)', '大气电场仪 (3)', '地网监测仪 (4)', '静电传感器 (18)']"
        :key="cat"
        @click="activeCategory = cat"
        class="px-3 py-1.5 rounded-lg transition-all"
        :class="activeCategory === cat ? 'bg-[#1872f6] text-white font-semibold shadow' : 'text-slate-400 hover:text-slate-200 bg-[#091b3b]/60'"
      >
        {{ cat }}
      </button>
    </div>

    <!-- Device List Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
      <div
        v-for="dev in filteredDevices"
        :key="dev.id"
        class="tech-panel tech-panel-hover rounded-xl p-4 flex flex-col justify-between"
      >
        <div>
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-white tracking-wide">{{ dev.name }}</span>
            <span
              class="px-2 py-0.5 rounded text-[10px] font-medium"
              :class="dev.status === '正常' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' : 'bg-amber-950 text-amber-400 border border-amber-500/40'"
            >
              {{ dev.status }}
            </span>
          </div>
          <div class="text-[11px] text-slate-400 mt-1">编号: {{ dev.code }} · 安装位: {{ dev.location }}</div>
        </div>

        <div class="grid grid-cols-2 gap-2 my-3 py-2 border-y border-[#173868]/50 text-[11px]">
          <div>
            <span class="text-slate-500">协议: </span>
            <span class="text-slate-300 font-tech">{{ dev.protocol }}</span>
          </div>
          <div>
            <span class="text-slate-500">心跳: </span>
            <span class="text-cyan-300 font-tech">{{ dev.latency }}</span>
          </div>
          <div>
            <span class="text-slate-500">健康度: </span>
            <span class="text-emerald-400 font-tech font-bold">{{ dev.health }}%</span>
          </div>
          <div>
            <span class="text-slate-500">累计动作: </span>
            <span class="text-slate-200 font-tech">{{ dev.actions }} 次</span>
          </div>
        </div>

        <div class="flex items-center justify-between pt-1">
          <span class="text-[10px] text-slate-500">上次校验: {{ dev.lastCheck }}</span>
          <button
            @click="testDevice(dev.name)"
            class="px-2.5 py-1 rounded bg-[#102d5e] hover:bg-[#18448a] text-cyan-300 border border-cyan-500/30 text-[11px]"
          >
            设备自检
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const searchQuery = ref('');
const activeCategory = ref('全部设备 (37)');

const devices = ref([
  { id: '1', name: '总配电柜一级 SPD 浪涌终端', code: 'SPD-A01', location: '配电中心 1F', protocol: 'Modbus-RTU', latency: '2ms', health: 98, actions: 12, status: '正常', lastCheck: '2025-04-28' },
  { id: '2', name: 'AI算力柜二级精细 SPD 浪涌终端', code: 'SPD-B02', location: '机房A区 2F', protocol: 'Modbus-TCP', latency: '4ms', health: 99, actions: 3, status: '正常', lastCheck: '2025-04-29' },
  { id: '3', name: '外场高精大气电场仪', code: 'EFM-01', location: '园区气象塔顶', protocol: 'RS485/光纤', latency: '8ms', health: 97, actions: 0, status: '正常', lastCheck: '2025-04-25' },
  { id: '4', name: '地网高频连续电阻监测仪', code: 'GRM-01', location: '地网测试井 #1', protocol: 'LoRaWAN', latency: '15ms', health: 96, actions: 0, status: '正常', lastCheck: '2025-04-27' },
  { id: '5', name: '静电防护离子平衡度在线仪', code: 'ESD-M04', location: '设备间 B 区', protocol: 'TCP/IP', latency: '3ms', health: 95, actions: 1, status: '正常', lastCheck: '2025-04-29' },
  { id: '6', name: '双流向主动防雷截流控制器', code: 'ADL-01', location: '楼顶防雷基站', protocol: 'CAN总线', latency: '1ms', health: 100, actions: 2, status: '正常', lastCheck: '2025-04-28' },
]);

const filteredDevices = computed(() => {
  if (!searchQuery.value) return devices.value;
  return devices.value.filter(
    d => d.name.includes(searchQuery.value) || d.code.includes(searchQuery.value) || d.location.includes(searchQuery.value)
  );
});

const testDevice = (name: string) => {
  alert(`【已向设备发送自检指令】${name} 接收应答正常，传感器探针与内嵌保护芯片未见异常！`);
};

const pingAllDevices = () => {
  alert('全域 37 台物联防雷/静电硬件设备巡测完毕，100% 在线，平均延迟 4.2ms！');
};
</script>
