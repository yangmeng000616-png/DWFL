<template>
  <div class="space-y-3 min-h-0 flex-1 flex flex-col">
    <!-- 1. Header: 统一标题 + 状态统计 + 快捷操作 -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-1 flex-shrink-0">
      <div class="flex items-center gap-2">
        <div class="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.3)]">
          <ShieldAlert class="w-3.5 h-3.5" />
        </div>
        <div>
          <h2 class="text-sm sm:text-base font-bold text-white tracking-wide flex items-center gap-2">
            <span>预警处置中心 · 感知研判与闭环协同</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-500/40">
              {{ unclosedCount }} 起待闭环
            </span>
          </h2>
        </div>
      </div>

      <!-- Action Buttons & Mode Switcher -->
      <div class="flex items-center gap-2 flex-wrap">
        <!-- 3D 联动与纯清单模式切换 Pill -->
        <div class="flex items-center bg-[#071c3e] p-0.5 rounded-lg border border-cyan-500/40">
          <button
            @click="viewMode = '3d'"
            class="px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            :class="viewMode === '3d' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold shadow-[0_0_8px_rgba(6,182,212,0.5)]' : 'text-slate-300 hover:text-white'"
            title="展示机房三维数字孪生告警空间定位与透视"
          >
            <Box class="w-3.5 h-3.5 text-cyan-300" />
            <span>三维孪生联动</span>
          </button>
          <button
            @click="viewMode = 'list'"
            class="px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            :class="viewMode === 'list' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold shadow-[0_0_8px_rgba(6,182,212,0.5)]' : 'text-slate-300 hover:text-white'"
            title="切换为大屏纯表格清单排障模式"
          >
            <FileText class="w-3.5 h-3.5 text-slate-300" />
            <span>纯清单工作台</span>
          </button>
        </div>

        <button
          @click="openEmergency3D"
          class="px-3 py-1.5 rounded-lg bg-[#0e3b7a] hover:bg-[#154fa0] border border-cyan-500/50 text-cyan-200 text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          title="切换至全屏三维数字孪生应急处置工作台"
        >
          <Layers class="w-3.5 h-3.5 text-cyan-300" />
          <span>全屏应急孪生</span>
        </button>

        <button
          @click="triggerDefenseTest"
          class="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-semibold shadow-[0_0_12px_rgba(6,182,212,0.4)] transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
        >
          <Shield class="w-3.5 h-3.5" />
          <span>执行防御联动测试</span>
        </button>
      </div>
    </div>

    <!-- Feedback Toast -->
    <div
      v-if="feedbackNotice"
      class="bg-[#0b2d56] border border-cyan-400/70 text-cyan-200 px-3 py-1.5 rounded-lg text-xs flex items-center justify-between animate-fadeIn shadow-lg flex-shrink-0"
    >
      <div class="flex items-center gap-2">
        <CheckCircle2 class="w-4 h-4 text-emerald-400 flex-shrink-0" />
        <span>{{ feedbackNotice }}</span>
      </div>
      <button @click="feedbackNotice = ''" class="text-slate-400 hover:text-white text-sm font-mono cursor-pointer">&times;</button>
    </div>

    <!-- 2. 预警等级标准体系条 (色彩严谨规范：红色严格仅对应一级严重，当前受控为0，绝不滥用爆红) -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-2 flex-shrink-0">
      <div
        v-for="item in warningTiers"
        :key="item.name"
        class="tech-panel rounded-xl p-2.5 border transition-all"
        :class="item.active ? item.activeClass : 'border-[#18396c]/40 opacity-80'"
      >
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold flex items-center gap-1.5" :class="item.color">
            <span class="w-2 h-2 rounded-full" :class="item.dotColor"></span>
            <span>{{ item.name }}</span>
          </span>
          <span
            class="px-1.5 py-0.2 rounded text-[9.5px] font-semibold"
            :class="item.active ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50' : 'bg-slate-800 text-slate-400'"
          >
            {{ item.active ? '当前处于' : '受控监控' }}
          </span>
        </div>
        <div class="text-[11px] font-semibold text-white mt-1 truncate">{{ item.condition }}</div>
        <div class="text-[10px] text-slate-400 mt-0.5 leading-tight truncate">{{ item.action }}</div>
      </div>
    </div>

    <!-- 3. 主体工作台：支持三维孪生联动与纯清单排障双模式 -->
    <div class="grid grid-cols-1 gap-3 flex-1 min-h-[580px]" :class="viewMode === '3d' ? 'xl:grid-cols-12' : 'lg:grid-cols-12'">
      <!-- ==================================================== -->
      <!-- 左列：待处置具体告警列表 + 雷达测距微模块 -->
      <!-- ==================================================== -->
      <div :class="viewMode === '3d' ? 'xl:col-span-3 lg:col-span-4 flex flex-col gap-2.5 min-w-0' : 'lg:col-span-5 flex flex-col gap-2.5 min-w-0'">
        <!-- 告警紧凑分类卡片列表 -->
        <div class="tech-panel rounded-xl p-3 flex flex-col flex-1 border border-[#1b4382]/80 shadow-md min-h-[300px]">
          <div class="flex items-center justify-between pb-2 border-b border-[#184682]/60 flex-shrink-0">
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-white">具体告警事件</span>
              <span class="text-[10px] text-slate-400 font-mono">共 {{ currentAlerts.length }} 条记录</span>
            </div>

            <!-- 状态筛选 Tab -->
            <div class="flex items-center gap-1 text-[10px]">
              <button
                @click="filterStatus = 'all'"
                class="px-2 py-0.5 rounded cursor-pointer transition-colors"
                :class="filterStatus === 'all' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white bg-slate-800/60'"
              >
                全部
              </button>
              <button
                @click="filterStatus = 'active'"
                class="px-2 py-0.5 rounded cursor-pointer transition-colors"
                :class="filterStatus === 'active' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-white bg-slate-800/60'"
              >
                待闭环 ({{ unclosedCount }})
              </button>
              <button
                @click="filterStatus = 'resolved'"
                class="px-2 py-0.5 rounded cursor-pointer transition-colors"
                :class="filterStatus === 'resolved' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white bg-slate-800/60'"
              >
                已闭环 ({{ resolvedCount }})
              </button>
            </div>
          </div>

          <!-- 告警列表项 -->
          <div class="flex-1 overflow-y-auto space-y-1.5 pr-1 pt-2 custom-scroll">
            <div
              v-for="item in filteredAlerts"
              :key="item.id"
              @click="selectAlert(item.id)"
              class="p-2.5 rounded-xl border transition-all cursor-pointer group flex flex-col gap-1.5"
              :class="[
                selectedAlertId === item.id
                  ? 'bg-[#0f2e5c] border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.25)] ring-1 ring-cyan-400/50'
                  : 'bg-[#06152d]/90 border-slate-700/60 hover:border-slate-500 hover:bg-[#0b2042]'
              ]"
            >
              <!-- 行1：等级Badge + 标题 + 发生时间 -->
              <div class="flex items-center justify-between gap-1">
                <div class="flex items-center gap-1.5 min-w-0">
                  <span
                    class="px-1.5 py-0.2 rounded text-[9.5px] font-semibold whitespace-nowrap flex-shrink-0"
                    :class="getLevelBadgeClass(item.severity)"
                  >
                    {{ item.severityText }}
                  </span>
                  <span class="text-xs font-bold truncate" :class="selectedAlertId === item.id ? 'text-white' : 'text-slate-200 group-hover:text-white'">
                    {{ item.title }}
                  </span>
                </div>
                <span class="text-[9.5px] font-mono text-slate-400 flex-shrink-0">{{ item.alarmTime }}</span>
              </div>

              <!-- 行2：空间位置 + 测点编号 -->
              <div class="flex items-center justify-between text-[10.5px] text-slate-400">
                <div class="flex items-center gap-1 truncate">
                  <MapPin class="w-3 h-3 text-cyan-400 flex-shrink-0" />
                  <span class="truncate">{{ item.location }}</span>
                </div>
                <span class="font-mono text-slate-400 flex-shrink-0 text-[10px]">{{ item.deviceCode }}</span>
              </div>

              <!-- 行3：实时测点超限指标 + 当前处置阶段 -->
              <div class="flex items-center justify-between pt-1 border-t border-white/5 text-[10.5px]">
                <div class="flex items-center gap-1.5">
                  <span class="text-slate-400 text-[10px]">实时:</span>
                  <strong class="font-tech text-xs font-bold" :class="getSeverityTextClass(item.severity)">
                    {{ item.realtimeValue }}
                  </strong>
                  <span class="text-[9px] text-slate-400">限值: ≤{{ item.threshold }}</span>
                </div>

                <div class="flex items-center gap-1">
                  <span
                    class="px-1.5 py-0.2 rounded text-[9px] font-medium"
                    :class="getStatusBadgeClass(item.status)"
                  >
                    {{ item.status }}
                  </span>
                  <ChevronRight class="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-300 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 下部微缩：雷云多普勒雷达测距与移向预测 -->
        <div class="tech-panel rounded-xl p-2.5 flex flex-col border border-[#1b4382]/80 shadow-md flex-shrink-0">
          <div class="flex items-center justify-between pb-1 border-b border-[#1b3d75]/50 text-xs">
            <span class="font-bold text-white flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>雷云多普勒雷达空间测距</span>
            </span>
            <span class="text-[10px] text-cyan-300 font-mono">探测半径: 50 km</span>
          </div>

          <div class="grid grid-cols-12 gap-2 items-center py-1.5">
            <!-- 紧凑雷达扫描盘 (5 cols) -->
            <div class="col-span-5 h-[90px] relative flex items-center justify-center">
              <svg class="w-full h-full" viewBox="0 0 160 100">
                <circle cx="80" cy="50" r="42" fill="none" stroke="#163868" stroke-dasharray="2 3" />
                <circle cx="80" cy="50" r="28" fill="none" stroke="#163868" stroke-dasharray="2 3" />
                <circle cx="80" cy="50" r="14" fill="none" stroke="#163868" />
                <line x1="38" y1="50" x2="122" y2="50" stroke="#163868" />
                <line x1="80" y1="8" x2="80" y2="92" stroke="#163868" />

                <!-- 雷云团簇 A (橙黄高亮，绝无泛红) -->
                <ellipse cx="112" cy="32" rx="14" ry="9" fill="#f59e0b" fill-opacity="0.3" stroke="#f59e0b" stroke-width="1.2" />
                <circle cx="112" cy="32" r="3" fill="#f59e0b" />
                <!-- 移动轨迹箭头 -->
                <line x1="112" y1="32" x2="94" y2="42" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="2 2" />

                <!-- 算力中心圆心 -->
                <circle cx="80" cy="50" r="3" fill="#00f0ff" />
                <text x="84" y="58" fill="#38bdf8" font-size="7" font-weight="bold">算力中心</text>
              </svg>
            </div>

            <!-- 雷达遥测数值 (7 cols) -->
            <div class="col-span-7 grid grid-cols-1 gap-1 text-[10px]">
              <div class="flex items-center justify-between bg-[#081838] px-2 py-1 rounded">
                <span class="text-slate-400">最近对流中心:</span>
                <span class="font-tech text-xs font-bold text-cyan-300">38.4 km</span>
              </div>
              <div class="flex items-center justify-between bg-[#081838] px-2 py-1 rounded">
                <span class="text-slate-400">移速与方向:</span>
                <span class="font-tech text-xs font-bold text-amber-300">24 km/h · 东北向</span>
              </div>
              <div class="flex items-center justify-between bg-[#081838] px-2 py-1 rounded">
                <span class="text-slate-400">预计影响窗口:</span>
                <span class="font-tech text-xs font-bold text-slate-200">约 95 分钟后</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ==================================================== -->
      <!-- 中列：机房三维数字孪生告警空间透视底座 (仅在 3D 联动模式渲染) -->
      <!-- ==================================================== -->
      <div v-if="viewMode === '3d'" class="xl:col-span-5 lg:col-span-8 flex flex-col min-w-0 h-full min-h-[500px]">
        <Datacenter3DCard
          :focused-alarm-id="selectedAlertId"
          @select-alarm="handle3DSelectAlarm"
        />
      </div>

      <!-- ==================================================== -->
      <!-- 右列：设备专属深度闭环处置工作台 -->
      <!-- ==================================================== -->
      <div :class="viewMode === '3d' ? 'xl:col-span-4 lg:col-span-12 flex flex-col gap-2 min-w-0' : 'lg:col-span-7 flex flex-col gap-2 min-w-0'">
        <div
          v-if="activeAlert"
          class="tech-panel rounded-xl p-3 flex flex-col justify-between flex-1 border border-[#1b4382]/80 shadow-lg gap-2.5 overflow-hidden"
        >
          <!-- A. 设备技术档案与超限详情 (大幅扩容，留足设备详情展示空间) -->
          <div class="flex flex-col gap-1.5 pb-2 border-b border-white/10 flex-shrink-0">
            <div class="flex items-start justify-between gap-2">
              <div class="flex flex-col min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="px-1.5 py-0.2 rounded bg-cyan-950/90 border border-cyan-400/60 text-[10px] text-cyan-300 font-mono font-bold">
                    {{ activeAlert.deviceCode }}
                  </span>
                  <h3 class="text-sm sm:text-base font-bold text-white truncate">{{ activeAlert.deviceName }}</h3>
                  <span
                    class="px-2 py-0.2 rounded text-[10px] font-semibold"
                    :class="getLevelBadgeClass(activeAlert.severity)"
                  >
                    {{ activeAlert.severityText }}
                  </span>
                </div>
                <div class="flex items-center gap-1.5 text-xs text-slate-400 mt-1 truncate">
                  <MapPin class="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  <span class="text-slate-300 truncate">{{ activeAlert.location }}</span>
                  <span class="text-slate-600">·</span>
                  <span class="text-slate-400">{{ activeAlert.systemCategory }}</span>
                </div>
              </div>

              <!-- 右侧超限看板 -->
              <div class="flex flex-col items-end flex-shrink-0 bg-[#071d42] px-2.5 py-1.5 rounded-lg border border-[#1b4885]">
                <div class="text-xs sm:text-sm font-tech font-bold" :class="getSeverityTextClass(activeAlert.severity)">
                  实时值: {{ activeAlert.realtimeValue }}
                </div>
                <div class="text-[10px] text-slate-300 font-mono mt-0.5">
                  安全限值: ≤ {{ activeAlert.threshold }}
                </div>
                <div class="text-[9.5px] font-semibold" :class="getSeverityTextClass(activeAlert.severity)">
                  超限偏差: {{ activeAlert.overValue }}
                </div>
              </div>
            </div>

            <!-- 设备深度工况技术规格网格 (丰富而整洁) -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1 text-[10.5px]">
              <div class="bg-[#05132b]/90 p-1.5 rounded border border-white/5">
                <div class="text-[9.5px] text-slate-400">电气技术规格</div>
                <div class="text-slate-200 font-medium truncate mt-0.5">{{ activeAlert.specs }}</div>
              </div>
              <div class="bg-[#05132b]/90 p-1.5 rounded border border-white/5">
                <div class="text-[9.5px] text-slate-400">通信协议与节点</div>
                <div class="text-slate-200 font-mono truncate mt-0.5">{{ activeAlert.protocol }}</div>
              </div>
              <div class="bg-[#05132b]/90 p-1.5 rounded border border-white/5">
                <div class="text-[9.5px] text-slate-400">健康度评分</div>
                <div class="text-emerald-400 font-bold font-mono truncate mt-0.5">{{ activeAlert.healthScore }} / 100 分</div>
              </div>
              <div class="bg-[#05132b]/90 p-1.5 rounded border border-white/5">
                <div class="text-[9.5px] text-slate-400">防护等级 / 巡检周期</div>
                <div class="text-slate-200 truncate mt-0.5">{{ activeAlert.ipRating }} · {{ activeAlert.checkPeriod }}</div>
              </div>
            </div>

            <!-- 风险研判与影响说明 -->
            <div class="p-2 rounded bg-amber-950/30 border border-amber-500/30 text-[10.5px] text-amber-200/90 leading-relaxed flex items-start gap-1.5">
              <AlertTriangle class="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
              <span><strong>风险研判：</strong>{{ activeAlert.riskNotice }}</span>
            </div>
          </div>

          <!-- B. 异常趋势时序突变曲线 (高对比度精细趋势，杜绝全屏大红) -->
          <div class="flex flex-col gap-1 bg-[#041228]/80 p-2 rounded-lg border border-white/5 flex-shrink-0">
            <div class="flex items-center justify-between text-xs">
              <span class="text-slate-300 font-semibold flex items-center gap-1.5">
                <Activity class="w-3.5 h-3.5 text-cyan-400" />
                <span>异常时序突变趋势监测</span>
              </span>
              <span class="text-[10px] text-slate-400 font-mono">
                {{ activeAlert.durationText }} · {{ activeAlert.trendDesc }}
              </span>
            </div>

            <!-- 专属精细折线图 -->
            <div class="h-12 w-full relative px-1 bg-black/40 rounded border border-white/5 overflow-hidden">
              <svg class="w-full h-full" viewBox="0 0 320 45" preserveAspectRatio="none">
                <!-- 阈值虚线 (Y=20) -->
                <line x1="5" y1="20" x2="315" y2="20" stroke="#f59e0b" stroke-width="1" stroke-dasharray="4 2" />
                <text x="8" y="16" fill="#f59e0b" font-size="8" font-family="monospace">门限阈值 {{ activeAlert.threshold }}</text>

                <!-- 越限突变阴影区 -->
                <path
                  :d="activeAlert.sparklineOverArea"
                  :fill="activeAlert.severity === 'red' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(245, 158, 11, 0.25)'"
                />

                <!-- 历史平稳线 -->
                <path
                  :d="activeAlert.sparklineStrokeBefore"
                  fill="none"
                  stroke="#38bdf8"
                  stroke-width="1.8"
                />

                <!-- 越限抬升线 -->
                <path
                  :d="activeAlert.sparklineStrokeOver"
                  fill="none"
                  :stroke="activeAlert.severity === 'red' ? '#ef4444' : activeAlert.severity === 'orange' ? '#f59e0b' : '#eab308'"
                  stroke-width="2.2"
                />

                <!-- 突变转折点 -->
                <circle cx="180" cy="20" r="2.5" fill="#f59e0b" stroke="#ffffff" stroke-width="1" />
                <!-- 实时最新测点 -->
                <circle cx="280" :cy="activeAlert.endY" r="3" :fill="activeAlert.severity === 'red' ? '#ef4444' : '#f59e0b'" stroke="#ffffff" stroke-width="1.5" />
              </svg>
            </div>
          </div>

          <!-- C. 标准化 4 步处置闭环流程 + 责任人 -->
          <div class="flex flex-col gap-1.5 py-1 border-t border-b border-white/10 flex-shrink-0">
            <div class="flex items-center justify-between text-xs">
              <span class="text-slate-300 font-semibold">处置流程 (4步标准化闭环流转)</span>
              <span class="text-cyan-300 text-[10.5px]">
                责任人: <strong class="text-white">{{ activeAlert.assignee }}</strong> ({{ activeAlert.phone }})
              </span>
            </div>

            <!-- 4 步流程流转卡片 -->
            <div class="grid grid-cols-4 gap-1.5 text-[10.5px]">
              <!-- 1. 触发 -->
              <div
                class="px-1.5 py-1.5 rounded-lg border flex flex-col items-center justify-center text-center transition-colors"
                :class="activeAlert.step >= 1 ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-300' : 'bg-slate-900/60 border-slate-800 text-slate-500'"
              >
                <span class="font-bold">1. 阈值触发</span>
                <span class="text-[9px] text-slate-400 mt-0.5">{{ activeAlert.alarmTime }}</span>
              </div>

              <!-- 2. 派单 -->
              <div
                class="px-1.5 py-1.5 rounded-lg border flex flex-col items-center justify-center text-center transition-colors"
                :class="activeAlert.step >= 2 ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-300' : 'bg-slate-900/60 border-slate-800 text-slate-500'"
              >
                <span class="font-bold">2. 调度派单</span>
                <span class="text-[9px] text-slate-400 mt-0.5">{{ activeAlert.step >= 2 ? '工单已下发' : '待调度' }}</span>
              </div>

              <!-- 3. 排查 -->
              <div
                class="px-1.5 py-1.5 rounded-lg border flex flex-col items-center justify-center text-center transition-colors"
                :class="activeAlert.step >= 3 ? (activeAlert.step === 3 ? 'bg-cyan-950/90 border-cyan-400 text-cyan-200 ring-1 ring-cyan-400/50' : 'bg-emerald-950/70 border-emerald-500/60 text-emerald-300') : 'bg-slate-900/60 border-slate-800 text-slate-500'"
              >
                <span class="font-bold flex items-center gap-1">
                  <span>3. 现场排查</span>
                  <span v-if="activeAlert.step === 3" class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                </span>
                <span class="text-[9px] text-slate-400 mt-0.5">{{ activeAlert.step >= 3 ? (activeAlert.step === 3 ? '核验排查中' : '排查完成') : '待响应' }}</span>
              </div>

              <!-- 4. 销号 -->
              <div
                class="px-1.5 py-1.5 rounded-lg border flex flex-col items-center justify-center text-center transition-colors"
                :class="activeAlert.step >= 4 ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-300' : 'bg-slate-900/60 border-slate-800 text-slate-500'"
              >
                <span class="font-bold">4. 复测销号</span>
                <span class="text-[9px] text-slate-400 mt-0.5">{{ activeAlert.step >= 4 ? '已闭环归档' : '待复测' }}</span>
              </div>
            </div>
          </div>

          <!-- D. 操作流水记录 (可滚动流水日志) -->
          <div class="flex-1 flex flex-col min-h-0 bg-[#041026]/70 p-2 rounded-lg border border-white/5 overflow-hidden">
            <div class="text-[10.5px] text-slate-400 mb-1 flex items-center justify-between flex-shrink-0">
              <span class="flex items-center gap-1.5 text-slate-300 font-semibold">
                <FileText class="w-3.5 h-3.5 text-cyan-400" />
                <span>协同处置操作记录</span>
              </span>
              <span class="text-[9.5px] text-slate-500 font-mono">共 {{ activeAlert.logs.length }} 条流水</span>
            </div>
            <div class="flex-1 overflow-y-auto no-scrollbar space-y-1 text-[10.5px]">
              <div
                v-for="(log, lIdx) in activeAlert.logs"
                :key="lIdx"
                class="flex items-start gap-1.5 text-slate-300 leading-tight py-0.5"
              >
                <span class="text-cyan-400/80 font-mono text-[9.5px] flex-shrink-0 mt-0.5">{{ log.time }}</span>
                <span class="text-slate-400 font-medium flex-shrink-0">[{{ log.user }}]</span>
                <span class="text-slate-200">{{ log.text }}</span>
              </div>
            </div>
          </div>

          <!-- E. 闭环处置操作控制条 -->
          <div class="flex items-center justify-between gap-2 pt-1 border-t border-white/10 flex-shrink-0">
            <button
              @click="viewDeviceIn3D(activeAlert.deviceId)"
              class="px-2.5 py-1.5 rounded-lg bg-[#0c244d] hover:bg-[#13356e] text-cyan-200 text-xs border border-cyan-500/40 transition-all cursor-pointer flex items-center gap-1.5"
              title="在星云计算中心 3D 数字孪生模型中定位该设备"
            >
              <Eye class="w-3.5 h-3.5" />
              <span>三维孪生定位</span>
            </button>

            <!-- 操作推进按键 -->
            <div class="flex items-center gap-2">
              <button
                v-if="activeAlert.step === 1"
                @click="advanceStep(activeAlert.id)"
                class="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white cursor-pointer transition-all active:scale-95 shadow flex items-center gap-1.5"
              >
                <Send class="w-3.5 h-3.5" />
                <span>立即派发工单</span>
              </button>
              <button
                v-else-if="activeAlert.step === 2"
                @click="advanceStep(activeAlert.id)"
                class="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer transition-all active:scale-95 shadow flex items-center gap-1.5"
              >
                <MapPin class="w-3.5 h-3.5" />
                <span>确认到位排查</span>
              </button>
              <button
                v-else-if="activeAlert.step === 3"
                @click="advanceStep(activeAlert.id)"
                class="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer transition-all active:scale-95 shadow flex items-center gap-1.5"
                title="现场排查与复测合格，执行闭环销号"
              >
                <Check class="w-3.5 h-3.5" />
                <span>复测合格·闭环销号</span>
              </button>
              <button
                v-else
                @click="resetStep(activeAlert.id)"
                class="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer transition-all flex items-center gap-1"
                title="重新核验该告警点位"
              >
                <RotateCcw class="w-3 h-3" />
                <span>重新复核</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  ShieldAlert,
  Shield,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Activity,
  FileText,
  MapPin,
  ChevronRight,
  Eye,
  Send,
  Check,
  RotateCcw,
  Box
} from 'lucide-vue-next';
import Datacenter3DCard from '@/components/overview/Datacenter3DCard.vue';
import { enterEmergencyMode } from '@/composables/useEmergencyMode';
import { activeFocusHotspot, openDeviceInspection } from '@/composables/useCockpitState';

