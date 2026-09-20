<template>
  <div class="tech-panel rounded-xl p-3 flex flex-col justify-between h-full relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
    <!-- Header with Icon, Title & Compact Toolbar -->
    <div class="flex items-center justify-between pb-2 border-b border-[#184682]/60 relative z-20 flex-nowrap gap-1 min-w-0">
      <div class="flex items-center gap-1.5 flex-shrink-0 min-w-0">
        <div class="w-5 h-5 rounded bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_6px_rgba(6,182,212,0.3)] flex-shrink-0">
          <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="3" />
            <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
          </svg>
        </div>
        <div class="flex items-center gap-1">
          <h3 class="text-xs sm:text-sm font-bold text-white tracking-wide whitespace-nowrap">雷电活动实时地图</h3>
          <span class="px-1 py-0.2 text-[9px] bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 rounded font-medium whitespace-nowrap">实时监测</span>
        </div>
      </div>

      <!-- Compact Map Tool Controls -->
      <div class="flex items-center gap-1 text-xs flex-nowrap flex-shrink-0">
        <!-- Boundary Highlight Toggle -->
        <button
          @click="toggleBoundaries"
          class="px-1.5 py-0.5 rounded text-[10.5px] border transition-all font-medium cursor-pointer flex items-center gap-1 whitespace-nowrap"
          :class="showBoundaries ? 'bg-gradient-to-r from-[#0d4f9b] to-[#0284c7] text-cyan-200 border-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.4)] font-semibold' : 'bg-[#0b2b63] text-slate-300 border-[#235dae]/70 hover:text-white'"
          title="显示或隐藏中国行政区划高亮边界"
        >
          <span class="w-1.5 h-1.5 rounded-full flex-shrink-0" :class="showBoundaries ? 'bg-cyan-300 shadow-[0_0_6px_#00f0ff] animate-pulse' : 'bg-slate-400'"></span>
          <span>{{ showBoundaries ? '边界高亮:开' : '边界高亮:关' }}</span>
        </button>

        <!-- Nationwide View Button -->
        <button
          @click="viewChinaExtent"
          class="px-1.5 py-0.5 rounded text-[10.5px] bg-[#0b2b63] hover:bg-[#133e88] text-slate-200 hover:text-cyan-200 border border-[#235dae]/70 transition-colors font-medium flex items-center gap-1 cursor-pointer whitespace-nowrap"
          title="切换至全国宏观行政区划与雷电全貌视角"
        >
          <svg class="w-3 h-3 text-cyan-300 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          <span>全国</span>
        </button>

        <!-- Warning radius toggle -->
        <button
          @click="toggleRings"
          class="px-1.5 py-0.5 rounded text-[10.5px] border transition-colors font-medium cursor-pointer whitespace-nowrap"
          :class="showRings ? 'bg-cyan-900/80 text-cyan-200 border-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.35)]' : 'bg-[#0b2b63] text-slate-300 border-[#235dae]/70 hover:text-white'"
          title="显示/隐藏防御警戒圈"
        >
          {{ showRings ? '预警圈:开' : '预警圈:关' }}
        </button>

        <!-- Relocate to Datacenter -->
        <button
          @click="recenterMap"
          class="px-1.5 py-0.5 rounded text-[10.5px] bg-[#0b2b63] hover:bg-[#133e88] text-slate-200 hover:text-cyan-200 border border-[#235dae]/70 transition-colors font-medium flex items-center gap-1 cursor-pointer whitespace-nowrap"
          title="快速定位至算力中心主节点"
        >
          <svg class="w-3 h-3 text-cyan-300 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <span>节点</span>
        </button>
      </div>
    </div>

    <!-- Map Stage Container with Leaflet -->
    <div class="relative flex-1 min-h-[190px] w-full rounded-lg overflow-hidden my-1 border border-[#20579e]/70 bg-[#092248]">
      <!-- Leaflet Map Mount Point -->
      <div ref="mapContainerRef" class="w-full h-full min-h-[190px] z-0"></div>

      <!-- Floating HUD: Top-Right Compact Horizontal Legend Bar (Slim, unobtrusive) -->
      <div class="absolute right-2 top-2 z-10 pointer-events-auto">
        <div class="bg-[#051838eb] border border-[#235dae]/80 rounded-lg px-2.5 py-1 backdrop-blur-md shadow-lg flex items-center gap-2 text-[11px]">
          <span class="text-slate-400 font-medium text-[10px]">强度:</span>
          <div class="flex items-center gap-1" title="强烈雷暴"><span class="w-2 h-2 rounded-full bg-[#ef4444] shadow-[0_0_5px_#ef4444]"></span><span class="text-slate-200 text-[10px]">强烈</span></div>
          <div class="flex items-center gap-1" title="较强雷暴"><span class="w-2 h-2 rounded-full bg-[#f97316] shadow-[0_0_5px_#f97316]"></span><span class="text-slate-200 text-[10px]">较强</span></div>
          <div class="flex items-center gap-1" title="中等雷暴"><span class="w-2 h-2 rounded-full bg-[#eab308] shadow-[0_0_5px_#eab308]"></span><span class="text-slate-200 text-[10px]">中等</span></div>
          <div class="flex items-center gap-1" title="较弱雷暴"><span class="w-2 h-2 rounded-full bg-[#00f0ff] shadow-[0_0_5px_#00f0ff]"></span><span class="text-slate-200 text-[10px]">较弱</span></div>

          <span class="w-px h-3 bg-[#1e4d8c]"></span>

          <div class="flex items-center gap-1" title="中国国界高亮轮廓"><span class="w-3.5 h-0.5 bg-[#00f0ff] shadow-[0_0_6px_#00f0ff] rounded"></span><span class="text-cyan-200 text-[10px]">国界</span></div>
          <div class="flex items-center gap-1" title="省级行政边界"><span class="w-3.5 h-0.5 border-t border-dashed border-[#38bdf8]"></span><span class="text-slate-300 text-[10px]">省界</span></div>
        </div>
      </div>

      <!-- Floating HUD: Bottom-Right Compact Coordinates & Status Pill -->
      <div class="absolute right-2 bottom-2 z-10 pointer-events-auto">
        <div class="bg-[#051838eb] border border-[#235dae]/80 rounded-lg px-2.5 py-1 backdrop-blur-md shadow-lg text-[11px] flex items-center gap-2">
          <div class="text-cyan-300 font-bold flex items-center gap-1">
            <svg class="w-3 h-3 text-cyan-300 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="8"/>
              <circle cx="12" cy="12" r="2.5" fill="currentColor"/>
            </svg>
            <span class="text-[10px]">主站:</span>
          </div>
          <div class="text-slate-200 font-mono text-[10px]">116.397°E, 39.908°N</div>
          <span class="w-px h-3 bg-[#1e4d8c]"></span>
          <div class="text-slate-200 text-[10px]">雷电概率: <span class="text-emerald-400 font-bold font-mono">5%</span></div>
        </div>
      </div>

      <!-- Floating HUD: Bottom-Left Compass & Zoom Controls -->
      <div class="absolute left-2 bottom-2 z-10 flex items-center gap-1.5 pointer-events-auto">
        <!-- N Compass -->
        <div class="w-6 h-6 rounded-full bg-[#051838eb] border border-cyan-400/60 flex items-center justify-center shadow-md">
          <span class="text-[10px] font-bold text-cyan-300 font-tech">N</span>
        </div>

        <!-- Custom Map Zoom buttons (allowing zooming out down to level 2) -->
        <div class="flex items-center bg-[#051838eb] border border-[#235dae]/80 rounded-md overflow-hidden shadow-md text-slate-200 text-xs">
          <button
            @click="zoomIn"
            title="放大视角"
            class="w-5 h-5 flex items-center justify-center hover:bg-[#144795] hover:text-cyan-200 transition-colors font-bold cursor-pointer"
          >
            +
          </button>
          <span class="w-px h-3 bg-slate-600"></span>
          <button
            @click="zoomOut"
            title="缩小视角 (支持多级缩小至全国及外围宏观视野)"
            class="w-5 h-5 flex items-center justify-center hover:bg-[#144795] hover:text-cyan-200 transition-colors font-bold cursor-pointer"
          >
            -
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const mapContainerRef = ref<HTMLElement | null>(null);
let map: L.Map | null = null;
let ringsLayerGroup: L.LayerGroup | null = null;
let strikesLayerGroup: L.LayerGroup | null = null;
let boundariesLayerGroup: L.LayerGroup | null = null;
let provincesGeoLayer: L.GeoJSON | null = null;
let resizeObserver: ResizeObserver | null = null;
let flashInterval: number | null = null;

