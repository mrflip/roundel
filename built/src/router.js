import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
import Roundels from '@/views/Roundels.vue';
import Guesser from '@/views/Guesser.vue';
console.log(createWebHistory === createWebHashHistory);
const BASE_ROUTE = '/r/';
const routes = [
    {
        name: 'roundels',
        path: BASE_ROUTE + ':playerID?',
        component: Roundels,
        props: true,
    },
    {
        name: 'guesser',
        path: BASE_ROUTE + ':playerID?/roundels/:letters',
        component: Guesser,
        props: true,
    },
    {
        path: '/:catchAll(.*)',
        redirect: BASE_ROUTE + 'flip',
    },
];
const router = createRouter({
    routes,
    history: createWebHashHistory(),
});
export default router;
//# sourceMappingURL=router.js.map