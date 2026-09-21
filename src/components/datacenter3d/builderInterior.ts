import * as THREE from 'three';
import { MaterialLibrary } from './materials';

export function buildBuildingInterior(materials: MaterialLibrary): THREE.Group {
  const interiorGroup = new THREE.Group();
  interiorGroup.name = 'Layer_interior';

  // =========================================================================
  // 1F: 7×24小时 NOC 运维监控调度值班室 + 动力电池与UPS配电区 (Y: 0 ~ 5.5m)
  // =========================================================================
  const floor1Group = new THREE.Group();

  // 1F 架空防静电活动地板地坪 (X: -40 ~ 40, Z: -26 ~ 26)
  const f1Floor = new THREE.Mesh(
    new THREE.BoxGeometry(80, 0.2, 52),
    materials.interiorFloor
  );
  f1Floor.position.set(0, 0.1, 0);
  f1Floor.receiveShadow = true;
  floor1Group.add(f1Floor);

  // 1F 室内防火隔断墙 (区分值班大厅、UPS动力间与后勤通道)
  // 南北纵向主隔墙 (X = 8, 分割西侧值班大厅与东侧动力区)
  const partitionWall1 = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 5.0, 48),
    materials.interiorPartitionWall
  );
  partitionWall1.position.set(8, 2.7, 0);
  floor1Group.add(partitionWall1);

  // 东西向隔墙 (Z = 4, 隔离北侧电池间)
  const partitionWall2 = new THREE.Mesh(
    new THREE.BoxGeometry(32, 5.0, 0.3),
    materials.interiorPartitionWall
  );
  partitionWall2.position.set(24, 2.7, 4);
  floor1Group.add(partitionWall2);

  // -------------------------------------------------------------------------
  // A. 1F 运维总控调度值班大厅 (NOC Center, X: -38 ~ 6, Z: -6 ~ 24)
  // -------------------------------------------------------------------------
  const nocGroup = new THREE.Group();

  // 1. NOC 弧形发光超清监控大屏 (Curved Monitoring Video Wall, 宽 18m x 高 3.6m)
  // 朝向南方，值班席面朝北面大屏
  const screenCurve = new THREE.Group();
  const screenSegments = 16;
  const screenRadius = 22;
  const screenAngle = Math.PI / 3.8; // 弧度约 48度

  for (let i = 0; i < screenSegments; i++) {
    const angle = -screenAngle / 2 + (i / (screenSegments - 1)) * screenAngle;
    const x = Math.sin(angle) * screenRadius - 16;
    const z = Math.cos(angle) * screenRadius - 20;

    const seg = new THREE.Mesh(
      new THREE.BoxGeometry(1.25, 3.4, 0.15),
      materials.nocScreen
    );
    seg.rotation.y = angle;
    seg.position.set(x, 2.2, z);
    screenCurve.add(seg);
  }
  screenCurve.userData = {
    id: 'DEV-NOC-SCREEN',
    code: 'NOC-SCREEN-01',
    name: 'NOC 运维调度中心 8K 超高清数字孪生监控大屏',
    type: '7×24小时全局态势调度巨幕',
    system: '建筑设施',
    location: '1F 运营管理中心/调度大厅主立面 (18m×3.6m 微弧幕)',
    specs: 'P0.9 MicroLED 微间距拼接 · 8K超高清显示 · 毫秒级雷击与动环态势同步',
    status: '正常',
    statusType: 'success',
    realtimeValue: '双链路热备 · 刷新率 120Hz · 告警弹窗联动激活',
  };
  nocGroup.add(screenCurve);

  // 2. 双排弧形值班调度指挥台 (Two-Tier Dispatcher Consoles)
  // 前排与后排调度席位
  [0, 5].forEach((dist, rowIdx) => {
    const consoleRadius = 14 + dist;
    for (let c = -3; c <= 3; c++) {
      const angle = c * 0.12;
      const cx = Math.sin(angle) * consoleRadius - 16;
      const cz = Math.cos(angle) * consoleRadius - 14;

      // 调度工作台 (Console Desk)
      const desk = new THREE.Mesh(
        new THREE.BoxGeometry(2.0, 0.75, 0.85),
        materials.nocConsoleDesk
      );
      desk.rotation.y = angle;
      desk.position.set(cx, 0.55, cz);

      // 工作台上的多联液晶显示器 (3 屏联排)
      const monitor = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 0.45, 0.08),
        materials.nocScreen
      );
      monitor.rotation.y = angle;
      monitor.position.set(cx, 1.15, cz - 0.15);

      // 调度座椅 (Chair)
      const chair = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.35, 0.8, 12),
        materials.sandwichWallDark
      );
      chair.position.set(cx, 0.5, cz + 0.6);

      nocGroup.add(desk, monitor, chair);
    }
  });

  // 3. 值班长总控工位及交接班接待台 (Duty Chief Workstation & Counter)
  const chiefDesk = new THREE.Mesh(
    new THREE.BoxGeometry(4.5, 0.85, 1.2),
    materials.nocConsoleDesk
  );
  chiefDesk.position.set(-16, 0.6, 16);
  chiefDesk.userData = {
    id: 'DEV-NOC-DUTY',
    code: 'DUTY-DESK-01',
    name: '星云计算中心 7×24小时值班长调度席',
    type: '综合运维指挥与应急响应台',
    system: '建筑设施',
    location: '1F NOC 运营中心值班长工位 (D-01)',
    specs: '值班电话与应急调度广播系统 · 一键触发全园区三维应急疏散与防雷接地元动',
    status: '正常',
    statusType: 'success',
    realtimeValue: '值班人员: 张工、李工 (在岗双人双审)',
  };
  nocGroup.add(chiefDesk);

  // 4. 南侧主入口人员访客闸机 (Security Turnstiles)
  for (let x = -4; x <= 4; x += 1.4) {
    const turnstile = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 1.0, 1.2),
      materials.curtainWallLight
    );
    turnstile.position.set(x, 0.7, 24.5);

    // 闸机指示灯
    const turnLed = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.05, 0.8),
      materials.serverRackLedsGreen
    );
    turnLed.position.set(x, 1.22, 24.5);
    nocGroup.add(turnstile, turnLed);
  }

  floor1Group.add(nocGroup);

  // -------------------------------------------------------------------------
  // B. 1F 东侧 UPS 动力电池与配电保障间 (X: 12 ~ 38, Z: -22 ~ 2)
  // -------------------------------------------------------------------------
  const upsGroup = new THREE.Group();

  // 4 列双排高压直流 UPS 锂电池储能机柜阵列
  const upsCols = [14, 20, 26, 32];
  upsCols.forEach((xPos, colIdx) => {
    for (let zPos = -18; zPos <= -2; zPos += 2.8) {
      // 电池柜 (Battery Cabinet)
      const batCab = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 2.2, 2.0),
        materials.upsBatteryCabinet
      );
      batCab.position.set(xPos, 1.3, zPos);
      batCab.castShadow = true;

      // 电池柜门状态发光指示灯
      const batLed = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.08, 0.4),
        materials.serverRackLedsGreen
      );
      batLed.position.set(xPos + 0.62, 2.0, zPos);

      upsGroup.add(batCab, batLed);
    }
  });

  upsGroup.userData = {
    id: 'DEV-UPS-BAT-ROOM',
    code: 'UPS-1F-BANK',
    name: '1F 高压直流锂电储能与UPS保障系统',
    type: '2N 容错不间断电源储能舱',
    system: '变配电',
    location: '1F 东侧独立动力电池保障间 (X:14~32, Z:-18~-2)',
    specs: '4组模块化高功率密度锂电池柜 · 单组后备供电时间 30分钟 · 双母线静止切换',
    status: '正常',
    statusType: 'success',
    realtimeValue: '荷电状态 SOC 99.4% · 直流母线电压 536V (平稳)',
  };
  floor1Group.add(upsGroup);

  interiorGroup.add(floor1Group);

  // =========================================================================
  // 2F: 核心高密算力服务器机房大厅 (Core Server Hall, Zone-A, Y: 5.5 ~ 11.0m)
  // =========================================================================
  const floor2Group = new THREE.Group();

  // 2F 架空全钢防静电地板 (标高 Y = 5.5m)
  const f2Floor = new THREE.Mesh(
    new THREE.BoxGeometry(80, 0.25, 52),
    materials.interiorFloor
  );
  f2Floor.position.set(0, 5.5 + 0.12, 0);
  f2Floor.receiveShadow = true;
  floor2Group.add(f2Floor);

  // 6 组冷热通道封闭服务器机柜排 (Cold/Hot Aisle Containment Modules)
  // X 方向每组间隔 9.5m (从 X: -26 到 +26，共 6 组)
  const rackRowX = [-25, -15, -5, 5, 15, 25];

  rackRowX.forEach((rx, aisleIdx) => {
    const aisleGroup = new THREE.Group();
    const aisleCode = `ZONE-A-AISLE-0${aisleIdx + 1}`;

    // 冷通道封闭顶部采光隔热玻璃天幕 (Translucent Glass Roof, 标高 Y = 8.1m)
    const glassRoof = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.08, 28),
      materials.aisleContainmentRoof
    );
    glassRoof.position.set(rx, 8.15, 0);
    aisleGroup.add(glassRoof);

    // 冷通道两端封闭双开推拉门 (Sliding Doors, 南端与北端)
    [-14, 14].forEach((doorZ) => {
      const doorMesh = new THREE.Mesh(
        new THREE.BoxGeometry(2.3, 2.3, 0.1),
        materials.aisleContainmentRoof
      );
      doorMesh.position.set(rx, 6.9, doorZ);
      aisleGroup.add(doorMesh);
    });

    // 左右两侧双排 42U 标准服务器机柜 (每侧 18 台机柜，合计 36 台机柜/通道)
    [-1.5, 1.5].forEach((sideOffset, sideIdx) => {
      const rackMat = materials.serverRackBody;
      const ledMat = aisleIdx === 3 ? materials.serverRackLeds : materials.serverRackLedsGreen;

      for (let rz = -12.5; rz <= 12.5; rz += 1.6) {
        // 单台 42U 服务器机柜体 (宽 0.8m x 高 2.3m x 深 1.2m)
        const rackMesh = new THREE.Mesh(
          new THREE.BoxGeometry(1.2, 2.3, 1.5),
          rackMat
        );
        rackMesh.position.set(rx + sideOffset, 6.9, rz);
        rackMesh.castShadow = true;

        // 机柜前门蜂窝孔板发光 LED 状态指示条 (蓝光/绿光交互呼吸感)
        const ledStrip = new THREE.Mesh(
          new THREE.BoxGeometry(0.06, 2.0, 0.08),
          ledMat
        );
        ledStrip.position.set(
          rx + (sideIdx === 0 ? sideOffset + 0.62 : sideOffset - 0.62),
          6.9,
          rz
        );

        aisleGroup.add(rackMesh, ledStrip);
      }
    });

    // 通道列头柜 (精密列头智能配电柜 PDU, 位于每列通道端头)
    const pduMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 2.3, 1.2),
      materials.sandwichWallDark
    );
    pduMesh.position.set(rx, 6.9, -15.5);

    const pduScreen = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.6, 0.05),
      materials.serverRackLeds
    );
    pduScreen.position.set(rx, 7.3, -16.15);

    aisleGroup.add(pduMesh, pduScreen);

    // 通道上方架空双层电缆桥架 (强电母线槽 + 弱电光纤梯架)
    const cableTray = new THREE.Mesh(
      new THREE.BoxGeometry(3.6, 0.15, 32),
      materials.galvanizedSteel
    );
    cableTray.position.set(rx, 9.2, 0);
    aisleGroup.add(cableTray);

    // 资产挂载
    aisleGroup.userData = {
      id: `DEV-AISLE-0${aisleIdx + 1}`,
      code: aisleCode,
      name: `2F 算力中心 #${aisleIdx + 1} 冷通道高密微模块机组`,
      type: '核心高密算力服务器集群',
      system: '建筑设施',
      location: `2F 核心算力大厅 Zone-A 第 0${aisleIdx + 1} 列通道`,
      specs: '36台 42U 标准高密机柜 · 单机柜平均功率 8kW · 冷热通道封闭物理隔离 · 静电等电位接地',
      status: '正常',
      statusType: 'success',
      realtimeValue: '冷通道温度 22.4℃ · 湿度 48.5%RH · 机柜负载率 78.2%',
    };

    floor2Group.add(aisleGroup);
  });

  // 2F 精密列间空调排 (CRAH Units, 分布在南北端侧)
  [-32, 32].forEach((endX) => {
    for (let acZ = -18; acZ <= 18; acZ += 8) {
      const crah = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 2.4, 3.2),
        materials.chillerBody
      );
      crah.position.set(endX, 6.95, acZ);
      floor2Group.add(crah);
    }
  });

  interiorGroup.add(floor2Group);

  // =========================================================================
  // 3F: 算力扩展机房与云存储大厅 (Cloud Storage & AI Expansion, Y: 11.0 ~ 16.5m)
  // =========================================================================
  const floor3Group = new THREE.Group();

  // 3F 架空地板
  const f3Floor = new THREE.Mesh(
    new THREE.BoxGeometry(80, 0.25, 52),
    materials.interiorFloor
  );
  f3Floor.position.set(0, 11.0 + 0.12, 0);
  f3Floor.receiveShadow = true;
  floor3Group.add(f3Floor);

  // 3F 4 组大型 AI 算力与分布式存储集群
  const rackRowX3F = [-20, -7, 7, 20];
  rackRowX3F.forEach((rx, idx) => {
    const clusterGroup = new THREE.Group();

    // 机柜排 (双面，长 24m)
    for (let rz = -10; rz <= 10; rz += 2.0) {
      [-1.2, 1.2].forEach((offset) => {
        const rack = new THREE.Mesh(
          new THREE.BoxGeometry(1.1, 2.3, 1.8),
          materials.serverRackBody
        );
        rack.position.set(rx + offset, 12.4, rz);

        const led = new THREE.Mesh(
          new THREE.BoxGeometry(0.06, 1.9, 0.06),
          materials.serverRackLeds
        );
        led.position.set(rx + offset + (offset > 0 ? -0.58 : 0.58), 12.4, rz);

        clusterGroup.add(rack, led);
      });
    }

    clusterGroup.userData = {
      id: `DEV-CLUSTER-3F-0${idx + 1}`,
      code: `ZONE-B-CLUSTER-0${idx + 1}`,
      name: `3F 分布式智算与海量对象存储集群 #${idx + 1}`,
      type: '高吞吐分布式全闪存存储柜阵列',
      system: '建筑设施',
      location: `3F 扩展算力大厅 Zone-B 第 0${idx + 1} 矩阵区`,
      specs: 'PCIe 5.0 NVMe 全闪阵列 · 400Gbps RoCEv2 高速无损网络 · 双路冗余供电',
      status: '正常',
      statusType: 'success',
      realtimeValue: '存储利用率 64.8% · 吞吐量 1.2 TB/s · 温度 21.8℃',
    };

    floor3Group.add(clusterGroup);
  });

  interiorGroup.add(floor3Group);

  return interiorGroup;
}
