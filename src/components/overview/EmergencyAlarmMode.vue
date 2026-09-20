<template>
  <div
    class="relative w-full h-full rounded-xl overflow-hidden flex flex-col transition-all duration-300 border"
    :class="[
      isNightWatchMode
        ? 'bg-[#030a16] border-[#102a54]/60 text-slate-400'
        : 'bg-[#040f26] border-[#1b4382]/80 text-slate-200',
      activeScenario.severity === 'red'
        ? 'shadow-[0_0_25px_rgba(239,68,68,0.15)]'
        : 'shadow-[0_0_25px_rgba(245,158,11,0.15)]'
    ]"
  >
    <!-- ======================================================== -->
    <!-- 区域 1：顶部状态监控与控制栏 (单行紧凑：左侧设备在线与各项指标监测 + 右侧轮播与一键派单) -->
    <!-- ======================================================== -->
    <div
      class="w-full relative z-20 px-3 py-1.5 flex items-center justify-between gap-3 border-b backdrop-blur-md transition-colors duration-500 flex-nowrap overflow-x-auto no-scrollbar"
      :class="[
        activeScenario.severity === 'red'
          ? 'bg-gradient-to-r from-red-950/95 via-[#1a0a0a]/95 to-[#0b1b36]/90 border-red-500/70 shadow-[0_4px_16px_rgba(239,68,68,0.2)]'
          : 'bg-gradient-to-r from-amber-950/95 via-[#1a1208]/95 to-[#0b1b36]/90 border-amber-500/70 shadow-[0_4px_16px_rgba(245,158,11,0.2)]'
      ]"
    >
      <!-- 左侧：设备在线率与全域各项防雷/静电指标实时在线监测 (可点击穿透排查) -->
      <div class="flex items-center gap-2 flex-shrink-0 min-w-0">
        <!-- 核心设备在网率胶囊 -->
        <div
          @click="openDeviceInspection('datacenter_zone')"
          class="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#092248]/90 border border-cyan-500/50 text-cyan-200 cursor-pointer hover:bg-cyan-950/80 transition-colors shadow-sm"
          title="点击查看算力中心设备在线与通信链路详情"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0"></span>
          <span class="text-xs font-semibold text-white whitespace-nowrap">设备在线:</span>
          <span class="font-tech text-xs font-bold text-emerald-300">99.4%</span>
          <span class="text-[10px] text-cyan-300 font-mono">(156/157)</span>
        </div>

        <div class="h-3 w-px bg-white/15 flex-shrink-0"></div>

        <!-- 各种监测指标胶囊：雷电、静电、地网、SPD、动力电源 -->
        <div class="flex items-center gap-1.5 flex-nowrap text-xs">
          <!-- 雷电监测 -->
          <div
            @click="openDeviceInspection('atmospheric')"
            class="flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/40 border border-white/10 hover:border-cyan-400 text-slate-200 hover:text-white cursor-pointer transition-colors whitespace-nowrap"
            title="雷电空间电场实时监测"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0"></span>
            <span class="text-[11px] text-slate-300">雷电:</span>
            <span class="font-tech text-[11px] font-bold text-cyan-300">23.6kA</span>
          </div>

          <!-- 静电监测 -->
          <div
            @click="openDeviceInspection('esd_terminal')"
            class="flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/40 border border-white/10 hover:border-emerald-400 text-slate-200 hover:text-white cursor-pointer transition-colors whitespace-nowrap"
            title="微环境防静电电位遥测"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0"></span>
            <span class="text-[11px] text-slate-300">静电:</span>
            <span class="font-tech text-[11px] font-bold text-emerald-300">0.8kV</span>
          </div>

          <!-- 接地阻抗 -->
          <div
            @click="openDeviceInspection('ground_res')"
            class="flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/40 border border-white/10 hover:border-amber-400 text-slate-200 hover:text-white cursor-pointer transition-colors whitespace-nowrap"
            title="地网接地电阻在线遥测 (当前有超标告警)"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 animate-ping"></span>
            <span class="text-[11px] text-slate-300">地阻:</span>
            <span class="font-tech text-[11px] font-bold text-amber-300">1.28Ω</span>
          </div>

          <!-- SPD在网 -->
          <div
            @click="openDeviceInspection('spd_terminal')"
            class="flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/40 border border-white/10 hover:border-red-400 text-slate-200 hover:text-white cursor-pointer transition-colors whitespace-nowrap"
            title="SPD浪涌保护器群组监测 (当前有漏电告警)"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0 animate-pulse"></span>
            <span class="text-[11px] text-slate-300">SPD:</span>
            <span class="font-tech text-[11px] font-bold text-red-300">0.28mA</span>
          </div>

          <!-- 配电电源 -->
          <div
            @click="openDeviceInspection('datacenter_zone')"
            class="flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/40 border border-white/10 hover:border-cyan-400 text-slate-200 hover:text-white cursor-pointer transition-colors whitespace-nowrap"
            title="主机房供配电相电压质量"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0"></span>
            <span class="text-[11px] text-slate-300">电源:</span>
            <span class="font-tech text-[11px] font-bold text-emerald-300">220.4V</span>
          </div>
        </div>
      </div>

      <!-- 右侧：返回常态 -->
      <div class="flex items-center gap-2 flex-shrink-0">
        <!-- 返回常态 -->
        <button
          @click="exitEmergencyMode"
          class="px-2.5 py-1 rounded text-xs font-medium bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-600 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap flex-shrink-0"
          title="退出应急极简视图，返回全量大屏"
        >
          <LogOut class="w-3.5 h-3.5 flex-shrink-0" />
          <span>返回常态</span>
        </button>
      </div>
    </div>

    <!-- 告警销号后 30秒自动回切常态提示条 -->
    <div
      v-if="allResolved"
      class="bg-emerald-950/90 border-b border-emerald-500/60 px-4 py-1.5 flex items-center justify-between text-xs text-emerald-200 animate-fadeIn"
    >
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        <span>全量告警已全部闭环销号，系统将在 <strong class="font-tech text-cyan-300 text-sm font-bold">{{ autoRecoverSeconds }}</strong> 秒后自动恢复【常态浏览模式】</span>
      </div>
      <button
        @click="exitEmergencyMode"
        class="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] cursor-pointer"
      >
        立即恢复常态
      </button>
    </div>

    <!-- ======================================================== -->
    <!-- 中间主视图区：左侧 58% 为三维机房大卡片；右侧 42% 纵向告警胶囊 (空间充裕，绝不截断挤压) -->
    <!-- ======================================================== -->
    <div class="flex-1 grid grid-cols-1 lg:grid-cols-[58%_42%] gap-3 p-2.5 overflow-hidden">
      <!-- 左侧：保留总览的原版高保真三维机房态势图，叠加 3 处故障靶标联动 -->
      <div class="flex flex-col min-w-0 h-full gap-2">
        <!-- 3D 联动说明工具栏 -->
        <div class="flex items-center justify-between px-3 py-1 rounded-lg bg-[#071c3f]/80 border border-[#1d4d8c]/70 text-xs">
          <div class="flex items-center gap-2">
            <span class="text-slate-400 text-xs font-medium">3D全域定位:</span>
            <span class="text-slate-200 flex items-center gap-1.5 text-[11px]">
              <span v-if="alarmCards.some(c => c.id === 'spd')" class="flex items-center gap-1">
                <span class="w-2 h-2 rounded-full bg-red-500 animate-ping"></span> 2F动力室 (SPD超标)
              </span>
              <span v-if="alarmCards.some(c => c.id === 'spd') && alarmCards.some(c => c.id === 'ground')" class="text-slate-600">|</span>
              <span v-if="alarmCards.some(c => c.id === 'ground')" class="flex items-center gap-1">
                <span class="w-2 h-2 rounded-full bg-amber-400"></span> -1F地网 (阻抗超限)
              </span>
              <span v-if="(alarmCards.some(c => c.id === 'spd') || alarmCards.some(c => c.id === 'ground')) && alarmCards.some(c => c.id === 'lightning')" class="text-slate-600">|</span>
              <span v-if="alarmCards.some(c => c.id === 'lightning')" class="flex items-center gap-1">
                <span class="w-2 h-2 rounded-full bg-yellow-400"></span> 顶楼天面 (电场畸变)
              </span>
              <span v-if="alarmCards.length === 0" class="text-emerald-400 font-medium flex items-center gap-1">
                <span class="w-2 h-2 rounded-full bg-emerald-400"></span> 园区全域防雷指标均已恢复正常受控
              </span>
            </span>
          </div>

          <div class="flex items-center gap-1 text-xs text-cyan-300">
            <span>点击右侧告警卡片切换三维视角定位</span>
          </div>
        </div>

        <!-- 核心：总览三维数字孪生卡片组件，完全复用总览真实的三维建筑/地网/配电/机房透视渲染 -->
        <div class="relative flex-1 min-h-0 rounded-xl overflow-hidden border border-[#1d4d8c]/80 shadow-lg">
          <Datacenter3DCard
            class="h-full w-full"
            :active-alarms="alarmCards"
            :focused-alarm-id="focusedId"
          />

          <!-- 在原版三维视图上方轻量叠加醒目的当前主焦点 HUD 指引徽标 -->
          <div class="absolute bottom-3 left-3 z-30 pointer-events-none transition-all duration-300">
            <div class="px-3 py-1.5 rounded-lg bg-black/85 border border-amber-400/80 shadow-[0_0_15px_rgba(245,158,11,0.4)] backdrop-blur-md flex items-center gap-2.5">
              <span class="w-3 h-3 rounded-full" :class="activeScenario.severity === 'red' ? 'bg-red-500 animate-ping' : 'bg-amber-400 animate-ping'"></span>
              <div class="flex flex-col">
                <span class="text-xs font-bold text-white flex items-center gap-1">
                  <span>当前聚焦:</span>
                  <span :class="activeScenario.severity === 'red' ? 'text-red-300' : 'text-amber-300'">{{ activeScenario.title }}</span>
                </span>
                <span class="text-[11px] text-slate-300">
                  物理点位: <strong class="text-white">{{ activeScenario.location }}</strong> · 实时值 <strong class="text-amber-300 font-mono">{{ activeScenario.realtimeValue }}</strong> (门限 {{ activeScenario.threshold }})
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ======================================================== -->
      <!-- 右侧：结构严密、层次清晰、无截断的工业级告警卡片集 -->
      <!-- ======================================================== -->
      <div class="flex flex-col gap-2.5 min-w-0 h-full overflow-y-auto no-scrollbar justify-start">
        <!-- 如果还有活跃告警，渲染卡片列表 -->
        <template v-if="alarmCards.length > 0">
          <div
            v-for="(item, idx) in alarmCards"
            :key="item.id"
            @click="manualSelect(item.id)"
            class="p-3 rounded-xl border flex flex-col justify-between backdrop-blur-md transition-all cursor-pointer relative overflow-hidden flex-1 group shadow-md"
            :class="[
              focusedId === item.id
                ? 'ring-2 ring-cyan-400/90 shadow-[0_0_18px_rgba(6,182,212,0.3)] bg-gradient-to-r from-[#0c1e3d] to-[#08152e]'
                : 'hover:border-slate-500 bg-[#06142a]/95 opacity-95',
              item.severity === 'red'
                ? 'border-red-500/60 hover:border-red-400'
                : item.severity === 'orange'
                  ? 'border-amber-500/60 hover:border-amber-400'
                  : 'border-yellow-500/50 hover:border-yellow-400'
            ]"
          >
            <!-- 顶部行：左侧[序号+标题+设备]+右侧[大字号实时监控值与门限对比] -->
            <div class="flex items-start justify-between gap-2 pb-1 border-b border-white/5">
              <!-- 左侧标号与完整标题 -->
              <div class="flex items-start gap-2 min-w-0 flex-1">
                <span
                  class="w-5 h-5 rounded flex items-center justify-center text-[11px] font-bold font-mono flex-shrink-0 mt-0.5 shadow-sm"
                  :class="focusedId === item.id ? 'bg-cyan-500 text-black' : 'bg-black/60 text-slate-300 border border-white/20'"
                >
                  {{ idx + 1 }}
                </span>
                <div class="flex flex-col min-w-0">
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <span
                      class="w-2 h-2 rounded-full flex-shrink-0"
                      :class="item.severity === 'red' ? 'bg-red-500 animate-ping' : item.severity === 'orange' ? 'bg-amber-400' : 'bg-yellow-400'"
                    ></span>
                    <span class="font-bold text-white text-[13px] leading-snug tracking-wide">{{ item.title }}</span>
                  </div>
                  <span class="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2 flex-wrap">
                    <span class="text-cyan-300 flex items-center gap-0.5">
                      <MapPin class="w-3 h-3 text-cyan-400 inline-block" />
                      <strong>{{ item.location }}</strong>
                    </span>
                    <span class="text-slate-600">·</span>
                    <span>编码: <strong class="text-slate-300 font-mono">{{ item.deviceCode }}</strong></span>
                    <span class="text-slate-600">·</span>
                    <span>责任人: <strong class="text-slate-300">{{ item.assignee }}</strong></span>
                  </span>
                </div>
              </div>

              <!-- 右侧超标大字号数值看板 -->
              <div class="flex flex-col items-end flex-shrink-0">
                <div class="flex items-baseline gap-1">
                  <span class="font-tech font-extrabold text-base tracking-tight" :class="item.severity === 'red' ? 'text-red-400' : 'text-amber-300'">
                    {{ item.realtimeValue }}
                  </span>
                </div>
                <div class="flex items-center gap-1 mt-0.5">
                  <span
                    class="text-[9.5px] px-1.5 py-0.2 rounded font-mono font-medium border"
                    :class="item.severity === 'red'
                      ? 'bg-red-950/80 text-red-300 border-red-500/40'
                      : item.severity === 'orange'
                        ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                        : 'bg-yellow-950/80 text-yellow-300 border-yellow-500/40'"
                  >
                    安全门限 ≤ {{ item.threshold }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 中间行：全宽超标曲线趋势 + 偏离指标说明 -->
            <div class="py-1 flex items-center justify-between gap-3">
              <!-- Sparkline 微型趋势图 -->
              <div class="flex-1 h-9 relative px-1 bg-black/40 rounded-lg border border-white/5 overflow-hidden">
                <svg class="w-full h-full" viewBox="0 0 280 34" preserveAspectRatio="none">
                  <!-- 阈值虚线 (Y=18) -->
                  <line x1="5" y1="18" x2="275" y2="18" stroke="#f59e0b" stroke-width="1" stroke-dasharray="4 2" />
                  
                  <!-- 超标高亮渐变区域 (X=170到X=270) -->
                  <path
                    :d="item.sparklineOverArea"
                    :fill="item.severity === 'red' ? 'rgba(239, 68, 68, 0.45)' : 'rgba(245, 158, 11, 0.45)'"
                  />

                  <!-- 历史基础折线 -->
                  <path
                    :d="item.sparklineStrokeBefore"
                    fill="none"
                    stroke="#38bdf8"
                    stroke-width="1.8"
                  />

                  <!-- 实时超标高亮折线 -->
                  <path
                    :d="item.sparklineStrokeOver"
                    fill="none"
                    :stroke="item.severity === 'red' ? '#ef4444' : '#f59e0b'"
                    stroke-width="2.5"
                  />

                  <!-- 越界突变起点 (X=170, Y=18) -->
                  <circle cx="170" cy="18" r="2.5" fill="#f59e0b" stroke="#ffffff" stroke-width="1" />

                  <!-- 当前最新测点 -->
                  <circle cx="250" :cy="item.endY" r="3" :fill="item.severity === 'red' ? '#ef4444' : '#f59e0b'" stroke="#ffffff" stroke-width="1.2" />
                </svg>
              </div>

              <!-- 右侧越界量化标签与起始时间 -->
              <div class="flex flex-col items-end flex-shrink-0 text-right">
                <span class="text-xs font-bold font-mono tracking-tight" :class="item.severity === 'red' ? 'text-red-400' : 'text-amber-300'">
                  {{ item.overValue }}
                </span>
                <span class="text-[10px] text-slate-400 font-mono mt-0.5">{{ item.timeTag }}</span>
              </div>
            </div>

            <!-- 底部行：工单协同步进器与右侧操作按钮 -->
            <div class="flex items-center justify-between gap-3 pt-1 border-t border-white/5">
              <!-- 4 步流转指示器 -->
              <div class="flex items-center gap-1.5 text-[10.5px]">
                <div class="flex items-center gap-1">
                  <span
                    class="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                    :class="item.step >= 1 ? 'bg-emerald-500 text-black' : 'bg-slate-800 text-slate-500'"
                  >1</span>
                  <span :class="item.step >= 1 ? 'text-emerald-300 font-medium' : 'text-slate-500'">触发</span>
                </div>
                <span class="w-3 h-0.5 rounded" :class="item.step >= 2 ? 'bg-emerald-500' : 'bg-slate-700'"></span>

                <div class="flex items-center gap-1">
                  <span
                    class="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                    :class="item.step >= 2 ? 'bg-emerald-500 text-black' : 'bg-slate-800 text-slate-500'"
                  >2</span>
                  <span :class="item.step >= 2 ? 'text-emerald-300 font-medium' : 'text-slate-500'">派单</span>
                </div>
                <span class="w-3 h-0.5 rounded" :class="item.step >= 3 ? 'bg-cyan-400' : 'bg-slate-700'"></span>

                <div class="flex items-center gap-1">
                  <span
                    class="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                    :class="item.step >= 3 ? 'bg-cyan-500 text-black animate-pulse' : 'bg-slate-800 text-slate-500'"
                  >3</span>
                  <span :class="item.step >= 3 ? 'text-cyan-300 font-bold' : 'text-slate-500'">排查</span>
                </div>
                <span class="w-3 h-0.5 rounded bg-slate-700"></span>

                <div class="flex items-center gap-1">
                  <span class="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold bg-slate-800 text-slate-500">4</span>
                  <span class="text-slate-500">销号</span>
                </div>
              </div>

              <!-- 状态推进按钮 -->
              <div>
                <button
                  v-if="item.step === 1"
                  @click.stop="advanceStep(item.id)"
                  class="px-3 py-1 rounded-md text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white cursor-pointer transition-all active:scale-95 shadow-md flex items-center gap-1"
                >
                  <Send class="w-3 h-3" />
                  <span>立即派单</span>
                </button>
                <button
                  v-else-if="item.step === 2"
                  @click.stop="advanceStep(item.id)"
                  class="px-3 py-1 rounded-md text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer transition-all active:scale-95 shadow-md flex items-center gap-1"
                >
                  <MapPin class="w-3 h-3" />
                  <span>到位排查</span>
                </button>
                <button
                  v-else-if="item.step === 3"
                  @click.stop="resolveAndRemove(item.id)"
                  class="px-3 py-1 rounded-md text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer transition-all active:scale-95 shadow-md flex items-center gap-1"
                  title="现场排查结束，闭环并消除此条告警"
                >
                  <Check class="w-3.5 h-3.5" />
                  <span>结束排查(销号)</span>
                </button>
              </div>
            </div>
          </div>
        </template>

        <!-- 所有告警全部消除后的清空状态 -->
        <div v-else class="flex-1 flex flex-col items-center justify-center p-6 rounded-xl border border-emerald-500/50 bg-[#041d18]/90 text-center gap-3 animate-fadeIn">
          <div class="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300">
            <CheckCircle2 class="w-7 h-7 animate-bounce" />
          </div>
          <div>
            <h4 class="text-sm font-bold text-white mb-1">所有告警排查完毕，已全量销号</h4>
            <p class="text-xs text-emerald-300/80">在网所有防雷测点恢复绿色受控状态，无残留安全隐患</p>
          </div>
          <button
            @click="exitEmergencyMode"
            class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md cursor-pointer transition-all"
          >
            返回常态监控大屏
          </button>
        </div>

        <!-- 底部微型日志条 (简明展示 1 行最新联动动态) -->
        <div class="px-2.5 py-1.5 rounded-lg bg-[#071c3f]/80 border border-[#1d4d8c]/60 flex items-center justify-between text-[10.5px] text-slate-400 flex-shrink-0">
          <span class="flex items-center gap-1.5 truncate">
            <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            <span class="text-slate-300 truncate">最新调度: {{ latestActionText }}</span>
          </span>
          <span class="text-slate-500 font-mono text-[9px] flex-shrink-0">处置流水</span>
        </div>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- 区域 4：底部极简单行状态栏 (非常窄、极低亮度，绝无冗余图表) -->
    <!-- ======================================================== -->
    <div
      class="w-full relative z-20 px-4 py-1.5 flex items-center justify-between border-t text-[11px] backdrop-blur-md"
      :class="isNightWatchMode ? 'bg-[#020611] border-[#0e2344]/80 text-slate-500' : 'bg-[#04122d]/95 border-[#173d72]/80 text-slate-400'"
    >
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>在网测点: <strong class="text-slate-300 font-mono">37/37 (100%)</strong></span>
        </div>
        <div class="h-3 w-px bg-slate-700"></div>
        <div class="flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping"></span>
          <span>当前并发告警: <strong class="text-red-400">{{ activeCount }} 条 (处置中)</strong></span>
        </div>
        <div class="h-3 w-px bg-slate-700"></div>
        <div class="flex items-center gap-1.5 text-slate-400">
          <span>值班责任人: <strong class="text-slate-300">周工 (工号 #8201)</strong></span>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="toggleNightWatchMode"
          class="flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] border transition-colors cursor-pointer"
          :class="isNightWatchMode
            ? 'bg-indigo-950/80 border-indigo-400 text-indigo-200'
            : 'bg-transparent border-slate-700 text-slate-400 hover:text-slate-200'"
        >
          <Moon class="w-3 h-3" />
          <span>{{ isNightWatchMode ? '夜间模式: 开' : '夜间模式:关' }}</span>
        </button>
        <span class="text-[10px] text-slate-500">
          极简应急模式 · 3处告警空间靶标联动与快速处置
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  AlertTriangle,
  MapPin,
  Send,
  LogOut,
  Moon,
  Check,
  CheckCircle2
} from 'lucide-vue-next';
import {
  isNightWatchMode,
  autoRecoverSeconds,
  exitEmergencyMode,
  toggleNightWatchMode
} from '@/composables/useEmergencyMode';

import Datacenter3DCard from '@/components/overview/Datacenter3DCard.vue';
import { openDeviceInspection } from '@/composables/useCockpitState';

// 3 个并发告警的独立状态对象
const alarmCards = ref([
  {
    id: 'spd',
    title: '2F动力配电室 SPD 漏电超标',
    deviceCode: 'SPD-04#',
    location: '2F 数据机房动力母线柜 A-02',
    severity: 'red',
    realtimeValue: '0.28 mA',
    threshold: '0.20 mA',
    overValue: '+0.08 mA (超40%)',
    overText: '超标 +0.08mA',
    timeTag: '15:10 起始',
    endY: 6,
    sparklineOverArea: 'M 170,18 Q 210,10 250,6 L 250,18 L 170,18 Z',
    sparklineStrokeBefore: 'M 5,26 Q 90,25 130,22 T 170,18',
    sparklineStrokeOver: 'M 170,18 Q 210,10 250,6',
    step: 3, // 默认已经现场排查中，方便直接点【结束排查(销号)】
    assignee: '动力组 李工'
  },
  {
    id: 'ground',
    title: '园区人工地网基准测试井阻抗超限',
    deviceCode: 'GW-01#',
    location: '地下 -1F 人工地网基准井',
    severity: 'orange',
    realtimeValue: '0.88 Ω',
    threshold: '0.80 Ω',
    overValue: '+0.08 Ω (超10%)',
    overText: '超标 +0.08Ω',
    timeTag: '15:10 起始',
    endY: 9,
    sparklineOverArea: 'M 170,18 Q 210,13 250,9 L 250,18 L 170,18 Z',
    sparklineStrokeBefore: 'M 5,27 Q 85,26 130,23 T 170,18',
    sparklineStrokeOver: 'M 170,18 Q 210,13 250,9',
    step: 2, // 处于派单后
    assignee: '高压防雷 张工'
  },
  {
    id: 'lightning',
    title: '12号接闪塔空间电场突变预警',
    deviceCode: 'AEFM-01#',
    location: '科研楼天面 12号主动接闪塔',
    severity: 'yellow',
    realtimeValue: '38.6 kV/m',
    threshold: '25.0 kV/m',
    overValue: '+13.6 kV/m (畸变)',
    overText: '畸变 +13.6kV',
    timeTag: '15:18 起始',
    endY: 7,
    sparklineOverArea: 'M 170,18 Q 210,11 250,7 L 250,18 L 170,18 Z',
    sparklineStrokeBefore: 'M 5,26 Q 90,24 130,21 T 170,18',
    sparklineStrokeOver: 'M 170,18 Q 210,11 250,7',
    step: 1, // 待派单
    assignee: '天面设施 赵工'
  }
]);

// 当前 3D 镜头焦点
const focusedId = ref('spd');

const activeScenario = computed(() => {
  if (alarmCards.value.length === 0) {
    return {
      id: 'none',
      title: '全部告警已消除',
      location: '园区整体',
      severity: 'green',
      realtimeValue: '受控正常',
      threshold: '正常',
      overValue: '安全'
    };
  }
  return alarmCards.value.find(c => c.id === focusedId.value) || alarmCards.value[0];
});

// 各严重等级实时统计
const countRed = computed(() => alarmCards.value.filter(c => c.severity === 'red').length);
const countOrange = computed(() => alarmCards.value.filter(c => c.severity === 'orange').length);
const countYellow = computed(() => alarmCards.value.filter(c => c.severity === 'yellow').length);

// 点选任意告警卡片：锁定并在 3D 视图中聚焦对应靶点
const manualSelect = (id: string) => {
  focusedId.value = id;
};

// 推进单张卡片的进度 (1 -> 2 -> 3)
const advanceStep = (id: string) => {
  const card = alarmCards.value.find(c => c.id === id);
  if (card && card.step < 3) {
    card.step++;
    latestActionText.value = `${card.title} 进度推进至 [${card.step === 2 ? '已派发工单' : '现场排查中'}]`;
  }
};

// 关键业务闭环：排查结束，闭环销号，该告警立刻从列表中消失！
const resolveAndRemove = (id: string) => {
  const targetIndex = alarmCards.value.findIndex(c => c.id === id);
  if (targetIndex !== -1) {
    const removedTitle = alarmCards.value[targetIndex].title;
    alarmCards.value.splice(targetIndex, 1);
    latestActionText.value = `[销号成功] ${removedTitle} 隐患排除，告警已移出活跃看板`;

    // 如果当前聚焦的正是被销号的这一项，自动对焦到剩余的第一项
    if (focusedId.value === id) {
      if (alarmCards.value.length > 0) {
        focusedId.value = alarmCards.value[0].id;
      }
    }

    // 如果全部告警均已销号完毕，延迟 1.5 秒自动退出应急模式，平滑返回常态大屏
    if (alarmCards.value.length === 0) {
      setTimeout(() => {
        exitEmergencyMode();
      }, 1800);
    }
  }
};

// 一键全部派单
const handleDispatchAll = () => {
  alarmCards.value.forEach(c => {
    if (c.step === 1) c.step = 2;
  });
  latestActionText.value = '值班中心已一键协同派发全部应急工单至各责任班组';
};

const latestActionText = ref('系统已捕获 3 处并发告警，三维孪生已锁定关联靶点');

// 统计未销号的告警数量
const activeCount = computed(() => alarmCards.value.length);

// 全部销号判断
const allResolved = computed(() => alarmCards.value.length === 0);
</script>