const showRings = ref(true);
const showBoundaries = ref(true);

// Center coordinate for Datacenter (Beijing Compute Hub)
const CENTER_LAT = 39.908;
const CENTER_LNG = 116.397;

// Simulated active lightning strike clusters
const strikeClusters = [
  {
    lat: 39.25,
    lng: 116.95,
    radius: 18000,
    intensity: '强烈',
    current: '58.7 kA',
    time: '12:36:15',
    color: '#ef4444',
    fillColor: '#ef4444',
    fillOpacity: 0.65
  },
  {
    lat: 39.15,
    lng: 116.85,
    radius: 12000,
    intensity: '较强',
    current: '36.2 kA',
    time: '12:35:48',
    color: '#f97316',
    fillColor: '#f97316',
    fillOpacity: 0.55
  },
  {
    lat: 39.40,
    lng: 117.15,
    radius: 14000,
    intensity: '中等',
    current: '19.5 kA',
    time: '12:34:02',
    color: '#eab308',
    fillColor: '#eab308',
    fillOpacity: 0.45
  },
  {
    lat: 39.55,
    lng: 116.20,
    radius: 10000,
    intensity: '较弱',
    current: '8.4 kA',
    time: '12:32:19',
    color: '#00f0ff',
    fillColor: '#00f0ff',
    fillOpacity: 0.35
  }
];

