<template>
  <div class="space-y-3">
    <!-- 1. Top 5 KPI Cards Row -->
    <KpiCards />

    <!-- 2. Middle Section (3-Column Grid matching the screenshot) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-[350px]">
      <!-- Left Column: 雷电监测概览 (3 cols) -->
      <div class="lg:col-span-3 flex flex-col">
        <LightningOverviewCard />
      </div>

      <!-- Center Column: 机房三维态势图 (6 cols) -->
      <div class="lg:col-span-6 flex flex-col">
        <Datacenter3DCard />
      </div>

      <!-- Right Column: 实时预警信息 + 雷电活动实时地图 (3 cols) -->
      <div class="lg:col-span-3 flex flex-col gap-3">
        <div class="flex-1">
          <RealtimeAlertsCard />
        </div>
        <div class="flex-1">
          <LightningMapCard />
        </div>
      </div>
    </div>

    <!-- 3. Bottom Row: 4 Metric Trend & Status Cards -->
    <BottomCards />
  </div>
</template>

<script setup lang="ts">
import KpiCards from '@/components/overview/KpiCards.vue';
import LightningOverviewCard from '@/components/overview/LightningOverviewCard.vue';
import Datacenter3DCard from '@/components/overview/Datacenter3DCard.vue';
import RealtimeAlertsCard from '@/components/overview/RealtimeAlertsCard.vue';
import LightningMapCard from '@/components/overview/LightningMapCard.vue';
import BottomCards from '@/components/overview/BottomCards.vue';
</script>
