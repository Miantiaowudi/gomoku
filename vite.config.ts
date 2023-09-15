import {resolve} from 'path';
import {defineConfig} from 'vite';
import vitePluginImp from 'vite-plugin-imp';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: [
            {
                find: '@/',
                replacement: `${resolve(__dirname, 'src')}/`
            }
        ]
    },
    plugins: [
        react(),
        // antd按需加载
        vitePluginImp({
            libList: [
                {
                    libName: 'antd',
                    style: (name: string) => `antd/es/${name}/style`
                }
            ]
        })
    ]
});
