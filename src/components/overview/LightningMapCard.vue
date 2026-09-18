<template>
  <div class="tech-panel rounded-xl p-3 flex flex-col justify-between h-full relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
    <!-- Header with Icon & Title -->
    <div class="flex items-center justify-between pb-2 border-b border-[#184682]/60 relative z-20">
      <div class="flex items-center gap-2">
        <div class="w-6 h-6 rounded-md bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_6px_rgba(6,182,212,0.3)]">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="3" />
            <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
          </svg>
        </div>
        <h3 class="text-sm font-bold text-white tracking-wide">雷电活动实时地图</h3>
      </div>
    </div>

    <!-- Map Stage Container -->
    <div class="relative flex-1 min-h-[145px] flex items-center justify-center overflow-hidden my-1">
      <!-- Radar Map Background SVG -->
      <svg class="w-full h-full object-contain" viewBox="0 0 420 220">
        <defs>
          <radialGradient id="heatRed" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#ef4444" stop-opacity="0.95" />
            <stop offset="40%" stop-color="#f97316" stop-opacity="0.7" />
            <stop offset="80%" stop-color="#eab308" stop-opacity="0.3" />
            <stop offset="100%" stop-color="#0284c7" stop-opacity="0" />
          </radialGradient>
          <radialGradient id="heatOrange" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#f97316" stop-opacity="0.9" />
            <stop offset="60%" stop-color="#eab308" stop-opacity="0.4" />
            <stop offset="100%" stop-color="#38bdf8" stop-opacity="0" />
          </radialGradient>
        </defs>

        <!-- Coordinate Grid Background -->
        <g stroke="#13325e" stroke-width="0.75" stroke-dasharray="2 3" opacity="0.65">
          <line x1="20" y1="30" x2="330" y2="30" />
          <line x1="20" y1="80" x2="330" y2="80" />
          <line x1="20" y1="130" x2="330" y2="130" />
          <line x1="20" y1="180" x2="330" y2="180" />
          <line x1="60" y1="15" x2="60" y2="205" />
          <line x1="140" y1="15" x2="140" y2="205" />
          <line x1="220" y1="15" x2="220" y2="205" />
          <line x1="300" y1="15" x2="300" y2="205" />
        </g>

        <!-- Stylized China Outline Path -->
        <g fill="#071b3e" stroke="#1f58a3" stroke-width="1.3">
          <path d="
            M 140 45
            C 170 35, 220 30, 260 40
            C 290 45, 330 35, 340 50
            C 345 70, 320 85, 335 105
            C 340 120, 310 135, 305 155
            C 300 170, 270 190, 250 185
            C 235 180, 210 200, 180 190
            C 160 185, 140 175, 125 155
            C 110 140, 70 135, 60 115
            C 50 95, 80 80, 100 70
            C 115 65, 125 55, 140 45 Z
          " />
          <!-- Hainan & Islands -->
          <circle cx="210" cy="195" r="5" />
          <circle cx="270" cy="170" r="4" />
        </g>

        <!-- Heatmap Clusters of Lightning Strikes -->
        <circle cx="230" cy="140" r="38" fill="url(#heatRed)" />
        <circle cx="245" cy="145" r="16" fill="#ef4444" opacity="0.8" />
        <circle cx="245" cy="145" r="6" fill="#ffffff" />

        <circle cx="200" cy="125" r="30" fill="url(#heatOrange)" />
        <circle cx="205" cy="120" r="10" fill="#f97316" opacity="0.85" />

        <!-- Current Datacenter Location Pin (Beijing / North Node) -->
        <g transform="translate(235, 85)">
          <circle cx="0" cy="0" r="4" fill="#00f0ff" />
          <circle cx="0" cy="0" r="8" fill="none" stroke="#00f0ff" stroke-width="1.5" class="animate-ping origin-center" />
          <text x="8" y="4" fill="#38bdf8" font-size="10" font-weight="bold" font-family="'Noto Sans SC'">当前节点</text>
        </g>
      </svg>

      <!-- Right Overlay: Legend & Location Box -->
      <div class="absolute right-2 top-2 z-10 flex flex-col gap-2">
        <!-- Legend -->
        <div class="bg-[#061838]/85 border border-[#1b3d75]/70 rounded-lg p-2.5 backdrop-blur-md shadow-lg flex flex-col gap-1.5 text-xs">
          <div class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-[#ef4444] shadow-[0_0_6px_#ef4444]"></span>
            <span class="text-slate-200 font-medium">强烈</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-[#f97316] shadow-[0_0_6px_#f97316]"></span>
            <span class="text-slate-200 font-medium">较强</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-[#eab308] shadow-[0_0_6px_#eab308]"></span>
            <span class="text-slate-200 font-medium">中等</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-[#00f0ff] shadow-[0_0_6px_#00f0ff]"></span>
            <span class="text-slate-200 font-medium">较弱</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full border border-slate-500 bg-[#071b3e]"></span>
            <span class="text-slate-400">无</span>
          </div>
        </div>

        <!-- Coordinates Box -->
        <div class="bg-[#061838]/85 border border-[#1b3d75]/70 rounded-lg p-2.5 backdrop-blur-md shadow-lg text-xs flex flex-col gap-1">
          <div class="text-cyan-300 font-bold flex items-center gap-1">
            <svg class="w-3.5 h-3.5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>当前位置</span>
          </div>
          <div class="text-slate-300 font-tech">经度: 116.397°E</div>
          <div class="text-slate-300 font-tech">纬度: 39.908°N</div>
          <div class="text-slate-200 font-medium">雷电概率: <span class="text-emerald-400 font-bold">5%</span></div>
        </div>
      </div>

      <!-- Bottom Left Compass Rose -->
      <div class="absolute left-3 bottom-2 z-10 flex flex-col items-center">
        <div class="w-7 h-7 rounded-full bg-[#081838]/80 border border-cyan-500/40 flex items-center justify-center">
          <span class="text-xs font-bold text-cyan-300 font-tech">N</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Lightning Map Card matching screenshot
</script>
