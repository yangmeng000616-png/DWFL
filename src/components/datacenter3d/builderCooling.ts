import * as THREE from 'three';
import { MaterialLibrary } from './materials';

export function buildCoolingPlant(materials: MaterialLibrary): THREE.Group {
  const coolingGroup = new THREE.Group();
  coolingGroup.name = 'Layer_cooling';

  // 冷却设备区场地底座与集水沟基坪 (X: -52 ~ -78, Z: -26 ~ 26)
  const yardWidth = 26;
  const yardDepth = 52;
  const yardX = -65;
  const yardZ = 0;

  const yardFloor = new THREE.Mesh(
    new THREE.BoxGeometry(yardWidth, 0.3, yardDepth),
    materials.concretePaving
  );
  yardFloor.position.set(yardX, 0.15, yardZ);
  yardFloor.receiveShadow = true;
  coolingGroup.add(yardFloor);

  // 1. 4 台大型变频离心冷水机组 (CHILLER-01 ~ CHILLER-04)
  // 整齐布置于西侧核心设备基础区
  const chillersZ = [-18, -6, 6, 18];

  chillersZ.forEach((zPos, idx) => {
    const chillerGroup = new THREE.Group();
    const chId = `DEV-CHILLER-0${idx + 1}`;

    // 混凝土减振基础台 (Plinth)
    const plinth = new THREE.Mesh(
      new THREE.BoxGeometry(10.5, 0.5, 4.2),
      materials.architecturalConcrete
    );
    plinth.position.set(-68, 0.45, zPos);
    chillerGroup.add(plinth);

    // 离心冷水机组双圆柱主筒体 (蒸发器与冷凝器)
    // 蒸发器筒体 (下筒，冷水，深蓝)
    const evapGeo = new THREE.CylinderGeometry(0.9, 0.9, 9.2, 24);
    const evaporator = new THREE.Mesh(evapGeo, materials.pipeChilledSupply);
    evaporator.rotation.z = Math.PI / 2;
    evaporator.position.set(-68, 1.6, zPos - 0.9);
    evaporator.castShadow = true;

    // 冷凝器筒体 (上筒，冷却水，草绿)
    const condGeo = new THREE.CylinderGeometry(0.85, 0.85, 9.2, 24);
    const condenser = new THREE.Mesh(condGeo, materials.pipeCondenserWater);
    condenser.rotation.z = Math.PI / 2;
    condenser.position.set(-68, 2.5, zPos + 0.8);
    condenser.castShadow = true;

    chillerGroup.add(evaporator, condenser);

    // 中置变频磁悬浮离心压缩机机头与电机 (Compressor)
    const compGeo = new THREE.CylinderGeometry(0.7, 0.75, 2.6, 16);
    const compressor = new THREE.Mesh(compGeo, materials.chillerBody);
    compressor.position.set(-68, 3.4, zPos);
    compressor.castShadow = true;
    chillerGroup.add(compressor);

    // 机组本地微电脑智能触摸屏与动力变频电控柜
    const panel = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 2.0, 0.6),
      materials.sandwichWallDark
    );
    panel.position.set(-63.5, 2.0, zPos);
    panel.castShadow = true;
    chillerGroup.add(panel);

    // 挂载资产与交互属性
    plinth.userData = chillerGroup.userData = {
      id: chId,
      code: chId,
      name: `西区 ${idx + 1}号高能效离心冷水机组`,
      type: '高能效双级变频离心冷水机组',
      system: '暖通冷却',
      location: `园区西侧冷水机房设备区基础 P-0${idx + 1}`,
      specs: '额定制冷量 3500kW · COP 6.8 · 电源 10kV高压直供 · 环保制冷剂 R134a',
      status: '正常',
      statusType: 'success',
      realtimeValue: '出水 7.0℃ · 回水 12.1℃ · 负载率 76.5%',
    };

    coolingGroup.add(chillerGroup);
  });

  // 2. 冷却循环水泵与冷冻循环水泵机组 (6台高效卧式离心泵)
  const pumpZ = [-20, -12, -4, 4, 12, 20];
  pumpZ.forEach((zPos, idx) => {
    const pumpGroup = new THREE.Group();
    const pumpPlinth = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.35, 1.8),
      materials.architecturalConcrete
    );
    pumpPlinth.position.set(-57.5, 0.4, zPos);
    pumpGroup.add(pumpPlinth);

    // 卧式泵体 (蜗壳 + 电机)
    const motor = new THREE.Mesh(
      new THREE.CylinderGeometry(0.4, 0.4, 1.4, 16),
      materials.chillerBody
    );
    motor.rotation.z = Math.PI / 2;
    motor.position.set(-57.8, 0.95, zPos);

    const volute = new THREE.Mesh(
      new THREE.CylinderGeometry(0.55, 0.55, 0.6, 16),
      idx % 2 === 0 ? materials.pipeChilledSupply : materials.pipeCondenserWater
    );
    volute.position.set(-56.7, 0.95, zPos);

    pumpGroup.add(motor, volute);
    pumpGroup.userData = {
      id: `DEV-PUMP-0${idx + 1}`,
      code: `PUMP-W-0${idx + 1}`,
      name: `${idx % 2 === 0 ? '冷冻水' : '冷却水'}主循环水泵 #${idx + 1}`,
      type: '高效变频卧式端吸离心泵',
      system: '暖通冷却',
      location: `西侧循环水泵阵列 S-0${idx + 1}`,
      specs: '额定流量 580m³/h · 扬程 36m · 电机功率 75kW · 变频IE4超高效',
      status: '正常',
      statusType: 'success',
      realtimeValue: '转速 1460rpm · 轴承振动 1.2mm/s (良好)',
    };
    coolingGroup.add(pumpGroup);
  });

  // 3. 多层彩色编码保温冷却管道总管与支架系统 (Overhead Pipe Rack & Headers)
  // 贯穿整个冷却区 (Z: -24 到 +24)，并将总管穿越西立面 (X: -41) 送入主机房
  const pipingGroup = new THREE.Group();

  // 钢结构管道管廊主立柱与横担 (每隔 6m 一座龙门架)
  for (let z = -24; z <= 24; z += 6) {
    const rackPostL = new THREE.Mesh(
      new THREE.BoxGeometry(0.25, 4.8, 0.25),
      materials.galvanizedSteel
    );
    rackPostL.position.set(-61.5, 2.4, z);
    const rackPostR = new THREE.Mesh(
      new THREE.BoxGeometry(0.25, 4.8, 0.25),
      materials.galvanizedSteel
    );
    rackPostR.position.set(-53.5, 2.4, z);

    // 双层横梁
    const crossBeam1 = new THREE.Mesh(
      new THREE.BoxGeometry(8.2, 0.2, 0.2),
      materials.galvanizedSteel
    );
    crossBeam1.position.set(-57.5, 3.4, z);

    const crossBeam2 = new THREE.Mesh(
      new THREE.BoxGeometry(8.2, 0.2, 0.2),
      materials.galvanizedSteel
    );
    crossBeam2.position.set(-57.5, 4.6, z);

    pipingGroup.add(rackPostL, rackPostR, crossBeam1, crossBeam2);
  }

  // 纵向冷却主管道 (管径 DN600 / DN500)
  // A. 冷冻水供水总管 (深蓝 7℃, Y = 3.6m)
  const pChilledSupply = new THREE.Mesh(
    new THREE.CylinderGeometry(0.35, 0.35, 48, 16),
    materials.pipeChilledSupply
  );
  pChilledSupply.rotation.x = Math.PI / 2;
  pChilledSupply.position.set(-59.5, 3.6, 0);
  pipingGroup.add(pChilledSupply);

  // B. 冷冻水回水总管 (浅蓝 12℃, Y = 3.6m)
  const pChilledReturn = new THREE.Mesh(
    new THREE.CylinderGeometry(0.35, 0.35, 48, 16),
    materials.pipeChilledReturn
  );
  pChilledReturn.rotation.x = Math.PI / 2;
  pChilledReturn.position.set(-58.2, 3.6, 0);
  pipingGroup.add(pChilledReturn);

  // C. 冷却水供水总管 (草绿 32℃, Y = 4.8m)
  const pCondSupply = new THREE.Mesh(
    new THREE.CylinderGeometry(0.38, 0.38, 48, 16),
    materials.pipeCondenserWater
  );
  pCondSupply.rotation.x = Math.PI / 2;
  pCondSupply.position.set(-59.5, 4.8, 0);
  pipingGroup.add(pCondSupply);

  // D. 冷却水回水总管 (草绿 37℃, Y = 4.8m)
  const pCondReturn = new THREE.Mesh(
    new THREE.CylinderGeometry(0.38, 0.38, 48, 16),
    materials.pipeCondenserWater
  );
  pCondReturn.rotation.x = Math.PI / 2;
  pCondReturn.position.set(-58.2, 4.8, 0);
  pipingGroup.add(pCondReturn);

  // 穿越主机房西外墙的横向入楼管段 (从 X: -53 连至主机房西立面 X: -41)
  [-8, 8].forEach((zOffset) => {
    const feederPipe1 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.32, 12.5, 16),
      materials.pipeChilledSupply
    );
    feederPipe1.rotation.z = Math.PI / 2;
    feederPipe1.position.set(-47, 3.6, zOffset);

    const feederPipe2 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.32, 12.5, 16),
      materials.pipeChilledReturn
    );
    feederPipe2.rotation.z = Math.PI / 2;
    feederPipe2.position.set(-47, 4.8, zOffset);

    pipingGroup.add(feederPipe1, feederPipe2);
  });

  coolingGroup.add(pipingGroup);

  // 4. 检修平台与工业黄色安全围栏 (Maintenance Catwalk & Yellow Safety Handrails)
  const platformGroup = new THREE.Group();

  // 沿水机西侧贯穿的钢格栅检修平台 (高 1.5m, 宽 1.4m, 长 44m)
  const platMesh = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 0.1, 44),
    materials.galvanizedSteel
  );
  platMesh.position.set(-73.8, 1.5, 0);
  platformGroup.add(platMesh);

  // 平台黄色安全立杆与扶手
  const railMat = materials.safetyYellow;
  const handrail = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 1.0, 44),
    railMat
  );
  handrail.position.set(-74.45, 2.0, 0);
  platformGroup.add(handrail);

  // 冷却区外围安全围栏
  const fenceMat = materials.galvanizedSteel;
  const fenceWest = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.2, 53), fenceMat);
  fenceWest.position.set(-78.5, 1.1, 0);
  const fenceNorth = new THREE.Mesh(new THREE.BoxGeometry(26, 2.2, 0.1), fenceMat);
  fenceNorth.position.set(-65.5, 1.1, -26.5);
  const fenceSouth = new THREE.Mesh(new THREE.BoxGeometry(26, 2.2, 0.1), fenceMat);
  fenceSouth.position.set(-65.5, 1.1, 26.5);
  platformGroup.add(fenceWest, fenceNorth, fenceSouth);

  coolingGroup.add(platformGroup);

  return coolingGroup;
}
