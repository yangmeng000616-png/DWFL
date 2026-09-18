<template>
  <div class="tech-panel rounded-xl p-3.5 flex flex-col justify-between h-full relative overflow-hidden group shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
    <!-- Card Top Header with Mode & Controls -->
    <div class="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#184682]/60 relative z-20">
      <div class="flex items-center gap-2">
        <div class="w-6 h-6 rounded-md bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_6px_rgba(6,182,212,0.3)]">
          <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M13 2L3 14h8l-1 8 11-12h-8l1-8z" />
          </svg>
        </div>
        <h3 class="text-sm font-bold text-white tracking-wide">
          算力中心建筑三维数字孪生态势
        </h3>
      </div>

      <!-- Mode & Interactive Tools -->
      <div class="flex items-center gap-1.5">
        <!-- View Mode Selector -->
        <div class="hidden sm:flex items-center bg-[#092960]/90 p-0.5 rounded-md border border-[#2461b2]/70 text-xs">
          <button
            v-for="mode in viewModes"
            :key="mode.id"
            @click="activeMode = mode.id"
            class="px-2 py-0.5 rounded transition-all font-medium text-[11px] whitespace-nowrap"
            :class="activeMode === mode.id ? 'bg-gradient-to-r from-[#217bf8] to-[#00a6ff] text-white shadow-[0_0_10px_rgba(33,123,248,0.7)]' : 'text-slate-300 hover:text-white'"
          >
            {{ mode.label }}
          </button>
        </div>

        <!-- Lightning Simulation Button (For Presales & Demonstration) -->
        <button
          @click="handleLightningDemo"
          :disabled="isDemoRunning"
          class="h-6.5 px-2 rounded-md border text-[11px] font-semibold flex items-center gap-1 transition-all shadow-[0_0_8px_rgba(0,240,255,0.2)] disabled:opacity-50 cursor-pointer"
          :class="isDemoRunning ? 'bg-amber-600/90 text-white border-amber-400 animate-pulse' : 'bg-[#0f3b7d] hover:bg-[#184ea0] text-cyan-200 border-cyan-400/50'"
        >
          <svg class="w-3 h-3 fill-current text-amber-300" viewBox="0 0 24 24">
            <path d="M13 2L3 14h8l-1 8 11-12h-8l1-8z" />
          </svg>
          <span>{{ isDemoRunning ? '模拟泄流中...' : '防雷模拟' }}</span>
        </button>

        <!-- 3D Transform Controls (Rotate & Zoom) -->
        <div class="flex items-center bg-[#092960]/90 p-0.5 rounded-md border border-[#2461b2]/70 text-xs text-slate-200 h-6.5">
          <button
            @click="rotateAngle -= 15"
            title="左旋 15°"
            class="w-5 h-5 flex items-center justify-center hover:text-cyan-200 hover:bg-[#124286] rounded transition-colors text-xs cursor-pointer"
          >
            ↺
          </button>
          <button
            @click="toggleAutoRotate"
            :title="isAutoRotating ? '暂停巡航' : '自动巡航'"
            class="px-1 py-0.5 hover:text-cyan-200 hover:bg-[#124286] rounded transition-colors font-tech text-[10px] cursor-pointer"
            :class="isAutoRotating ? 'text-cyan-300 font-bold' : 'text-slate-300'"
          >
            {{ isAutoRotating ? '巡航中' : '巡航' }}
          </button>
          <button
            @click="rotateAngle += 15"
            title="右旋 15°"
            class="w-5 h-5 flex items-center justify-center hover:text-cyan-200 hover:bg-[#124286] rounded transition-colors text-xs cursor-pointer"
          >
            ↻
          </button>
          <span class="w-px h-3 bg-slate-600 mx-0.5"></span>
          <button
            @click="zoomIn"
            title="放大"
            class="w-5 h-5 flex items-center justify-center hover:text-cyan-200 hover:bg-[#124286] rounded transition-colors text-xs font-bold cursor-pointer"
          >
            +
          </button>
          <button
            @click="zoomOut"
            title="缩小"
            class="w-5 h-5 flex items-center justify-center hover:text-cyan-200 hover:bg-[#124286] rounded transition-colors text-xs font-bold cursor-pointer"
          >
            -
          </button>
          <button
            @click="resetView"
            title="重置视角"
            class="px-1 py-0.5 hover:text-cyan-200 hover:bg-[#124286] rounded transition-colors text-[10px] cursor-pointer"
          >
            复位
          </button>
        </div>
      </div>
    </div>

    <!-- Center 3D Isometric View Stage -->
    <div class="relative flex-1 min-h-[320px] flex items-center justify-center overflow-hidden my-1 select-none">
      <!-- Ambient Cyber Glows & Grid Floor -->
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#144ba0]/55 via-[#0b2b68]/75 to-[#061940] pointer-events-none"></div>

      <!-- High-Fidelity 3D Isometric Architectural SVG -->
      <div
        class="w-full h-full flex items-center justify-center transition-transform duration-300 ease-out"
        :style="{
          transform: `scale(${zoomScale}) rotate(${rotateAngle}deg)`,
          transformOrigin: 'center center'
        }"
      >
        <svg class="w-full h-full max-h-[380px] object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.85)]" viewBox="0 0 880 540">
          <defs>
            <!-- Ground & Shadow Gradients -->
            <linearGradient id="groundGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#0a224a" stop-opacity="0.85" />
              <stop offset="50%" stop-color="#051533" stop-opacity="0.95" />
              <stop offset="100%" stop-color="#020a1c" stop-opacity="1" />
            </linearGradient>

            <linearGradient id="roadGrad" x1="0" y1="0" x2="1" y2="0.8">
              <stop offset="0%" stop-color="#14213d" />
              <stop offset="100%" stop-color="#091326" />
            </linearGradient>

            <!-- Building Facade Gradients -->
            <linearGradient id="wallFront" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#1b457e" />
              <stop offset="100%" stop-color="#0b1e3d" />
            </linearGradient>

            <linearGradient id="wallSide" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#123260" />
              <stop offset="100%" stop-color="#061226" />
            </linearGradient>

            <linearGradient id="glassFacade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.65" />
              <stop offset="50%" stop-color="#0284c7" stop-opacity="0.35" />
              <stop offset="100%" stop-color="#0369a1" stop-opacity="0.75" />
            </linearGradient>

            <!-- Server Hall Floor & Glow -->
            <linearGradient id="serverFloor" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#041229" />
              <stop offset="100%" stop-color="#020817" />
            </linearGradient>

            <!-- Lightning Arc Gradient -->
            <linearGradient id="lightningGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#ffffff" />
              <stop offset="30%" stop-color="#fef08a" />
              <stop offset="70%" stop-color="#00f0ff" />
              <stop offset="100%" stop-color="#3b82f6" />
            </linearGradient>

            <!-- Drop Shadow Filter -->
            <filter id="shadow3D" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="0" dy="16" stdDeviation="16" flood-color="#000000" flood-opacity="0.85" />
            </filter>

            <filter id="neonGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          <!-- 1. BASE ISOMETRIC CAMPUS PLATFORM -->
          <g id="campus-base" filter="url(#shadow3D)">
            <!-- Outer Island -->
            <polygon points="440,30 840,240 440,490 40,240" fill="url(#groundGrad)" stroke="#1a4885" stroke-width="1.8" />

            <!-- High-tech Floor Cyber Grid Lines -->
            <g stroke="#133d74" stroke-width="0.7" opacity="0.45" fill="none">
              <path d="M 120 200 L 520 430 M 200 160 L 600 390 M 280 120 L 680 350 M 360 80 L 760 310" />
              <path d="M 760 200 L 360 430 M 680 160 L 280 390 M 600 120 L 200 350 M 520 80 L 120 310" />
            </g>

            <!-- Glowing Grounding Grid Mesh (Perimeter Lightning Net) -->
            <polygon
              points="440,48 820,240 440,475 60,240"
              fill="none"
              :stroke="isDemoRunning ? '#f59e0b' : '#00f0ff'"
              :stroke-width="isDemoRunning ? '3.5' : '2'"
              stroke-dasharray="8 4"
              opacity="0.85"
              filter="url(#neonGlow)"
            />
            
            <!-- Moving Pulse Particles on Ground Net -->
            <circle cx="630" cy="144" r="3.5" :fill="isDemoRunning ? '#f59e0b' : '#00f0ff'">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="250" cy="355" r="3.5" :fill="isDemoRunning ? '#f59e0b' : '#00f0ff'">
              <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
            </circle>

            <!-- 2. ASPHALT PERIMETER ROADWAY WITH STRIPING -->
            <g id="campus-road">
              <polygon points="440,70 790,240 440,455 90,240" fill="url(#roadGrad)" stroke="#1c3a6b" stroke-width="1" />
              <polygon points="440,100 740,240 440,420 140,240" fill="#071836" stroke="#1c3a6b" stroke-width="1" />
              <polygon points="440,85 765,240 440,438 115,240" fill="none" stroke="#f59e0b" stroke-width="1.2" stroke-dasharray="6 6" opacity="0.75" />
            </g>

            <!-- Corner Landscaping Greenery -->
            <polygon points="120,230 150,215 165,225 135,240" fill="#08332a" stroke="#10b981" stroke-width="0.8" opacity="0.8" />
            <polygon points="725,230 755,215 770,225 740,240" fill="#08332a" stroke="#10b981" stroke-width="0.8" opacity="0.8" />
            <polygon points="425,60 455,45 470,55 440,70" fill="#08332a" stroke="#10b981" stroke-width="0.8" opacity="0.8" />
            <polygon points="425,455 455,440 470,450 440,465" fill="#08332a" stroke="#10b981" stroke-width="0.8" opacity="0.8" />
          </g>

          <!-- 3. ISOMETRIC DATACENTER BUILDING COMPLEX -->
          <g id="datacenter-main-building" filter="url(#shadow3D)">
            <!-- Foundation Slab -->
            <polygon points="210,240 440,370 670,240 440,110" fill="#071b3d" stroke="#1c4d8e" stroke-width="2" />
            
            <!-- South-West Facade (Left Wall) -->
            <polygon points="210,240 440,370 440,320 210,190" fill="url(#wallFront)" stroke="#2563eb" stroke-width="1.2" />
            <!-- Architectural Glass Windows -->
            <polygon points="230,220 320,270 320,255 230,205" fill="url(#glassFacade)" stroke="#00f0ff" stroke-width="0.8" />
            <polygon points="340,280 420,325 420,310 340,265" fill="url(#glassFacade)" stroke="#00f0ff" stroke-width="0.8" />

            <!-- South-East Facade (Right Wall) -->
            <polygon points="440,370 670,240 670,190 440,320" fill="url(#wallSide)" stroke="#1d4ed8" stroke-width="1.2" />
            <polygon points="460,325 540,280 540,265 460,310" fill="url(#glassFacade)" stroke="#00f0ff" stroke-width="0.8" />
            <polygon points="560,270 650,220 650,205 560,255" fill="url(#glassFacade)" stroke="#00f0ff" stroke-width="0.8" />

            <!-- Main Entrance -->
            <polygon points="420,340 460,340 440,360" fill="#00f0ff" opacity="0.4" />
            <polygon points="420,340 440,352 460,340 440,328" fill="#1e40af" stroke="#60a5fa" stroke-width="1" />

            <!-- 4. COMPUTER SERVER HALL INTERIOR -->
            <!-- Sunken Server Room Floor -->
            <polygon
              points="250,200 440,310 630,200 440,90"
              fill="url(#serverFloor)"
              :stroke="activeMode === 'server' || focusHotspot === 'datacenter_zone' ? '#00f0ff' : '#00e5ff'"
              :stroke-width="activeMode === 'server' || focusHotspot === 'datacenter_zone' ? '3' : '1.5'"
              :class="{ 'animate-pulse': focusHotspot === 'datacenter_zone' }"
            />

            <!-- Raised Floor Grid inside Server Hall -->
            <g stroke="#0e2a56" stroke-width="0.8" opacity="0.7">
              <path d="M 290 180 L 480 290 M 330 160 L 520 270 M 370 140 L 560 250 M 410 120 L 600 230" />
              <path d="M 590 180 L 400 290 M 550 160 L 360 270 M 510 140 L 320 250 M 470 120 L 280 230" />
            </g>

            <!-- Blue LED Floor Runway Stripes (Cold Aisle Lighting) -->
            <line x1="320" y1="210" x2="500" y2="170" stroke="#00f0ff" stroke-width="3" opacity="0.7" filter="url(#neonGlow)" />
            <line x1="360" y1="240" x2="540" y2="200" stroke="#00f0ff" stroke-width="3" opacity="0.7" filter="url(#neonGlow)" />

            <!-- 5. 3D ISOMETRIC HIGH-DENSITY SERVER RACKS -->
            <g id="isometric-server-racks">
              <!-- Rack Cluster 1 -->
              <polygon points="320,195 360,172 368,177 328,200" fill="#00f0ff" opacity="0.35" />
              <polygon points="328,200 368,177 368,205 328,228" fill="#091b3b" stroke="#1d4ed8" stroke-width="0.8" />
              <polygon points="320,195 328,200 328,228 320,223" fill="#153a73" stroke="#1d4ed8" stroke-width="0.8" />
              <line x1="332" y1="205" x2="364" y2="186" stroke="#00f0ff" stroke-width="1.5" stroke-dasharray="2 2" />
              <line x1="332" y1="212" x2="364" y2="193" stroke="#10b981" stroke-width="1.5" stroke-dasharray="3 2" />

              <polygon points="375,163 415,140 423,145 383,168" fill="#00f0ff" opacity="0.35" />
              <polygon points="383,168 423,145 423,173 383,196" fill="#091b3b" stroke="#1d4ed8" stroke-width="0.8" />
              <polygon points="375,163 383,168 383,196 375,191" fill="#153a73" stroke="#1d4ed8" stroke-width="0.8" />
              <line x1="387" y1="173" x2="419" y2="154" stroke="#00f0ff" stroke-width="1.5" stroke-dasharray="2 2" />

              <polygon points="430,131 470,108 478,113 438,136" fill="#00f0ff" opacity="0.35" />
              <polygon points="438,136 478,113 478,141 438,164" fill="#091b3b" stroke="#1d4ed8" stroke-width="0.8" />
              <polygon points="430,131 438,136 438,164 430,159" fill="#153a73" stroke="#1d4ed8" stroke-width="0.8" />

              <!-- Rack Cluster 2 -->
              <polygon points="360,225 400,202 408,207 368,230" fill="#00f0ff" opacity="0.35" />
              <polygon points="368,230 408,207 408,235 368,258" fill="#091b3b" stroke="#1d4ed8" stroke-width="0.8" />
              <polygon points="360,225 368,230 368,258 360,253" fill="#153a73" stroke="#1d4ed8" stroke-width="0.8" />
              <line x1="372" y1="235" x2="404" y2="216" stroke="#00f0ff" stroke-width="1.5" stroke-dasharray="2 2" />

              <polygon points="415,193 455,170 463,175 423,198" fill="#00f0ff" opacity="0.35" />
              <polygon points="423,198 463,175 463,203 423,226" fill="#091b3b" stroke="#1d4ed8" stroke-width="0.8" />
              <polygon points="415,193 423,198 423,226 415,221" fill="#153a73" stroke="#1d4ed8" stroke-width="0.8" />
              <line x1="427" y1="203" x2="459" y2="184" stroke="#00f0ff" stroke-width="1.5" stroke-dasharray="2 2" />
            </g>

            <!-- 6. ROOFTOP HV UNITS & LIGHTNING ROD ARRESTORS -->
            <polygon points="230,165 275,140 320,165 275,190" fill="#0e2954" stroke="#3b82f6" stroke-width="1.2" />
            <line x1="250" y1="155" x2="295" y2="180" stroke="#60a5fa" stroke-width="1" />

            <!-- Rooftop Dual Protection Lightning Arrester Tower -->
            <line x1="440" y1="85" x2="440" y2="30" stroke="#e0f2fe" stroke-width="3" />
            <line x1="436" y1="30" x2="444" y2="30" stroke="#00f0ff" stroke-width="3.5" />
            <circle cx="440" cy="30" r="8" fill="none" stroke="#00f0ff" stroke-width="1.5" opacity="0.8" class="animate-ping origin-center" />
            <circle cx="440" cy="30" r="4.5" fill="#00f0ff" filter="url(#neonGlow)" />

            <!-- Rooftop Atmospheric Field Mill Sensor (Left) -->
            <line x1="275" y1="135" x2="275" y2="105" stroke="#38bdf8" stroke-width="2.5" />
            <circle cx="275" cy="105" r="5" fill="#0284c7" stroke="#00f0ff" stroke-width="1.5" />
            <circle cx="275" cy="105" r="8" fill="none" stroke="#00f0ff" stroke-width="1" stroke-dasharray="3 3" class="animate-spin origin-center" />

            <!-- Power Distribution / SPD Center (Right Flank) -->
            <polygon points="570,225 620,195 650,212 600,242" fill="#0d244c" stroke="#6366f1" stroke-width="1.2" />
            <circle cx="610" cy="218" r="4.5" fill="#f59e0b" filter="url(#neonGlow)" />
          </g>

          <!-- 7. SIMULATED LIGHTNING DISCHARGE FLASH (Interactive Demonstration) -->
          <g v-if="isDemoRunning" id="lightning-strike-demonstration">
            <!-- Sky strike arc down to tower -->
            <path
              d="M 440 0 L 435 15 L 445 22 L 440 30"
              stroke="url(#lightningGrad)"
              stroke-width="5"
              fill="none"
              filter="url(#neonGlow)"
            />
            <!-- Down-conductor diversion paths into ground grid -->
            <path
              d="M 440 30 L 440 85 L 440 370 L 440 475"
              stroke="#00f0ff"
              stroke-width="3"
              stroke-dasharray="8 4"
              fill="none"
              filter="url(#neonGlow)"
            >
              <animate attributeName="stroke-dashoffset" values="50;0" dur="0.3s" repeatCount="indefinite" />
            </path>
            <!-- Ground grid lightning dissipation shockwave -->
            <circle cx="440" cy="475" r="35" fill="none" stroke="#00f0ff" stroke-width="2.5" opacity="0.85" class="animate-ping" />
          </g>

          <!-- 8. CYAN CONNECTING LASER LINES TO SENSOR HOTSPOTS -->
          <!-- 1: 大气电场仪 (275, 105) -> (210, 85) -->
          <line x1="275" y1="105" x2="220" y2="85" stroke="#00f0ff" stroke-width="1.6" stroke-dasharray="4 3" filter="url(#neonGlow)" />
          <circle cx="275" cy="105" r="4" fill="#00f0ff" />

          <!-- 2: 双流向主动防雷装置 (440, 30) -> (470, 40) -->
          <line x1="440" y1="30" x2="480" y2="40" stroke="#00f0ff" stroke-width="1.6" stroke-dasharray="4 3" filter="url(#neonGlow)" />
          <circle cx="440" cy="30" r="4.5" fill="#00f0ff" />

          <!-- 3: SPD监测终端 (610, 218) -> (660, 205) -->
          <line x1="610" y1="218" x2="660" y2="205" stroke="#00f0ff" stroke-width="1.6" stroke-dasharray="4 3" filter="url(#neonGlow)" />
          <circle cx="610" cy="218" r="4" fill="#00f0ff" />

          <!-- 4: 接地电阻监测 (320, 330) -> (240, 385) -->
          <line x1="320" y1="330" x2="240" y2="385" stroke="#00f0ff" stroke-width="1.6" stroke-dasharray="4 3" filter="url(#neonGlow)" />
          <circle cx="320" cy="330" r="4" fill="#00f0ff" />

          <!-- 5: 静电监测终端 (480, 280) -> (550, 365) -->
          <line x1="480" y1="280" x2="550" y2="365" stroke="#00f0ff" stroke-width="1.6" stroke-dasharray="4 3" filter="url(#neonGlow)" />
          <circle cx="480" cy="280" r="4" fill="#00f0ff" />

          <!-- 6: 设备机房区域状态 (440, 210) -> (440, 280) -->
          <line x1="440" y1="210" x2="440" y2="260" stroke="#10b981" stroke-width="1.6" stroke-dasharray="4 3" filter="url(#neonGlow)" />
          <circle cx="440" cy="210" r="4" fill="#10b981" />
        </svg>
      </div>

      <!-- 9. THE 6 FLOATING HOLOGRAPHIC 3D CALLOUT BADGES (Sleek Cockpit HUD Badges) -->

      <!-- Tag 1: 大气电场仪 (Top-Left) -->
      <div
        @click="openDetail('atmospheric')"
        class="absolute left-[3%] top-[6%] z-20 cursor-pointer bg-[#0a295ee8] hover:bg-[#113a80] border rounded-lg px-2.5 py-1 backdrop-blur-md transition-all transform hover:scale-105 flex items-center gap-2 shadow-[0_4px_16px_rgba(2,12,38,0.7)]"
        :class="focusHotspot === 'atmospheric' ? 'border-cyan-300 ring-1 ring-cyan-400 shadow-[0_0_18px_rgba(0,240,255,0.75)]' : 'border-cyan-400/50 hover:border-cyan-300'"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse flex-shrink-0"></span>
        <div class="flex flex-col text-left">
          <span class="text-xs font-bold text-white">大气电场仪</span>
          <span class="text-[11px] text-emerald-300 font-mono font-medium leading-tight">12.4 kV/m · 正常</span>
        </div>
      </div>

      <!-- Tag 2: 双流向主动防雷装置 (Top-Center-Right) -->
      <div
        @click="openDetail('dual_protection')"
        class="absolute left-[47%] top-[2%] z-20 cursor-pointer bg-[#0a295ee8] hover:bg-[#113a80] border rounded-lg px-2.5 py-1 backdrop-blur-md transition-all transform hover:scale-105 flex items-center gap-2 shadow-[0_4px_16px_rgba(2,12,38,0.7)]"
        :class="focusHotspot === 'dual_protection' ? 'border-cyan-300 ring-1 ring-cyan-400 shadow-[0_0_18px_rgba(0,240,255,0.75)]' : 'border-cyan-400/50 hover:border-cyan-300'"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse flex-shrink-0"></span>
        <div class="flex flex-col text-left">
          <span class="text-xs font-bold text-white">双流向主动防雷</span>
          <span class="text-[11px] text-emerald-300 font-mono font-medium leading-tight">就绪 · 耐受58.7kA</span>
        </div>
      </div>

      <!-- Tag 3: SPD监测终端 (Middle-Right) -->
      <div
        @click="openDetail('spd_terminal')"
        class="absolute right-[3%] top-[24%] z-20 cursor-pointer bg-[#0a295ee8] hover:bg-[#113a80] border rounded-lg px-2.5 py-1 backdrop-blur-md transition-all transform hover:scale-105 flex items-center gap-2 shadow-[0_4px_16px_rgba(2,12,38,0.7)]"
        :class="focusHotspot === 'spd_terminal' ? 'border-amber-300 ring-1 ring-amber-400 shadow-[0_0_18px_rgba(245,158,11,0.75)]' : 'border-cyan-400/50 hover:border-cyan-300'"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse flex-shrink-0"></span>
        <div class="flex flex-col text-left">
          <span class="text-xs font-bold text-white">SPD监测终端</span>
          <span class="text-[11px] text-amber-300 font-mono font-medium leading-tight">12/12在网 · 正常</span>
        </div>
      </div>

      <!-- Tag 4: 接地电阻监测 (Bottom-Left) -->
      <div
        @click="openDetail('ground_res')"
        class="absolute left-[4%] bottom-[6%] z-20 cursor-pointer bg-[#0a295ee8] hover:bg-[#113a80] border rounded-lg px-2.5 py-1 backdrop-blur-md transition-all transform hover:scale-105 flex items-center gap-2 shadow-[0_4px_16px_rgba(2,12,38,0.7)]"
        :class="focusHotspot === 'ground_res' ? 'border-cyan-300 ring-1 ring-cyan-400 shadow-[0_0_18px_rgba(0,240,255,0.75)]' : 'border-cyan-400/50 hover:border-cyan-300'"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0"></span>
        <div class="flex flex-col text-left">
          <span class="text-xs font-bold text-white">地网接地电阻</span>
          <span class="text-[11px] text-emerald-300 font-mono font-medium leading-tight">0.52 Ω (≤1.0Ω优)</span>
        </div>
      </div>

      <!-- Tag 5: 静电监测终端 (Bottom-Right) -->
      <div
        @click="openDetail('esd_terminal')"
        class="absolute right-[4%] bottom-[6%] z-20 cursor-pointer bg-[#0a295ee8] hover:bg-[#113a80] border rounded-lg px-2.5 py-1 backdrop-blur-md transition-all transform hover:scale-105 flex items-center gap-2 shadow-[0_4px_16px_rgba(2,12,38,0.7)]"
        :class="focusHotspot === 'esd_terminal' ? 'border-cyan-300 ring-1 ring-cyan-400 shadow-[0_0_18px_rgba(0,240,255,0.75)]' : 'border-cyan-400/50 hover:border-cyan-300'"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0"></span>
        <div class="flex flex-col text-left">
          <span class="text-xs font-bold text-white">微环境静电终端</span>
          <span class="text-[11px] text-emerald-300 font-mono font-medium leading-tight">0.8 kV · 运行正常</span>
        </div>
      </div>

      <!-- Tag 6: 设备机房区域状态 (Center Floating Badge) -->
      <div
        @click="openDetail('datacenter_zone')"
        class="absolute left-[36%] top-[56%] z-20 cursor-pointer bg-[#0a295ee8] hover:bg-[#113a80] border rounded-lg px-2.5 py-1 backdrop-blur-md transition-all transform hover:scale-105 flex items-center gap-2 shadow-[0_4px_16px_rgba(2,12,38,0.7)]"
        :class="focusHotspot === 'datacenter_zone' ? 'border-emerald-300 ring-1 ring-emerald-400 shadow-[0_0_18px_rgba(0,229,163,0.75)]' : 'border-emerald-400/60 hover:border-emerald-300'"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0"></span>
        <div class="flex flex-col text-left">
          <span class="text-xs font-bold text-white">核心机房防护</span>
          <span class="text-[11px] text-emerald-300 font-medium leading-tight">屏蔽衰减88dB · 等电位优</span>
        </div>
      </div>

      <!-- BOTTOM-LEFT COMPASS ROSE -->
      <div class="absolute left-3 bottom-3 z-10 flex flex-col items-center select-none pointer-events-none">
        <div class="w-9 h-9 rounded-full bg-[#0a2b60]/95 border border-cyan-400/70 flex items-center justify-center shadow-[0_0_14px_rgba(0,240,255,0.45)]">
          <svg
            class="w-6 h-6 text-cyan-300 transition-transform duration-300"
            :style="{ transform: `rotate(${-45 - rotateAngle}deg)` }"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <polygon points="12,2 15,12 12,9 9,12" fill="#ef4444" />
            <polygon points="12,22 15,12 12,9 9,12" fill="#38bdf8" />
          </svg>
        </div>
        <span class="text-xs font-bold text-cyan-300 font-tech mt-0.5 tracking-wider">N</span>
      </div>

      <!-- Demonstration Feedback Toast -->
      <div
        v-if="isDemoRunning"
        class="absolute inset-x-10 top-3 z-30 bg-[#07244a]/95 border border-cyan-400/80 rounded-xl p-3 backdrop-blur-xl shadow-[0_0_30px_rgba(0,240,255,0.6)] flex items-center justify-between text-xs animate-bounce"
      >
        <div class="flex items-center gap-3">
          <span class="w-3 h-3 rounded-full bg-amber-400 animate-ping"></span>
          <span class="text-white font-bold">【雷电拦截仿真演练】已截获 58.7 kA 瞬态陡脉冲！</span>
          <span class="text-cyan-300 font-tech">分流通量: 100% · 地网散流阻抗: 0.52Ω · 屏蔽衰减: 88dB (防护正常)</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import {
  openDeviceInspection,
  activeFocusHotspot,
  simulatedLightningActive,
  triggerSimulatedLightning
} from '@/composables/useCockpitState';

