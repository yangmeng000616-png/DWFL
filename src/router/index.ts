import { createRouter, createWebHistory } from 'vue-router';
import OverviewView from '@/views/OverviewView.vue';
import RealtimeView from '@/views/RealtimeView.vue';
import WarningView from '@/views/WarningView.vue';
import ElectrostaticView from '@/views/ElectrostaticView.vue';
import DevicesView from '@/views/DevicesView.vue';
import AnalyticsView from '@/views/AnalyticsView.vue';
import HistoryView from '@/views/HistoryView.vue';
import ReportsView from '@/views/ReportsView.vue';
import SettingsView from '@/views/SettingsView.vue';

const routes = [
  {
    path: '/',
    redirect: '/overview',
  },
  {
    path: '/overview',
    name: 'Overview',
    component: OverviewView,
  },
  {
    path: '/realtime',
    name: 'Realtime',
    component: RealtimeView,
  },
  {
    path: '/warning',
    name: 'Warning',
    component: WarningView,
  },
  {
    path: '/electrostatic',
    name: 'Electrostatic',
    component: ElectrostaticView,
  },
  {
    path: '/devices',
    name: 'Devices',
    component: DevicesView,
  },
  {
    path: '/analytics',
    name: 'Analytics',
    component: AnalyticsView,
  },
  {
    path: '/history',
    name: 'History',
    component: HistoryView,
  },
  {
    path: '/reports',
    name: 'Reports',
    component: ReportsView,
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsView,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/overview',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
