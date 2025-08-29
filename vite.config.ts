import {fileURLToPath, URL} from 'node:url'
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import Components from 'unplugin-vue-components/vite'
import {AntDesignVueResolver} from 'unplugin-vue-components/resolvers'

export default defineConfig({
    build: {
        sourcemap: false,
    },
    plugins: [
        vue(),
        vueDevTools(),
        Components({
            resolvers: [
                AntDesignVueResolver({
                    importStyle: 'less',
                }),
            ],
            dts: true,
        }),
    ],
    server: {
        proxy: {
            '/api': {
                target: 'http://173.185.79.174:44214',
                changeOrigin: true,
                // rewrite: (path) => path.replace(/^\/api/, ''),
            },
            '/chat': {
                target: 'http://localhost:11434',
                changeOrigin: true,
                rewrite: path => path.replace(/^\/chat/, ''),
            },
        },
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    css: {
        preprocessorOptions: {
            less: {
                javascriptEnabled: true,
            },
        },
    },
})