const router = useRouter();
const viewMode = ref<'3d' | 'list'>('3d');
const feedbackNotice = ref('');
const filterStatus = ref<'all' | 'active' | 'resolved'>('all');
const selectedAlertId = ref<string>('ground');

// 严格预警等级色彩定义（规范：红色严格保留给一级严重故障事故，当前受控为0，杜绝大面积爆红）
const warningTiers = [
  {
    name: '一级红色预警 (严重)',
    condition: '电场 > 40 kV/m · 绝缘击穿或短路事故',
    action: '全域电磁屏蔽密封，全站切断市电启应急发电机组',
    active: false,
    color: 'text-red-400',
    dotColor: 'bg-slate-500',
    activeClass: 'border-red-500/60 bg-[#350b0b]'
  },
  {
    name: '二级橙色预警 (高危)',
    condition: '接地阻抗持续抬升 > 0.80Ω · 距离 < 10km',
    action: '开启双流向主动截流，阻隔外部弱电反击浪涌',
    active: false,
    color: 'text-amber-400',
    dotColor: 'bg-amber-400',
    activeClass: 'border-amber-500/60 bg-[#2d1706]'
  },
  {
    name: '三级黄色预警 (关注)',
    condition: 'SPD漏电流微变 > 0.20mA · 早期老化排查',
    action: '机房UPS切入抗扰滤波，巡视各级SPD漏电',
    active: true,
    color: 'text-yellow-400',
    dotColor: 'bg-yellow-400',
    activeClass: 'border-yellow-500/60 bg-[#291e07]'
  },
  {
    name: '四级蓝色预警 (提示)',
    condition: '天面大气电场突变 · 远距雷暴云团监视',
    action: '平台广播预警，例行巡检外场地网与接闪塔',
    active: false,
    color: 'text-cyan-400',
    dotColor: 'bg-cyan-400',
    activeClass: 'border-cyan-500/60 bg-[#061e40]'
  }
];

