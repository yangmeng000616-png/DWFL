import * as THREE from 'three';

export interface MaterialLibrary {
  curtainWallLight: THREE.MeshStandardMaterial;
  sandwichWallDark: THREE.MeshStandardMaterial;
  architecturalConcrete: THREE.MeshStandardMaterial;
  glassTinted: THREE.MeshStandardMaterial;
  ventLouver: THREE.MeshStandardMaterial;
  canopyFascia: THREE.MeshStandardMaterial;
  roofDeck: THREE.MeshStandardMaterial;
  roadAsphalt: THREE.MeshStandardMaterial;
  concretePaving: THREE.MeshStandardMaterial;
  roadLineWhite: THREE.MeshStandardMaterial;
  roadLineYellow: THREE.MeshStandardMaterial;
  galvanizedSteel: THREE.MeshStandardMaterial;
  safetyYellow: THREE.MeshStandardMaterial;
  pipeChilledSupply: THREE.MeshStandardMaterial;
  pipeChilledReturn: THREE.MeshStandardMaterial;
  pipeCondenserWater: THREE.MeshStandardMaterial;
  pipeRefrigerant: THREE.MeshStandardMaterial;
  transformerBody: THREE.MeshStandardMaterial;
  insulatorCeramic: THREE.MeshStandardMaterial;
  generatorBody: THREE.MeshStandardMaterial;
  exhaustStack: THREE.MeshStandardMaterial;
  chillerBody: THREE.MeshStandardMaterial;
  lightningConductor: THREE.MeshStandardMaterial;
  lightningMastActive: THREE.MeshStandardMaterial;
  groundingCopperBus: THREE.MeshStandardMaterial;
  groundingSoilStratum: THREE.MeshStandardMaterial;
  testBoxBody: THREE.MeshStandardMaterial;
  sensorProbe: THREE.MeshStandardMaterial;
  statusNormal: THREE.MeshStandardMaterial;
  statusWarning: THREE.MeshStandardMaterial;
  statusOrange: THREE.MeshStandardMaterial;
  statusAlarm: THREE.MeshStandardMaterial;
}

