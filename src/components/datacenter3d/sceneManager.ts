import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createMaterials, MaterialLibrary } from './materials';
import { buildSite } from './builderSite';
import { buildMainBuilding } from './builderBuilding';
import { buildBuildingInterior } from './builderInterior';
import { buildPowerSubstation } from './builderPower';
import { buildCoolingPlant } from './builderCooling';
import { buildEmergencyPower } from './builderEmergency';
import { buildGroundingAndLightning } from './builderGroundingLightning';
import { LayerId, ViewPresetId, ViewPreset } from './types';

export const VIEW_PRESETS: ViewPreset[] = [
  {
    id: 'birds_eye',
    label: '鸟瞰全局',
    shortLabel: '鸟瞰',
    position: [115, 95, 125],
    target: [0, 8, 0],
    description: '全园区鸟瞰视角，呈现星云计算中心规整工业规划与各功能分区',
  },
  {
    id: 'xray_datacenter',
    label: '建筑透视 (机房与值班室)',
    shortLabel: '整楼透视',
    position: [56, 32, 68],
    target: [0, 6, 0],
    description: '外墙半透明透视，纵览1F运维值班大厅与2F核心高密服务器机房排',
    xrayFocus: true,
  },
  {
    id: 'interior_server_room',
    label: '2F 核心服务器机房',
    shortLabel: '2F机房',
    position: [-8, 9.2, 14],
    target: [-5, 7.2, 0],
    description: '深入2F数据机房核心冷通道，近距观测42U高密机柜、冷通道玻璃天幕与LED指示灯',
    xrayFocus: true,
  },
  {
    id: 'interior_duty_room',
    label: '1F 运维监控值班室',
    shortLabel: '1F值班室',
    position: [-16, 4.0, 10],
    target: [-16, 2.5, -14],
    description: '进入1F 7×24小时NOC调度监控大厅，检视微弧8K监控巨幕与值班指挥调度工位',
    xrayFocus: true,
  },
  {
    id: 'south_entrance',
    label: '南立面 (主入口)',
    shortLabel: '南门',
    position: [0, 16, 75],
    target: [0, 5, 27],
    description: '南侧主入口、悬挑雨棚、门厅玻璃幕墙及访客通道',
  },
  {
    id: 'north_logistics',
    label: '北立面 (货运物流)',
    shortLabel: '北立面',
    position: [0, 18, -75],
    target: [0, 5, -27],
    description: '北侧重载装卸平台、工业提升卷帘门及吊车防雨梁棚',
  },
  {
    id: 'east_power',
    label: '东立面 (变配电区)',
    shortLabel: '东立面',
    position: [108, 26, 0],
    target: [55, 6, 0],
    description: '东侧变配电附属用房、高压母线封闭桥架与室外变压器场',
  },
  {
    id: 'west_cooling',
    label: '西立面 (冷冻机房)',
    shortLabel: '西立面',
    position: [-108, 26, 0],
    target: [-55, 6, 0],
    description: '西侧冷冻水循环管廊、大温差离心水机与室外换热设备区',
  },
  {
    id: 'roof_lightning',
    label: '屋顶防雷接闪',
    shortLabel: '屋顶',
    position: [0, 42, 28],
    target: [0, 17, 0],
    description: '屋面女儿墙压顶接闪带、10m接闪网格、中央主动双流向避雷塔及干冷器',
  },
  {
    id: 'cooling_yard_detail',
    label: '冷水机组特写',
    shortLabel: '冷冻站',
    position: [-56, 12, 14],
    target: [-66, 3, 0],
    description: '4台变频离心冷水机组、水泵组、多色温控水管与检修步道',
  },
  {
    id: 'substation_detail',
    label: '110kV主变特写',
    shortLabel: '变电区',
    position: [60, 13, -6],
    target: [76, 4, -14],
    description: '110kV/10kV油浸式主变压器、防爆防火隔墙与卵石集油坑',
  },
  {
    id: 'generator_detail',
    label: '柴发动力特写',
    shortLabel: '柴发区',
    position: [56, 14, 46],
    target: [72, 4, 34],
    description: '4台2000kW重载高压柴油发电机组、出屋面排气消音立管与燃油围堰',
  },
  {
    id: 'underground_grid',
    label: '地下接地网透视',
    shortLabel: '地网',
    position: [65, 8, 65],
    target: [0, -3.5, 0],
    description: '透视穿透建筑与地面，展示地下-3.5m 10m×10m闭合铜质联合接地网',
    undergroundFocus: true,
  },
];

