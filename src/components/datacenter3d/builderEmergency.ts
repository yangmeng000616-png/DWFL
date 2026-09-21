import * as THREE from 'three';
import { MaterialLibrary } from './materials';

export function buildEmergencyPower(materials: MaterialLibrary): THREE.Group {
  const emergencyGroup = new THREE.Group();
  emergencyGroup.name = 'Layer_emergency';

  // 1. 柴油发电机房建筑主体 (26m x 16m x 7.5m)
  // 位于东南侧 (X: 58 ~ 84, 中心在 X: 71, Z: 34)
  const dgWidth = 26;
  const dgDepth = 16;
  const dgHeight = 7.5;
  const dgX = 71;
  const dgZ = 34;

  // 混凝土基础
  const dgPlinth = new THREE.Mesh(
    new THREE.BoxGeometry(dgWidth + 0.6, 0.8, dgDepth + 0.6),
    materials.architecturalConcrete
  );
  dgPlinth.position.set(dgX, 0.4, dgZ);
  dgPlinth.receiveShadow = true;
  emergencyGroup.add(dgPlinth);

  // 柴发房墙体 (深灰金属夹芯保温降噪板)
  const dgBuilding = new THREE.Mesh(
    new THREE.BoxGeometry(dgWidth, dgHeight - 0.8, dgDepth),
    materials.sandwichWallDark
  );
  dgBuilding.position.set(dgX, 0.8 + (dgHeight - 0.8) / 2, dgZ);
  dgBuilding.castShadow = true;
  dgBuilding.receiveShadow = true;
  dgBuilding.userData = {
    id: 'DIESEL-GEN-BUILDING',
    name: '应急柴油发电机动力中心',
    type: '应急备用自备电源枢纽',
    system: '应急动力',
    location: '园区东南动力保障区 (26m×16m)',
    specs: '4×2000kW 10kV高压重载柴油发电机组 · 15秒黑启动并机 · 满载连续供电 > 48小时',
  };
  emergencyGroup.add(dgBuilding);

  // 屋顶女儿墙压顶
  const dgParapet = new THREE.Mesh(
    new THREE.BoxGeometry(dgWidth + 0.2, 0.5, dgDepth + 0.2),
    materials.curtainWallLight
  );
  dgParapet.position.set(dgX, dgHeight + 0.25, dgZ);
  emergencyGroup.add(dgParapet);

  // 2. 4 台大型应急柴油发电机组的排烟与消音系统 (4 根不锈钢消音立管出屋面)
  // 位于柴发房屋顶上方，配有消音包与防雨帽
  const stackPositions = [-9, -3, 3, 9];

  stackPositions.forEach((xOffset, idx) => {
    const stackGroup = new THREE.Group();
    const genId = `DEV-GEN-0${idx + 1}`;
    const posX = dgX + xOffset;
    const posZ = dgZ - 3;

    // 出屋面不锈钢排气直管
    const stackPipe = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 0.35, 4.2, 16),
      materials.exhaustStack
    );
    stackPipe.position.set(posX, dgHeight + 2.1, posZ);
    stackPipe.castShadow = true;

    // 排烟消音腔阻抗复合消音器 (Silencer Drum)
    const silencer = new THREE.Mesh(
      new THREE.CylinderGeometry(0.7, 0.7, 1.8, 16),
      materials.exhaustStack
    );
    silencer.position.set(posX, dgHeight + 2.8, posZ);
    silencer.castShadow = true;

    // 顶部锥形不锈钢防雨帽 (Rain Cowl Cap)
    const rainCap = new THREE.Mesh(
      new THREE.ConeGeometry(0.65, 0.45, 16),
      materials.exhaustStack
    );
    rainCap.position.set(posX, dgHeight + 4.3, posZ);

    stackGroup.add(stackPipe, silencer, rainCap);
    stackGroup.userData = {
      id: genId,
      code: genId,
      name: `${idx + 1}号高压重载柴油发电机组 (2000kW)`,
      type: '10kV应急高压柴油发电机',
      system: '应急动力',
      location: `东南柴发机房 0${idx + 1}号机位`,
      specs: '额定功率 2000kW · 输出电压 10.5kV · 快速自启动投切 < 12s · 电子调速控制',
      status: '正常',
      statusType: 'success',
      realtimeValue: '热备就绪 · 蓄电池电压 26.8V · 水温 45℃',
    };
    emergencyGroup.add(stackGroup);
  });

  // 3. 柴发房进风与排风降噪百叶 (南立面进风，北立面排风)
  stackPositions.forEach((xOffset) => {
    // 进风百叶 (南侧)
    const intakeLouver = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 3.4, 0.25),
      materials.ventLouver
    );
    intakeLouver.position.set(dgX + xOffset, 3.2, dgZ + dgDepth / 2 + 0.1);
    emergencyGroup.add(intakeLouver);

    // 散热器排风百叶 (北侧)
    const exhaustLouver = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 3.4, 0.25),
      materials.ventLouver
    );
    exhaustLouver.position.set(dgX + xOffset, 3.2, dgZ - dgDepth / 2 - 0.1);
    emergencyGroup.add(exhaustLouver);
  });

  // 4. 独立室外燃油配套设施与日用防爆油箱围堰 (Daily Fuel Tank Bunded Area)
  // 位于柴发房东侧 (X: 86 ~ 94, Z: 28 ~ 40)
  const fuelGroup = new THREE.Group();

  // 混凝土防爆防溢防火围堰 (Containment Dyke)
  const dykeWallMat = materials.architecturalConcrete;
  const dykeFloor = new THREE.Mesh(new THREE.BoxGeometry(8.5, 0.3, 11), materials.concretePaving);
  dykeFloor.position.set(90, 0.15, 34);
  const dykeNorth = new THREE.Mesh(new THREE.BoxGeometry(8.5, 1.4, 0.4), dykeWallMat);
  dykeNorth.position.set(90, 0.7, 28.5);
  const dykeSouth = new THREE.Mesh(new THREE.BoxGeometry(8.5, 1.4, 0.4), dykeWallMat);
  dykeSouth.position.set(90, 0.7, 39.5);
  const dykeEast = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.4, 11), dykeWallMat);
  dykeEast.position.set(94.2, 0.7, 34);
  const dykeWest = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.4, 11), dykeWallMat);
  dykeWest.position.set(85.8, 0.7, 34);
  fuelGroup.add(dykeFloor, dykeNorth, dykeSouth, dykeEast, dykeWest);

  // 2 座卧式防爆应急日用储油罐 (5m³ / 罐)
  [-2.2, 2.2].forEach((zOffset, idx) => {
    const tankCyl = new THREE.Mesh(
      new THREE.CylinderGeometry(1.2, 1.2, 6.2, 20),
      materials.sandwichWallDark
    );
    tankCyl.rotation.z = Math.PI / 2;
    tankCyl.position.set(90, 1.8, 34 + zOffset);
    tankCyl.castShadow = true;
    tankCyl.userData = {
      id: `DEV-FUEL-TANK-0${idx + 1}`,
      code: `TANK-0${idx + 1}`,
      name: `${idx + 1}号高位日用储油罐 (5m³)`,
      type: '防爆卧式燃油存储容器',
      system: '应急动力',
      location: '东南柴发围堰设备区',
      specs: '容积 5m³ · 阻隔防爆填料 · 快速紧急切断阀 · 双回路供油',
      status: '正常',
      statusType: 'success',
      realtimeValue: '储量 88.5% (4.42m³) · 静电接地电阻 0.12Ω',
    };
    fuelGroup.add(tankCyl);
  });

  // 静电消除接地柱与燃油接地释放夹 (ESD-FUEL-01)
  const esdPole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 1.5, 12),
    materials.safetyYellow
  );
  esdPole.position.set(87.5, 0.75, 41);
  const esdBall = new THREE.Mesh(
    new THREE.SphereGeometry(0.14, 16, 16),
    materials.sensorProbe
  );
  esdBall.position.set(87.5, 1.5, 41);
  esdBall.userData = {
    id: 'DEV-ESD-FUEL',
    code: 'ESD-FUEL-01',
    name: '卸油防静电报警联锁控制器',
    type: '人体与车辆静电消除接地仪',
    system: '防静电ESD',
    location: '燃油卸车与储罐围堰入口',
    specs: '本安防爆 Ex ia IIC T4 · 静电释放阻值 ≤ 55Ω · 蜂鸣声光联锁',
    status: '正常',
    statusType: 'success',
    realtimeValue: '回路导通 0.08Ω · 静电位 0V',
  };
  fuelGroup.add(esdPole, esdBall);

  emergencyGroup.add(fuelGroup);

  return emergencyGroup;
}
