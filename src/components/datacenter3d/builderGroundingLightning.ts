import * as THREE from 'three';
import { MaterialLibrary } from './materials';

export interface GroundingLightningResult {
  lightningGroup: THREE.Group;
  groundingGroup: THREE.Group;
  undergroundGroup: THREE.Group;
  spdGroup: THREE.Group;
  esdGroup: THREE.Group;
  sensorsGroup: THREE.Group;
}

export function buildGroundingAndLightning(materials: MaterialLibrary): GroundingLightningResult {
  const lightningGroup = new THREE.Group();
  lightningGroup.name = 'Layer_lightning';

  const groundingGroup = new THREE.Group();
  groundingGroup.name = 'Layer_grounding';

  const undergroundGroup = new THREE.Group();
  undergroundGroup.name = 'Layer_underground';

  const spdGroup = new THREE.Group();
  spdGroup.name = 'Layer_spd';

  const esdGroup = new THREE.Group();
  esdGroup.name = 'Layer_esd';

  const sensorsGroup = new THREE.Group();
  sensorsGroup.name = 'Layer_sensors';

  const B_WIDTH = 82;
  const B_DEPTH = 54;
  const B_HEIGHT = 16.5;
  const PARAPET_H = 1.2;
  const ROOF_TOP_Y = B_HEIGHT + PARAPET_H + 0.12; // 17.82m

  // =========================================================================
  // 1. 屋面防雷接闪设施 (Lightning Air Termination Network)
  // =========================================================================

  // A. 四周女儿墙压顶接闪带 (25x4mm 热镀锌扁钢接闪带)
  const parapetTapeMat = materials.lightningConductor;
  const tapeThick = 0.08;

  // 北侧接闪带 (Z = -B_DEPTH/2 + 0.2)
  const tapeN = new THREE.Mesh(new THREE.BoxGeometry(B_WIDTH, tapeThick, tapeThick), parapetTapeMat);
  tapeN.position.set(0, ROOF_TOP_Y + 0.1, -B_DEPTH / 2 + 0.2);
  // 南侧接闪带
  const tapeS = new THREE.Mesh(new THREE.BoxGeometry(B_WIDTH, tapeThick, tapeThick), parapetTapeMat);
  tapeS.position.set(0, ROOF_TOP_Y + 0.1, B_DEPTH / 2 - 0.2);
  // 西侧接闪带
  const tapeW = new THREE.Mesh(new THREE.BoxGeometry(tapeThick, tapeThick, B_DEPTH), parapetTapeMat);
  tapeW.position.set(-B_WIDTH / 2 + 0.2, ROOF_TOP_Y + 0.1, 0);
  // 东侧接闪带
  const tapeE = new THREE.Mesh(new THREE.BoxGeometry(tapeThick, tapeThick, B_DEPTH), parapetTapeMat);
  tapeE.position.set(B_WIDTH / 2 - 0.2, ROOF_TOP_Y + 0.1, 0);

  lightningGroup.add(tapeN, tapeS, tapeW, tapeE);

  // B. 屋面 10m x 10m 等电位防雷接闪网格 (Roof Lightning Mesh)
  // 沿屋面标高 +16.7m 敷设
  const meshGroup = new THREE.Group();
  // 东西向横网扁钢 (每隔 10m 一道)
  for (let z = -20; z <= 20; z += 10) {
    const barX = new THREE.Mesh(new THREE.BoxGeometry(B_WIDTH - 2, tapeThick, tapeThick), parapetTapeMat);
    barX.position.set(0, B_HEIGHT + 0.2, z);
    meshGroup.add(barX);
  }
  // 南北向纵网扁钢 (每隔 10m 一道)
  for (let x = -30; x <= 30; x += 10) {
    const barZ = new THREE.Mesh(new THREE.BoxGeometry(tapeThick, tapeThick, B_DEPTH - 2), parapetTapeMat);
    barZ.position.set(x, B_HEIGHT + 0.2, 0);
    meshGroup.add(barZ);
  }
  lightningGroup.add(meshGroup);

  // C. 屋面四角避雷短针 (4 Corner Air Termination Rods)
  const cornerPositions = [
    [-B_WIDTH / 2 + 0.2, -B_DEPTH / 2 + 0.2],
    [B_WIDTH / 2 - 0.2, -B_DEPTH / 2 + 0.2],
    [-B_WIDTH / 2 + 0.2, B_DEPTH / 2 - 0.2],
    [B_WIDTH / 2 - 0.2, B_DEPTH / 2 - 0.2],
  ];

  cornerPositions.forEach(([x, z], idx) => {
    const rodGroup = new THREE.Group();
    const rodId = `ROD-CORNER-0${idx + 1}`;

    // 避雷针针体 (不锈钢针，高 1.6m)
    const rodMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.08, 1.6, 12),
      materials.lightningConductor
    );
    rodMesh.position.set(x, ROOF_TOP_Y + 0.8, z);
    rodMesh.castShadow = true;

    // 基座紧固法兰
    const flange = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.22, 0.15, 12),
      materials.galvanizedSteel
    );
    flange.position.set(x, ROOF_TOP_Y + 0.08, z);

    rodGroup.add(rodMesh, flange);
    rodGroup.userData = {
      id: rodId,
      code: rodId,
      name: `屋顶角隅避雷接闪短针 #${idx + 1}`,
      type: '角部防雷直击雷保护终端',
      system: '防雷接闪',
      location: `主机房女儿墙角顶端 (标高 +19.4m)`,
      specs: '国标304不锈钢纯针 · 耐受冲击电流 150kA (10/350μs) · 滚球法保护半径 22m',
      status: '正常',
      statusType: 'success',
      realtimeValue: '泄流回路电阻 0.03Ω · 完好',
    };
    lightningGroup.add(rodGroup);
  });

  // D. 中央主动双流向接闪针塔 (DEV-LGT-002 DL-PRO)
  // 位于屋面东侧中央防雷基站高台上 (X: 18, Z: 0)
  const mastGroup = new THREE.Group();
  const mastX = 18;
  const mastZ = 0;

  // 基座高台 (基站混凝土台)
  const mastBase = new THREE.Mesh(
    new THREE.CylinderGeometry(1.2, 1.4, 0.8, 16),
    materials.architecturalConcrete
  );
  mastBase.position.set(mastX, B_HEIGHT + 0.4, mastZ);
  mastGroup.add(mastBase);

  // 主绝缘支撑钢管立柱 (高 4.5m)
  const mastPole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.22, 4.5, 16),
    materials.galvanizedSteel
  );
  mastPole.position.set(mastX, B_HEIGHT + 3.0, mastZ);
  mastPole.castShadow = true;
  mastGroup.add(mastPole);

  // 双流向主动提前放电电离腔体 (Ionization Chamber)
  const ionChamber = new THREE.Mesh(
    new THREE.CylinderGeometry(0.65, 0.55, 0.9, 16),
    materials.lightningMastActive
  );
  ionChamber.position.set(mastX, B_HEIGHT + 5.2, mastZ);
  mastGroup.add(ionChamber);

  // 主针尖与提前放电副针
  const mainSpike = new THREE.Mesh(
    new THREE.ConeGeometry(0.12, 1.8, 16),
    materials.lightningMastActive
  );
  mainSpike.position.set(mastX, B_HEIGHT + 6.4, mastZ);
  mastGroup.add(mainSpike);

  mastGroup.userData = {
    id: 'dual_protection',
    code: 'DEV-LGT-002',
    name: '双流向主动防雷装置 (DL-PRO)',
    type: '直接雷主动拦截终端',
    system: '防雷接闪',
    location: '主建筑屋面东侧中央防雷基站 (标高 +23.8m)',
    specs: '额定 100kA (8/20μs & 10/350μs) · 提前放电时间 Δt=60μs · 保护半径 86m',
    status: '正常',
    statusType: 'success',
    realtimeValue: '截获耐受 58.7 kA (当前泄流 0.0 kA)',
  };
  lightningGroup.add(mastGroup);

  // E. 8 根专用防雷引下线 (8 Down-Conductors)
  // 沿建筑外墙结构柱垂直向下直通室外散水地坪
  const downConductorCoords = [
    [-36, -B_DEPTH / 2],
    [0, -B_DEPTH / 2],
    [36, -B_DEPTH / 2],
    [-36, B_DEPTH / 2],
    [0, B_DEPTH / 2],
    [36, B_DEPTH / 2],
    [-B_WIDTH / 2, 0],
    [B_WIDTH / 2, 0],
  ];

  downConductorCoords.forEach(([x, z], idx) => {
    // 镀锌圆钢引下线直管
    const dcMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, B_HEIGHT + PARAPET_H, 12),
      materials.lightningConductor
    );
    dcMesh.position.set(x, (B_HEIGHT + PARAPET_H) / 2, z);
    lightningGroup.add(dcMesh);

    // =======================================================================
    // 2. 接地系统：接地电阻断接卡测试箱 (TEST-BOX-01 ~ TEST-BOX-08)
    // 距室外地面标高 +0.5m
    // =======================================================================
    const boxGroup = new THREE.Group();
    const boxId = `DEV-TEST-0${idx + 1}`;
    const boxName = `接地电阻测试断接卡箱 #${idx + 1}`;

    const boxBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.45, 0.65, 0.25),
      materials.testBoxBody
    );
    boxBody.position.set(
      x === -B_WIDTH / 2 ? x - 0.15 : x === B_WIDTH / 2 ? x + 0.15 : x,
      0.55,
      z === -B_DEPTH / 2 ? z - 0.15 : z === B_DEPTH / 2 ? z + 0.15 : z
    );

    // 黄绿相间安全警示条
    const boxStripe = new THREE.Mesh(
      new THREE.BoxGeometry(0.47, 0.15, 0.26),
      materials.safetyYellow
    );
    boxStripe.position.copy(boxBody.position);

    boxGroup.add(boxBody, boxStripe);
    boxGroup.userData = {
      id: boxId,
      code: `TEST-BOX-0${idx + 1}`,
      name: boxName,
      type: '断接卡引下线检测节点',
      system: '接地网',
      location: `建筑外立面散水检修点 (${x > 0 ? '东' : '西'}${z > 0 ? '南' : '北'})`,
      specs: '铜铁过渡双金属防电化腐蚀接头 · 50×5mm纯紫铜测试排 · IP67三防箱',
      status: '正常',
      statusType: 'success',
      realtimeValue: '接触电阻 0.04mΩ · 导通正常',
    };
    groundingGroup.add(boxGroup);
  });

  // F. 主等电位联结端子箱 (MEB Cabinets)
  [-16, 16].forEach((xPos, idx) => {
    const mebGroup = new THREE.Group();
    const mebId = `DEV-MEB-0${idx + 1}`;
    const mebMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 1.2, 0.35),
      materials.testBoxBody
    );
    mebMesh.position.set(xPos, 1.2, B_DEPTH / 2 + 0.2);
    mebGroup.add(mebMesh);
    mebGroup.userData = {
      id: mebId,
      code: `MEB-CAB-0${idx + 1}`,
      name: `${idx === 0 ? 'A' : 'B'}座总等电位联结柜 (MEB)`,
      type: '星型总等电位联结母排柜',
      system: '接地网',
      location: `南大厅动力竖井进线口 (#${idx + 1})`,
      specs: '100×10mm电解紫铜接地母排 · 电位差监测采样 · 连接机柜底座、结构钢柱与水管',
      status: '正常',
      statusType: 'success',
      realtimeValue: '等电位差 2.4mV (优于≤10mV标准)',
    };
    groundingGroup.add(mebGroup);
  });

  // G. 4 座园区深井接地电阻在线遥测测试井 (GW-01 ~ GW-04)
  // 分布在园区四个关键外围位置
  const gwCoords = [
    { id: 'ground_res', code: 'DEV-GND-001', name: '地网电阻在线监测终端 (GW-01# 基准井)', x: -38, z: 38 },
    { id: 'DEV-GND-002', code: 'DEV-GND-002', name: '变电区地网遥测测试井 (GW-02#)', x: 74, z: -20 },
    { id: 'DEV-GND-003', code: 'DEV-GND-003', name: '柴发区独立接地测试井 (GW-03#)', x: 86, z: 42 },
    { id: 'DEV-GND-004', code: 'DEV-GND-004', name: '冷冻站外围环形地网测试井 (GW-04#)', x: -75, z: -22 },
  ];

  gwCoords.forEach((cfg) => {
    const gwGroup = new THREE.Group();

    // 地面圆形重型承重铸铁/防爆井盖 (标高 0.05m)
    const wellCover = new THREE.Mesh(
      new THREE.CylinderGeometry(0.75, 0.75, 0.15, 24),
      materials.testBoxBody
    );
    wellCover.position.set(cfg.x, 0.07, cfg.z);

    // 井盖外圈发光状态指示环
    const statusRing = new THREE.Mesh(
      new THREE.RingGeometry(0.76, 0.9, 24),
      materials.statusNormal
    );
    statusRing.rotation.x = -Math.PI / 2;
    statusRing.position.set(cfg.x, 0.08, cfg.z);

    gwGroup.add(wellCover, statusRing);
    gwGroup.userData = {
      id: cfg.id,
      code: cfg.code,
      name: cfg.name,
      type: '高精度异频地网电阻在线监测仪',
      system: '接地网',
      location: `园区室外绿化/道路地网测试井位 (X:${cfg.x}, Z:${cfg.z})`,
      specs: '四极交流异频抗干扰注入法 · 测量范围 0.001~100Ω · 防雷冲击自恢复',
      status: '正常',
      statusType: 'success',
      realtimeValue: '0.52 Ω (国标标准 ≤ 1.0 Ω)',
    };
    groundingGroup.add(gwGroup);
  });

  // =========================================================================
  // 3. 地下 3D 数字孪生接地网 (Underground Grounding Grid Mesh)
  // 位于地下 Y = -3.5m ~ -7.5m
  // =========================================================================

  // A. 地下半透明土层地质块体 (Soil Stratum)
  const soilGeo = new THREE.BoxGeometry(200, 7.0, 140);
  const soilMesh = new THREE.Mesh(soilGeo, materials.groundingSoilStratum);
  soilMesh.position.set(6, -3.5, 0);
  soilMesh.receiveShadow = true;
  undergroundGroup.add(soilMesh);

  // B. 10m x 10m 正交水平高纯紫铜接地扁钢网格 (40x4mm Copper Grounding Grid)
  // 标高 Y = -3.5m
  const copperGridGroup = new THREE.Group();
  const copperMat = materials.groundingCopperBus;
  const busThick = 0.12;

  // 东西向水平铜带 (从 X: -80 到 +100，每隔 10m 一根，Z: -50 到 +50)
  for (let z = -50; z <= 50; z += 10) {
    const busLineX = new THREE.Mesh(
      new THREE.BoxGeometry(180, busThick, busThick),
      copperMat
    );
    busLineX.position.set(10, -3.5, z);
    copperGridGroup.add(busLineX);
  }

  // 南北向水平铜带 (从 Z: -50 到 +50，每隔 10m 一根，X: -80 到 +100)
  for (let x = -80; x <= 100; x += 10) {
    const busLineZ = new THREE.Mesh(
      new THREE.BoxGeometry(busThick, busThick, 100),
      copperMat
    );
    busLineZ.position.set(x, -3.5, 0);
    copperGridGroup.add(busLineZ);
  }

  // C. 网格交叉节点处的深埋垂直接地极 (Vertical Ground Rods)
  // 长度 4m，从 Y = -3.5m 深入至 Y = -7.5m
  for (let x = -70; x <= 90; x += 20) {
    for (let z = -40; z <= 40; z += 20) {
      const rod = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 4.0, 12),
        copperMat
      );
      rod.position.set(x, -5.5, z);
      copperGridGroup.add(rod);
    }
  }

  // D. 从地下地网直达各防雷引下线与测试断接卡箱的竖向引上干线 (Grounding Risers)
  downConductorCoords.forEach(([x, z]) => {
    const riser = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 3.5, 12),
      copperMat
    );
    riser.position.set(x, -1.75, z);
    copperGridGroup.add(riser);
  });

  // E. 挂载地下地网整体业务对象
  copperGridGroup.userData = {
    id: 'UNDERGROUND-GRID-MAIN',
    name: '星云算力中心一体化联合接地网',
    type: '综合等电位闭合接地系统',
    system: '接地网',
    location: '园区地下 -3.5m 深度封闭地网',
    specs: '40×4mm纯紫铜水平接地带 + Φ25×4000mm铜包钢垂直接地极 · 总面积 18000㎡',
    status: '正常',
    statusType: 'success',
    realtimeValue: '联合工频接地电阻 0.52Ω (设计指标 ≤ 0.8Ω)',
  };

  undergroundGroup.add(copperGridGroup);

  // =========================================================================
  // 4. 浪涌保护器 SPD 监测终端 (Surge Protective Devices)
  // =========================================================================
  const spdConfigs = [
    {
      id: 'spd_terminal',
      code: 'DEV-SPD-004',
      name: '智能浪涌保护器SPD监测终端 (SPD-04)',
      x: 35,
      y: 6.2,
      z: 14,
      loc: '2F 数据机房动力配电室低压柜 A-02',
      status: '关注',
      statusType: 'warning' as const,
      value: '漏电流 0.18 mA · 动作累计 12次 (正常阈值 < 0.15mA)',
      threshold: '0.15 mA',
    },
    {
      id: 'DEV-SPD-001',
      code: 'DEV-SPD-001',
      name: '110kV/10kV变电站高能进线防雷SPD',
      x: 74,
      y: 3.5,
      z: 2,
      loc: '东侧变配电中心 10kV 进线开关柜',
      status: '正常',
      statusType: 'success' as const,
      value: '漏电流 0.06 mA · 动作累计 3次',
      threshold: '0.15 mA',
    },
    {
      id: 'DEV-SPD-002',
      code: 'DEV-SPD-002',
      name: '西区冷水机组变频配电SPD保护器',
      x: -62,
      y: 2.2,
      z: 0,
      loc: '冷冻站动力配电控制柜 MCC-01',
      status: '正常',
      statusType: 'success' as const,
      value: '漏电流 0.08 mA · 动作累计 5次',
      threshold: '0.15 mA',
    },
    {
      id: 'DEV-SPD-003',
      code: 'DEV-SPD-003',
      name: '东南应急柴发高压自启动SPD监测模块',
      x: 70,
      y: 3.0,
      z: 32,
      loc: '应急柴发机房 10kV 并网柜',
      status: '正常',
      statusType: 'success' as const,
      value: '漏电流 0.05 mA · 动作累计 0次',
      threshold: '0.15 mA',
    },
    {
      id: 'spd_terminal',
      code: 'DEV-SPD-004',
      name: '2F动力配电室低压母线二级SPD监测终端 (SPD-04#)',
      x: 18,
      y: 7.2,
      z: -10,
      loc: '2F 数据机房动力配电室低压母线柜 A-02',
      status: '关注',
      statusType: 'warning' as const,
      value: '漏电流 0.28 mA · 动作累计 12次',
      threshold: '0.20 mA',
    },
  ];

  spdConfigs.forEach((cfg) => {
    const spdGroupMesh = new THREE.Group();

    // SPD 监测箱体
    const bodyMat = cfg.statusType === 'warning' ? materials.statusWarning : materials.statusNormal;
    const spdBox = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.7, 0.3), materials.testBoxBody);
    spdBox.position.set(cfg.x, cfg.y, cfg.z);

    const ledBeacon = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 12), bodyMat);
    ledBeacon.position.set(cfg.x, cfg.y + 0.45, cfg.z);

    spdGroupMesh.add(spdBox, ledBeacon);
    spdGroupMesh.userData = {
      id: cfg.id,
      code: cfg.code,
      name: cfg.name,
      type: 'T1+T2 级复合型智能浪涌保护器',
      system: '浪涌保护SPD',
      location: cfg.loc,
      specs: '冲击电流 Iimp 25kA (10/350μs) · 标称放电 In 50kA · 漏电流与热脱扣遥测',
      status: cfg.status,
      statusType: cfg.statusType,
      realtimeValue: cfg.value,
      threshold: cfg.threshold,
    };
    spdGroup.add(spdGroupMesh);
  });

  // =========================================================================
  // 5. 静电监测 ESD 节点 (Electrostatic Discharge Monitoring)
  // =========================================================================
  const esdConfigs = [
    {
      id: 'esd_terminal',
      code: 'DEV-ESD-008',
      name: '微环境静电综合监测终端 (ESD-08)',
      x: 0,
      y: 6.0,
      z: 0,
      loc: '2F 主机房核心算力列头柜 A01-A16 通道',
      status: '正常',
      statusType: 'success' as const,
      value: '机房静电位 0.8 kV · 人员残存 < 25V',
    },
    {
      id: 'DEV-ESD-002',
      code: 'DEV-ESD-002',
      name: '人员访客防静电闸机综合测试仪',
      x: 0,
      y: 1.2,
      z: 28,
      loc: '南大门访客安检门禁闸机处',
      status: '正常',
      statusType: 'success' as const,
      value: '人体综合电阻 7.2×10^6 Ω (合格)',
    },
  ];

  esdConfigs.forEach((cfg) => {
    const esdGroupMesh = new THREE.Group();
    const esdMesh = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.5, 0.2), materials.testBoxBody);
    esdMesh.position.set(cfg.x, cfg.y, cfg.z);

    const probe = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.4, 12), materials.sensorProbe);
    probe.position.set(cfg.x, cfg.y + 0.35, cfg.z);

    esdGroupMesh.add(esdMesh, probe);
    esdGroupMesh.userData = {
      id: cfg.id,
      code: cfg.code,
      name: cfg.name,
      type: '高精度非接触式静电电位及接地回路监测仪',
      system: '防静电ESD',
      location: cfg.loc,
      specs: '测试范围 0~20kV · 响应时间 < 100ms · 支持防静电地板/腕带接地双闭环检测',
      status: cfg.status,
      statusType: cfg.statusType,
      realtimeValue: cfg.value,
    };
    esdGroup.add(esdGroupMesh);
  });

  // =========================================================================
  // 6. 雷电环境传感器 (Lightning & Atmospheric Sensors)
  // =========================================================================
  // A. 大气电场仪 (AEFM-01) - 位于主建筑屋顶中央接闪基站旁 (+22.5m 标高)
  const aefmGroup = new THREE.Group();
  const aefmMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.16, 2.4, 16),
    materials.galvanizedSteel
  );
  aefmMesh.position.set(-8, B_HEIGHT + 1.2, 0);

  // 顶部旋转动片感应探头
  const vaneHead = new THREE.Mesh(
    new THREE.SphereGeometry(0.28, 16, 16),
    materials.sensorProbe
  );
  vaneHead.position.set(-8, B_HEIGHT + 2.5, 0);

  aefmGroup.add(aefmMesh, vaneHead);
  aefmGroup.userData = {
    id: 'atmospheric',
    code: 'DEV-ENV-001',
    name: '全天候大气电场仪 (AEFM-01)',
    type: '高灵敏度空间电场先导探针',
    system: '防雷接闪',
    location: '主建筑屋面 12号测试基座顶端 (标高 +19.0m)',
    specs: '动态范围 ±50kV/m · 灵敏度 10V/m · 采样率 1000Hz · 雷电先导预警时间 15~30min',
    status: '正常',
    statusType: 'success',
    realtimeValue: '12.4 kV/m (正常阈值 -15.0 ~ +15.0 kV/m)',
    threshold: '±15.0 kV/m',
  };
  sensorsGroup.add(aefmGroup);

  return {
    lightningGroup,
    groundingGroup,
    undergroundGroup,
    spdGroup,
    esdGroup,
    sensorsGroup,
  };
}