export interface AlarmBeaconConfig {
  id: string;
  code: string;
  title: string;
  value: string;
  severity: 'red' | 'orange' | 'yellow' | 'blue';
  position: [number, number, number];
  needsXRay?: boolean;
  needsUnderground?: boolean;
}

export interface SceneManagerCallbacks {
  onHoverObject?: (userData: any | null, mouseEvent: MouseEvent) => void;
  onClickObject?: (userData: any | null) => void;
  onClickAlarm?: (alarmId: string) => void;
}

export class DatacenterSceneManager {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private materials: MaterialLibrary;
  private animationFrameId: number | null = null;
  private callbacks: SceneManagerCallbacks;

  // Layer groups mapping
  private layers: Map<LayerId, THREE.Group> = new Map();

  // Highlight pulse ring
  private highlightRing: THREE.Mesh | null = null;
  private activeFocusObject: THREE.Object3D | null = null;

  // 3D Spatial Alarm Beacons Group
  private alarmMarkersGroup = new THREE.Group();

  // Lightning effect elements
  private lightningBolts: THREE.Line[] = [];
  private isLightningActive = false;

  // Camera animation
  private isCameraTransitioning = false;
  private cameraTween = {
    startPos: new THREE.Vector3(),
    endPos: new THREE.Vector3(),
    startTarget: new THREE.Vector3(),
    endTarget: new THREE.Vector3(),
    startTime: 0,
    duration: 1000,
  };

  // Raycasting
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private isDragging = false;
  private mouseDownTime = 0;

  // Auto patrol
  public isAutoRotate = false;
  private resizeObserver: ResizeObserver | null = null;

  constructor(container: HTMLElement, callbacks: SceneManagerCallbacks = {}) {
    this.container = container;
    this.callbacks = callbacks;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x06142a);
    this.scene.fog = new THREE.FogExp2(0x06142a, 0.0035);

