export type LayerId =
  | 'building'
  | 'interior'
  | 'roads'
  | 'power'
  | 'cooling'
  | 'emergency'
  | 'lightning'
  | 'grounding'
  | 'underground'
  | 'spd'
  | 'esd'
  | 'sensors'
  | 'alarms'
  | 'labels';

export interface LayerConfig {
  id: LayerId;
  name: string;
  category: '建筑与土建' | '机房室内' | '动力暖通' | '防雷防静电' | '辅助标注';
  color: string;
  visible: boolean;
  transparent: boolean;
  opacity: number;
  count?: number;
  description: string;
}

export type ViewPresetId =
  | 'birds_eye'
  | 'xray_datacenter'
  | 'interior_server_room'
  | 'interior_duty_room'
  | 'south_entrance'
  | 'north_logistics'
  | 'east_power'
  | 'west_cooling'
  | 'roof_lightning'
  | 'cooling_yard_detail'
  | 'substation_detail'
  | 'generator_detail'
  | 'underground_grid';

export interface ViewPreset {
  id: ViewPresetId;
  label: string;
  shortLabel: string;
  position: [number, number, number];
  target: [number, number, number];
  description: string;
  undergroundFocus?: boolean;
  xrayFocus?: boolean;
}

export interface EquipmentData {
  id: string;
  code: string;
  name: string;
  type: string;
  system: '防雷接闪' | '接地网' | '浪涌保护SPD' | '防静电ESD' | '变配电' | '暖通冷却' | '应急动力' | '建筑设施';
  location: string;
  status: '正常' | '关注' | '预警' | '严重';
  statusType: 'success' | 'warning' | 'orange' | 'danger' | 'info';
  realtimeValue: string;
  threshold: string;
  normalRange: string;
  healthScore: number;
  ipAddress: string;
  protocol: string;
  lastCheckTime: string;
  specs: string;
  desc: string;
  position: [number, number, number];
  recentTrends?: number[];
}
