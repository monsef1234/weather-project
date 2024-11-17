import { createRouter, createWebHistory } from 'vue-router'


const routes = [
    {
        path: "/",
        component: () => import("@/views/home/Home.vue"),
    },
    {
        path: "/weather/:key",
        component: () => import("@/views/details/Details.vue"),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router