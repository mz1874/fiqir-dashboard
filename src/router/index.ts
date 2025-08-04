import {createRouter, createWebHashHistory, type RouteRecordRaw} from 'vue-router';
import editor from "@/views/editor/index.vue";
import home from "@/views/home/index.vue";
import ollama from "@/views/ollama/index.vue";

const staticRoutes: RouteRecordRaw[]  = [
    {
        path: '/editor',
        name: 'editor',
        component: editor
    },
    {
        path: '/home',
        name: 'home',
        component: home
    },
    {
        path: '/',
        name: 'ollama',
        component: ollama
    },

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