export interface DisposalAlertItem {
  id: string;
  title: string;
  severity: 'red' | 'orange' | 'yellow' | 'blue';
  severityText: string;
  deviceCode: string;
  deviceName: string;
  systemCategory: string;
  location: string;
  deviceId: string;
  realtimeValue: string;
  threshold: string;
  overValue: string;
  specs: string;
  protocol: string;
  healthScore: number;
  ipRating: string;
  checkPeriod: string;
  alarmTime: string;
  durationText: string;
  trendDesc: string;
  riskNotice: string;
  assignee: string;
  phone: string;
  step: number; // 1: 触发, 2: 派单, 3: 排查, 4: 销号
  status: string;
  sparklineStrokeBefore: string;
  sparklineStrokeOver: string;
  sparklineOverArea: string;
  endY: number;
  logs: Array<{ time: string; user: string; text: string }>;
}

// 统一告警实例列表 (包含异常趋势、处置流程、责任人与操作记录)
const currentAlerts = ref<DisposalAlertItem[]>([
  {
    id: 'ground',
    title: '园区人工地网基准测试井阻抗超标',
    severity: 'orange',
    severityText: '二级高危预警',
    deviceCode: 'GW-01# (DEV-GND-001)',
    deviceName: '地网电阻在线监测终端 (GND-NET)',
    systemCategory: '防雷与全域接地系统',
    location: '园区地下 -1F 人工地网基准测试井 (标高 -4.2m)',
    deviceId: 'DEV-GND-001',
    realtimeValue: '0.88 Ω',
    threshold: '0.80 Ω',
    overValue: '+0.08 Ω (超标 10%)',
    specs: '紫铜热熔焊网格 · 4点等电位连接',
    protocol: 'Modbus-RTU / 工业网关',
    healthScore: 88,
    ipRating: 'IP67 防水防尘',
    checkPeriod: '1s 实时遥测',
    alarmTime: '15:38:12',
    durationText: '已持续 4分24秒',
    trendDesc: '近2小时连续抬升 +0.06 Ω/h',
    riskNotice: '地电阻超标会导致泄流电位抬升。遇直接雷或感应雷击时，地网均压差扩大，机房弱电设备可能遭受地电位反击浪涌，危及AI计算集群与UPS供电安全！',
    assignee: '机房高压电气运维二组 (张工/李工)',
    phone: '138-1122-3344',
    step: 2,
    status: '已派单',
    sparklineStrokeBefore: 'M 5 32 L 60 30 L 120 31 L 180 20',
    sparklineStrokeOver: 'M 180 20 L 220 12 L 260 8 L 280 6',
    sparklineOverArea: 'M 180 20 L 220 12 L 260 8 L 280 6 L 280 20 Z',
    endY: 6,
    logs: [
      { time: '15:38:12', user: '系统总线', text: '地网电阻传感器采样值达 0.88Ω，超过安全阈值 0.80Ω，触发二级高危预警' },
      { time: '15:38:15', user: '规则引擎', text: '自动关联地下 -3.5m 铜质地网拓扑，生成紧急抢修工单 [WO-928103]' },
      { time: '15:39:02', user: '周工 (调度长)', text: '调度长审核并完成工单下发，派驻电气二组前往 -1F 人工地网测试井现场排查' }
    ]
  },
  {
    id: 'spd',
    title: '2F动力配电室低压母线二级SPD早期漏电微变',
    severity: 'yellow',
    severityText: '三级关注预警',
    deviceCode: 'SPD-04# (DEV-SPD-004)',
    deviceName: '智能浪涌保护器监测终端 (SPD-M)',
    systemCategory: '动力配电过电压保护',
    location: '2F 数据机房动力配电室低压母线柜 A-02',
    deviceId: 'DEV-SPD-004',
    realtimeValue: '0.28 mA',
    threshold: '0.20 mA',
    overValue: '+0.08 mA (超标 40%)',
    specs: 'Imax 80kA · 氧化锌高能压敏阀片',
    protocol: 'BACnet-IP / 动力环境总线',
    healthScore: 92,
    ipRating: 'IP40 柜内嵌入式',
    checkPeriod: '500ms 高频巡检',
    alarmTime: '15:41:05',
    durationText: '已持续 1分31秒',
    trendDesc: '压敏电阻轻微发热，处于早期微劣化区间',
    riskNotice: 'SPD内部氧化锌阀片进入早期衰退区间，建议在下一个维护窗口期更换或进行离线高压直流泄漏测试，避免雷击时残压过高损坏PDU。',
    assignee: '弱电智能化维护班 (王工)',
    phone: '139-5566-7788',
    step: 3,
    status: '排查中',
    sparklineStrokeBefore: 'M 5 35 L 60 34 L 120 33 L 180 20',
    sparklineStrokeOver: 'M 180 20 L 220 15 L 260 12 L 280 10',
    sparklineOverArea: 'M 180 20 L 220 15 L 260 12 L 280 10 L 280 20 Z',
    endY: 10,
    logs: [
      { time: '15:41:05', user: '系统总线', text: 'SPD 监测探针遥测漏电流达 0.28mA，触发三级关注告警' },
      { time: '15:41:40', user: '王工 (现场)', text: '已持红外热像仪进入 2F 机房配电柜 A-02 现场，热成像测温显示阀片温度 38.5℃ (在控)' }
    ]
  },
  {
    id: 'lightning',
    title: '科研楼天面 12号主动接闪塔上空电场畸变',
    severity: 'blue',
    severityText: '四级提示信息',
    deviceCode: 'AEFM-01# (DEV-ENV-001)',
    deviceName: '天面大气电场动态监测探针 (AEFM)',
    systemCategory: '气象与直击雷前沿感知',
    location: '科研楼天面 12号主动接闪塔顶端 (标高 +48.5m)',
    deviceId: 'DEV-ENV-001',
    realtimeValue: '38.6 kV/m',
    threshold: '25.0 kV/m',
    overValue: '+13.6 kV/m (雷暴云前沿)',
    specs: '动态场磨式探头 · 精度 ±2% · 量程 ±100kV/m',
    protocol: '光纤隔离以太网专线',
    healthScore: 99,
    ipRating: 'IP68 耐候抗腐蚀',
    checkPeriod: '100ms 毫秒级推流',
    alarmTime: '15:35:48',
    durationText: '已持续 6分48秒',
    trendDesc: '跃变速率 > 4.2 kV/(m·min)',
    riskNotice: '天面接闪塔上空电荷剧烈积聚，15分钟内算力园区发生对地直击雷概率上升，保持巡检与监测。',
    assignee: '安全调度总控台 (周工)',
    phone: '分机 8012',
    step: 1,
    status: '待调度',
    sparklineStrokeBefore: 'M 5 36 L 60 35 L 120 32 L 180 20',
    sparklineStrokeOver: 'M 180 20 L 220 14 L 260 9 L 280 7',
    sparklineOverArea: 'M 180 20 L 220 14 L 260 9 L 280 7 L 280 20 Z',
    endY: 7,
    logs: [
      { time: '15:35:48', user: '气象探头', text: '天面大气电场跃升至 38.6kV/m，雷云临近天面主动避雷塔群' },
      { time: '15:36:10', user: '自动化预案', text: '启动防雷预警三级响应，联动女儿墙接闪网与地网放电回路自检' }
    ]
  },
  {
    id: 'esd_channel',
    title: '主机房 A01列机柜通道防静电接地阻抗微浮动',
    severity: 'blue',
    severityText: '四级提示信息',
    deviceCode: 'ESD-02# (DEV-ESD-002)',
    deviceName: '防静电微模块监测点',
    systemCategory: '机房静电防护系统',
    location: '2F 核心算力机房 A01列冷通道两端',
    deviceId: 'DEV-ESD-002',
    realtimeValue: '0.72 MΩ',
    threshold: '1.00 MΩ',
    overValue: '正常标准范围内',
    specs: '防静电耗散地板 · 等电位铜接地排',
    protocol: 'RS485 / 智能母线网关',
    healthScore: 100,
    ipRating: 'IP54',
    checkPeriod: '5s 定时监测',
    alarmTime: '11:20:00',
    durationText: '已处置完成',
    trendDesc: '指标已回归稳定基线',
    riskNotice: '机房微模块静电电位低于安全上限 100V，对高密算力服务器芯片无威胁。',
    assignee: '设施运维一组 (陈工)',
    phone: '136-7788-9900',
    step: 4,
    status: '已闭环',
    sparklineStrokeBefore: 'M 5 25 L 60 22 L 120 20 L 180 20',
    sparklineStrokeOver: 'M 180 20 L 220 28 L 260 32 L 280 34',
    sparklineOverArea: 'M 180 20 L 220 28 L 260 32 L 280 34 L 280 20 Z',
    endY: 34,
    logs: [
      { time: '11:20:00', user: '系统总线', text: '防静电地坪微电位出现小幅浮动 (0.72MΩ)' },
      { time: '11:25:30', user: '陈工', text: '现场紧固防静电铜排压接螺栓，阻抗复测合格' },
      { time: '11:30:15', user: '调度台', text: '复测合格，闭环销号归档' }
    ]
  },
  {
    id: 'chiller_spd',
    title: '西侧冷冻站 1# 冷水机组变频输入端浪涌旁路自检',
    severity: 'blue',
    severityText: '四级提示信息',
    deviceCode: 'SPD-CH-01',
    deviceName: '冷水机组专用浪涌旁路器',
    systemCategory: '暖通动力配电保护',
    location: '西侧水冷机房动力配电总柜 #1',
    deviceId: 'DEV-CHILLER-01',
    realtimeValue: '0.04 mA',
    threshold: '0.20 mA',
    overValue: '指标优秀',
    specs: '通流容量 40kA · 响应时间 < 25ns',
    protocol: 'BACnet / 冷机中控',
    healthScore: 100,
    ipRating: 'IP55',
    checkPeriod: '日检通过',
    alarmTime: '09:16:00',
    durationText: '已闭环',
    trendDesc: '泄漏电流维持在极低基准值',
    riskNotice: '冷水机组变频压缩机供电稳定，旁路压敏元件完好。',
    assignee: '暖通动力班 (刘工)',
    phone: '135-2233-4455',
    step: 4,
    status: '已闭环',
    sparklineStrokeBefore: 'M 5 30 L 60 32 L 120 30 L 180 31',
    sparklineStrokeOver: 'M 180 31 L 220 32 L 260 33 L 280 34',
    sparklineOverArea: 'M 180 31 L 220 32 L 260 33 L 280 34 L 280 31 Z',
    endY: 34,
    logs: [
      { time: '09:16:00', user: 'BA系统', text: '冷水机组自检通过，无越限' },
      { time: '09:20:00', user: '刘工', text: '日常工况确认完毕' }
    ]
  }
]);

