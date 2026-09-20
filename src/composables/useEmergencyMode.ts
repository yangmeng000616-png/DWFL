import { ref, computed } from 'vue';

export type AlarmSeverity = 'orange' | 'red' | 'yellow';

export interface EmergencyScenario {
  id: string;
  title: string;
  subNotice?: string;
  severity: AlarmSeverity;
  severityText: string;
  deviceCode: string;
  deviceName: string;
  location: string;
  realtimeValue: string;
  threshold: string;
  overValue: string;
  trendDesc: string;
  unit: string;
  alarmTime: string;
  durationSeconds: number;
  historyCount: number;
  riskNotice: string;
  category: 'ground' | 'spd' | 'lightning';
}

export const SCENARIOS: Record<string, EmergencyScenario> = {
  ground: {
    id: 'ground',
    title: '园区人工地网基准测试井接地阻抗超限',
    subNotice: '接地阻抗持续抬升，超出安全控制线。',
    severity: 'orange',
    severityText: '橙色告警 (二级)',
    deviceCode: 'GW-01# (DEV-GND-001)',
    deviceName: '地网电阻在线监测终端 (GND-NET)',
    location: '园区地下 -1F 人工地网基准测试井 (标高 -4.2m)',
    realtimeValue: '0.88 Ω',
    threshold: '0.80 Ω',
    overValue: '+0.08 Ω (超标 10%)',
    trendDesc: '近2小时连续抬升 +0.06 Ω/h',
    unit: 'Ω',
    alarmTime: '15:38:12',
    durationSeconds: 264,
    historyCount: 2,
    riskNotice: '地电阻超标会导致泄流电位抬升。遇直接雷或感应雷击时，地网均压差扩大，机房弱电设备可能遭受地电位反击浪涌，危及AI计算集群与UPS供电安全！',
    category: 'ground'
  },
  spd: {
    id: 'spd',
    title: '2F动力配电室二级SPD漏电流超标且热敏预动',
    subNotice: '压敏电阻泄漏电流劣化剧增，内部热敏脱扣预警。',
    severity: 'red',
    severityText: '红色严重告警 (一级)',
    deviceCode: 'SPD-04# (DEV-SPD-004)',
    deviceName: '智能浪涌保护器监测终端 (SPD-M)',
    location: '2F 数据机房动力配电室低压母线柜 A-02',
    realtimeValue: '0.28 mA',
    threshold: '0.20 mA',
    overValue: '+0.08 mA (劣化超阈值 40%)',
    trendDesc: '压敏电阻阻抗骤降，伴随腔体温升 +8.5℃',
    unit: 'mA',
    alarmTime: '15:41:05',
    durationSeconds: 91,
    historyCount: 1,
    riskNotice: 'SPD内部氧化锌阀片已进入雪崩衰老区，如遭遇后续雷暴波将失去泄流防护能力，严重时有电弧自燃短路风险，必须紧急断路更替或旁路投切！',
    category: 'spd'
  },
  lightning: {
    id: 'lightning',
    title: '强雷暴云系临近接闪塔空间电场剧烈畸变',
    subNotice: '雷暴云电荷快速聚集，下行先导处于触发临界区。',
    severity: 'yellow',
    severityText: '黄色雷电预警 (三级)',
    deviceCode: 'AEFM-01# (DEV-ENV-001)',
    deviceName: '大气电场动态监测探针 (AEFM)',
    location: '科研楼天面 12号主动接闪塔顶端 (标高 +48.5m)',
    realtimeValue: '38.6 kV/m',
    threshold: '25.0 kV/m',
    overValue: '+13.6 kV/m (雷暴云先导已建立)',
    trendDesc: '极性由负转正，跃变速率 > 4.2 kV/(m·min)',
    unit: 'kV/m',
    alarmTime: '15:35:48',
    durationSeconds: 408,
    historyCount: 3,
    riskNotice: '天面接闪塔上空电荷剧烈积聚，15分钟内算力园区发生对地直击雷概率超过 85%，需立即启动精密服务器等电位联防与备用发电机预温！',
    category: 'lightning'
  }
};

