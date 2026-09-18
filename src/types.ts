export interface AlertItem {
  id: string;
  time: string;
  type: string;
  level: '黄色' | '橙色' | '红色' | '蓝色' | '绿色';
  levelColor: string;
  location: string;
  status: '已处理' | '处理中' | '未处理';
  statusColor: string;
  description?: string;
  suggestedAction?: string;
}

export interface MetricCardData {
  title: string;
  subTitle: string;
  value: string;
  unit?: string;
  status: '正常' | '预警' | '异常';
  icon: string;
  color: string;
}

export interface DeviceStatusItem {
  name: string;
  count: string;
  total: number;
  online: number;
  status: '正常' | '警告' | '故障';
  icon: string;
}

export interface SystemServiceStatus {
  name: string;
  status: '运行正常' | '亚健康' | '异常';
  latency: number;
}

export interface HotspotTag {
  id: string;
  name: string;
  status: string;
  x: number; // percentage
  y: number; // percentage
  type: string;
  params: Record<string, string>;
}