const focusHotspot = activeFocusHotspot;
const isDemoRunning = simulatedLightningActive;

const rotateAngle = ref(0);
const zoomScale = ref(1.0);
const isAutoRotating = ref(false);
let autoRotateTimer: number | null = null;

const viewModes = [
  { id: 'all', label: '全景态势' },
  { id: 'lightning', label: '防雷外廓' },
  { id: 'server', label: '机房透视' },
  { id: 'ground', label: '地网拓扑' },
];
const activeMode = ref('all');

const toggleAutoRotate = () => {
  isAutoRotating.value = !isAutoRotating.value;
  if (isAutoRotating.value) {
    autoRotateTimer = window.setInterval(() => {
      rotateAngle.value = (rotateAngle.value + 1) % 360;
    }, 80);
  } else {
    if (autoRotateTimer) clearInterval(autoRotateTimer);
    autoRotateTimer = null;
  }
};

const zoomIn = () => {
  if (zoomScale.value < 1.6) zoomScale.value = Number((zoomScale.value + 0.1).toFixed(1));
};

const zoomOut = () => {
  if (zoomScale.value > 0.8) zoomScale.value = Number((zoomScale.value - 0.1).toFixed(1));
};

const resetView = () => {
  rotateAngle.value = 0;
  zoomScale.value = 1.0;
  if (isAutoRotating.value) toggleAutoRotate();
};

const openDetail = (key: string) => {
  openDeviceInspection(key);
};

const handleLightningDemo = () => {
  triggerSimulatedLightning();
};

onUnmounted(() => {
  if (autoRotateTimer) clearInterval(autoRotateTimer);
});
</script>