const unclosedCount = computed(() => {
  return currentAlerts.value.filter((a) => a.step < 4).length;
});

const resolvedCount = computed(() => {
  return currentAlerts.value.filter((a) => a.step >= 4).length;
});

const filteredAlerts = computed(() => {
  if (filterStatus.value === 'active') {
    return currentAlerts.value.filter((a) => a.step < 4);
  }
  if (filterStatus.value === 'resolved') {
    return currentAlerts.value.filter((a) => a.step >= 4);
  }
  return currentAlerts.value;
});

const activeAlert = computed(() => {
  const found = currentAlerts.value.find((a) => a.id === selectedAlertId.value);
  return found || currentAlerts.value[0];
});

function selectAlert(id: string) {
  selectedAlertId.value = id;
}

// 处置流程操作推进
function advanceStep(id: string) {
  const item = currentAlerts.value.find((a) => a.id === id);
  if (!item) return;

  const now = new Date().toTimeString().slice(0, 8);
  if (item.step === 1) {
    item.step = 2;
    item.status = '已派单';
    item.logs.unshift({
      time: now,
      user: '周工 (值班长)',
      text: `已派发处置工单 [WO-${Date.now().toString().slice(-6)}] 至 ${item.assignee}`
    });
    feedbackNotice.value = `【工单已派发】已通知责任人 ${item.assignee}，工单状态流转为【已派单】`;
  } else if (item.step === 2) {
    item.step = 3;
    item.status = '排查中';
    item.logs.unshift({
      time: now,
      user: item.assignee.slice(0, 5),
      text: `工程师已携带专业仪器到位 ${item.location} 展开现场排查与核验`
    });
    feedbackNotice.value = `【现场排查中】${item.assignee} 确认到位，正在核查电气阻抗与波形指标`;
  } else if (item.step === 3) {
    item.step = 4;
    item.status = '已闭环';
    item.logs.unshift({
      time: now,
      user: '质量核验组',
      text: `现场复测遥测值已恢复正常限值内，符合国标规范，执行闭环销号归档`
    });
    feedbackNotice.value = `【已闭环销号】${item.deviceName} 现场复测合格，告警已正式闭环归档！`;
  }

  setTimeout(() => {
    feedbackNotice.value = '';
  }, 5000);
}

