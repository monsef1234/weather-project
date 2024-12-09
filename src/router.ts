import { createRouter, createWebHistory, Router } from 'vue-router'
import { useSavedLocationsStore } from './store/savedLocations';


const routes = [
    {
        path: "/",
        component: () => import("@/views/home/Home.vue"),
    },
    {
        path: "/weather/:key",
        component: () => import("@/views/details/Details.vue"),
        beforeEnter: (to: any, from: any, next: any) => {
            const store = useSavedLocationsStore();

            console.log(store.search);


            if (!store.search) {
                console.log("search is empty");
            } else {
                console.log("search is not empty");
            }
        }
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router