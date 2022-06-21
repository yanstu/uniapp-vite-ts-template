import uni from '@dcloudio/vite-plugin-uni';
import AutoImport from 'unplugin-auto-import/vite';
import VueSetupExtend from 'vite-plugin-vue-setup-extend';
import { defineConfig } from 'vite';
import { resolve } from 'path';

const pathResolve = (dir: string): any => {
  return resolve(__dirname, '.', dir);
};
const alias: Record<string, string> = {
  '@': pathResolve('src'),
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
    VueSetupExtend(),
    AutoImport({
      imports: ['vue'], // 自动导入vue相关函数
      dts: 'src/auto-import.d.ts', // 生成 `auto-import.d.ts` 全局声明
    }),
  ],
  resolve: {
    // 配置别名
    alias,
  },
});
