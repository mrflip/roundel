import {
  createRouter, createWebHistory, createWebHashHistory, RouteRecordRaw
} from 'vue-router';

import Roundels from '@/views/Roundels.vue';
import Guesser  from '@/views/Guesser.vue';
import Lobby    from '@/views/Lobby.vue';

console.log(createWebHistory === createWebHashHistory)
const BASE_ROUTE = '/'

const routes: RouteRecordRaw[] = [
  {
    name:       'roundels',
    path:       BASE_ROUTE + ':playerID',
    component:  Roundels,
    props:      true,
  },

  {
    name:       'guesser',
    path:       BASE_ROUTE + ':playerID/roundels/:letters',
    component:  Guesser,
    props:      true,
  },

  {
    path:       BASE_ROUTE,
    component:  Lobby,
    props:      true,
  },

  {
    path: '/:catchAll(.*)*',
    redirect:   BASE_ROUTE,
  },
];

const router = createRouter({
  routes,
  history: createWebHashHistory(),
});

export default router;