function resetStep(id: string) {
  const item = currentAlerts.value.find((a) => a.id === id);
  if (!item) return;
  item.step = 2;
  item.status = '已派单';
  item.logs.unshift({
    time: new Date().toTimeString().slice(0, 8),
    user: '周工 (值班长)',
    text: '发起重新复核流程，重新派发巡检工单'
  });
  feedbackNotice.value = '已重新发起复核工单！';
  setTimeout(() => {
    feedbackNotice.value = '';
  }, 4000);
}

function openEmergency3D() {
  enterEmergencyMode(activeAlert.value.id || 'ground');
  router.push('/overview');
}

function handle3DSelectAlarm(alarmId: string) {
  const match = currentAlerts.value.find(
    (a) =>
      a.id === alarmId ||
      a.deviceId === alarmId ||
      a.deviceCode === alarmId ||
      (alarmId === 'ground' && a.id === 'ground') ||
      (alarmId === 'spd' && a.id === 'spd') ||
      (alarmId === 'lightning' && a.id === 'lightning')
  );
  if (match) {
    selectedAlertId.value = match.id;
  }
}

function viewDeviceIn3D(deviceId: string) {
  viewMode.value = '3d';
  const match = currentAlerts.value.find(
    (a) => a.id === deviceId || a.deviceId === deviceId || a.deviceCode === deviceId
  );
  if (match) {
    selectedAlertId.value = match.id;
  }
  activeFocusHotspot.value = deviceId;
  feedbackNotice.value = `已在中央三维数字孪生底座中聚焦【${activeAlert.value.deviceName}】，并智能启用对应区域透视！`;
  setTimeout(() => {
    feedbackNotice.value = '';
  }, 4500);
}

