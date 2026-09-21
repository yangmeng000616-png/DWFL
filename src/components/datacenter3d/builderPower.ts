import * as THREE from 'three';
import { MaterialLibrary } from './materials';

export function buildPowerSubstation(materials: MaterialLibrary): THREE.Group {
  const powerGroup = new THREE.Group();
  powerGroup.name = 'Layer_power';

  // 1. 变配电中心与 UPS 配电附属用房主体建筑 (36m x 18m x 8m)
  // 位于主机房东侧 (X: 58 ~ 94, 中心在 X: 76, Z: 2)
  const subWidth = 36;
  const subDepth = 18;
  const subHeight = 8.2;
  const subX = 76;
  const subZ = 2;

  // 基础混凝土裙边
  const subPlinth = new THREE.Mesh(
    new THREE.BoxGeometry(subWidth + 0.6, 0.8, subDepth + 0.6),
    materials.architecturalConcrete
  );
  subPlinth.position.set(subX, 0.4, subZ);
  subPlinth.receiveShadow = true;
  powerGroup.add(subPlinth);

  // 配电中心主体墙体 (浅灰铝板幕墙与深灰装饰条)
  const subBuilding = new THREE.Mesh(
    new THREE.BoxGeometry(subWidth, subHeight - 0.8, subDepth),
    materials.curtainWallLight
  );
  subBuilding.position.set(subX, 0.8 + (subHeight - 0.8) / 2, subZ);
  subBuilding.castShadow = true;
  subBuilding.receiveShadow = true;
  subBuilding.userData = {
    id: 'POWER-SUBSTATION-MAIN',
    name: '星云变配电中心及UPS电力保障楼',
    type: '10kV变配电与高压直流UPS核心站',
    system: '变配电',
    location: '园区东侧独立动力区',
    specs: '双重110kV外市电输入 · 4×2500kVA高可靠干式配电 · 2N容错UPS构架',
  };
  powerGroup.add(subBuilding);

  // 女儿墙压顶
  const subRoofParapet = new THREE.Mesh(
    new THREE.BoxGeometry(subWidth + 0.2, 0.6, subDepth + 0.2),
    materials.sandwichWallDark
  );
  subRoofParapet.position.set(subX, subHeight + 0.3, subZ);
  powerGroup.add(subRoofParapet);

  // 变配电房双开防火门与电缆进线间百叶
  const powerDoor = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 3.2, 3.8),
    materials.sandwichWallDark
  );
  powerDoor.position.set(subX - subWidth / 2 - 0.05, 2.2, subZ - 3);
  powerGroup.add(powerDoor);

  const subLouver = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 2.2, 6),
    materials.ventLouver
  );
  subLouver.position.set(subX - subWidth / 2 - 0.05, 4.8, subZ + 3);
  powerGroup.add(subLouver);

  // 2. 室外 110kV/10kV 降压主变压器设备区 (位于变配电房北侧 X: 64 ~ 88, Z: -18 ~ -8)
  const transformerYard = new THREE.Group();

  // 变压器基础沉箱与碎石吸油层 (Gravel Soak-pit)
  const pitGeo = new THREE.BoxGeometry(26, 0.35, 12);
  const pitMesh = new THREE.Mesh(pitGeo, materials.concretePaving);
  pitMesh.position.set(76, 0.18, -14);
  pitMesh.receiveShadow = true;
  transformerYard.add(pitMesh);

  // 两台主变中间的高等级钢筋混凝土防爆防火隔墙 (Blast/Fire Wall)
  const fireWall = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 6.2, 13),
    materials.architecturalConcrete
  );
  fireWall.position.set(76, 3.1, -14);
  fireWall.castShadow = true;
  transformerYard.add(fireWall);

  // 2 台大型油浸式主变压器 (TR-01# 与 TR-02#)
  const trConfigs = [
    { id: 'DEV-TR-01', name: '1号主变压器 (110kV/10kV 31.5MVA)', x: 70, z: -14 },
    { id: 'DEV-TR-02', name: '2号主变压器 (110kV/10kV 31.5MVA)', x: 82, z: -14 },
  ];

  trConfigs.forEach((cfg) => {
    const trGroup = new THREE.Group();

    // 变压器混凝土基墩
    const plinth = new THREE.Mesh(
      new THREE.BoxGeometry(6.4, 0.6, 5.2),
      materials.architecturalConcrete
    );
    plinth.position.set(cfg.x, 0.45, cfg.z);
    trGroup.add(plinth);

    // 变压器钢制主体油箱 (Main Tank)
    const tank = new THREE.Mesh(
      new THREE.BoxGeometry(5.2, 3.4, 4.2),
      materials.transformerBody
    );
    tank.position.set(cfg.x, 2.45, cfg.z);
    tank.castShadow = true;
    tank.userData = {
      id: cfg.id,
      code: cfg.id,
      name: cfg.name,
      type: '110kV三相双绕组有载调压主变',
      system: '变配电',
      location: `变电区室外油浸变压器位 (X:${cfg.x}, Z:${cfg.z})`,
      specs: '额定容量 31500kVA · 阻抗电压 10.5% · 绝缘等级A · 自冷/风冷双模',
      status: '正常',
      statusType: 'success',
      realtimeValue: '负载率 62.4% · 顶层油温 54.1℃ (安全)',
    };
    trGroup.add(tank);

    // 变压器侧面片状散热风冷散热器排 (Radiator Fins)
    [-2.3, 2.3].forEach((zFin) => {
      for (let i = -1.8; i <= 1.8; i += 0.45) {
        const fin = new THREE.Mesh(
          new THREE.BoxGeometry(0.08, 2.8, 1.2),
          materials.galvanizedSteel
        );
        fin.position.set(cfg.x + i, 2.45, cfg.z + zFin);
        trGroup.add(fin);
      }
    });

    // 顶部圆柱形储油柜 (Oil Conservator Tank)
    const conservator = new THREE.Mesh(
      new THREE.CylinderGeometry(0.55, 0.55, 3.8, 16),
      materials.transformerBody
    );
    conservator.rotation.z = Math.PI / 2;
    conservator.position.set(cfg.x, 4.4, cfg.z - 1.2);
    trGroup.add(conservator);

    // 高压套管 (High-Voltage Ceramic Bushings) 3 相 A/B/C
    [-1.2, 0, 1.2].forEach((xOffset) => {
      const bushing = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.22, 1.4, 12),
        materials.insulatorCeramic
      );
      bushing.position.set(cfg.x + xOffset, 4.8, cfg.z + 1.1);
      trGroup.add(bushing);
    });

    transformerYard.add(trGroup);
  });

  // 变电站安全隔离围栏 (Safety Security Fence)
  const fenceMat = materials.galvanizedSteel;
  const fenceBack = new THREE.Mesh(new THREE.BoxGeometry(27, 2.4, 0.1), fenceMat);
  fenceBack.position.set(76, 1.2, -20.2);
  const fenceFront = new THREE.Mesh(new THREE.BoxGeometry(27, 2.4, 0.1), fenceMat);
  fenceFront.position.set(76, 1.2, -7.8);
  const fenceEast = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.4, 12.5), fenceMat);
  fenceEast.position.set(89.5, 1.2, -14);
  transformerYard.add(fenceBack, fenceFront, fenceEast);

  powerGroup.add(transformerYard);

  // 3. 全封闭跨街金属电缆桥架 (Overhead Enclosed Cable Bridge)
  // 跨越东侧 12m 专用检修通道，连接变配电楼 (X=58) 至主机房东墙 (X=41)
  const bridgeGroup = new THREE.Group();

  const bridgeLength = 18; // 从 X: 41 到 X: 59
  const bridgeWidth = 3.4; // Z
  const bridgeHeight = 2.8; // Y
  const bridgeY = 7.2; // 位于二层标高 (电缆层)
  const bridgeCenterX = (41 + 59) / 2; // 50
  const bridgeCenterZ = 2;

  // 桥架主体结构箱体
  const bridgeBox = new THREE.Mesh(
    new THREE.BoxGeometry(bridgeLength, bridgeHeight, bridgeWidth),
    materials.curtainWallLight
  );
  bridgeBox.position.set(bridgeCenterX, bridgeY, bridgeCenterZ);
  bridgeBox.castShadow = true;
  bridgeBox.userData = {
    id: 'CABLE-BRIDGE-EAST',
    name: '东区动力高压母线全封闭绝缘电缆桥架',
    type: '主路供电通道及管廊',
    system: '变配电',
    location: '跨主机房东立面 12m 检修通道 (+7.2m 标高)',
    specs: '敷设4回10kV三芯交联电力电缆与智能母线槽 · 具备甲级防火包覆与等电位跨接',
  };
  bridgeGroup.add(bridgeBox);

  // 桥架支撑钢结构门架工字立柱 (位于检修通道两侧，留足车辆通行净高 5.5m)
  [45, 55].forEach((xPillar) => {
    const p1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 5.8, 0.4),
      materials.galvanizedSteel
    );
    p1.position.set(xPillar, 2.9, bridgeCenterZ - bridgeWidth / 2);
    p1.castShadow = true;

    const p2 = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 5.8, 0.4),
      materials.galvanizedSteel
    );
    p2.position.set(xPillar, 2.9, bridgeCenterZ + bridgeWidth / 2);
    p2.castShadow = true;

    bridgeGroup.add(p1, p2);
  });

  powerGroup.add(bridgeGroup);

  return powerGroup;
}