function initMap() {
  if (!mapContainerRef.value || map) return;

  // Initialize Leaflet map with smaller zoom level (minZoom: 2) allowing deep zoom-out
  map = L.map(mapContainerRef.value, {
    center: [36.0, 104.5],
    zoom: 4,
    zoomControl: false,
    attributionControl: false,
    minZoom: 2, // Support zooming out to nationwide and East Asian overview
    maxZoom: 18
  });

  // Clean, high-definition Dark Map Tiles without watermark (CartoDB dark-matter)
  const tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    subdomains: 'abcd',
    maxZoom: 19,
    className: 'crisp-tech-tiles'
  });
  tileLayer.addTo(map);

  // 0. Layer Group for China Administrative Boundaries (National + Provincial Highlight)
  boundariesLayerGroup = L.layerGroup().addTo(map);
  loadChinaBoundaries();

  // 1. Layer Group for Guard / Warning concentric circles
  ringsLayerGroup = L.layerGroup().addTo(map);
  drawWarningRings();

  // 2. Layer Group for Lightning Strike Clusters
  strikesLayerGroup = L.layerGroup().addTo(map);
  drawStrikes();

  // 3. Datacenter Main Node Pulsing Marker
  drawDatacenterMarker();

  // Periodic subtle radar pulse simulation
  startLiveStrikePulse();

  // Handle auto-fit size & initial view fit
  nextTick(() => {
    if (map) {
      map.invalidateSize();
      // Auto fit China boundaries so the complete highlighted boundary is presented immediately
      map.fitBounds([
        [18.0, 73.4],
        [53.6, 135.1]
      ], { padding: [10, 10] });
    }
  });
}

