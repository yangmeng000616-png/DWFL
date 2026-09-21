import * as THREE from 'three';
import { MaterialLibrary } from './materials';

export function buildSite(materials: MaterialLibrary): THREE.Group {
  const siteGroup = new THREE.Group();
  siteGroup.name = 'Layer_roads';

  // 1. 规整工业园区矩形地基底座 (230m x 170m)
  const campusBaseGeo = new THREE.BoxGeometry(232, 0.6, 172);
  const campusBase = new THREE.Mesh(campusBaseGeo, materials.concretePaving);
  campusBase.position.set(4, -0.3, 0);
  campusBase.receiveShadow = true;
  siteGroup.add(campusBase);

  // 2. 园区外围硬质边界压顶缘石 (Curbs)
  const curbMat = materials.architecturalConcrete;
  const curbNorth = new THREE.Mesh(new THREE.BoxGeometry(232, 0.4, 1.2), curbMat);
  curbNorth.position.set(4, 0.2, -85.5);
  const curbSouth = new THREE.Mesh(new THREE.BoxGeometry(232, 0.4, 1.2), curbMat);
  curbSouth.position.set(4, 0.2, 85.5);
  const curbWest = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.4, 172), curbMat);
  curbWest.position.set(-111.5, 0.2, 0);
  const curbEast = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.4, 172), curbMat);
  curbEast.position.set(119.5, 0.2, 0);
  siteGroup.add(curbNorth, curbSouth, curbWest, curbEast);

  // 3. 规整环形消防车道与设备运输重载路网 (8-10m 宽沥青面层)
  // 北侧重载物流通道 (Z: -42 to -54)
  const northRoad = new THREE.Mesh(new THREE.PlaneGeometry(210, 11), materials.roadAsphalt);
  northRoad.rotation.x = -Math.PI / 2;
  northRoad.position.set(4, 0.01, -48);
  northRoad.receiveShadow = true;

  // 南侧园区环道与门厅通道 (Z: +44 to +54)
  const southRoad = new THREE.Mesh(new THREE.PlaneGeometry(210, 10), materials.roadAsphalt);
  southRoad.rotation.x = -Math.PI / 2;
  southRoad.position.set(4, 0.01, 49);
  southRoad.receiveShadow = true;

  // 西侧冷却区外围环道 (X: -84 to -94)
  const westRoad = new THREE.Mesh(new THREE.PlaneGeometry(10, 107), materials.roadAsphalt);
  westRoad.rotation.x = -Math.PI / 2;
  westRoad.position.set(-89, 0.01, 0.5);
  westRoad.receiveShadow = true;

  // 东侧变电区外围环道 (X: +96 to +106)
  const eastRoad = new THREE.Mesh(new THREE.PlaneGeometry(10, 107), materials.roadAsphalt);
  eastRoad.rotation.x = -Math.PI / 2;
  eastRoad.position.set(101, 0.01, 0.5);
  eastRoad.receiveShadow = true;

  siteGroup.add(northRoad, southRoad, westRoad, eastRoad);

  // 4. 设备检修内部连接道路与回车场坪
  // 主机房东侧与变配电区域之间的 12m 专用检修通道 (X: +41 to +56)
  const powerAccessLane = new THREE.Mesh(new THREE.PlaneGeometry(15, 62), materials.roadAsphalt);
  powerAccessLane.rotation.x = -Math.PI / 2;
  powerAccessLane.position.set(48.5, 0.012, 1);
  powerAccessLane.receiveShadow = true;

  // 主机房西侧与冷却设备区之间的 11m 检修通道 (X: -41 to -52)
  const coolingAccessLane = new THREE.Mesh(new THREE.PlaneGeometry(11, 60), materials.roadAsphalt);
  coolingAccessLane.rotation.x = -Math.PI / 2;
  coolingAccessLane.position.set(-46.5, 0.012, 0);
  coolingAccessLane.receiveShadow = true;

  // 北侧货运装卸大平台硬化地坪 (Z: -27 to -43, X: -38 to +38)
  const logisticsApron = new THREE.Mesh(new THREE.PlaneGeometry(76, 16), materials.roadAsphalt);
  logisticsApron.rotation.x = -Math.PI / 2;
  logisticsApron.position.set(0, 0.012, -35);
  logisticsApron.receiveShadow = true;

  // 南侧主入口前厅硬质花岗岩/水泥铺装广场 (Z: +27 to +44, X: -28 to +28)
  const southPlaza = new THREE.Mesh(new THREE.PlaneGeometry(56, 17), materials.concretePaving);
  southPlaza.rotation.x = -Math.PI / 2;
  southPlaza.position.set(0, 0.015, 35.5);
  southPlaza.receiveShadow = true;

  siteGroup.add(powerAccessLane, coolingAccessLane, logisticsApron, southPlaza);

  // 5. 道路专业工程标线 (道路中心黄色虚线、道路两侧白色实线、斑马线、回车引导线)
  const lineGroup = new THREE.Group();

  // 南路白边缘线与黄虚线
  const southLineW1 = new THREE.Mesh(new THREE.PlaneGeometry(210, 0.15), materials.roadLineWhite);
  southLineW1.rotation.x = -Math.PI / 2;
  southLineW1.position.set(4, 0.02, 44.5);
  const southLineW2 = new THREE.Mesh(new THREE.PlaneGeometry(210, 0.15), materials.roadLineWhite);
  southLineW2.rotation.x = -Math.PI / 2;
  southLineW2.position.set(4, 0.02, 53.5);
  lineGroup.add(southLineW1, southLineW2);

  // 南北路中心黄虚线段 (每段 4m，间隔 3m)
  for (let x = -95; x <= 100; x += 7) {
    const dashSouth = new THREE.Mesh(new THREE.PlaneGeometry(4, 0.15), materials.roadLineYellow);
    dashSouth.rotation.x = -Math.PI / 2;
    dashSouth.position.set(x, 0.02, 49);
    lineGroup.add(dashSouth);

    const dashNorth = new THREE.Mesh(new THREE.PlaneGeometry(4, 0.15), materials.roadLineYellow);
    dashNorth.rotation.x = -Math.PI / 2;
    dashNorth.position.set(x, 0.02, -48);
    lineGroup.add(dashNorth);
  }

  // 东西路白边缘线
  const westLineW1 = new THREE.Mesh(new THREE.PlaneGeometry(0.15, 96), materials.roadLineWhite);
  westLineW1.rotation.x = -Math.PI / 2;
  westLineW1.position.set(-84.5, 0.02, 0.5);
  const westLineW2 = new THREE.Mesh(new THREE.PlaneGeometry(0.15, 96), materials.roadLineWhite);
  westLineW2.rotation.x = -Math.PI / 2;
  westLineW2.position.set(-93.5, 0.02, 0.5);

  const eastLineW1 = new THREE.Mesh(new THREE.PlaneGeometry(0.15, 96), materials.roadLineWhite);
  eastLineW1.rotation.x = -Math.PI / 2;
  eastLineW1.position.set(96.5, 0.02, 0.5);
  const eastLineW2 = new THREE.Mesh(new THREE.PlaneGeometry(0.15, 96), materials.roadLineWhite);
  eastLineW2.rotation.x = -Math.PI / 2;
  eastLineW2.position.set(105.5, 0.02, 0.5);
  lineGroup.add(westLineW1, westLineW2, eastLineW1, eastLineW2);

  // 南大门人行斑马线 (主入口正前方)
  for (let i = -5; i <= 5; i += 1.4) {
    const zebra = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 6), materials.roadLineWhite);
    zebra.rotation.x = -Math.PI / 2;
    zebra.position.set(i, 0.022, 49);
    lineGroup.add(zebra);
  }

  // 北侧装卸泊位引导虚线 (3 个货车倒车入库位)
  [-16, 0, 16].forEach((xPos) => {
    const bayLineL = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 14), materials.roadLineYellow);
    bayLineL.rotation.x = -Math.PI / 2;
    bayLineL.position.set(xPos - 3.8, 0.022, -36);
    const bayLineR = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 14), materials.roadLineYellow);
    bayLineR.rotation.x = -Math.PI / 2;
    bayLineR.position.set(xPos + 3.8, 0.022, -36);
    lineGroup.add(bayLineL, bayLineR);
  });

  siteGroup.add(lineGroup);

  return siteGroup;
}
