<template>
  <div class="space-y-3">
    <!-- 1. Top 5 KPI Cards Row -->
    <KpiCards />

    <!-- 2. Middle Section: Adjusted column proportions (Reduced Left & Center cards, expanded Right column) -->
    <div class="grid grid-cols-1 lg:grid-cols-[22%_43%_1fr] gap-2.5 min-h-[440px]">
      <!-- Left Column: 雷电监测概览 (Reduced to ~22%) -->
      <div class="flex flex-col min-w-0">
        <LightningOverviewCard />
      </div>

      <!-- Center Column: 机房三维态势图 (Reduced to ~43%) -->
      <div class="flex flex-col min-w-0">
        <Datacenter3DCard />
      </div>

      <!-- Right Column: 实时预警信息 + 雷电活动实时地图 (Expanded to ~35%) -->
      <div class="flex flex-col gap-2.5 min-w-0">
        <div class="h-[185px] flex-shrink-0">
          <RealtimeAlertsCard />
        </div>
        <div class="flex-1 min-h-[220px]">
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