async function loadChinaBoundaries() {
  if (!boundariesLayerGroup) return;

  try {
    // 1. Load China National Outer Boundary (Dual-layer High-intensity Cyber Neon Highlight)
    const countryRes = await fetch('/geo/china_country.json');
    if (countryRes.ok) {
      const countryGeo = await countryRes.json();

      // Layer A: Outer diffuse luminous cyan halo (blurred glow ring)
      const outerHalo = L.geoJSON(countryGeo, {
        style: {
          color: '#0284c7',
          weight: 5.5,
          opacity: 0.5,
          fill: false,
          className: 'china-national-glow-outer'
        }
      });

      // Layer B: Core sharp neon cyan boundary with subtle territory mask
      const coreBorder = L.geoJSON(countryGeo, {
        style: {
          color: '#00f0ff',
          weight: 2.6,
          opacity: 1.0,
          fillColor: '#00e5ff',
          fillOpacity: 0.04,
          className: 'china-national-boundary'
        }
      });

      boundariesLayerGroup.addLayer(outerHalo);
      boundariesLayerGroup.addLayer(coreBorder);
    }

    // 2. Load China Provincial Administrative Boundaries (High-tech interactive division lines)
    const provincesRes = await fetch('/geo/china_provinces.json');
    if (provincesRes.ok) {
      const provincesGeo = await provincesRes.json();

      provincesGeoLayer = L.geoJSON(provincesGeo, {
        style: () => ({
          color: '#258bf5',
          weight: 1.2,
          opacity: 0.85,
          dashArray: '4, 3',
          fillColor: '#0066ff',
          fillOpacity: 0.01,
          className: 'china-province-boundary'
        }),
        onEachFeature: (feature, layer) => {
          const name = feature.properties?.name || '未知省区';

          // Custom cyber tooltip on hover
          layer.bindTooltip(`
            <div class="font-sans py-0.5">
              <div class="text-cyan-300 font-bold text-xs flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00f0ff]"></span>
                ${name}
              </div>
              <div class="text-slate-300 text-[10px] mt-1 flex items-center gap-1">
                <span>防雷感知网:</span>
                <span class="text-emerald-400 font-medium">在线巡检</span>
              </div>
              <div class="text-slate-400 text-[10px]">
                实时雷暴活动: <span class="text-cyan-300 font-medium font-mono">低风险 (常规)</span>
              </div>
            </div>
          `, {
            sticky: true,
            className: 'custom-province-tooltip'
          });

          // Interactive Hover Highlights
          layer.on({
            mouseover: (e) => {
              const target = e.target as L.Path;
              target.setStyle({
                color: '#00f0ff',
                weight: 2.4,
                dashArray: '',
                fillColor: '#00e5ff',
                fillOpacity: 0.16
              });
              if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                target.bringToFront();
              }
            },
            mouseout: (e) => {
              if (provincesGeoLayer) {
                provincesGeoLayer.resetStyle(e.target);
              }
            },
            click: (e) => {
              if (map && feature.geometry) {
                const bounds = (e.target as L.Polygon).getBounds();
                map.fitBounds(bounds, { padding: [20, 20], maxZoom: 10, duration: 0.8 });
              }
            }
          });
        }
      });

      boundariesLayerGroup.addLayer(provincesGeoLayer);
    }
  } catch (err) {
    console.warn('Failed to load China administrative boundary GeoJSON:', err);
  }
}

function toggleBoundaries() {
  if (!map || !boundariesLayerGroup) return;
  showBoundaries.value = !showBoundaries.value;
  if (showBoundaries.value) {
    map.addLayer(boundariesLayerGroup);
  } else {
    map.removeLayer(boundariesLayerGroup);
  }
}

function viewChinaExtent() {
  if (map) {
    // Fits full extent of China with South China Sea islands
    map.flyToBounds([
      [18.0, 73.4],
      [53.6, 135.1]
    ], { padding: [15, 15], duration: 1.2 });
  }
}

function drawWarningRings() {
  if (!ringsLayerGroup) return;
  ringsLayerGroup.clearLayers();

  // 15km Inner Guard Zone
  const innerRing = L.circle([CENTER_LAT, CENTER_LNG], {
    radius: 15000,
    color: '#00f0ff',
    dashArray: '4, 6',
    weight: 1.5,
    fillColor: '#00f0ff',
    fillOpacity: 0.08
  }).bindTooltip('核心防护区 (15km)', {
    permanent: false,
    direction: 'top',
    className: 'custom-map-tooltip'
  });

  // 30km Early Warning Zone
  const midRing = L.circle([CENTER_LAT, CENTER_LNG], {
    radius: 30000,
    color: '#38bdf8',
    dashArray: '6, 8',
    weight: 1.2,
    fillColor: '#0284c7',
    fillOpacity: 0.04
  }).bindTooltip('二级预警圈 (30km)', {
    permanent: false,
    direction: 'top',
    className: 'custom-map-tooltip'
  });

  // 50km Monitoring Radar Zone
  const outerRing = L.circle([CENTER_LAT, CENTER_LNG], {
    radius: 50000,
    color: '#2563eb',
    dashArray: '8, 10',
    weight: 1.2,
    fill: false
  }).bindTooltip('雷电宏观监测圈 (50km)', {
    permanent: false,
    direction: 'top',
    className: 'custom-map-tooltip'
  });

  ringsLayerGroup.addLayer(innerRing);
  ringsLayerGroup.addLayer(midRing);
  ringsLayerGroup.addLayer(outerRing);
}

