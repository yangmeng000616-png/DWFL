<template>
  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2">
    <!-- Bottom Card 1: 监测趋势联动分析 -->
    <div class="tech-panel rounded-xl py-2 px-2.5 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      <div class="flex items-center justify-between pb-1.5 border-b border-[#184682]/60">
        <div class="flex items-center gap-1.5">
          <div class="w-5 h-5 rounded-md bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_6px_rgba(6,182,212,0.3)]">
            <svg class="w-3 h-3 fill-current" viewBox="0 0 24 24">
              <path d="M13 2L3 14h8l-1 8 11-12h-8l1-8z" />
            </svg>
          </div>
          <h3 class="text-xs sm:text-sm font-bold text-white tracking-wide">多参数趋势联动</h3>
        </div>

        <!-- Metric Switcher -->
        <div class="flex items-center bg-[#092960]/90 p-0.5 rounded-md border border-[#2461b2]/70 text-xs">
          <button
            v-for="m in metricChannels"
            :key="m.id"
            @click="activeMetric = m.id"
            class="px-1.5 py-0.2 rounded transition-all font-medium text-[10px] cursor-pointer"
            :class="activeMetric === m.id ? 'bg-gradient-to-r from-[#217bf8] to-[#00a6ff] text-white font-semibold shadow-[0_0_8px_rgba(33,123,248,0.6)]' : 'text-slate-300 hover:text-white'"
          >
            {{ m.label }}
          </button>
        </div>
      </div>

      <!-- Trend Chart with Realtime Dynamic Values -->
      <div class="relative mt-1 flex-1 flex flex-col justify-between">
        <div class="flex items-center justify-between text-[11px] text-slate-300 mb-0.5">
          <span>{{ currentMetricConfig.unitLabel }}</span>
          <span class="font-tech text-cyan-300 font-semibold bg-cyan-950/70 border border-cyan-500/30 px-1.5 py-0.2 rounded text-[10px]">
            当前: {{ currentMetricConfig.currentVal }}
          </span>
        </div>
        <div class="h-[74px] w-full">
          <svg class="w-full h-full overflow-visible" viewBox="0 0 320 90" preserveAspectRatio="none">
            <defs>
              <linearGradient id="trendCyanGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#00f0ff" stop-opacity="0.45" />
                <stop offset="100%" stop-color="#0284c7" stop-opacity="0.0" />
              </linearGradient>
            </defs>

            <!-- Horizontal Grid lines -->
            <line x1="25" y1="12" x2="310" y2="12" stroke="#1d4d8c" stroke-dasharray="2 2" />
            <line x1="25" y1="38" x2="310" y2="38" stroke="#1d4d8c" stroke-dasharray="2 2" />
            <line x1="25" y1="64" x2="310" y2="64" stroke="#1d4d8c" stroke-dasharray="2 2" />

            <!-- Y-Axis ticks -->
            <text x="20" y="15" fill="#94a3b8" font-size="9" text-anchor="end" font-family="'Chakra Petch', sans-serif">
              {{ currentMetricConfig.yMax }}
            </text>
            <text x="20" y="41" fill="#94a3b8" font-size="9" text-anchor="end" font-family="'Chakra Petch', sans-serif">
              {{ currentMetricConfig.yMid }}
            </text>
            <text x="20" y="67" fill="#94a3b8" font-size="9" text-anchor="end" font-family="'Chakra Petch', sans-serif">
              {{ currentMetricConfig.yMin }}
            </text>

            <!-- Trend Area & Stroke -->
            <path :d="currentMetricConfig.areaPath" fill="url(#trendCyanGrad)" />
            <path :d="currentMetricConfig.strokePath" fill="none" stroke="#00f0ff" stroke-width="2" />

            <!-- X-Axis time labels -->
            <text x="35" y="84" fill="#64748b" font-size="8.5" text-anchor="middle" font-family="'Chakra Petch', sans-serif">00:00</text>
            <text x="100" y="84" fill="#64748b" font-size="8.5" text-anchor="middle" font-family="'Chakra Petch', sans-serif">06:00</text>
            <text x="170" y="84" fill="#64748b" font-size="8.5" text-anchor="middle" font-family="'Chakra Petch', sans-serif">12:00</text>
            <text x="240" y="84" fill="#64748b" font-size="8.5" text-anchor="middle" font-family="'Chakra Petch', sans-serif">18:00</text>
            <text x="300" y="84" fill="#64748b" font-size="8.5" text-anchor="middle" font-family="'Chakra Petch', sans-serif">24:00</text>
          </svg>
        </div>
      </div>

      <!-- Bottom Parameter Telemetry Breakdown -->
      <div class="mt-1 pt-1.5 border-t border-[#184682]/60 grid grid-cols-3 gap-1 text-center">
        <div class="py-1 px-1 rounded bg-[#0a285e]/85 border border-[#235eae]/60">
          <div class="text-[9px] text-slate-300 truncate font-medium">{{ currentMetricConfig.stat1Label }}</div>
          <div class="mt-0.5 font-tech font-bold text-[10px] text-cyan-300 whitespace-nowrap">{{ currentMetricConfig.stat1Val }}</div>
        </div>
        <div class="py-1 px-1 rounded bg-[#0a285e]/85 border border-[#235eae]/60">
          <div class="text-[9px] text-slate-300 truncate font-medium">{{ currentMetricConfig.stat2Label }}</div>
          <div class="mt-0.5 font-tech font-bold text-[10px] text-white whitespace-nowrap">{{ currentMetricConfig.stat2Val }}</div>
        </div>
        <div class="py-1 px-1 rounded bg-[#0a285e]/85 border border-[#235eae]/60">
          <div class="text-[9px] text-slate-300 truncate font-medium">{{ currentMetricConfig.stat3Label }}</div>
          <div class="mt-0.5 flex items-center justify-center gap-1 text-emerald-300 font-bold text-[10px] whitespace-nowrap">
            <span class="w-1 h-1 rounded-full bg-emerald-400"></span>
            {{ currentMetricConfig.stat3Val }}
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Card 2: 设备运行状态 -->
    <div class="tech-panel rounded-xl py-2 px-2.5 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      <div class="flex items-center justify-between pb-1.5 border-b border-[#215caa]/70">
        <div class="flex items-center gap-1.5">
          <div class="w-5 h-5 rounded-md bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300 shadow-[0_0_6px_rgba(59,130,246,0.3)]">
            <svg class="w-3 h-3 fill-current" viewBox="0 0 24 24">
              <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
            </svg>
          </div>
          <h3 class="text-xs sm:text-sm font-bold text-white tracking-wide">设备在线与健康度</h3>
        </div>
        <span class="text-[11px] text-slate-300 font-tech">在线率 100%</span>
      </div>

      <!-- 2x2 Device Grid with Circular Ring Progress Gauges (Clickable to inspect) -->
      <div class="grid grid-cols-2 gap-1.5 my-1 flex-1">
        <div
          v-for="dev in deviceHealthList"
          :key="dev.id"
          @click="openDeviceInspection(dev.id)"
          class="bg-[#0a285e]/85 hover:bg-[#123877] border border-[#235eae]/60 hover:border-cyan-400/70 rounded-lg p-1.5 flex items-center justify-between cursor-pointer transition-all duration-200 group shadow-sm hover:shadow-[0_0_12px_rgba(0,240,255,0.25)]"
          :title="`点击查看${dev.name}详情`"
        >
          <!-- Left device meta info -->
          <div class="flex flex-col justify-between">
            <div>
              <div class="text-[11px] text-slate-200 group-hover:text-white font-medium flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]"></span>
                <span class="truncate">{{ dev.name }}</span>
              </div>
              <div class="text-[10px] text-slate-400 mt-0.5">
                在线 <span class="font-tech text-white font-bold">{{ dev.online }}</span> / {{ dev.total }}
              </div>
            </div>
            <div class="mt-0.5">
              <span class="px-1.5 py-0.2 rounded bg-emerald-950/80 border border-emerald-400/50 text-[9px] font-medium text-emerald-300">
                {{ dev.status }}
              </span>
            </div>
          </div>

          <!-- Right: Circular Ring Gauge (圆环) -->
          <div class="relative w-10 h-10 flex-shrink-0 flex items-center justify-center">
            <svg class="w-full h-full -rotate-90" viewBox="0 0 44 44">
              <!-- Base Track -->
              <circle cx="22" cy="22" r="16" fill="none" stroke="#0d3063" stroke-width="3" />
              <!-- Outer Dashed Tick Ring -->
              <circle cx="22" cy="22" r="20" fill="none" stroke="#1d4d8c" stroke-width="0.8" stroke-dasharray="2 3" opacity="0.5" />
              <!-- Progress Ring -->
              <circle
                cx="22"
                cy="22"
                r="16"
                fill="none"
                :stroke="dev.color"
                stroke-width="3"
                stroke-dasharray="100.5"
                :stroke-dashoffset="100.5 * (1 - dev.online / dev.total)"
                stroke-linecap="round"
                class="transition-all duration-500"
                :style="{ filter: `drop-shadow(0 0 5px ${dev.color}99)` }"
              />
            </svg>
            <!-- Center Percent & Status in Ring -->
            <div class="absolute inset-0 flex flex-col items-center justify-center font-tech leading-none pointer-events-none">
              <span class="text-[10px] font-bold text-white tracking-tighter">
                {{ Math.round((dev.online / dev.total) * 100) }}%
              </span>
              <span class="text-[7px] text-cyan-300 font-sans scale-90 mt-0.2">在网</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Device Health Summary Strip -->
      <div class="mt-1 pt-1.5 border-t border-[#184682]/60 grid grid-cols-3 gap-1 text-center">
        <div class="py-0.5 px-1 rounded bg-[#0a285e]/85 border border-[#235eae]/50">
          <div class="text-[9px] text-slate-400">在网总设备</div>
          <div class="font-tech text-[10px] text-cyan-300 font-bold">37 台/套</div>
        </div>
        <div class="py-0.5 px-1 rounded bg-[#0a285e]/85 border border-[#235eae]/50">
          <div class="text-[9px] text-slate-400">设备健康度</div>
          <div class="font-tech text-[10px] text-emerald-400 font-bold">100 分</div>
        </div>
        <div class="py-0.5 px-1 rounded bg-[#0a285e]/85 border border-[#235eae]/50">
          <div class="text-[9px] text-slate-400">巡检机制</div>
          <div class="font-tech text-[10px] text-white font-bold">自适应闭环</div>
        </div>
      </div>
    </div>

    <!-- Bottom Card 3: 运行数据统计 -->
    <div class="tech-panel rounded-xl py-2 px-2.5 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      <div class="flex items-center justify-between pb-1.5 border-b border-[#215caa]/70">
        <div class="flex items-center gap-1.5">
          <div class="w-5 h-5 rounded-md bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shadow-[0_0_6px_rgba(99,102,241,0.3)]">
            <svg class="w-3 h-3 fill-current" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
            </svg>
          </div>
          <h3 class="text-xs sm:text-sm font-bold text-white tracking-wide">运行数据统计</h3>
        </div>

        <!-- Time Range Selector -->
        <div class="flex items-center bg-[#092960]/90 p-0.5 rounded-md border border-[#2461b2]/70 text-xs">
          <button
            v-for="t in ['今日', '本周', '本月']"
            :key="t"
            @click="statsPeriod = t"
            class="px-1.5 py-0.2 rounded transition-all font-medium text-[10px] cursor-pointer"
            :class="statsPeriod === t ? 'bg-gradient-to-r from-[#217bf8] to-[#00a6ff] text-white font-semibold' : 'text-slate-300 hover:text-white'"
          >
            {{ t }}
          </button>
        </div>
      </div>

      <!-- 2x2 Metric Stat Boxes with Visual Telemetry -->
      <div class="grid grid-cols-2 gap-1.5 my-1 flex-1">
        <!-- Box 1: 雷击事件计数 -->
        <div class="bg-[#0a285e]/85 hover:bg-[#123877] border border-[#235eae]/60 rounded-lg p-1.5 px-2 flex items-center justify-between transition-colors group">
          <div class="flex flex-col justify-between">
            <div class="text-[10px] text-slate-300 group-hover:text-white font-medium flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              <span>雷击事件计数</span>
            </div>
            <div class="text-sm font-bold font-tech text-white my-0.2">
              {{ currentPeriodData.lightningCount }} <span class="text-[10px] font-sans text-slate-400 font-normal">次</span>
            </div>
            <div>
              <span class="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.2 rounded bg-emerald-950/80 border border-emerald-400/40 text-emerald-300 font-medium">
                {{ currentPeriodData.lightningDiff }}
              </span>
            </div>
          </div>
          <!-- Spark bars visualization -->
          <div class="flex items-end gap-0.5 h-7 px-1 py-0.5 bg-[#071d44]/80 border border-[#1b4b88]/60 rounded flex-shrink-0">
            <div
              v-for="(h, idx) in currentPeriodData.bars"
              :key="idx"
              class="w-1 rounded-t transition-all duration-300"
              :class="idx === 2 ? 'bg-amber-400 shadow-[0_0_6px_#f59e0b]' : 'bg-cyan-400/60'"
              :style="{ height: `${h}%` }"
            ></div>
          </div>
        </div>

        <!-- Box 2: 峰值泄流电流 -->
        <div class="bg-[#0a285e]/85 hover:bg-[#123877] border border-[#235eae]/60 rounded-lg p-1.5 px-2 flex items-center justify-between transition-colors group">
          <div class="flex flex-col justify-between">
            <div class="text-[10px] text-slate-300 group-hover:text-white font-medium flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              <span>峰值泄流电流</span>
            </div>
            <div class="text-sm font-bold font-tech text-cyan-300 my-0.2">
              {{ currentPeriodData.maxCurrent }} <span class="text-[10px] font-sans text-slate-400 font-normal">kA</span>
            </div>
            <div>
              <span class="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.2 rounded bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 font-medium">
                截获率 100%
              </span>
            </div>
          </div>
          <!-- Circular Arc / Gauge -->
          <div class="relative w-9 h-9 flex-shrink-0 flex items-center justify-center">
            <svg class="w-full h-full -rotate-90" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="14" fill="none" stroke="#0d3063" stroke-width="2.8" />
              <circle
                cx="20"
                cy="20"
                r="14"
                fill="none"
                stroke="#00f0ff"
                stroke-width="2.8"
                stroke-dasharray="87.96"
                :stroke-dashoffset="87.96 * (1 - Math.min(currentPeriodData.maxCurrent, 100) / 100)"
                stroke-linecap="round"
                class="drop-shadow-[0_0_5px_rgba(0,240,255,0.8)]"
              />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center font-tech text-[8px] text-cyan-300 font-bold">
              {{ Math.round(currentPeriodData.maxCurrent) }}%
            </div>
          </div>
        </div>

        <!-- Box 3: 静电超限告警 -->
        <div class="bg-[#0a285e]/85 hover:bg-[#123877] border border-[#235eae]/60 rounded-lg p-1.5 px-2 flex items-center justify-between transition-colors group">
          <div class="flex flex-col justify-between">
            <div class="text-[10px] text-slate-300 group-hover:text-white font-medium flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>静电超限告警</span>
            </div>
            <div class="text-sm font-bold font-tech text-white my-0.2">
              {{ currentPeriodData.esdAlerts }} <span class="text-[10px] font-sans text-slate-400 font-normal">次</span>
            </div>
            <div>
              <span class="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.2 rounded bg-emerald-950/80 border border-emerald-400/40 text-emerald-300 font-medium">
                <span class="w-1 h-1 rounded-full bg-emerald-400 shadow-[0_0_4px_#10b981]"></span> 平稳受控
              </span>
            </div>
          </div>
          <!-- Shield Badge -->
          <div class="w-8 h-8 rounded-md bg-emerald-950/60 border border-emerald-500/40 flex flex-col items-center justify-center text-emerald-300 shadow-[0_0_6px_rgba(16,185,129,0.25)] flex-shrink-0">
            <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span class="text-[7px] font-mono text-emerald-400 font-bold leading-none mt-0.2">SAFE</span>
          </div>
        </div>

        <!-- Box 4: 设备主动维保 -->
        <div class="bg-[#0a285e]/85 hover:bg-[#123877] border border-[#235eae]/60 rounded-lg p-1.5 px-2 flex items-center justify-between transition-colors group">
          <div class="flex flex-col justify-between">
            <div class="text-[10px] text-slate-300 group-hover:text-white font-medium flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
              <span>设备主动维保</span>
            </div>
            <div class="text-sm font-bold font-tech text-white my-0.2">
              {{ currentPeriodData.maintenanceCount }} <span class="text-[10px] font-sans text-slate-400 font-normal">次</span>
            </div>
            <div>
              <span class="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.2 rounded bg-indigo-950/80 border border-indigo-400/40 text-indigo-300 font-medium">
                已处置闭环
              </span>
            </div>
          </div>
          <!-- Closed Loop Badge -->
          <div class="w-8 h-8 rounded-md bg-indigo-950/60 border border-indigo-400/40 flex flex-col items-center justify-center text-indigo-300 shadow-[0_0_6px_rgba(99,102,241,0.25)] flex-shrink-0">
            <svg class="w-3.5 h-3.5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span class="text-[7px] font-mono text-indigo-300 font-bold leading-none mt-0.2">CLOSED</span>
          </div>
        </div>
      </div>

      <!-- Bottom Statistical Energy & Archive Ribbon -->
      <div class="mt-1 pt-1.5 border-t border-[#184682]/60 grid grid-cols-3 gap-1 text-center">
        <div class="py-0.5 px-1 rounded bg-[#0a285e]/85 border border-[#235eae]/50">
          <div class="text-[9px] text-slate-400">泄放总能量</div>
          <div class="font-tech text-[10px] text-cyan-300 font-bold">{{ currentPeriodData.absorbedEnergy }}</div>
        </div>
        <div class="py-0.5 px-1 rounded bg-[#0a285e]/85 border border-[#235eae]/50">
          <div class="text-[9px] text-slate-400">防护拦截率</div>
          <div class="font-tech text-[10px] text-emerald-400 font-bold">100.0%</div>
        </div>
        <div class="py-0.5 px-1 rounded bg-[#0a285e]/85 border border-[#235eae]/50">
          <div class="text-[9px] text-slate-400">报表归档</div>
          <div class="font-tech text-[10px] text-white font-bold">自动闭环</div>
        </div>
      </div>
    </div>

    <!-- Bottom Card 4: 系统综合可用度 -->
    <div class="tech-panel rounded-xl py-2 px-2.5 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      <!-- Card Header with SLA & Status Badge -->
      <div class="flex items-center justify-between pb-1.5 border-b border-[#215caa]/70">
        <div class="flex items-center gap-1.5">
          <div class="w-5 h-5 rounded-md bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-[0_0_6px_rgba(16,185,129,0.3)]">
            <svg class="w-3 h-3 fill-current" viewBox="0 0 24 24">
              <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
            </svg>
          </div>
          <h3 class="text-xs sm:text-sm font-bold text-white tracking-wide">系统综合可用度</h3>
        </div>

        <!-- MTBF & SLA Badge in Header -->
        <div class="flex items-center gap-1 bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-[10px] px-1.5 py-0.2 rounded font-mono">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981] animate-pulse"></span>
          <span>SLA 99.999%</span>
        </div>
      </div>

      <!-- Main Body: Dual-Track Gauge + 5 Structured High-Tech Micro-Cards -->
      <div class="flex items-center gap-2 my-1 flex-1">
        <!-- Left: Enhanced Radial Gauge with Outer Tick Ring -->
        <div class="flex flex-col items-center justify-center w-20 flex-shrink-0">
          <div class="relative w-16 h-16 flex items-center justify-center">
            <svg class="w-full h-full -rotate-90" viewBox="0 0 80 80">
              <!-- Background Track -->
              <circle cx="40" cy="40" r="32" fill="none" stroke="#0d3063" stroke-width="5" />
              <!-- Outer Accent Tick Ring -->
              <circle cx="40" cy="40" r="37" fill="none" stroke="#1d4d8c" stroke-width="0.8" stroke-dasharray="3 3" opacity="0.6" />
              <!-- Active Progress Track with Glowing Emerald -->
              <circle
                cx="40"
                cy="40"
                r="32"
                fill="none"
                stroke="#00e5a3"
                stroke-width="5"
                stroke-dasharray="201"
                stroke-dashoffset="2"
                stroke-linecap="round"
                class="drop-shadow-[0_0_8px_rgba(0,229,163,0.9)]"
              />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span class="text-sm font-bold font-tech text-white tracking-tight">99.8%</span>
              <span class="text-[8px] text-[#00e5a3] font-semibold bg-[#00e5a3]/10 px-1 py-0.2 rounded border border-[#00e5a3]/30">稳定运行</span>
            </div>
          </div>
          <div class="text-[9px] text-slate-300 font-mono text-center mt-0.5">
            无故障 <span class="text-cyan-300 font-bold">342</span> 天
          </div>
        </div>

        <!-- Right: 5 Structured High-Tech Micro-Cards with Real Param Readings -->
        <div class="flex flex-col gap-0.5 text-xs flex-1 min-w-0">
          <div class="bg-[#0a285e]/80 hover:bg-[#123877] border border-[#235eae]/60 rounded px-1.5 py-0.5 flex items-center justify-between transition-colors">
            <div class="flex items-center gap-1 truncate">
              <span class="w-1 h-1 rounded-full bg-[#00e5a3] shadow-[0_0_4px_#00e5a3] flex-shrink-0"></span>
              <span class="text-slate-200 truncate text-[10px]">空间雷电感知链</span>
            </div>
            <div class="flex items-center gap-1 flex-shrink-0">
              <span class="font-tech text-cyan-300 font-bold text-[10px]">99.9%</span>
              <span class="text-[9px] px-1 py-0.1 rounded bg-emerald-950/80 border border-emerald-400/50 text-emerald-300 font-medium">在线</span>
            </div>
          </div>

          <div class="bg-[#0a285e]/80 hover:bg-[#123877] border border-[#235eae]/60 rounded px-1.5 py-0.5 flex items-center justify-between transition-colors">
            <div class="flex items-center gap-1 truncate">
              <span class="w-1 h-1 rounded-full bg-[#00e5a3] shadow-[0_0_4px_#00e5a3] flex-shrink-0"></span>
              <span class="text-slate-200 truncate text-[10px]">机房微环境屏蔽</span>
            </div>
            <div class="flex items-center gap-1 flex-shrink-0">
              <span class="font-tech text-white font-bold text-[10px]">-62dB</span>
              <span class="text-[9px] px-1 py-0.1 rounded bg-emerald-950/80 border border-emerald-400/50 text-emerald-300 font-medium">优良</span>
            </div>
          </div>

          <div class="bg-[#0a285e]/80 hover:bg-[#123877] border border-[#235eae]/60 rounded px-1.5 py-0.5 flex items-center justify-between transition-colors">
            <div class="flex items-center gap-1 truncate">
              <span class="w-1 h-1 rounded-full bg-[#00e5a3] shadow-[0_0_4px_#00e5a3] flex-shrink-0"></span>
              <span class="text-slate-200 truncate text-[10px]">深埋人工地网</span>
            </div>
            <div class="flex items-center gap-1 flex-shrink-0">
              <span class="font-tech text-cyan-300 font-bold text-[10px]">0.52Ω</span>
              <span class="text-[9px] px-1 py-0.1 rounded bg-emerald-950/80 border border-emerald-400/50 text-emerald-300 font-medium">达标</span>
            </div>
          </div>

          <div class="bg-[#0a285e]/80 hover:bg-[#123877] border border-[#235eae]/60 rounded px-1.5 py-0.5 flex items-center justify-between transition-colors">
            <div class="flex items-center gap-1 truncate">
              <span class="w-1 h-1 rounded-full bg-[#00e5a3] shadow-[0_0_4px_#00e5a3] flex-shrink-0"></span>
              <span class="text-slate-200 truncate text-[10px]">浪涌主动分流通道</span>
            </div>
            <div class="flex items-center gap-1 flex-shrink-0">
              <span class="font-tech text-white font-bold text-[10px]">双通道</span>
              <span class="text-[9px] px-1 py-0.1 rounded bg-emerald-950/80 border border-emerald-400/50 text-emerald-300 font-medium">热备</span>
            </div>
          </div>

          <div class="bg-[#0a285e]/80 hover:bg-[#123877] border border-[#235eae]/60 rounded px-1.5 py-0.5 flex items-center justify-between transition-colors">
            <div class="flex items-center gap-1 truncate">
              <span class="w-1 h-1 rounded-full bg-[#00e5a3] shadow-[0_0_4px_#00e5a3] flex-shrink-0"></span>
              <span class="text-slate-200 truncate text-[10px]">数字孪生通信总线</span>
            </div>
            <div class="flex items-center gap-1 flex-shrink-0">
              <span class="font-tech text-emerald-300 font-bold text-[10px]">3.8ms</span>
              <span class="text-[9px] px-1 py-0.1 rounded bg-emerald-950/80 border border-emerald-400/50 text-emerald-300 font-medium">极速</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom SLA & Architecture Guarantee Strip -->
      <div class="mt-1 pt-1.5 border-t border-[#184682]/60 grid grid-cols-3 gap-1 text-center">
        <div class="py-0.5 px-1 rounded bg-[#0a285e]/85 border border-[#235eae]/50">
          <div class="text-[9px] text-slate-400">自检周期</div>
          <div class="font-tech text-[10px] text-cyan-300 font-bold">10 秒/轮</div>
        </div>
        <div class="py-0.5 px-1 rounded bg-[#0a285e]/85 border border-[#235eae]/50">
          <div class="text-[9px] text-slate-400">冗余等级</div>
          <div class="font-tech text-[10px] text-emerald-400 font-bold">Tier IV</div>
        </div>
        <div class="py-0.5 px-1 rounded bg-[#0a285e]/85 border border-[#235eae]/50">
          <div class="text-[9px] text-slate-400">响应闭环</div>
          <div class="font-tech text-[10px] text-emerald-400 font-bold">&lt; 50 ms</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { openDeviceInspection } from '@/composables/useCockpitState';

const activeMetric = ref('lightning');
const statsPeriod = ref('今日');

const deviceHealthList = [
  {
    id: 'atmospheric',
    name: '雷电监测',
    online: 3,
    total: 3,
    status: '正常',
    color: '#00f0ff'
  },
  {
    id: 'spd_terminal',
    name: 'SPD终端',
    online: 12,
    total: 12,
    status: '正常',
    color: '#00e5a3'
  },
  {
    id: 'ground_res',
    name: '接地监测',
    online: 4,
    total: 4,
    status: '正常',
    color: '#38bdf8'
  },
  {
    id: 'esd_terminal',
    name: '静电传感器',
    online: 18,
    total: 18,
    status: '正常',
    color: '#00e5a3'
  }
];

const metricChannels = [
  { id: 'lightning', label: '雷电流' },
  { id: 'esd', label: '静电电位' },
  { id: 'ground', label: '地网电阻' }
];

const currentMetricConfig = computed(() => {
  if (activeMetric.value === 'esd') {
    return {
      unitLabel: '静电电位波动 (kV)',
      currentVal: '0.80 kV',
      yMax: '2.0',
      yMid: '1.0',
      yMin: '0.0',
      areaPath: 'M 28 85 L 50 78 L 80 80 L 110 70 L 140 65 L 170 72 L 200 62 L 230 68 L 260 75 L 290 70 L 305 72 L 305 92 L 28 92 Z',
      strokePath: 'M 28 85 L 50 78 L 80 80 L 110 70 L 140 65 L 170 72 L 200 62 L 230 68 L 260 75 L 290 70 L 305 72',
      stat1Label: '静电峰值',
      stat1Val: '1.20 kV',
      stat2Label: '消散耗时',
      stat2Val: '0.8 s',
      stat3Label: '电荷中和',
      stat3Val: '优良'
    };
  }
  if (activeMetric.value === 'ground') {
    return {
      unitLabel: '地网阻抗微变化 (Ω)',
      currentVal: '0.52 Ω',
      yMax: '1.0',
      yMid: '0.6',
      yMin: '0.2',
      areaPath: 'M 28 75 L 50 72 L 80 76 L 110 74 L 140 75 L 170 74 L 200 73 L 230 74 L 260 73 L 290 74 L 305 74 L 305 92 L 28 92 Z',
      strokePath: 'M 28 75 L 50 72 L 80 76 L 110 74 L 140 75 L 170 74 L 200 73 L 230 74 L 260 73 L 290 74 L 305 74',
      stat1Label: '工频电阻',
      stat1Val: '0.52 Ω',
      stat2Label: '冲击阻抗',
      stat2Val: '1.15 Ω',
      stat3Label: '全网导通',
      stat3Val: '100%'
    };
  }
  return {
    unitLabel: '雷电电场强度 (kA)',
    currentVal: '23.6 kA',
    yMax: '80',
    yMid: '40',
    yMin: '0',
    areaPath: 'M 28 88 L 40 84 L 60 80 L 80 78 L 100 82 L 120 72 L 140 76 L 160 62 L 180 80 L 200 50 L 220 35 L 240 70 L 260 76 L 280 84 L 305 80 L 305 92 L 28 92 Z',
    strokePath: 'M 28 88 L 40 84 L 60 80 L 80 78 L 100 82 L 120 72 L 140 76 L 160 62 L 180 80 L 200 50 L 220 35 L 240 70 L 260 76 L 280 84 L 305 80',
    stat1Label: '24h峰值',
    stat1Val: '58.7 kA',
    stat2Label: '放电积分',
    stat2Val: '14.8 C',
    stat3Label: '运行状态',
    stat3Val: '正常'
  };
});

const currentPeriodData = computed(() => {
  if (statsPeriod.value === '本周') {
    return {
      lightningCount: 5,
      maxCurrent: 64.2,
      esdAlerts: 1,
      maintenanceCount: 3,
      lightningDiff: '较同期 ↓ 20%',
      bars: [30, 60, 95, 45, 70],
      absorbedEnergy: '128.5 MJ'
    };
  }
  if (statsPeriod.value === '本月') {
    return {
      lightningCount: 12,
      maxCurrent: 78.5,
      esdAlerts: 2,
      maintenanceCount: 6,
      lightningDiff: '较同期 ↓ 35%',
      bars: [45, 80, 100, 60, 85],
      absorbedEnergy: '486.2 MJ'
    };
  }
  return {
    lightningCount: 2,
    maxCurrent: 58.7,
    esdAlerts: 0,
    maintenanceCount: 1,
    lightningDiff: '较同期 ↓ 50%',
    bars: [25, 40, 90, 35, 50],
    absorbedEnergy: '42.8 MJ'
  };
});
</script>
