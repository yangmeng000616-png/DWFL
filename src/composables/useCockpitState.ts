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
    },
    'DEV-TR-01': {
      id: 'DEV-TR-01',
      name: '1# 110kV/10kV 油浸式主变压器',
      code: 'DEV-TR-01',
      category: '高压供配电系统',
      location: '东侧变配电中心室外变压器场 1# 隔离仓',
      status: '正常',
      statusType: 'success',
      realtimeValue: '负载率 62.4% · 顶层油温 54.2℃',
      normalRange: '额定容量 25000kVA · 油温 ≤ 85℃',
      healthScore: 98,
      ipAddress: '192.168.30.10',
      protocol: 'IEC 61850 光纤变电站总线',
      lastCheckTime: '实时遥测 (在线色谱监测)',
      desc: '三相双绕组低损耗有载调压变压器，配备瓦斯继电器、压力释放阀与高阻抗氧化锌避雷器组。',
      recentTrends: [52, 53, 54, 54.2, 54.1, 54.2]
    },
    'DEV-CHILLER-01': {
      id: 'DEV-CHILLER-01',
      name: '1# 离心式变频冷水机组',
      code: 'DEV-CHILLER-01',
      category: '暖通冷冻站系统',
      location: '西侧冷水机组设备区基础平台 #1',
      status: '正常',
      statusType: 'success',
      realtimeValue: 'COP 6.82 · 出水温度 7.2℃',
      normalRange: '制冷量 1200RT · 出水温控 7.0±0.5℃',
      healthScore: 99,
      ipAddress: '192.168.30.50',
      protocol: 'BACnet-IP / BA中控',
      lastCheckTime: '实时在线',
      desc: '采用环保制冷剂与高效变频双级压缩机，大温差小流量节能工况运行，出水温度波动小于±0.2℃。',
      recentTrends: [7.3, 7.2, 7.1, 7.2, 7.2, 7.2]
    },
    'DEV-GEN-01': {
      id: 'DEV-GEN-01',
      name: '1# 2000kW 应急高压柴油发电机组',
      code: 'DEV-GEN-01',
      category: '应急后备动力系统',
      location: '东南侧独立柴发动力用房 1# 机位',
      status: '正常',
      statusType: 'success',
      realtimeValue: '蓄电池电压 26.8V · 水温预热 42℃',
      normalRange: '自启动并机响应时间 ≤ 15秒',
      healthScore: 99,
      ipAddress: '192.168.30.80',
      protocol: 'Modbus-TCP / 应急自启动控制柜',
      lastCheckTime: '每周自动静态自检合格',
      desc: '采用康明斯高压重载机组与低噪声进排风消音房设计，配置24小时日用防爆储油罐与静音排烟立管。',
      recentTrends: [26.8, 26.8, 26.7, 26.8, 26.8, 26.8]
    },
    'DEV-NOC-SCREEN': {
      id: 'DEV-NOC-SCREEN',
      name: 'NOC 运维总控 8K 超高清数字孪生监控大屏',
      code: 'NOC-SCREEN-01',
      category: '智能化与综合运维管控系统',
      location: '1F NOC 运营监控调度大厅主立面 (18m×3.6m 微弧大屏)',
      status: '正常',
      statusType: 'success',
      realtimeValue: '8K 超高刷 120Hz · 全球气象与雷电监测专线激活',
      normalRange: 'P0.9 MicroLED · 冗余双发卡 · 双路2N市电保障',
      healthScore: 100,
      ipAddress: '192.168.10.10',
      protocol: 'DVI/光纤KVM矩阵 / 毫秒级态势推流',
      lastCheckTime: '实时运行中',
      desc: '负责全园区电力供应、暖通冷冻循环、雷电预警放电、机房微模块环境等全系统3D数字孪生可视总控。',
      recentTrends: [100, 100, 100, 100, 100, 100]
    },
    'DEV-NOC-DUTY': {
      id: 'DEV-NOC-DUTY',
      name: '星云计算中心 7×24小时值班调度长指挥台',
      code: 'DUTY-DESK-01',
      category: '运维值班调度保障席',
      location: '1F NOC 监控大厅主指挥工位 (D-01)',
      status: '正常',
      statusType: 'success',
      realtimeValue: '双人双审在岗 (张工/李工) · 一级调度权限就绪',
      normalRange: '支持一键启动应急动力切换与防雷联动',
      healthScore: 100,
      ipAddress: '192.168.10.12',
      protocol: '专网IP指挥对讲 / 应急声光联动总线',
      lastCheckTime: '当班交接完毕',
      desc: 'NOC总值班调度席，配备专用应急调度硬按键、无线电防爆对讲专网与一键式数字孪生漫游处置终端。',
      recentTrends: [100, 100, 100, 100, 100, 100]
    },
    'DEV-AISLE-01': {
      id: 'DEV-AISLE-01',
      name: '2F 核心算力中心 #1 冷通道微模块集群',
      code: 'ZONE-A-AISLE-01',
      category: '高密算力与服务器集群',
      location: '2F 核心机房大厅 Zone-A 第 01 列冷通道',
      status: '正常',
      statusType: 'success',
      realtimeValue: '冷通道送风 22.2℃ · 湿度 47.8%RH · 机柜总功耗 142kW',
      normalRange: '冷通道温控 22±2℃ · 静压差 ≥ 15Pa · 防静电接地 ≤ 1Ω',
      healthScore: 99,
      ipAddress: '192.168.20.11',
      protocol: 'SNMPv3 / BACnet / 列头柜智能母线',
      lastCheckTime: '实时遥测中',
      desc: '双排 42U 标准高密服务器机柜封闭冷通道，具备全钢化透明防爆顶棚与平移玻璃门，配置列头智能PDU与等电位防静电铜接地排。',
      recentTrends: [22.1, 22.3, 22.2, 22.2, 22.1, 22.2]
    }
  };

  const found = mockDevices[deviceId];
  if (found) {
    activeInspectionDevice.value = found;
  } else {
    // Generate dynamic card for other devices (e.g. pumps, coolers, test boxes)
    activeInspectionDevice.value = {
      id: deviceId,
      name: `${deviceId} 设备对象`,
      code: deviceId,
      category: '数据中心工业设施',
      location: '星云计算中心园区',
      status: '正常',
      statusType: 'success',
      realtimeValue: '运行指标正常 · 通讯心跳在线',
      normalRange: '工况指标符合设计基准',
      healthScore: 98,
      ipAddress: '192.168.30.200',
      protocol: '工业物联网/Modbus网关',
      lastCheckTime: '实时监测中',
      desc: '星云计算中心数字化工业孪生模型挂载设备，支持实时数据遥测与态势告警联动。',
      recentTrends: [98, 98, 99, 98, 98, 98]
    };
  }
}

export function closeDeviceInspection() {
  activeInspectionDevice.value = null;
}