function drawStrikes() {
  if (!strikesLayerGroup) return;
  strikesLayerGroup.clearLayers();

  strikeClusters.forEach((cluster) => {
    // Outer halo
    const halo = L.circle([cluster.lat, cluster.lng], {
      radius: cluster.radius,
      color: cluster.color,
      weight: 1.5,
      fillColor: cluster.fillColor,
      fillOpacity: cluster.fillOpacity
    });

    // Inner bright core
    const core = L.circleMarker([cluster.lat, cluster.lng], {
      radius: 6,
      color: '#ffffff',
      weight: 2,
      fillColor: cluster.color,
      fillOpacity: 1
    });

    const popupHtml = `
      <div style="min-width: 140px; font-size: 11px; line-height: 1.5;">
        <div style="font-weight: bold; color: ${cluster.color}; border-bottom: 1px solid rgba(255,255,255,0.15); padding-bottom: 3px; margin-bottom: 4px;">
          雷暴云对流团 [${cluster.intensity}]
        </div>
        <div style="color: #cbd5e1;">峰值电流: <span style="font-family: monospace; font-weight: bold; color: #fff;">${cluster.current}</span></div>
        <div style="color: #cbd5e1;">记录时间: <span style="font-family: monospace; color: #94a3b8;">${cluster.time}</span></div>
        <div style="color: #cbd5e1;">云地放电: <span style="color: #38bdf8;">持续活跃</span></div>
      </div>
    `;

    halo.bindPopup(popupHtml);
    core.bindPopup(popupHtml);

    strikesLayerGroup!.addLayer(halo);
    strikesLayerGroup!.addLayer(core);
  });
}

function drawDatacenterMarker() {
  if (!map) return;

  const pulseIcon = L.divIcon({
    className: 'custom-datacenter-marker',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    html: `
      <div class="relative w-7 h-7 flex items-center justify-center">
        <div class="w-3.5 h-3.5 bg-cyan-400 rounded-full shadow-[0_0_12px_#00f0ff] z-10 border border-white"></div>
        <div class="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping"></div>
        <div class="absolute -inset-2 rounded-full border border-cyan-400/40 animate-pulse"></div>
        <div class="absolute left-7 top-0 whitespace-nowrap bg-[#04122bf0] border border-cyan-400 text-cyan-300 text-[10px] font-bold px-1.5 py-0.5 rounded shadow-[0_0_10px_rgba(0,240,255,0.4)]">
          当前节点
        </div>
      </div>
    `
  });

  const nodeMarker = L.marker([CENTER_LAT, CENTER_LNG], { icon: pulseIcon });

  const nodePopupHtml = `
    <div style="min-width: 160px; font-size: 11px; line-height: 1.5;">
      <div style="font-weight: bold; color: #38bdf8; border-bottom: 1px solid rgba(56,189,248,0.3); padding-bottom: 3px; margin-bottom: 5px;">
        算力中心防雷主站
      </div>
      <div style="color: #cbd5e1;">坐标: <span style="font-family: monospace; color: #f8fafc;">116.397°E, 39.908°N</span></div>
      <div style="color: #cbd5e1;">防护等级: <span style="color: #34d399; font-weight: bold;">特级 (A级机房)</span></div>
      <div style="color: #cbd5e1;">地面电场: <span style="font-family: monospace; color: #38bdf8;">12.4 kV/m (正常)</span></div>
      <div style="color: #cbd5e1;">地网电阻: <span style="font-family: monospace; color: #34d399;">0.52 Ω (优)</span></div>
    </div>
  `;

  nodeMarker.bindPopup(nodePopupHtml);
  nodeMarker.addTo(map);
}

function startLiveStrikePulse() {
  // Add an animated transient strike flash every 6 seconds
  flashInterval = window.setInterval(() => {
    if (!map || !strikesLayerGroup) return;

    // Random flash in the storm zone
    const flashLat = 39.2 + (Math.random() - 0.5) * 0.4;
    const flashLng = 116.8 + (Math.random() - 0.5) * 0.5;

    const flashMarker = L.circleMarker([flashLat, flashLng], {
      radius: 8,
      color: '#ffffff',
      weight: 2,
      fillColor: '#ef4444',
      fillOpacity: 1
    }).addTo(strikesLayerGroup);

    setTimeout(() => {
      if (strikesLayerGroup && strikesLayerGroup.hasLayer(flashMarker)) {
        strikesLayerGroup.removeLayer(flashMarker);
      }
    }, 1800);
  }, 6000);
}

function toggleRings() {
  if (!map || !ringsLayerGroup) return;
  showRings.value = !showRings.value;
  if (showRings.value) {
    map.addLayer(ringsLayerGroup);
  } else {
    map.removeLayer(ringsLayerGroup);
  }
}

function recenterMap() {
  if (map) {
    map.flyTo([CENTER_LAT, CENTER_LNG], 8, { duration: 1 });
  }
}

