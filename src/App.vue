<template>
  <div class="min-h-screen bg-[radial-gradient(circle_at_50%_15%,_#08265e_0%,_#04143a_40%,_#010717_100%)] text-slate-100 flex flex-col font-sans relative overflow-x-hidden">
    <!-- Cyber ambient lighting glow circles in background -->
    <div class="fixed top-0 left-1/4 w-[700px] h-[350px] bg-blue-500/15 rounded-full blur-[150px] pointer-events-none"></div>
    <div class="fixed bottom-0 right-1/4 w-[700px] h-[400px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none"></div>

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
