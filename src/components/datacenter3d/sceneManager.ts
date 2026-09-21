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

      // 1. Vertical translucent pulsing beam
      const colGeo = new THREE.CylinderGeometry(0.12, 0.4, 3.2, 16);
      const colMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0.45,
        depthWrite: false,
      });
      const colMesh = new THREE.Mesh(colGeo, colMat);
      colMesh.position.y = 1.6;
      colMesh.userData = { isAlarmBeacon: true, alarmId: alarm.id };
      group.add(colMesh);

      // 2. Base pulse ring
      const pulseGeo = new THREE.RingGeometry(0.8, 1.25, 24);
      const pulseMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
      pulseMesh.name = 'pulseRing';
      pulseMesh.rotation.x = -Math.PI / 2;
      pulseMesh.position.y = 0.08;
      pulseMesh.userData = { isAlarmBeacon: true, alarmId: alarm.id };
      group.add(pulseMesh);

      // 3. Central floating Diamond beacon
      const diamondGeo = new THREE.OctahedronGeometry(0.55, 0);
      const diamondMat = new THREE.MeshBasicMaterial({
        color: colorHex,
      });
      const diamondMesh = new THREE.Mesh(diamondGeo, diamondMat);
      diamondMesh.name = 'diamondMesh';
      diamondMesh.position.y = 3.2;
      diamondMesh.userData = { isAlarmBeacon: true, alarmId: alarm.id };
      group.add(diamondMesh);

      // 4. Sprite Billboard
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 110;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle =
          alarm.severity === 'orange'
            ? 'rgba(45, 20, 5, 0.90)'
            : alarm.severity === 'yellow'
            ? 'rgba(42, 32, 5, 0.90)'
            : 'rgba(8, 30, 60, 0.90)';
        ctx.strokeStyle =
          alarm.severity === 'orange'
            ? '#f59e0b'
            : alarm.severity === 'yellow'
            ? '#eab308'
            : '#00f0ff';
        ctx.lineWidth = 4;
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(6, 6, 388, 98, 16);
        } else {
          ctx.rect(6, 6, 388, 98);
        }
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px sans-serif';
        const sevText =
          alarm.severity === 'orange'
            ? '【二级高危】'
            : alarm.severity === 'yellow'
            ? '【三级关注】'
            : '【四级提示】';
        ctx.fillText(`${sevText} ${alarm.code}`, 18, 42);

        ctx.fillStyle =
          alarm.severity === 'orange'
            ? '#fcd34d'
            : alarm.severity === 'yellow'
            ? '#fef08a'
            : '#67e8f9';
        ctx.font = 'bold 22px monospace';
        ctx.fillText(alarm.value, 18, 80);
      }
      const texture = new THREE.CanvasTexture(canvas);
      const spriteMat = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: false,
      });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.name = 'alarmSprite';
      sprite.scale.set(10, 2.8, 1);
      sprite.position.y = 4.8;
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
          const alarmRes = this.focusByAlarmId(targetObj.userData.alarmId);
          if (this.callbacks.onClickAlarm) {
            this.callbacks.onClickAlarm(targetObj.userData.alarmId);
          }
          if (alarmRes.userData && this.callbacks.onClickObject) {
            this.callbacks.onClickObject(alarmRes.userData);
          }
          return;
        }

        if (targetObj.userData.name) {
          this.focusOnObject(targetObj);
          if (this.callbacks.onClickObject) {
            this.callbacks.onClickObject(targetObj.userData);
          }
        }
      }
    }
  }

  public focusOnObject(obj: THREE.Object3D) {
    this.activeFocusObject = obj;
    const worldPos = new THREE.Vector3();
    obj.getWorldPosition(worldPos);

    if (this.highlightRing) {
      this.highlightRing.position.set(worldPos.x, Math.max(worldPos.y + 0.05, 0.2), worldPos.z);
      this.highlightRing.visible = true;
    }

    // Smoothly pan camera target to object position
    const camOffset = this.camera.position.clone().sub(this.controls.target);
    const targetDistance = Math.max(camOffset.length(), 28);
    camOffset.normalize().multiplyScalar(targetDistance);

    this.flyTo(
      worldPos.clone().add(new THREE.Vector3(20, 16, 20)),
      worldPos,
      1200
    );
  }

  public focusByAlarmId(alarmId: string): { found: boolean; userData?: any } {
    if (alarmId === 'ground' || alarmId === 'DEV-GND-001' || alarmId === 'ground_res') {
      this.setLayerVisibility('underground', true);
      this.setLayerVisibility('grounding', true);
      this.setBuildingXRay(true);
      this.controls.maxPolarAngle = Math.PI * 0.72;
      this.setHighlightColor(0xf59e0b);
      this.flyTo(
        new THREE.Vector3(-18, 16, 56),
        new THREE.Vector3(-38, 0.2, 38),
        1200
      );
      if (this.highlightRing) {
        this.highlightRing.position.set(-38, 0.25, 38);
        this.highlightRing.visible = true;
      }
      return {
        found: true,
        userData: {
          id: 'ground_res',
          code: 'DEV-GND-001',
          name: '园区室外 -1F 人工地网基准测试井 (GW-01#)',
          type: '联合接地电网基准测试井',
          system: '接地网',
          location: '园区地下 -1F 人工地网基准测试井 (标高 -4.2m)',
          status: '预警',
          statusType: 'orange',
          realtimeValue: '0.88 Ω (设计限值 ≤ 0.80 Ω · 国标 ≤ 1.0 Ω)',
          threshold: '≤ 0.80 Ω',
          specs: '四极交流异频抗干扰注入法 · 紫铜热熔焊网格',
          desc: '地网接地阻抗持续微变超限，地网均压差扩大，遇直接雷或感应雷击时可能引发反击过电压。',
        },
      };
    } else if (alarmId === 'spd' || alarmId === 'DEV-SPD-004' || alarmId === 'spd_terminal') {
      this.setBuildingXRay(true);
      this.setLayerVisibility('interior', true);
      this.setLayerVisibility('spd', true);
      this.controls.maxPolarAngle = Math.PI / 2 - 0.02;
      this.setHighlightColor(0xeab308);
      this.flyTo(
        new THREE.Vector3(30, 15, 2),
        new THREE.Vector3(18, 7.2, -10),
        1200
      );
      if (this.highlightRing) {
        this.highlightRing.position.set(18, 5.8, -10);
        this.highlightRing.visible = true;
      }
      return {
        found: true,
        userData: {
          id: 'spd_terminal',
          code: 'DEV-SPD-004',
          name: '2F动力配电室低压母线二级SPD监测终端 (SPD-04#)',
          type: '电源配电二级浪涌监测',
          system: '浪涌保护SPD',
          location: '2F 数据机房动力配电室低压母线柜 A-02',
          status: '关注',
          statusType: 'warning',
          realtimeValue: '漏电流 0.28 mA · 动作累计 12次',
          threshold: '≤ 0.20 mA',
          specs: '冲击电流 Imax 80kA · 氧化锌高能压敏阀片 · CAN-Bus总线',
          desc: 'SPD内部氧化锌阀片进入早期微劣化阶段，漏电微安增加，建议红外巡视并在维保窗口更换。',
        },
      };
    } else if (alarmId === 'lightning' || alarmId === 'atmospheric' || alarmId === 'DEV-ENV-001') {
      this.setBuildingXRay(false);
      this.setLayerVisibility('lightning', true);
      this.setHighlightColor(0x06b6d4);
      this.flyTo(
        new THREE.Vector3(12, 28, 24),
        new THREE.Vector3(-8, 19, 0),
        1200
      );
      if (this.highlightRing) {
        this.highlightRing.position.set(-8, 17.8, 0);
        this.highlightRing.visible = true;
      }
      return {
        found: true,
        userData: {
          id: 'atmospheric',
          code: 'DEV-ENV-001',
          name: '天面大气电场动态监测探针 (AEFM-01)',
          type: '空间电场监测探针',
          system: '防雷接闪',
          location: '科研楼天面 12号主动接闪塔顶端 (标高 +48.5m)',
          status: '关注',
          statusType: 'info',
          realtimeValue: '38.6 kV/m (雷暴云前沿)',
          threshold: '≤ 25.0 kV/m',
          specs: '动态范围 ±50kV/m · 采样率 1000Hz · Modbus-TCP光纤环网',
          desc: '探测到上方对流层雷云强电荷集聚，大气电场迅速畸变，预计30分钟内有强对流雷闪可能。',
        },
      };
    } else if (alarmId === 'esd' || alarmId === 'DEV-ESD-008' || alarmId === 'esd_terminal' || alarmId === 'esd_channel') {
      this.setBuildingXRay(true);
      this.setLayerVisibility('interior', true);
      this.setHighlightColor(0x06b6d4);
      this.flyTo(
        new THREE.Vector3(6, 11, 14),
        new THREE.Vector3(0, 6.9, 0),
        1200
      );
      if (this.highlightRing) {
        this.highlightRing.position.set(0, 5.7, 0);
        this.highlightRing.visible = true;
      }
      return {
        found: true,
        userData: {
          id: 'esd_terminal',
          code: 'DEV-ESD-008',
          name: '微环境静电综合监测终端 (ESD-MON)',
          type: '机房防静电微环境',
          system: '防静电ESD',
          location: '2F 核心算力机房 A01-A16 列冷通道',
          status: '正常',
          statusType: 'success',
          realtimeValue: '0.72 MΩ (人员残存电压 < 25V)',
          threshold: '≤ 1.00 MΩ',
          specs: '防静电耗散地板 · 等电位铜排 · Zigbee无线网',
          desc: '核心服务器通道防静电接地阻抗稳定，在控无威胁。',
        },
      };
    }
    return { found: false };
  }

  public focusByEquipmentId(id: string): boolean {
    const alarmCheck = this.focusByAlarmId(id);
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
      this.focusOnObject(found);
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
      this.setBuildingXRay(false);
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

    // Animate 3D Spatial Alarm Beacons
    if (this.alarmMarkersGroup && this.alarmMarkersGroup.visible) {
      this.alarmMarkersGroup.children.forEach((group) => {
        const ring = group.getObjectByName('pulseRing');
        if (ring) {
          const ringScale = 1 + ((time * 0.0015) % 1) * 1.5;
          ring.scale.set(ringScale, ringScale, ringScale);
          const mat = (ring as THREE.Mesh).material as THREE.MeshBasicMaterial;
          if (mat) {
            mat.opacity = Math.max(0, 0.85 - ((time * 0.0015) % 1) * 0.85);
          }
        }
        const diamond = group.getObjectByName('diamondMesh');
        if (diamond) {
          diamond.rotation.y = time * 0.002;
          diamond.position.y = 3.2 + Math.sin(time * 0.004) * 0.25;
        }
        const sprite = group.getObjectByName('alarmSprite');
        if (sprite) {
          sprite.position.y = 4.8 + Math.sin(time * 0.003) * 0.15;
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