function triggerDefenseTest() {
  feedbackNotice.value = '【主动防御测试成功】指令已执行！SPD状态自检通过，等电位均压继电器响应 18ms，全链路就绪。';
  setTimeout(() => {
    feedbackNotice.value = '';
  }, 5000);
}

function getLevelBadgeClass(severity: string) {
  switch (severity) {
    case 'red':
      return 'bg-[#450a0a] text-red-300 border border-red-500/70';
    case 'orange':
      return 'bg-[#401b07] text-amber-300 border border-amber-500/60';
    case 'yellow':
      return 'bg-[#3b2b06] text-yellow-300 border border-yellow-500/60';
    case 'blue':
    default:
      return 'bg-[#0d2a58] text-cyan-300 border border-cyan-500/60';
  }
}

function getSeverityTextClass(severity: string) {
  switch (severity) {
    case 'red':
      return 'text-red-400';
    case 'orange':
      return 'text-amber-400';
    case 'yellow':
      return 'text-yellow-400';
    case 'blue':
    default:
      return 'text-cyan-300';
  }
}

function getStatusBadgeClass(status: string) {
  if (status === '已闭环') {
    return 'bg-[#082b21] text-emerald-300 border border-emerald-500/50';
  }
  if (status === '排查中') {
    return 'bg-[#0d2a58] text-cyan-300 border border-cyan-400/60 animate-pulse';
  }
  if (status === '已派单') {
    return 'bg-[#3e1d08] text-amber-300 border border-amber-500/60';
  }
  return 'bg-[#291e07] text-yellow-300 border border-yellow-500/50';
}
</script>
