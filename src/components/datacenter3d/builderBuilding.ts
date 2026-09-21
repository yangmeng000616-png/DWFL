import * as THREE from 'three';
import { MaterialLibrary } from './materials';

export function buildMainBuilding(materials: MaterialLibrary): THREE.Group {
  const buildingGroup = new THREE.Group();
  buildingGroup.name = 'Layer_building';

  const B_WIDTH = 82; // X
  const B_DEPTH = 54; // Z
  const B_HEIGHT = 16.5; // 3 floors: 5.5m each
  const PARAPET_H = 1.2; // 女儿墙高 1.2m
  const WALL_T = 0.45; // 外墙厚度 0.45m

  // 为建筑外围护结构创建专属独立材质实例，便于 X-Ray 透视控制
  const buildingWallMat = materials.curtainWallLight.clone();
  buildingWallMat.name = 'buildingWallMat';

  const buildingSandwichMat = materials.sandwichWallDark.clone();
  buildingSandwichMat.name = 'buildingSandwichMat';

  const buildingConcreteMat = materials.architecturalConcrete.clone();
  buildingConcreteMat.name = 'buildingConcreteMat';

  const buildingRoofMat = materials.roofDeck.clone();
  buildingRoofMat.name = 'buildingRoofMat';

  // 挂载材质引用至 buildingGroup.userData 方便 sceneManager 统一精准调节
  buildingGroup.userData = {
    isBuildingGroup: true,
    wallMaterials: [buildingWallMat, buildingSandwichMat, buildingConcreteMat, buildingRoofMat],
  };

  // 1. 建筑裙楼清水混凝土基座 (四周连续环梁, Y: 0 ~ 1.5m)
  // 南北两侧底梁
  const plinthNS = new THREE.Mesh(new THREE.BoxGeometry(B_WIDTH + 0.8, 1.5, WALL_T + 0.4), buildingConcreteMat);
  const plinthS = plinthNS.clone();
  plinthS.position.set(0, 0.75, B_DEPTH / 2 + 0.2);
  const plinthN = plinthNS.clone();
  plinthN.position.set(0, 0.75, -B_DEPTH / 2 - 0.2);

  // 东西两侧底梁
  const plinthEW = new THREE.Mesh(new THREE.BoxGeometry(WALL_T + 0.4, 1.5, B_DEPTH), buildingConcreteMat);
  const plinthE = plinthEW.clone();
  plinthE.position.set(B_WIDTH / 2 + 0.2, 0.75, 0);
  const plinthW = plinthEW.clone();
  plinthW.position.set(-B_WIDTH / 2 - 0.2, 0.75, 0);

  buildingGroup.add(plinthS, plinthN, plinthE, plinthW);

  // 2. 主体真实空腔外墙围护 (Hollow Exterior Shell, Y: 1.5 ~ 16.5m)
  const wallHeight = B_HEIGHT - 1.5;
  const wallCenterY = 1.5 + wallHeight / 2;

  // 东外墙 (X = +B_WIDTH/2)
  const eastWall = new THREE.Mesh(
    new THREE.BoxGeometry(WALL_T, wallHeight, B_DEPTH),
    buildingWallMat
  );
  eastWall.position.set(B_WIDTH / 2, wallCenterY, 0);
  eastWall.castShadow = true;
  eastWall.receiveShadow = true;

  // 西外墙 (X = -B_WIDTH/2)
  const westWall = new THREE.Mesh(
    new THREE.BoxGeometry(WALL_T, wallHeight, B_DEPTH),
    buildingWallMat
  );
  westWall.position.set(-B_WIDTH / 2, wallCenterY, 0);
  westWall.castShadow = true;
  westWall.receiveShadow = true;

  // 北外墙 (Z = -B_DEPTH/2)
  const northWall = new THREE.Mesh(
    new THREE.BoxGeometry(B_WIDTH, wallHeight, WALL_T),
    buildingWallMat
  );
  northWall.position.set(0, wallCenterY, -B_DEPTH / 2);
  northWall.castShadow = true;
  northWall.receiveShadow = true;

  // 南外墙 (Z = +B_DEPTH/2, 中间预留门厅玻璃透视大开口 X: -9 ~ +9, 高度 5m)
  // 左侧实墙 (X: -41 ~ -9)
  const southWallL = new THREE.Mesh(
    new THREE.BoxGeometry(32, wallHeight, WALL_T),
    buildingWallMat
  );
  southWallL.position.set(-25, wallCenterY, B_DEPTH / 2);

  // 右侧实墙 (X: 9 ~ 41)
  const southWallR = new THREE.Mesh(
    new THREE.BoxGeometry(32, wallHeight, WALL_T),
    buildingWallMat
  );
  southWallR.position.set(25, wallCenterY, B_DEPTH / 2);

  // 门厅上方实墙 (X: -9 ~ 9, Y: 5.5 ~ 16.5)
  const southWallTop = new THREE.Mesh(
    new THREE.BoxGeometry(18, wallHeight - 4.0, WALL_T),
    buildingWallMat
  );
  southWallTop.position.set(0, 1.5 + 4.0 + (wallHeight - 4.0) / 2, B_DEPTH / 2);

  buildingGroup.add(eastWall, westWall, northWall, southWallL, southWallR, southWallTop);

  // 3. 立面深灰色金属夹芯板装饰分格带与层间金属嵌条 (RAL 7016)
  const floorBands = new THREE.Group();

  // 1F-2F 层间嵌条 (Y = 5.5)
  const band1FGeo = new THREE.BoxGeometry(B_WIDTH + 0.2, 0.4, B_DEPTH + 0.2);
  const band1F = new THREE.Mesh(band1FGeo, buildingSandwichMat);
  band1F.position.set(0, 5.5, 0);
  floorBands.add(band1F);

  // 2F-3F 层间嵌条 (Y = 11.0)
  const band2F = new THREE.Mesh(band1FGeo, buildingSandwichMat);
  band2F.position.set(0, 11.0, 0);
  floorBands.add(band2F);

  // 南北外立面深灰金属夹芯板立面模块拼缝 (厚度 0.12m 突出幕墙面)
  const accentPanelGeo = new THREE.BoxGeometry(14, 13.5, 0.25);
  const southAccentL = new THREE.Mesh(accentPanelGeo, buildingSandwichMat);
  southAccentL.position.set(-28, 8.5, B_DEPTH / 2 + 0.05);
  const southAccentR = new THREE.Mesh(accentPanelGeo, buildingSandwichMat);
  southAccentR.position.set(28, 8.5, B_DEPTH / 2 + 0.05);

  const northAccentL = new THREE.Mesh(accentPanelGeo, buildingSandwichMat);
  northAccentL.position.set(-28, 8.5, -B_DEPTH / 2 - 0.05);
  const northAccentR = new THREE.Mesh(accentPanelGeo, buildingSandwichMat);
  northAccentR.position.set(28, 8.5, -B_DEPTH / 2 - 0.05);

  floorBands.add(southAccentL, southAccentR, northAccentL, northAccentR);

  // 东西两侧外墙深灰纵向竖条饰带
  const eastAccentGeo = new THREE.BoxGeometry(0.25, 13.5, 12);
  const eastAccent1 = new THREE.Mesh(eastAccentGeo, buildingSandwichMat);
  eastAccent1.position.set(B_WIDTH / 2 + 0.05, 8.5, -12);
  const eastAccent2 = new THREE.Mesh(eastAccentGeo, buildingSandwichMat);
  eastAccent2.position.set(B_WIDTH / 2 + 0.05, 8.5, 12);

  const westAccent1 = new THREE.Mesh(eastAccentGeo, buildingSandwichMat);
  westAccent1.position.set(-B_WIDTH / 2 - 0.05, 8.5, -12);
  const westAccent2 = new THREE.Mesh(eastAccentGeo, buildingSandwichMat);
  westAccent2.position.set(-B_WIDTH / 2 - 0.05, 8.5, 12);

  floorBands.add(eastAccent1, eastAccent2, westAccent1, westAccent2);
  buildingGroup.add(floorBands);

  // 4. 高位窄窗 (Clerestory Ribbon Windows)
  const windowGroup = new THREE.Group();

  [-16, 16].forEach((xOffset) => {
    [7.8, 13.3].forEach((yFloor) => {
      const winGeo = new THREE.BoxGeometry(10, 1.1, 0.2);
      const winMesh = new THREE.Mesh(winGeo, materials.glassTinted);
      winMesh.position.set(xOffset, yFloor, B_DEPTH / 2 + 0.1);
      windowGroup.add(winMesh);
    });
  });

  [-16, 16].forEach((xOffset) => {
    [7.8, 13.3].forEach((yFloor) => {
      const winGeo = new THREE.BoxGeometry(10, 1.1, 0.2);
      const winMesh = new THREE.Mesh(winGeo, materials.glassTinted);
      winMesh.position.set(xOffset, yFloor, -B_DEPTH / 2 - 0.1);
      windowGroup.add(winMesh);
    });
  });

  // 外墙消音百叶
  [-30, 30].forEach((xPos) => {
    const louverGeo = new THREE.BoxGeometry(6, 2.2, 0.22);
    const louverMeshS = new THREE.Mesh(louverGeo, materials.ventLouver);
    louverMeshS.position.set(xPos, 3.5, B_DEPTH / 2 + 0.1);
    const louverMeshN = new THREE.Mesh(louverGeo, materials.ventLouver);
    louverMeshN.position.set(xPos, 3.5, -B_DEPTH / 2 - 0.1);
    windowGroup.add(louverMeshS, louverMeshN);
  });

  const westLouver = new THREE.Mesh(new THREE.BoxGeometry(0.22, 2.5, 8), materials.ventLouver);
  westLouver.position.set(-B_WIDTH / 2 - 0.1, 3.8, 0);
  windowGroup.add(westLouver);

  buildingGroup.add(windowGroup);

  // 5. 南立面主入口、门厅雨棚与访客通道 (Z = +27m)
  const southEntranceGroup = new THREE.Group();

  // 主入口悬挑大雨棚
  const canopyPlate = new THREE.Mesh(
    new THREE.BoxGeometry(18, 0.6, 6.2),
    materials.canopyFascia
  );
  canopyPlate.position.set(0, 4.8, B_DEPTH / 2 + 3.1);
  canopyPlate.castShadow = true;
  southEntranceGroup.add(canopyPlate);

  // 雨棚招牌："星云计算中心 STAR CLOUD DATA CENTER"
  const signBoard = new THREE.Mesh(
    new THREE.BoxGeometry(16, 0.45, 0.08),
    materials.canopyFascia
  );
  signBoard.position.set(0, 4.8, B_DEPTH / 2 + 6.25);
  southEntranceGroup.add(signBoard);

  // 门厅高通透落地结构玻璃幕墙 (透过此玻璃可直接望见1F内部NOC大厅)
  const lobbyGlass = new THREE.Mesh(
    new THREE.BoxGeometry(14, 4.2, 0.1),
    materials.glassTinted
  );
  lobbyGlass.position.set(0, 2.4, B_DEPTH / 2 + 0.05);
  southEntranceGroup.add(lobbyGlass);

  // 入口门廊大理石方柱
  [-7.5, 7.5].forEach((xPos) => {
    const col = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 4.5, 0.8),
      buildingConcreteMat
    );
    col.position.set(xPos, 2.55, B_DEPTH / 2 + 5.5);
    col.castShadow = true;
    southEntranceGroup.add(col);
  });

  buildingGroup.add(southEntranceGroup);

  // 6. 北立面设备运输入口、货运通道与后勤检修
  const northLogisticsGroup = new THREE.Group();

  const dockPlatform = new THREE.Mesh(
    new THREE.BoxGeometry(42, 1.2, 4.2),
    buildingConcreteMat
  );
  dockPlatform.position.set(0, 0.6, -B_DEPTH / 2 - 2.1);
  dockPlatform.receiveShadow = true;
  northLogisticsGroup.add(dockPlatform);

  const doorWidth = 4.2;
  const doorHeight = 4.5;
  const doorOffsets = [-12, 0, 12];

  doorOffsets.forEach((xPos) => {
    const rollDoor = new THREE.Mesh(
      new THREE.BoxGeometry(doorWidth, doorHeight, 0.15),
      buildingSandwichMat
    );
    rollDoor.position.set(xPos, 1.2 + doorHeight / 2, -B_DEPTH / 2 - 0.05);
    northLogisticsGroup.add(rollDoor);

    const louverAbove = new THREE.Mesh(
      new THREE.BoxGeometry(doorWidth, 1.2, 0.2),
      materials.ventLouver
    );
    louverAbove.position.set(xPos, 1.2 + doorHeight + 0.8, -B_DEPTH / 2 - 0.05);
    northLogisticsGroup.add(louverAbove);
  });

  const dockCanopy = new THREE.Mesh(
    new THREE.BoxGeometry(44, 0.4, 5.0),
    materials.canopyFascia
  );
  dockCanopy.position.set(0, 8.2, -B_DEPTH / 2 - 2.5);
  dockCanopy.castShadow = true;
  northLogisticsGroup.add(dockCanopy);

  buildingGroup.add(northLogisticsGroup);

  // 7. 屋面工程：结构层、女儿墙与屋顶设备基础平台
  const roofGroup = new THREE.Group();

  // 屋面板 (82m x 54m x 0.4m, 标高 +16.5m)
  const roofPlate = new THREE.Mesh(
    new THREE.BoxGeometry(B_WIDTH, 0.4, B_DEPTH),
    buildingRoofMat
  );
  roofPlate.position.set(0, B_HEIGHT - 0.2, 0);
  roofPlate.receiveShadow = true;
  roofGroup.add(roofPlate);

  // 四周女儿墙 (高 1.2m, 标高 16.5 ~ 17.7m)
  const parapetMat = buildingWallMat;

  const parapetN = new THREE.Mesh(new THREE.BoxGeometry(B_WIDTH, PARAPET_H, 0.35), parapetMat);
  parapetN.position.set(0, B_HEIGHT + PARAPET_H / 2, -B_DEPTH / 2 + 0.175);
  const parapetS = new THREE.Mesh(new THREE.BoxGeometry(B_WIDTH, PARAPET_H, 0.35), parapetMat);
  parapetS.position.set(0, B_HEIGHT + PARAPET_H / 2, B_DEPTH / 2 - 0.175);
  const parapetW = new THREE.Mesh(new THREE.BoxGeometry(0.35, PARAPET_H, B_DEPTH), parapetMat);
  parapetW.position.set(-B_WIDTH / 2 + 0.175, B_HEIGHT + PARAPET_H / 2, 0);
  const parapetE = new THREE.Mesh(new THREE.BoxGeometry(0.35, PARAPET_H, B_DEPTH), parapetMat);
  parapetE.position.set(B_WIDTH / 2 - 0.175, B_HEIGHT + PARAPET_H / 2, 0);

  roofGroup.add(parapetN, parapetS, parapetW, parapetE);

  // 屋面 8台 CRAH 室外换热器 / 干冷器组
  const coolerPositions = [
    [-26, -14], [-10, -14], [10, -14], [26, -14],
    [-26, 14], [-10, 14], [10, 14], [26, 14],
  ];

  coolerPositions.forEach(([cx, cz], idx) => {
    const coolerGroup = new THREE.Group();

    const baseMesh = new THREE.Mesh(
      new THREE.BoxGeometry(9.0, 0.35, 4.2),
      buildingConcreteMat
    );
    baseMesh.position.set(cx, B_HEIGHT + 0.175, cz);

    const bodyMesh = new THREE.Mesh(
      new THREE.BoxGeometry(8.4, 2.0, 3.6),
      materials.chillerBody
    );
    bodyMesh.position.set(cx, B_HEIGHT + 1.35, cz);
    bodyMesh.castShadow = true;

    for (let f = -3; f <= 3; f += 2) {
      const fan = new THREE.Mesh(
        new THREE.CylinderGeometry(0.8, 0.8, 0.25, 16),
        materials.galvanizedSteel
      );
      fan.position.set(cx + f, B_HEIGHT + 2.45, cz);
      coolerGroup.add(fan);
    }

    coolerGroup.add(baseMesh, bodyMesh);
    coolerGroup.userData = {
      id: `DEV-ROOF-COOLER-0${idx + 1}`,
      code: `COOLER-ROOF-0${idx + 1}`,
      name: `屋顶干式冷却塔 #${idx + 1}`,
      type: '冷凝自然冷却排热单元',
      system: '暖通冷却',
      location: `主机房屋面排热区 (${cx > 0 ? '东' : '西'}${cz > 0 ? '南' : '北'})`,
      specs: '变频轴流风机组 · 换热量 850kW · 乙二醇封闭回路',
      status: '正常',
      statusType: 'success',
      realtimeValue: '出水温度 28.5℃ · 风机转速 65%',
    };
    roofGroup.add(coolerGroup);
  });

  // 屋面防雷接闪基站中央高台
  const stationPlinth = new THREE.Mesh(
    new THREE.BoxGeometry(10, 0.4, 10),
    buildingConcreteMat
  );
  stationPlinth.position.set(18, B_HEIGHT + 0.2, 0);
  roofGroup.add(stationPlinth);

  buildingGroup.add(roofGroup);

  return buildingGroup;
}