    // 2. Camera
    const aspect = container.clientWidth / (container.clientHeight || 1);
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.5, 1000);
    this.camera.position.set(115, 95, 125);

    // 3. Renderer with PBR & Antialiasing
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.container.appendChild(this.renderer.domElement);

    // 4. Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.target.set(0, 8, 0);
    this.controls.minDistance = 8;
    this.controls.maxDistance = 280;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.04; // Keep above ground in standard view
    this.controls.minPolarAngle = 0.05;

    // 5. Materials
    this.materials = createMaterials();

    // 6. Lights
    this.setupLighting();

    // 7. Build Scene Layers
    this.buildScene();

    // 8. Setup Highlight Ring
    this.setupHighlightIndicator();

    // 9. Event Listeners
    this.bindEvents();

    // 10. Start Animation Loop
    this.animate = this.animate.bind(this);
    this.animationFrameId = requestAnimationFrame(this.animate);
  }

  private setupLighting() {
    // Ambient Soft Fill Light
    const ambientLight = new THREE.AmbientLight(0x7391b4, 0.95);
    this.scene.add(ambientLight);

    // Hemispheric Skylight
    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x0f172a, 0.6);
    this.scene.add(hemiLight);

    // Main Sun Directional Light with Shadows
    const dirLight = new THREE.DirectionalLight(0xfff8ea, 1.8);
    dirLight.position.set(90, 140, 70);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 400;
    const shadowDist = 120;
    dirLight.shadow.camera.left = -shadowDist;
    dirLight.shadow.camera.right = shadowDist;
    dirLight.shadow.camera.top = shadowDist;
    dirLight.shadow.camera.bottom = -shadowDist;
    dirLight.shadow.bias = -0.0003;
    this.scene.add(dirLight);

    // Secondary Cool Blue Fill Light (from North-West)
    const fillLight = new THREE.DirectionalLight(0x1e40af, 0.75);
    fillLight.position.set(-80, 60, -80);
    this.scene.add(fillLight);
  }

  private buildScene() {
    // 1. Site roads and pavement
    const site = buildSite(this.materials);
    this.layers.set('roads', site);
    this.scene.add(site);

    // 2. Main Datacenter 3-story Building (82m x 54m x 16.5m)
    const building = buildMainBuilding(this.materials);
    this.layers.set('building', building);
    this.scene.add(building);

    // 3. Main Datacenter Building Interior (1F Duty Room + 2F Server Room + 3F Storage)
    const interior = buildBuildingInterior(this.materials);
    this.layers.set('interior', interior);
    this.scene.add(interior);

    // 4. Power Substation & Cable Bridge
    const power = buildPowerSubstation(this.materials);
    this.layers.set('power', power);
    this.scene.add(power);

    // 4. West Cooling Plant
    const cooling = buildCoolingPlant(this.materials);
    this.layers.set('cooling', cooling);
    this.scene.add(cooling);

    // 5. Emergency Diesel Generator & Fuel Bund
    const emergency = buildEmergencyPower(this.materials);
    this.layers.set('emergency', emergency);
    this.scene.add(emergency);

    // 6. Grounding, Lightning & Sensors
    const gl = buildGroundingAndLightning(this.materials);
    this.layers.set('lightning', gl.lightningGroup);
    this.layers.set('grounding', gl.groundingGroup);
    this.layers.set('underground', gl.undergroundGroup);
    this.layers.set('spd', gl.spdGroup);
    this.layers.set('esd', gl.esdGroup);
    this.layers.set('sensors', gl.sensorsGroup);

    this.scene.add(gl.lightningGroup);
    this.scene.add(gl.groundingGroup);
    this.scene.add(gl.undergroundGroup);
    this.scene.add(gl.spdGroup);
    this.scene.add(gl.esdGroup);
    this.scene.add(gl.sensorsGroup);

    // 7. 3D Spatial Alarm Beacons Group
    this.alarmMarkersGroup.name = 'Layer_alarms';
    this.scene.add(this.alarmMarkersGroup);
    this.initDefaultAlarmBeacons();

    // 8. 默认开启建筑透视（X-Ray），直观显露室内高密机房与地下地网
    this.setBuildingXRay(true);
  }

  public setHighlightColor(colorHex: number) {
    if (this.highlightRing && this.highlightRing.material) {
      (this.highlightRing.material as THREE.MeshBasicMaterial).color.setHex(colorHex);
    }
  }

  public initDefaultAlarmBeacons() {
    this.setAlarmBeacons([
      {
        id: 'ground',
        code: 'DEV-GND-001',
        title: '地网阻抗超标',
        value: '阻抗 0.88 Ω (+10%)',
        severity: 'orange',
        position: [-38, 0.2, 38],
        needsUnderground: true,
        needsXRay: true,
      },
      {
        id: 'spd',
        code: 'DEV-SPD-004',
        title: '2F低压母线SPD漏电微变',
        value: '漏电流 0.28 mA',
        severity: 'yellow',
        position: [18, 6.8, -10],
        needsXRay: true,
      },
      {
        id: 'lightning',
        code: 'DEV-ENV-001',
        title: '天面12号接闪塔电场突变',
        value: '空间电场 38.6 kV/m',
        severity: 'blue',
        position: [-8, 18.2, 0],
      },
    ]);
  }

  public setAlarmBeacons(alarms: AlarmBeaconConfig[]) {
    // Clear previous alarm markers
    while (this.alarmMarkersGroup.children.length > 0) {
      const child = this.alarmMarkersGroup.children[0];
      this.alarmMarkersGroup.remove(child);
      child.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Sprite) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material?.dispose();
          }
        }
      });
    }

    alarms.forEach((alarm) => {
      const group = new THREE.Group();
      group.name = `AlarmBeacon_${alarm.id}`;
      group.position.set(...alarm.position);
      group.userData = {
        isAlarmBeacon: true,
        alarmId: alarm.id,
        code: alarm.code,
        title: alarm.title,
        value: alarm.value,
        baseY: alarm.position[1] + 2.8,
      };

      const colorHex =
        alarm.severity === 'red'
          ? 0xef4444
          : alarm.severity === 'orange'
          ? 0xf59e0b
          : alarm.severity === 'yellow'
          ? 0xeab308
          : 0x06b6d4;

      // 1. Dynamic Strobe Warning PointLight (rhythmically illuminates area on flash)
      const pointLight = new THREE.PointLight(colorHex, 2.5, 36, 1.8);
      pointLight.name = 'alarmPointLight';
      pointLight.position.y = 4.0;
      group.add(pointLight);

      // 2. Vertical translucent pulsing beam (tall, penetrates building in X-Ray)
      const colGeo = new THREE.CylinderGeometry(0.2, 0.65, 9.5, 16);
      const colMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0.6,
        depthWrite: false,
      });
      const colMesh = new THREE.Mesh(colGeo, colMat);
      colMesh.name = 'lightBeam';
      colMesh.position.y = 4.75;
      colMesh.userData = { isAlarmBeacon: true, alarmId: alarm.id };
      group.add(colMesh);

      // 3. Multi-tier expanding ripple rings on ground/floor
      const ringGeo = new THREE.RingGeometry(0.8, 1.5, 32);
      const ringMat1 = new THREE.MeshBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const pulseMesh1 = new THREE.Mesh(ringGeo, ringMat1);
      pulseMesh1.name = 'pulseRing1';
      pulseMesh1.rotation.x = -Math.PI / 2;
      pulseMesh1.position.y = 0.08;
      pulseMesh1.userData = { isAlarmBeacon: true, alarmId: alarm.id };
      group.add(pulseMesh1);

      const ringMat2 = new THREE.MeshBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const pulseMesh2 = new THREE.Mesh(ringGeo, ringMat2);
      pulseMesh2.name = 'pulseRing2';
      pulseMesh2.rotation.x = -Math.PI / 2;
      pulseMesh2.position.y = 0.12;
      pulseMesh2.userData = { isAlarmBeacon: true, alarmId: alarm.id };
      group.add(pulseMesh2);

      // 4. Central high-energy flashing core sphere
      const coreGeo = new THREE.SphereGeometry(0.75, 16, 16);
      const coreMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0.85,
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      coreMesh.name = 'flashCore';
      coreMesh.position.y = 4.2;
      coreMesh.userData = { isAlarmBeacon: true, alarmId: alarm.id };
      group.add(coreMesh);

      // 5. Surrounding rotating wireframe Diamond beacon
      const diamondGeo = new THREE.OctahedronGeometry(1.05, 0);
      const diamondMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.8,
      });
      const diamondMesh = new THREE.Mesh(diamondGeo, diamondMat);
      diamondMesh.name = 'diamondMesh';
      diamondMesh.position.y = 4.2;
      diamondMesh.userData = { isAlarmBeacon: true, alarmId: alarm.id };
      group.add(diamondMesh);

      // 6. Sprite Billboard (Compact & Minimal text)
      const canvas = document.createElement('canvas');
      canvas.width = 240;
      canvas.height = 70;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const strokeColor =
          alarm.severity === 'red'
            ? '#ef4444'
            : alarm.severity === 'orange'
            ? '#f59e0b'
            : alarm.severity === 'yellow'
            ? '#eab308'
            : '#00f0ff';

        ctx.fillStyle = 'rgba(6, 16, 36, 0.92)';
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(4, 4, 232, 62, 10);
        } else {
          ctx.rect(4, 4, 232, 62);
        }
        ctx.fill();
        ctx.stroke();

        // Warning Dot
        ctx.fillStyle = strokeColor;
        ctx.beginPath();
        ctx.arc(20, 24, 5.5, 0, Math.PI * 2);
        ctx.fill();

        // Code
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText(alarm.code, 32, 30);

        // Value text
        ctx.fillStyle = strokeColor;
        ctx.font = 'bold 19px monospace';
        ctx.fillText(alarm.value, 16, 55);
      }
      const texture = new THREE.CanvasTexture(canvas);
      const spriteMat = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: false,
      });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.name = 'alarmSprite';
      sprite.scale.set(7.5, 2.2, 1);
      sprite.position.y = 8.5;
      sprite.userData = { isAlarmBeacon: true, alarmId: alarm.id };
      group.add(sprite);

      this.alarmMarkersGroup.add(group);
    });
  }

  private setupHighlightIndicator() {
    // Pulsing cyan indicator ring when an equipment is focused
    const ringGeo = new THREE.RingGeometry(1.2, 1.5, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });
    this.highlightRing = new THREE.Mesh(ringGeo, ringMat);
    this.highlightRing.rotation.x = -Math.PI / 2;
    this.highlightRing.visible = false;
    this.scene.add(this.highlightRing);
  }

  private bindEvents() {
    const dom = this.renderer.domElement;

    dom.addEventListener('pointerdown', () => {
      this.isDragging = false;
      this.mouseDownTime = Date.now();
    });

    dom.addEventListener('pointermove', (e: MouseEvent) => {
      this.isDragging = true;
      const rect = dom.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // Handle hover raycasting
      this.checkHover(e);
    });

    dom.addEventListener('pointerup', (e: MouseEvent) => {
      const clickDuration = Date.now() - this.mouseDownTime;
      // If it's a short click and not a long drag
      if (clickDuration < 280) {
        this.handleClick(e);
      }
    });

    window.addEventListener('resize', this.onResize);

    if (window.ResizeObserver && this.container) {
      this.resizeObserver = new ResizeObserver(() => {
        this.onResize();
      });
      this.resizeObserver.observe(this.container);
    }
  }

  public resize() {
    this.onResize();
  }

  public onResize = () => {
    if (!this.container) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    if (width === 0 || height === 0) return;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  private checkHover(e: MouseEvent) {
    if (this.isCameraTransitioning) return;
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const interactiveObjects: THREE.Object3D[] = [];
    this.scene.traverse((obj) => {
      if (obj.userData && (obj.userData.name || obj.userData.isAlarmBeacon) && obj.visible) {
        interactiveObjects.push(obj);
      }
    });

    const intersects = this.raycaster.intersectObjects(interactiveObjects, true);

    if (intersects.length > 0) {
      let targetObj: THREE.Object3D | null = intersects[0].object;
      while (targetObj && (!targetObj.userData || (!targetObj.userData.name && !targetObj.userData.isAlarmBeacon))) {
        targetObj = targetObj.parent;
      }

      if (targetObj && targetObj.userData && (targetObj.userData.name || targetObj.userData.isAlarmBeacon)) {
        this.renderer.domElement.style.cursor = 'pointer';
        if (this.callbacks.onHoverObject) {
          this.callbacks.onHoverObject(targetObj.userData, e);
        }
        return;
      }
    }

    this.renderer.domElement.style.cursor = 'default';
    if (this.callbacks.onHoverObject) {
      this.callbacks.onHoverObject(null, e);
    }
  }

  private handleClick(e: MouseEvent) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const interactiveObjects: THREE.Object3D[] = [];
    this.scene.traverse((obj) => {
      if (obj.userData && (obj.userData.name || obj.userData.isAlarmBeacon) && obj.visible) {
        interactiveObjects.push(obj);
      }
    });

    const intersects = this.raycaster.intersectObjects(interactiveObjects, true);

    if (intersects.length > 0) {
      let targetObj: THREE.Object3D | null = intersects[0].object;
      while (targetObj && (!targetObj.userData || (!targetObj.userData.name && !targetObj.userData.isAlarmBeacon))) {
        targetObj = targetObj.parent;
      }

      if (targetObj && targetObj.userData) {
        if (targetObj.userData.isAlarmBeacon && targetObj.userData.alarmId) {
          const alarmRes = this.focusByAlarmId(targetObj.userData.alarmId, false);
          if (this.callbacks.onClickAlarm) {
            this.callbacks.onClickAlarm(targetObj.userData.alarmId);
          }
          if (alarmRes.userData && this.callbacks.onClickObject) {
            this.callbacks.onClickObject(alarmRes.userData);
          }
          return;
        }

        if (targetObj.userData.name) {
          this.focusOnObject(targetObj, false);
          if (this.callbacks.onClickObject) {
            this.callbacks.onClickObject(targetObj.userData);
          }
        }
      }
    }
  }

  public focusOnObject(obj: THREE.Object3D, shouldFly = false) {
    this.activeFocusObject = obj;
    const worldPos = new THREE.Vector3();
    obj.getWorldPosition(worldPos);

    if (this.highlightRing) {
      this.highlightRing.position.set(worldPos.x, Math.max(worldPos.y + 0.05, 0.2), worldPos.z);
      this.highlightRing.visible = true;
    }

    if (shouldFly) {
      // Smoothly pan camera target to object position only if explicitly requested
      const camOffset = this.camera.position.clone().sub(this.controls.target);
      const targetDistance = Math.max(camOffset.length(), 28);
      camOffset.normalize().multiplyScalar(targetDistance);

      this.flyTo(
        worldPos.clone().add(new THREE.Vector3(20, 16, 20)),
        worldPos,
        1200
      );
    }
  }

  public focusByAlarmId(alarmId: string, shouldFly = false): { found: boolean; userData?: any } {
    if (alarmId === 'ground' || alarmId === 'DEV-GND-001' || alarmId === 'ground_res') {
      this.setLayerVisibility('underground', true);
      this.setLayerVisibility('grounding', true);
      this.setBuildingXRay(true);
      this.setHighlightColor(0xf59e0b);
      if (shouldFly) {
        this.controls.maxPolarAngle = Math.PI * 0.72;
        this.flyTo(
          new THREE.Vector3(-18, 16, 56),
          new THREE.Vector3(-38, 0.2, 38),
          1200
        );
      }
      if (this.highlightRing) {
        this.highlightRing.position.set(-38, 0.25, 38);
        this.highlightRing.visible = true;
      }
      return {
        found: true,
        userData: {
          id: 'ground_res',
          code: 'DEV-GND-001',
          name: '人工地网测试井 (GW-01#)',
          type: '地网测试井',
          system: '接地网',
          location: '-1F 地下 (标高 -4.2m)',
          status: '预警',
          statusType: 'orange',
          realtimeValue: '0.88 Ω (限值 ≤ 0.80Ω)',
          threshold: '≤ 0.80 Ω',
          specs: '紫铜热熔焊网格',
          desc: '地网阻抗微变超限。',
        },
      };
    } else if (alarmId === 'spd' || alarmId === 'DEV-SPD-004' || alarmId === 'spd_terminal') {
      this.setBuildingXRay(true);
      this.setLayerVisibility('interior', true);
      this.setLayerVisibility('spd', true);
      this.setHighlightColor(0xeab308);
      if (shouldFly) {
        this.controls.maxPolarAngle = Math.PI / 2 - 0.02;
        this.flyTo(
          new THREE.Vector3(30, 15, 2),
          new THREE.Vector3(18, 7.2, -10),
          1200
        );
      }
      if (this.highlightRing) {
        this.highlightRing.position.set(18, 5.8, -10);
        this.highlightRing.visible = true;
      }
      return {
        found: true,
        userData: {
          id: 'spd_terminal',
          code: 'DEV-SPD-004',
          name: '母线二级SPD (SPD-04#)',
          type: '浪涌监测',
          system: '浪涌保护',
          location: '2F 配电室 A-02',
          status: '关注',
          statusType: 'warning',
          realtimeValue: '0.28 mA (限值 ≤ 0.20mA)',
          threshold: '≤ 0.20 mA',
          specs: 'Imax 80kA · 氧化锌阀片',
          desc: 'SPD漏电微增。',
        },
      };
    } else if (alarmId === 'lightning' || alarmId === 'atmospheric' || alarmId === 'DEV-ENV-001') {
      this.setLayerVisibility('lightning', true);
      this.setHighlightColor(0x06b6d4);
      if (shouldFly) {
        this.flyTo(
          new THREE.Vector3(12, 28, 24),
          new THREE.Vector3(-8, 19, 0),
          1200
        );
      }
      if (this.highlightRing) {
        this.highlightRing.position.set(-8, 17.8, 0);
        this.highlightRing.visible = true;
      }
      return {
        found: true,
        userData: {
          id: 'atmospheric',
          code: 'DEV-ENV-001',
          name: '大气电场探针 (AEFM-01)',
          type: '电场探针',
          system: '防雷接闪',
          location: '天面 12号接闪塔',
          status: '关注',
          statusType: 'info',
          realtimeValue: '38.6 kV/m (限值 ≤ 25kV/m)',
          threshold: '≤ 25.0 kV/m',
          specs: '量程 ±50kV/m',
          desc: '雷云电荷集聚。',
        },
      };
    } else if (alarmId === 'esd' || alarmId === 'DEV-ESD-008' || alarmId === 'esd_terminal' || alarmId === 'esd_channel') {
      this.setBuildingXRay(true);
      this.setLayerVisibility('interior', true);
      this.setHighlightColor(0x06b6d4);
      if (shouldFly) {
        this.flyTo(
          new THREE.Vector3(6, 11, 14),
          new THREE.Vector3(0, 6.9, 0),
          1200
        );
      }
      if (this.highlightRing) {
        this.highlightRing.position.set(0, 5.7, 0);
        this.highlightRing.visible = true;
      }
      return {
        found: true,
        userData: {
          id: 'esd_terminal',
          code: 'DEV-ESD-008',
          name: '静电终端 (ESD-MON)',
          type: '防静电监测',
          system: '防静电',
          location: '2F 核心机房通道',
          status: '正常',
          statusType: 'success',
          realtimeValue: '0.72 MΩ (限值 ≤ 1.0MΩ)',
          threshold: '≤ 1.00 MΩ',
          specs: '等电位铜排',
          desc: '防静电稳定在控。',
        },
      };
    }
    return { found: false };
  }

  public focusByEquipmentId(id: string, shouldFly = false): boolean {
    const alarmCheck = this.focusByAlarmId(id, shouldFly);
    if (alarmCheck.found) {
      if (alarmCheck.userData && this.callbacks.onClickObject) {
        this.callbacks.onClickObject(alarmCheck.userData);
      }
      return true;
    }

    let found: THREE.Object3D | null = null;
    this.scene.traverse((obj) => {
      if (
        obj.userData &&
        (obj.userData.id === id || obj.userData.code === id)
      ) {
        found = obj;
      }
    });

    if (found) {
      this.focusOnObject(found, shouldFly);
      if (this.callbacks.onClickObject) {
        this.callbacks.onClickObject((found as THREE.Object3D).userData);
      }
      return true;
    }
    return false;
  }

  public setViewPreset(presetId: ViewPresetId) {
    const preset = VIEW_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    if (preset.undergroundFocus) {
      // Relax polar angle to view underground
      this.controls.maxPolarAngle = Math.PI * 0.72;
      this.setLayerVisibility('underground', true);
      this.setBuildingXRay(true);
    } else if (preset.xrayFocus) {
      this.controls.maxPolarAngle = Math.PI / 2 - 0.02;
      this.setBuildingXRay(true);
      this.setLayerVisibility('interior', true);
    } else {
      this.controls.maxPolarAngle = Math.PI / 2 - 0.04;
      // In birds-eye overview, keep building X-Ray transparent so internal equipment and problem points are visible
      if (presetId === 'birds_eye') {
        this.setBuildingXRay(true);
      }
    }

    this.flyTo(
      new THREE.Vector3(...preset.position),
      new THREE.Vector3(...preset.target),
      1400
    );
  }

  public flyTo(
    targetPos: THREE.Vector3,
    targetLookAt: THREE.Vector3,
    duration = 1200
  ) {
    this.isCameraTransitioning = true;
    this.cameraTween.startPos.copy(this.camera.position);
    this.cameraTween.endPos.copy(targetPos);
    this.cameraTween.startTarget.copy(this.controls.target);
    this.cameraTween.endTarget.copy(targetLookAt);
    this.cameraTween.startTime = performance.now();
    this.cameraTween.duration = duration;
  }

  public setLayerVisibility(layerId: LayerId, visible: boolean) {
    const group = this.layers.get(layerId);
    if (group) {
      group.visible = visible;
    }
  }

  public setBuildingXRay(enable: boolean) {
    const buildingGroup = this.layers.get('building');
    if (!buildingGroup) return;

    // 1. 如果绑定了专属外围护材质实例，则精准调优透明度与深度剔除
    if (buildingGroup.userData && buildingGroup.userData.wallMaterials) {
      buildingGroup.userData.wallMaterials.forEach((mat: THREE.MeshStandardMaterial) => {
        mat.transparent = enable;
        mat.opacity = enable ? 0.12 : 1.0;
        mat.depthWrite = !enable;
        mat.needsUpdate = true;
      });
    }

    // 2. 遍历整个建筑组，将所有结构网格柔和透视
    buildingGroup.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => {
            m.transparent = enable;
            m.opacity = enable ? 0.15 : 1.0;
            m.depthWrite = !enable;
          });
        } else {
          child.material.transparent = enable;
          child.material.opacity = enable ? 0.15 : 1.0;
          child.material.depthWrite = !enable;
        }
      }
    });

    // 3. 透视模式下，确保机房室内层开启
    if (enable) {
      this.setLayerVisibility('interior', true);
    }
  }

  public triggerLightningStrike() {
    if (this.isLightningActive) return;
    this.isLightningActive = true;

    // Create jagged lightning bolt lines striking DEV-LGT-002 (X: 18, Y: 24, Z: 0)
    const points: THREE.Vector3[] = [];
    const strikeTarget = new THREE.Vector3(18, 23.8, 0);
    const cloudStart = new THREE.Vector3(24, 110, -10);

    let current = cloudStart.clone();
    points.push(current.clone());

    const steps = 18;
    for (let i = 1; i <= steps; i++) {
      const alpha = i / steps;
      const targetInterp = cloudStart.clone().lerp(strikeTarget, alpha);
      if (i < steps) {
        targetInterp.x += (Math.random() - 0.5) * 6;
        targetInterp.z += (Math.random() - 0.5) * 6;
      }
      points.push(targetInterp);
    }

    const boltGeo = new THREE.BufferGeometry().setFromPoints(points);
    const boltMat = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      linewidth: 3,
    });
    const boltLine = new THREE.Line(boltGeo, boltMat);
    this.scene.add(boltLine);
    this.lightningBolts.push(boltLine);

    // Pulse underground grid emissive
    this.materials.groundingCopperBus.emissive.setHex(0x00f0ff);
    this.materials.groundingCopperBus.emissiveIntensity = 1.2;

    setTimeout(() => {
      this.scene.remove(boltLine);
      boltGeo.dispose();
      boltMat.dispose();
      this.lightningBolts = [];
      this.materials.groundingCopperBus.emissive.setHex(0xea580c);
      this.materials.groundingCopperBus.emissiveIntensity = 0.35;
      this.isLightningActive = false;
    }, 1800);
  }

  private animate(time: number) {
    this.animationFrameId = requestAnimationFrame(this.animate);

    // Camera fly-to interpolation with smooth cubic easeInOut
    if (this.isCameraTransitioning) {
      const elapsed = time - this.cameraTween.startTime;
      const progress = Math.min(elapsed / this.cameraTween.duration, 1);
      // Cubic easeInOut
      const ease =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      this.camera.position.lerpVectors(
        this.cameraTween.startPos,
        this.cameraTween.endPos,
        ease
      );
      this.controls.target.lerpVectors(
        this.cameraTween.startTarget,
        this.cameraTween.endTarget,
        ease
      );

      if (progress >= 1) {
        this.isCameraTransitioning = false;
      }
    }

    // Auto rotate / cruise
    if (this.isAutoRotate && !this.isCameraTransitioning) {
      this.controls.autoRotate = true;
      this.controls.autoRotateSpeed = 0.8;
    } else {
      this.controls.autoRotate = false;
    }

    // Pulse active highlight ring
    if (this.highlightRing && this.highlightRing.visible) {
      const scale = 1 + Math.sin(time * 0.005) * 0.15;
      this.highlightRing.scale.set(scale, scale, scale);
    }

    // Animate 3D Spatial Alarm Beacons (Vivid Flashing & Blinking)
    if (this.alarmMarkersGroup && this.alarmMarkersGroup.visible) {
      this.alarmMarkersGroup.children.forEach((group) => {
        // High-visibility alarm strobe flash cadence (~1.6 Hz)
        const flashRaw = Math.sin(time * 0.0075);
        const flashAlpha = Math.max(0, flashRaw); // 0 to 1 sharp strobe pulse
        const smoothPulse = (flashRaw + 1) * 0.5; // 0 to 1 smooth oscillation

        // 1. Dynamic warning strobe PointLight (casts real light on surroundings)
        const pointLight = group.getObjectByName('alarmPointLight') as THREE.PointLight;
        if (pointLight) {
          pointLight.intensity = 0.4 + Math.pow(flashAlpha, 1.4) * 4.2;
        }

        // 2. High-energy flashing core sphere (pulsing size & brightness)
        const flashCore = group.getObjectByName('flashCore') as THREE.Mesh;
        if (flashCore) {
          const coreScale = 0.85 + flashAlpha * 0.55;
          flashCore.scale.set(coreScale, coreScale, coreScale);
          const mat = flashCore.material as THREE.MeshBasicMaterial;
          if (mat) {
            mat.opacity = 0.35 + flashAlpha * 0.65;
          }
        }

        // 3. Rotating Diamond beacon wireframe
        const diamond = group.getObjectByName('diamondMesh') as THREE.Mesh;
        if (diamond) {
          diamond.rotation.y = time * 0.003;
          diamond.rotation.x = time * 0.0015;
          const diamondScale = 1.0 + flashAlpha * 0.35;
          diamond.scale.set(diamondScale, diamondScale, diamondScale);
        }

        // 4. Vertical light beam pulse
        const beam = group.getObjectByName('lightBeam') as THREE.Mesh;
        if (beam) {
          const mat = beam.material as THREE.MeshBasicMaterial;
          if (mat) {
            mat.opacity = 0.2 + flashAlpha * 0.7;
          }
        }

        // 5. Multi-tier concentric ripple rings on floor/ground
        const ring1 = group.getObjectByName('pulseRing1') as THREE.Mesh;
        if (ring1) {
          const phase1 = ((time * 0.0016) % 1);
          const rScale1 = 1 + phase1 * 3.6;
          ring1.scale.set(rScale1, rScale1, rScale1);
          const mat1 = ring1.material as THREE.MeshBasicMaterial;
          if (mat1) {
            mat1.opacity = Math.max(0, (1 - phase1) * 0.95);
          }
        }

        const ring2 = group.getObjectByName('pulseRing2') as THREE.Mesh;
        if (ring2) {
          const phase2 = (((time * 0.0016) + 0.5) % 1);
          const rScale2 = 1 + phase2 * 3.6;
          ring2.scale.set(rScale2, rScale2, rScale2);
          const mat2 = ring2.material as THREE.MeshBasicMaterial;
          if (mat2) {
            mat2.opacity = Math.max(0, (1 - phase2) * 0.95);
          }
        }

        // 6. Billboard tag hover bobbing & subtle opacity pulse
        const sprite = group.getObjectByName('alarmSprite') as THREE.Sprite;
        if (sprite) {
          sprite.position.y = 10.2 + Math.sin(time * 0.003) * 0.25;
          const mat = sprite.material as THREE.SpriteMaterial;
          if (mat) {
            mat.opacity = 0.85 + smoothPulse * 0.15;
          }
        }
      });
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  public dispose() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    window.removeEventListener('resize', this.onResize);
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    this.controls.dispose();
    this.renderer.dispose();
    if (this.container && this.renderer.domElement && this.renderer.domElement.parentNode === this.container) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