export function createMaterials(): MaterialLibrary {
  return {
    // 浅灰色金属幕墙 (RAL 7035)
    curtainWallLight: new THREE.MeshStandardMaterial({
      color: 0xc4cdd9,
      metalness: 0.52,
      roughness: 0.32,
    }),

    // 深灰色金属夹芯墙板 (RAL 7016)
    sandwichWallDark: new THREE.MeshStandardMaterial({
      color: 0x222a36,
      metalness: 0.48,
      roughness: 0.38,
    }),

    // 清水混凝土 (基础、裙楼边角柱)
    architecturalConcrete: new THREE.MeshStandardMaterial({
      color: 0x88929e,
      metalness: 0.08,
      roughness: 0.82,
    }),

    // 建筑隔热低反低辐射玻璃 (高位窄窗、门厅玻璃幕)
    glassTinted: new THREE.MeshStandardMaterial({
      color: 0x0e3a63,
      metalness: 0.85,
      roughness: 0.12,
      transparent: true,
      opacity: 0.82,
    }),

    // 深色通风/消音百叶
    ventLouver: new THREE.MeshStandardMaterial({
      color: 0x161e29,
      metalness: 0.55,
      roughness: 0.45,
    }),

    // 主入口悬挑雨棚包边与装饰铝单板
    canopyFascia: new THREE.MeshStandardMaterial({
      color: 0x1e3a5f,
      metalness: 0.7,
      roughness: 0.25,
    }),

    // 屋顶耐候防水面层
    roofDeck: new THREE.MeshStandardMaterial({
      color: 0x333d4b,
      metalness: 0.15,
      roughness: 0.75,
    }),

    // 园区沥青环道与货运通道
    roadAsphalt: new THREE.MeshStandardMaterial({
      color: 0x151c27,
      metalness: 0.1,
      roughness: 0.92,
    }),

    // 园区人行及硬质铺装混凝土面
    concretePaving: new THREE.MeshStandardMaterial({
      color: 0x263345,
      metalness: 0.08,
      roughness: 0.85,
    }),

    // 道路白色实线/虚线标线
    roadLineWhite: new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.05,
      roughness: 0.4,
    }),

    // 道路黄色警示标线
    roadLineYellow: new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.05,
      roughness: 0.4,
    }),

    // 热镀锌钢格栅平台与管道支架
    galvanizedSteel: new THREE.MeshStandardMaterial({
      color: 0x6e7b8c,
      metalness: 0.78,
      roughness: 0.38,
    }),

    // 工业安全黄色护栏与警示踢脚板
    safetyYellow: new THREE.MeshStandardMaterial({
      color: 0xeab308,
      metalness: 0.25,
      roughness: 0.35,
    }),

    // 冷冻水供水管 (深蓝 7℃)
    pipeChilledSupply: new THREE.MeshStandardMaterial({
      color: 0x1d4ed8,
      metalness: 0.4,
      roughness: 0.3,
    }),

    // 冷冻水回水管 (浅蓝 12℃)
    pipeChilledReturn: new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      metalness: 0.4,
      roughness: 0.3,
    }),

    // 冷却水循环管 (草绿 32℃/37℃)
    pipeCondenserWater: new THREE.MeshStandardMaterial({
      color: 0x059669,
      metalness: 0.4,
      roughness: 0.3,
    }),

    // 制冷剂备用管/旁通管
    pipeRefrigerant: new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.4,
      roughness: 0.3,
    }),

    // 变压器本体油箱与外壳 (工业深灰蓝)
    transformerBody: new THREE.MeshStandardMaterial({
      color: 0x243242,
      metalness: 0.65,
      roughness: 0.35,
    }),

    // 变压器高压陶瓷套管
    insulatorCeramic: new THREE.MeshStandardMaterial({
      color: 0xb45309,
      metalness: 0.1,
      roughness: 0.2,
    }),

    // 柴油发电机组箱体
    generatorBody: new THREE.MeshStandardMaterial({
      color: 0x1e2e42,
      metalness: 0.6,
      roughness: 0.4,
    }),

    // 不锈钢消音排烟立管
    exhaustStack: new THREE.MeshStandardMaterial({
      color: 0xd1d5db,
      metalness: 0.88,
      roughness: 0.18,
    }),

    // 冷水机组外壳 (工业冷灰)
    chillerBody: new THREE.MeshStandardMaterial({
      color: 0x37475c,
      metalness: 0.58,
      roughness: 0.38,
    }),

    // 防雷接闪带与镀锌圆钢引下线
    lightningConductor: new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.85,
      roughness: 0.25,
      emissive: 0x0284c7,
      emissiveIntensity: 0.25,
    }),

    // 主动双流向接闪针塔
    lightningMastActive: new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.55,
    }),

    // 地下高纯铜水平接地扁钢带与深埋接地极
    groundingCopperBus: new THREE.MeshStandardMaterial({
      color: 0xf97316,
      metalness: 0.88,
      roughness: 0.25,
      emissive: 0xea580c,
      emissiveIntensity: 0.35,
    }),

    // 地下透视土层介质
    groundingSoilStratum: new THREE.MeshStandardMaterial({
      color: 0x0a1628,
      metalness: 0.05,
      roughness: 0.95,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    }),

    // 接地电阻测试箱与等电位箱体
    testBoxBody: new THREE.MeshStandardMaterial({
      color: 0x384759,
      metalness: 0.7,
      roughness: 0.3,
    }),

    // 传感器高精监测探头
    sensorProbe: new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.45,
    }),

    // 状态灯光色标
    statusNormal: new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x10b981,
      emissiveIntensity: 0.8,
    }),
    statusWarning: new THREE.MeshStandardMaterial({
      color: 0xeab308,
      emissive: 0xeab308,
      emissiveIntensity: 0.8,
    }),
    statusOrange: new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.8,
    }),
    statusAlarm: new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xef4444,
      emissiveIntensity: 0.9,
    }),
  };
}
