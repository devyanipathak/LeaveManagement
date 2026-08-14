import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';
import { env } from 'process';

const target = env.ASPNETCORE_URLS
    ? env.ASPNETCORE_URLS.split(';')[0]
    : 'http://localhost:5022';

export default defineConfig({
    plugins: [plugin()],

    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },

    server: {
        proxy: {
            '^/weatherforecast': {
                target,
                secure: false
            },
            '^/api': {
                target,
                secure: false
            }
        },

        port: 54268
    }
});