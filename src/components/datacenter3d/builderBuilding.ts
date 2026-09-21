import * as THREE from 'three';
import { MaterialLibrary } from './materials';

export function buildMainBuilding(materials: MaterialLibrary): THREE.Group {
  const buildingGroup = new THREE.Group();
  buildingGroup.name = 'Layer_building';

  const B_WIDTH = 82; // X
  const B_DEPTH = 54; // Z
  const B_HEIGHT = 16.5; // 3 floors: 5.5m each
  const PARAPET_H = 1.2; // 女儿墙高 1.2m

  // 1. 建筑主体基础与首层清水混凝土裙座 (Y: 0 ~ 1.5m)
  const plinthGeo = new THREE.BoxGeometry(B_WIDTH + 0.8, 1.5, B_DEPTH + 0.8);
  const plinthMesh = new THREE.Mesh(plinthGeo, materials.architecturalConcrete);
  plinthMesh.position.set(0, 0.75, 0);
  plinthMesh.castShadow = true;
  plinthMesh.receiveShadow = true;
  buildingGroup.add(plinthMesh);

  // 2. 主体外墙结构块体 (Y: 1.5 ~ 16.5m)
  // 采用浅灰色金属幕墙作为主体底色
  const mainBodyGeo = new THREE.BoxGeometry(B_WIDTH, B_HEIGHT - 1.5, B_DEPTH);
  const mainBodyMesh = new THREE.Mesh(mainBodyGeo, materials.curtainWallLight);
  mainBodyMesh.position.set(0, 1.5 + (B_HEIGHT - 1.5) / 2, 0);
  mainBodyMesh.castShadow = true;
  mainBodyMesh.receiveShadow = true;
  mainBodyMesh.userData = {
    id: 'BUILDING-MAIN',
    name: '星云计算中心 3层主机房大楼',
    type: '大型数据中心主体建筑',
    system: '建筑设施',
    location: '园区核心区 (82m×54m)',
    specs: '地上3层 · 建筑高度 17.7m · 耐火等级一级 · 抗震烈度8度',
  };
  buildingGroup.add(mainBodyMesh);

  // 3. 立面深灰色金属夹芯板装饰分格带与层间金属嵌条 (RAL 7016)
  // 为真实工业数据中心立面提供规整、高级的模数感
  const floorBands = new THREE.Group();

  // 1F-2F 层间嵌条 (Y = 5.5)
  const band1FGeo = new THREE.BoxGeometry(B_WIDTH + 0.2, 0.4, B_DEPTH + 0.2);
  const band1F = new THREE.Mesh(band1FGeo, materials.sandwichWallDark);
  band1F.position.set(0, 5.5, 0);
  floorBands.add(band1F);

  // 2F-3F 层间嵌条 (Y = 11.0)
  const band2F = new THREE.Mesh(band1FGeo, materials.sandwichWallDark);
  band2F.position.set(0, 11.0, 0);
  floorBands.add(band2F);

  // 南北外立面深灰金属夹芯板立面模块拼缝 (厚度 0.12m 突出幕墙面)
  const accentPanelGeo = new THREE.BoxGeometry(14, 13.5, 0.25);
  // 南立面左右两侧深色夹芯对比段
  const southAccentL = new THREE.Mesh(accentPanelGeo, materials.sandwichWallDark);
  southAccentL.position.set(-28, 8.5, B_DEPTH / 2 + 0.05);
  const southAccentR = new THREE.Mesh(accentPanelGeo, materials.sandwichWallDark);
  southAccentR.position.set(28, 8.5, B_DEPTH / 2 + 0.05);

  // 北立面对应段
  const northAccentL = new THREE.Mesh(accentPanelGeo, materials.sandwichWallDark);
  northAccentL.position.set(-28, 8.5, -B_DEPTH / 2 - 0.05);
  const northAccentR = new THREE.Mesh(accentPanelGeo, materials.sandwichWallDark);
  northAccentR.position.set(28, 8.5, -B_DEPTH / 2 - 0.05);

  floorBands.add(southAccentL, southAccentR, northAccentL, northAccentR);

  // 东西两侧外墙深灰纵向竖条饰带
  const eastAccentGeo = new THREE.BoxGeometry(0.25, 13.5, 12);
  const eastAccent1 = new THREE.Mesh(eastAccentGeo, materials.sandwichWallDark);
  eastAccent1.position.set(B_WIDTH / 2 + 0.05, 8.5, -12);
  const eastAccent2 = new THREE.Mesh(eastAccentGeo, materials.sandwichWallDark);
  eastAccent2.position.set(B_WIDTH / 2 + 0.05, 8.5, 12);

  const westAccent1 = new THREE.Mesh(eastAccentGeo, materials.sandwichWallDark);
  westAccent1.position.set(-B_WIDTH / 2 - 0.05, 8.5, -12);
  const westAccent2 = new THREE.Mesh(eastAccentGeo, materials.sandwichWallDark);
  westAccent2.position.set(-B_WIDTH / 2 - 0.05, 8.5, 12);

  floorBands.add(eastAccent1, eastAccent2, westAccent1, westAccent2);
  buildingGroup.add(floorBands);

  // 4. 高位窄窗 (Data Center High-Level Clerestory Ribbon Windows)
  // 数据机房核心区为避光保温，仅在辅助走道、运维区开设规整防爆双银低辐射高位窄窗
  const windowGroup = new THREE.Group();

  // 南立面 2F & 3F 高位带状窄窗
  [-12, 12].forEach((xOffset) => {
    [7.8, 13.3].forEach((yFloor) => {
      const winGeo = new THREE.BoxGeometry(10, 1.1, 0.2);
      const winMesh = new THREE.Mesh(winGeo, materials.glassTinted);
      winMesh.position.set(xOffset, yFloor, B_DEPTH / 2 + 0.1);
      windowGroup.add(winMesh);
    });
  });

  // 北立面运维走道采光窗
  [-12, 12].forEach((xOffset) => {
    [7.8, 13.3].forEach((yFloor) => {
      const winGeo = new THREE.BoxGeometry(10, 1.1, 0.2);
      const winMesh = new THREE.Mesh(winGeo, materials.glassTinted);
      winMesh.position.set(xOffset, yFloor, -B_DEPTH / 2 - 0.1);
      windowGroup.add(winMesh);
    });
  });

  // 5. 外墙通风/消音百叶 (数据机房电池间与动力新风进排风百叶)
  [-30, 30].forEach((xPos) => {
    const louverGeo = new THREE.BoxGeometry(6, 2.2, 0.22);
    const louverMeshS = new THREE.Mesh(louverGeo, materials.ventLouver);
    louverMeshS.position.set(xPos, 3.5, B_DEPTH / 2 + 0.1);
    const louverMeshN = new THREE.Mesh(louverGeo, materials.ventLouver);
    louverMeshN.position.set(xPos, 3.5, -B_DEPTH / 2 - 0.1);
    windowGroup.add(louverMeshS, louverMeshN);
  });

  // 西立面对应管道穿越处的进气百叶
  const westLouver = new THREE.Mesh(new THREE.BoxGeometry(0.22, 2.5, 8), materials.ventLouver);
  westLouver.position.set(-B_WIDTH / 2 - 0.1, 3.8, 0);
  windowGroup.add(westLouver);

  buildingGroup.add(windowGroup);

  // 6. 南立面主入口、门厅雨棚与访客通道 (Z = +27m)
  const southEntranceGroup = new THREE.Group();

  // 主入口悬挑大雨棚 (18m 宽 x 6m 挑深 x 0.6m 厚，标高 +4.8m)
  const canopyPlate = new THREE.Mesh(
    new THREE.BoxGeometry(18, 0.6, 6.2),
    materials.canopyFascia
  );
  canopyPlate.position.set(0, 4.8, B_DEPTH / 2 + 3.1);
  canopyPlate.castShadow = true;
  southEntranceGroup.add(canopyPlate);

  // 雨棚立面金属发光招牌字板："星云计算中心 STAR CLOUD DATA CENTER"
  const signBoard = new THREE.Mesh(
    new THREE.BoxGeometry(16, 0.45, 0.08),
    materials.canopyFascia
  );
  signBoard.position.set(0, 4.8, B_DEPTH / 2 + 6.25);
  southEntranceGroup.add(signBoard);

  // 门厅落地结构玻璃幕墙 (14m 宽 x 4.2m 高)
  const lobbyGlass = new THREE.Mesh(
    new THREE.BoxGeometry(14, 4.2, 0.2),
    materials.glassTinted
  );
  lobbyGlass.position.set(0, 2.4, B_DEPTH / 2 + 0.12);
  southEntranceGroup.add(lobbyGlass);

  // 门厅深色自动平移防火玻璃门 (3.2m 宽 x 2.6m 高)
  const mainDoor = new THREE.Mesh(
    new THREE.BoxGeometry(3.6, 2.6, 0.25),
    materials.sandwichWallDark
  );
  mainDoor.position.set(0, 1.6, B_DEPTH / 2 + 0.2);
  southEntranceGroup.add(mainDoor);

  // 入口门廊两侧大理石方柱
  [-7.5, 7.5].forEach((xPos) => {
    const col = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 4.5, 0.8),
      materials.architecturalConcrete
    );
    col.position.set(xPos, 2.55, B_DEPTH / 2 + 5.5);
    col.castShadow = true;
    southEntranceGroup.add(col);
  });

  buildingGroup.add(southEntranceGroup);

  // 7. 北立面设备运输入口、货运通道与后勤检修 (Z = -27m)
  const northLogisticsGroup = new THREE.Group();

  // 高出室外地坪 1.2m 的专用装卸货台 (42m 宽 x 4m 进深 x 1.2m 高)
  const dockPlatform = new THREE.Mesh(
    new THREE.BoxGeometry(42, 1.2, 4.2),
    materials.architecturalConcrete
  );
  dockPlatform.position.set(0, 0.6, -B_DEPTH / 2 - 2.1);
  dockPlatform.receiveShadow = true;
  northLogisticsGroup.add(dockPlatform);

  // 装卸月台防撞橡胶缓冲块 (Dock Bumpers)
  for (let x = -19; x <= 19; x += 3.5) {
    const bumper = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.8, 0.25),
      materials.sandwichWallDark
    );
    bumper.position.set(x, 0.8, -B_DEPTH / 2 - 4.3);
    northLogisticsGroup.add(bumper);
  }

  // 3 樘重载工业卷帘货运门 (每樘 4.8m 宽 x 4.5m 高)
  [-13, 0, 13].forEach((xPos) => {
    const freightDoor = new THREE.Mesh(
      new THREE.BoxGeometry(4.8, 4.5, 0.25),
      materials.sandwichWallDark
    );
    freightDoor.position.set(xPos, 3.55, -B_DEPTH / 2 - 0.1);
    northLogisticsGroup.add(freightDoor);
  });

  // 装卸区上方悬挑钢构防雨吊车梁棚 (44m 宽 x 5m 挑深 x 0.45m 厚，标高 +6.8m)
  const dockCanopy = new THREE.Mesh(
    new THREE.BoxGeometry(44, 0.45, 5),
    materials.galvanizedSteel
  );
  dockCanopy.position.set(0, 6.8, -B_DEPTH / 2 - 2.5);
  dockCanopy.castShadow = true;
  northLogisticsGroup.add(dockCanopy);

  // 后勤检修人员防火逃生门 (北立面两侧)
  [-28, 28].forEach((xPos) => {
    const egressDoor = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 2.4, 0.15),
      materials.sandwichWallDark
    );
    egressDoor.position.set(xPos, 2.5, -B_DEPTH / 2 - 0.08);
    northLogisticsGroup.add(egressDoor);
  });

  buildingGroup.add(northLogisticsGroup);

  // 8. 建筑屋面女儿墙 (Parapet Walls) 与金属收口压顶
  const roofGroup = new THREE.Group();

  // 屋面底板 (Y = 16.5m)
  const roofSlab = new THREE.Mesh(
    new THREE.BoxGeometry(B_WIDTH - 0.8, 0.3, B_DEPTH - 0.8),
    materials.roofDeck
  );
  roofSlab.position.set(0, B_HEIGHT - 0.15, 0);
  roofSlab.receiveShadow = true;
  roofGroup.add(roofSlab);

  // 四周 1.2m 高女儿墙 (Y: 16.5m ~ 17.7m)
  const parapetMat = materials.curtainWallLight;
  const parapetCapMat = materials.galvanizedSteel;

  // 北侧女儿墙与压顶
  const paraNorth = new THREE.Mesh(new THREE.BoxGeometry(B_WIDTH, PARAPET_H, 0.4), parapetMat);
  paraNorth.position.set(0, B_HEIGHT + PARAPET_H / 2, -B_DEPTH / 2 + 0.2);
  const capNorth = new THREE.Mesh(new THREE.BoxGeometry(B_WIDTH + 0.3, 0.12, 0.55), parapetCapMat);
  capNorth.position.set(0, B_HEIGHT + PARAPET_H + 0.06, -B_DEPTH / 2 + 0.2);

  // 南侧女儿墙与压顶
  const paraSouth = new THREE.Mesh(new THREE.BoxGeometry(B_WIDTH, PARAPET_H, 0.4), parapetMat);
  paraSouth.position.set(0, B_HEIGHT + PARAPET_H / 2, B_DEPTH / 2 - 0.2);
  const capSouth = new THREE.Mesh(new THREE.BoxGeometry(B_WIDTH + 0.3, 0.12, 0.55), parapetCapMat);
  capSouth.position.set(0, B_HEIGHT + PARAPET_H + 0.06, B_DEPTH / 2 - 0.2);

  // 西侧女儿墙与压顶
  const paraWest = new THREE.Mesh(new THREE.BoxGeometry(0.4, PARAPET_H, B_DEPTH), parapetMat);
  paraWest.position.set(-B_WIDTH / 2 + 0.2, B_HEIGHT + PARAPET_H / 2, 0);
  const capWest = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.12, B_DEPTH + 0.3), parapetCapMat);
  capWest.position.set(-B_WIDTH / 2 + 0.2, B_HEIGHT + PARAPET_H + 0.06, 0);

  // 东侧女儿墙与压顶
  const paraEast = new THREE.Mesh(new THREE.BoxGeometry(0.4, PARAPET_H, B_DEPTH), parapetMat);
  paraEast.position.set(B_WIDTH / 2 - 0.2, B_HEIGHT + PARAPET_H / 2, 0);
  const capEast = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.12, B_DEPTH + 0.3), parapetCapMat);
  capEast.position.set(B_WIDTH / 2 - 0.2, B_HEIGHT + PARAPET_H + 0.06, 0);

  roofGroup.add(paraNorth, capNorth, paraSouth, capSouth, paraWest, capWest, paraEast, capEast);

  // 9. 屋面构筑物：屋顶楼梯间/电梯机房与精密空调送排风小室
  const penthouseGeo = new THREE.BoxGeometry(10, 3.2, 8);
  const penthouse = new THREE.Mesh(penthouseGeo, materials.curtainWallLight);
  penthouse.position.set(-18, B_HEIGHT + 1.6, -10);
  penthouse.castShadow = true;
  roofGroup.add(penthouse);

  const penthouseCap = new THREE.Mesh(
    new THREE.BoxGeometry(10.4, 0.2, 8.4),
    materials.galvanizedSteel
  );
  penthouseCap.position.set(-18, B_HEIGHT + 3.3, -10);
  roofGroup.add(penthouseCap);

  // 10. 屋顶空调及冷却设备基座群与热工散热干冷器机组 (8 台 CRAH 冷却模块)
  const roofEquipGroup = new THREE.Group();

  const coolerXPositions = [-26, -10, 8, 24];
  const coolerZPositions = [-12, 12];

  coolerXPositions.forEach((x, cIdx) => {
    coolerZPositions.forEach((z, rIdx) => {
      // 混凝土减振基础 (Plinth)
      const plinth = new THREE.Mesh(
        new THREE.BoxGeometry(9.2, 0.6, 5.2),
        materials.architecturalConcrete
      );
      plinth.position.set(x, B_HEIGHT + 0.3, z);
      roofEquipGroup.add(plinth);

      // 干冷器机组外壳 (Dry Cooler Unit)
      const coolerBox = new THREE.Mesh(
        new THREE.BoxGeometry(8.8, 1.8, 4.8),
        materials.chillerBody
      );
      coolerBox.position.set(x, B_HEIGHT + 1.5, z);
      coolerBox.castShadow = true;
      coolerBox.userData = {
        id: `ROOF-DRYCOOLER-0${cIdx * 2 + rIdx + 1}`,
        name: `屋顶高密热交换干式冷却器 #${cIdx * 2 + rIdx + 1}`,
        type: '屋顶散热设备',
        system: '暖通冷却',
        location: `屋面设备区 (X:${x.toFixed(0)}, Z:${z.toFixed(0)})`,
        specs: '散热能力 350kW/台 · 变频EC轴流风机群 · 进出水温 37/32℃',
        status: '正常',
        statusType: 'success',
        realtimeValue: '运转率 94% · 进水 34.2℃',
      };
      roofEquipGroup.add(coolerBox);

      // 顶部轴流风机排风口圆形风筒 (4 个风机/台)
      [-2.4, 2.4].forEach((fx) => {
        [-1.2, 1.2].forEach((fz) => {
          const fanGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.4, 16);
          const fanMesh = new THREE.Mesh(fanGeo, materials.galvanizedSteel);
          fanMesh.position.set(x + fx, B_HEIGHT + 2.6, z + fz);
          roofEquipGroup.add(fanMesh);
        });
      });
    });
  });

  // 11. 屋面金属检修步道通道与安全护栏 (连接各台干冷器与楼梯间出入口)
  const catwalkGroup = new THREE.Group();

  // 纵横向镀锌钢格板主步道 (宽 1.2m)
  const catwalkMat = materials.galvanizedSteel;
  const yellowRailMat = materials.safetyYellow;

  // 东西向主干步道 (跨越 65m)
  const mainWalkway = new THREE.Mesh(
    new THREE.BoxGeometry(68, 0.15, 1.4),
    catwalkMat
  );
  mainWalkway.position.set(0, B_HEIGHT + 0.15, 0);
  catwalkGroup.add(mainWalkway);

  // 两侧黄色安全护栏
  const railNorth = new THREE.Mesh(new THREE.BoxGeometry(68, 0.9, 0.08), yellowRailMat);
  railNorth.position.set(0, B_HEIGHT + 0.6, -0.65);
  const railSouth = new THREE.Mesh(new THREE.BoxGeometry(68, 0.9, 0.08), yellowRailMat);
  railSouth.position.set(0, B_HEIGHT + 0.6, 0.65);
  catwalkGroup.add(railNorth, railSouth);

  // 南北向通达每排干冷器的分支步道
  coolerXPositions.forEach((x) => {
    const branchWalk = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 0.15, 26),
      catwalkMat
    );
    branchWalk.position.set(x, B_HEIGHT + 0.15, 0);
    catwalkGroup.add(branchWalk);
  });

  roofGroup.add(roofEquipGroup);
  roofGroup.add(catwalkGroup);
  buildingGroup.add(roofGroup);

  return buildingGroup;
}
