import { createSSRApp } from 'vue';
import App from './App.vue';
import { setupStore } from '@/state';
// @ts-ignore
import uView from '@/uni_modules/vk-uview-ui';

export function createApp() {
  const app = createSSRApp(App);

  // 使用 uView UI
  app.use(uView);

  // Configure store
  setupStore(app);

  return {
    app,
  };
}
