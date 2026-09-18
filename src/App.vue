<template>
  <div class="min-h-screen bg-[radial-gradient(circle_at_50%_15%,_#123b8c_0%,_#0a2869_42%,_#061b45_80%,_#041232_100%)] text-slate-100 flex flex-col font-sans relative overflow-x-hidden">
    <!-- Cyber ambient lighting glow circles in background (brighter luminous atmosphere) -->
    <div class="fixed top-0 left-1/4 w-[800px] h-[400px] bg-blue-500/25 rounded-full blur-[160px] pointer-events-none"></div>
    <div class="fixed bottom-0 right-1/4 w-[800px] h-[450px] bg-cyan-500/20 rounded-full blur-[170px] pointer-events-none"></div>
    <div class="fixed top-1/2 right-10 w-[500px] h-[500px] bg-indigo-500/15 rounded-full blur-[180px] pointer-events-none"></div>

    <!-- Top Platform Header -->
    <AppHeader />

    <!-- Main Workspace Container -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Left Sidebar with Route Navigation -->
      <AppSidebar />

      <!-- Main Dynamic Route View Area -->
      <main class="flex-1 p-2.5 overflow-y-auto max-w-[1920px] mx-auto w-full">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>

    <!-- Global Cockpit Device Detail Modal -->
    <DeviceDetailModal />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue';
import AppSidebar from '@/components/layout/AppSidebar.vue';
import DeviceDetailModal from '@/components/common/DeviceDetailModal.vue';
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
