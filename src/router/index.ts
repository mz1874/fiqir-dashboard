import {createRouter, createWebHashHistory, type RouteRecordRaw} from 'vue-router';
import home from "@/views/home/index.vue";
import ollama from "@/views/ollama/index.vue";
import editor from "@/views/editor/index.vue";
import everywhere from "@/views/everywhere/index.vue";
import electric from "@/views/electric/index.vue";
import californiaISO from "@/views/californiaISO/index.vue";
import southwestPowerPool from "@/views/southwestPowerPool/index.vue";
import pjm from "@/views/pjm/index.vue";
import midcontinentISO from "@/views/midcontinentISO/index.vue";
import newYorkIso from "@/views/newYorkIso/index.vue";
import newEnglandISO from "@/views/newEnglandISO/index.vue";
import iESO from "@/views/iESO/index.vue";

const staticRoutes: RouteRecordRaw[]  = [
    {
        path: '/',
        name: 'ollama',
        component: ollama
    },
    {
        path: '/editor',
        name: 'editor',
        component: editor
    },
    {
        path: '/home',
        name: 'home',
        component: home,
        redirect: '/home/everyWhere',
        children: [
            {
                path: 'everyWhere',
                name: 'everyWhere',
                component: everywhere
            },
            {
                path: 'electric',
                name: 'electric',
                component: electric
            },
            {
                path: 'californiaISO',
                name: 'californiaISO',
                component: californiaISO
            },
            {
                path: 'southwestPowerPool',
                name: 'southwestPowerPool',
                component: southwestPowerPool
            },
            {
                path: 'pjm',
                name: 'pjm',
                component: pjm
            },
            {
                path: 'midcontinentISO',
                name: 'midcontinentISO',
                component: midcontinentISO
            },
            {
                path: 'newYorkIso',
                name: 'newYorkIso',
                component: newYorkIso
            },
            {
                path: 'newEnglandISO',
                name: 'newEnglandISO',
                component: newEnglandISO
            },
            {
                path: 'iESO',
                name: 'iESO',
                component: iESO
            },


        ]
    }
];


const router = createRouter({
    history: createWebHashHistory(),
    routes: staticRoutes,
});

let dynamicRoutesLoaded = false;

// router.beforeEach(async (to, from, next) => {
//     const isAuthenticated = localStorage.getItem('access_token');
//     if (to.name === 'login') {
//         return next();
//     }
//     if (!isAuthenticated) {
//         return next({ name: 'login' });
//     }
//     if (!dynamicRoutesLoaded) {
//         const res = await getUserRoutes();
//         const backendRoutes = res.data?.data;
//         const dynamicRoutes = mapBackendRoutes(backendRoutes);
//
//         dynamicRoutes.forEach(r => {
//             router.addRoute('main', r);
//         });
//         dynamicRoutesLoaded = true;
//         return next({ ...to, replace: true });
//     }
//
//     next();
// });

export default router;
