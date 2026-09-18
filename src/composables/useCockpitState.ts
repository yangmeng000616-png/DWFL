import { ref } from 'vue';

export interface CockpitDeviceDetail {
  id: string;
  name: string;
  code: string;
  category: string;
  location: string;
  status: '正常' | '关注' | '预警' | '严重';
  statusType: 'success' | 'warning' | 'orange' | 'danger' | 'info';
  realtimeValue: string;
  normalRange: string;
  healthScore: number;
  ipAddress: string;
  protocol: string;
  lastCheckTime: string;
  desc: string;
  recentTrends: number[];
}

export const activeFocusHotspot = ref<string | null>(null);
export const activeInspectionDevice = ref<CockpitDeviceDetail | null>(null);
export const simulatedLightningActive = ref<boolean>(false);

export function triggerSimulatedLightning() {
  simulatedLightningActive.value = true;
  setTimeout(() => {
    simulatedLightningActive.value = false;
  }, 3500);
}

export function openDeviceInspection(deviceId: string) {
  const mockDevices: Record<string, CockpitDeviceDetail> = {
    atmospheric: {
      id: 'atmospheric',
      name: '大气电场仪 (AEFM-01)',
      code: 'DEV-ENV-001',
      category: '空间电场监测',
      location: '科研楼天面 12号接闪塔顶端 (标高 +48.5m)',
      status: '正常',
      statusType: 'success',
      realtimeValue: '12.4 kV/m',
      normalRange: '-15.0 ~ +15.0 kV/m',
      healthScore: 99,
      ipAddress: '192.168.30.101',
      protocol: 'Modbus-TCP / 光纤环网',
      lastCheckTime: '实时在线 (延迟 < 12ms)',
      desc: '全天候高灵敏度动态电荷感应探针，支持±50kV/m宽动态监测与雷暴云团先导极性预警。',
      recentTrends: [8.2, 9.5, 11.0, 12.4, 13.1, 12.4]
    },
    dual_protection: {
      id: 'dual_protection',
      name: '双流向主动防雷装置 (DL-PRO)',
      code: 'DEV-LGT-002',
      category: '直接雷主动拦截装置',
      location: '主建筑屋面东侧中央防雷基站',
      status: '正常',
      statusType: 'success',
      realtimeValue: '截获耐受 58.7 kA (当前泄流 0.0 kA)',
      normalRange: '额定 100 kA (8/20μs & 10/350μs)',
      healthScore: 98,
      ipAddress: '192.168.30.102',
      protocol: 'RS485-LoRa 双模',
      lastCheckTime: '2025-04-29 15:42:01',
      desc: '配备正负双向电离提前放电针与陡脉冲截流消能腔，将雷电流经专用低感引下线直接泄放至深埋地网。',
      recentTrends: [0, 0, 58.7, 12.3, 0.4, 0]
    },
    spd_terminal: {
      id: 'spd_terminal',
      name: '智能浪涌保护器SPD监测终端 (SPD-M)',
      code: 'DEV-SPD-004',
      category: '电源配电二级浪涌监测',
      location: '2F 数据机房动力配电室低压柜 A-02',
      status: '关注',
      statusType: 'warning',
      realtimeValue: '漏电流 0.18 mA · 动作累计 12次',
      normalRange: '漏电流 < 0.15 mA (预警阈值 0.20 mA)',
      healthScore: 89,
      ipAddress: '192.168.30.114',
      protocol: 'CAN-Bus 总线',
      lastCheckTime: '实时在线',
      desc: '持续采样压敏电阻泄漏微安电流与热敏脱扣温度，预测氧化锌阀片衰老寿命。',
      recentTrends: [0.08, 0.10, 0.12, 0.15, 0.17, 0.18]
    },
    ground_res: {
      id: 'ground_res',
      name: '地网电阻在线监测终端 (GND-NET)',
      code: 'DEV-GND-001',
      category: '联合接地电网',
      location: '园区地下-1F 人工地网基准测试井 (GW-01#)',
      status: '正常',
      statusType: 'success',
      realtimeValue: '0.52 Ω',
      normalRange: '国标标准 ≤ 1.0 Ω (设计指标 ≤ 0.8 Ω)',
      healthScore: 97,
      ipAddress: '192.168.30.105',
      protocol: '工业以太网 / 环网透传',
      lastCheckTime: '2025-04-29 15:40:00 (每5分钟巡检)',
      desc: '采用四极交流异频抗干扰注入法，避免杂散电流干扰，实时监控闭合地网均压特性。',
      recentTrends: [0.55, 0.54, 0.53, 0.52, 0.52, 0.52]
    },
    esd_terminal: {
      id: 'esd_terminal',
      name: '微环境静电综合监测终端 (ESD-MON)',
      code: 'DEV-ESD-008',
      category: '机房防静电微环境',
      location: '主机房高密服务器 A01-A16 列冷通道',
      status: '正常',
      statusType: 'success',
      realtimeValue: '0.8 kV (人员残存电压 < 25 V)',
      normalRange: '安全阈值 < 1.0 kV',
      healthScore: 99,
      ipAddress: '192.168.30.120',
      protocol: 'Zigbee 无线传感网',
      lastCheckTime: '实时连续遥测',
      desc: '监测防静电地板泄漏电阻、腕带接地在线回路阻抗，以及离子风机消电衰减时间。',
      recentTrends: [0.6, 0.7, 0.9, 0.8, 0.8, 0.8]
    },
    datacenter_zone: {
      id: 'datacenter_zone',
      name: '算力中心主机房核心防护区 (Zone-A)',
      code: 'ZONE-CORE-01',
      category: '防雷防静电屏蔽舱',
      location: '2F 算力中心主建筑核心机房区 (面积 1800㎡)',
      status: '正常',
      statusType: 'success',
      realtimeValue: '屏蔽效能 > 85dB · 等电位联结差 < 5mV',
      normalRange: '法拉第笼电磁屏蔽标准 B级',
      healthScore: 99,
      ipAddress: '192.168.30.1',
      protocol: '智能BIM/数字孪生骨干中控',
      lastCheckTime: '系统实时联防联动中',
      desc: '六面体连续法拉第笼屏蔽结构，机房内机柜、线槽、金属管道均可靠连接至星型等电位铜带 (MEB)。',
      recentTrends: [99, 99, 98, 99, 99, 100]
    }
  };

  activeInspectionDevice.value = mockDevices[deviceId] || mockDevices.atmospheric;
}

export function closeDeviceInspection() {
  activeInspectionDevice.value = null;
}