function zoomIn() {
  if (map) {
    map.zoomIn();
  }
}

function zoomOut() {
  if (map) {
    map.zoomOut();
  }
}

onMounted(() => {
  initMap();

  if (mapContainerRef.value) {
    resizeObserver = new ResizeObserver(() => {
      if (map) {
        map.invalidateSize();
      }
    });
    resizeObserver.observe(mapContainerRef.value);
  }
});

onBeforeUnmount(() => {
  if (flashInterval) {
    clearInterval(flashInterval);
    flashInterval = null;
  }
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
  if (map) {
    map.remove();
    map = null;
  }
});
</script>

<style>
/* Leaflet High-Definition Dark Theme Inversion Filter */
.leaflet-container {
  background-color: #082149 !important;
  outline: none;
}

/* High-tech luminous dark-blue cyber styling for dark tiles without watermark */
.crisp-tech-tiles {
  filter: brightness(115%) contrast(115%) hue-rotate(190deg) saturate(135%) !important;
}

/* Custom dark popup styling */
.leaflet-popup-content-wrapper {
  background: rgba(4, 18, 48, 0.95) !important;
  color: #e2e8f0 !important;
  border: 1px solid rgba(24, 76, 150, 0.7) !important;
  border-radius: 8px !important;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.7) !important;
  backdrop-filter: blur(8px);
  padding: 2px !important;
}

.leaflet-popup-content {
  margin: 8px 10px !important;
  line-height: 1.4 !important;
}

.leaflet-popup-tip {
  background: rgba(4, 18, 48, 0.95) !important;
  border: 1px solid rgba(24, 76, 150, 0.7) !important;
}

.leaflet-popup-close-button {
  color: #94a3b8 !important;
  padding: 4px 4px 0 0 !important;
}

.leaflet-popup-close-button:hover {
  color: #38bdf8 !important;
}

/* Tooltip dark styling */
.custom-map-tooltip {
  background: rgba(3, 15, 38, 0.9) !important;
  border: 1px solid rgba(56, 189, 248, 0.5) !important;
  color: #38bdf8 !important;
  font-size: 10px !important;
  padding: 2px 6px !important;
  border-radius: 4px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5) !important;
}

.custom-map-tooltip:before {
  border-top-color: rgba(3, 15, 38, 0.9) !important;
}

/* Fix marker div background reset */
.custom-datacenter-marker {
  background: transparent !important;
  border: none !important;
}

/* China National Boundary Glowing Cyber Highlight */
path.china-national-boundary {
  stroke: #00f0ff !important;
  stroke-width: 2.6px !important;
  stroke-linejoin: round !important;
  stroke-linecap: round !important;
  filter: drop-shadow(0 0 5px #00f0ff) drop-shadow(0 0 12px rgba(0, 240, 255, 0.75));
  pointer-events: stroke;
}

path.china-national-glow-outer {
  stroke: #0284c7 !important;
  stroke-width: 5.5px !important;
  stroke-opacity: 0.5 !important;
  stroke-linejoin: round !important;
  stroke-linecap: round !important;
  filter: blur(1.5px);
  pointer-events: none;
}

/* China Provincial Boundary (Interactive) */
path.china-province-boundary {
  stroke: #258bf5 !important;
  stroke-width: 1.2px !important;
  stroke-opacity: 0.85 !important;
  stroke-dasharray: 4, 3 !important;
  transition: all 0.2s ease-out;
  cursor: pointer;
}

path.china-province-boundary:hover {
  stroke: #00f0ff !important;
  stroke-width: 2.4px !important;
  stroke-opacity: 1 !important;
  stroke-dasharray: none !important;
  fill: rgba(0, 240, 255, 0.18) !important;
  filter: drop-shadow(0 0 8px rgba(0, 240, 255, 0.95));
}

/* Custom province tooltip styling */
.custom-province-tooltip {
  background: rgba(4, 20, 52, 0.95) !important;
  border: 1px solid rgba(0, 240, 255, 0.7) !important;
  color: #e2e8f0 !important;
  font-size: 11px !important;
  padding: 5px 9px !important;
  border-radius: 6px !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6), 0 0 10px rgba(0, 240, 255, 0.3) !important;
  backdrop-filter: blur(8px);
}

.custom-province-tooltip:before {
  border-top-color: rgba(4, 20, 52, 0.95) !important;
}
</style>