// Global reactive states
export const isEmergencyMode = ref<boolean>(false);
export const isNightWatchMode = ref<boolean>(false); // 夜间低光值守模式
export const currentScenarioKey = ref<string>('ground');

// Work order states
export const alarmConfirmed = ref<boolean>(false);
export const alarmDispatched = ref<boolean>(false);
export const alarmResolved = ref<boolean>(false);
export const autoRecoverSeconds = ref<number>(30);
export const actionLog = ref<Array<{ time: string; text: string; user: string }>>([
  { time: '15:38:12', text: '系统自动化探测捕获传感器采样超限，产生橙色告警', user: '系统总线' },
  { time: '15:38:15', text: '触发智算中心智能防护应急预案 L2 级响应', user: '应急联动规则' }
]);

let autoRecoverTimer: number | null = null;

export const currentScenario = computed(() => {
  return SCENARIOS[currentScenarioKey.value] || SCENARIOS.ground;
});

// Switch to emergency mode manually or automatically
export function enterEmergencyMode(scenarioKey: string = 'ground', auto: boolean = false) {
  currentScenarioKey.value = scenarioKey;
  isEmergencyMode.value = true;
  alarmConfirmed.value = false;
  alarmDispatched.value = false;
  alarmResolved.value = false;
  if (autoRecoverTimer) {
    clearInterval(autoRecoverTimer);
    autoRecoverTimer = null;
  }
  autoRecoverSeconds.value = 30;

  actionLog.value = [
    { time: '15:38:12', text: `监测数据触发 ${currentScenario.value.severityText}，系统联动应急视图`, user: auto ? '自动化策略触发' : '值班员手动介入' },
    { time: '15:38:15', text: `启动 ${currentScenario.value.deviceName} 专属应急处置处置流程`, user: '联动调度系统' }
  ];
}

// Exit back to normal dashboard
export function exitEmergencyMode() {
  isEmergencyMode.value = false;
  if (autoRecoverTimer) {
    clearInterval(autoRecoverTimer);
    autoRecoverTimer = null;
  }
}

// Confirm Alarm
export function confirmAlarm() {
  alarmConfirmed.value = true;
  actionLog.value.unshift({
    time: new Date().toTimeString().slice(0, 8),
    text: '值班工程师确认告警有效，已核验现场实时遥测指标',
    user: '周工 (值班一室)'
  });
}

// Dispatch Work Order
export function dispatchWorkOrder(assignee: string = '机房高压电气运维四组 (张工/李工)') {
  alarmDispatched.value = true;
  alarmConfirmed.value = true;
  actionLog.value.unshift({
    time: new Date().toTimeString().slice(0, 8),
    text: `派发紧急处置工单 [WO-${Date.now().toString().slice(-6)}] 至 ${assignee}`,
    user: '周工 (值班一室)'
  });
}

// Resolve & Close Alarm
export function resolveAlarm() {
  alarmResolved.value = true;
  actionLog.value.unshift({
    time: new Date().toTimeString().slice(0, 8),
    text: '现场完成工单处置排查与复测闭环，告警已销号，启动30秒复原倒计时',
    user: '张工 (现场运维)'
  });

  // Start 30s countdown to auto restore normal mode
  autoRecoverSeconds.value = 30;
  if (autoRecoverTimer) clearInterval(autoRecoverTimer);
  autoRecoverTimer = window.setInterval(() => {
    if (autoRecoverSeconds.value > 1) {
      autoRecoverSeconds.value--;
    } else {
      if (autoRecoverTimer) clearInterval(autoRecoverTimer);
      autoRecoverTimer = null;
      exitEmergencyMode();
    }
  }, 1000);
}

// Toggle Night Watch Mode
export function toggleNightWatchMode() {
  isNightWatchMode.value = !isNightWatchMode.value;
}
