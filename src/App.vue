<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';
import { useAuthStore } from '@/state/modules/auth';
import { setupInterceptors } from '@/utils/interceptors';

onLaunch(() => {
  console.log('App Launch');
  setupInterceptors();
});
onShow(() => {
  const authStore = useAuthStore();
  authStore.initToken();
  console.log('App Show');
});
onHide(() => {
  console.log('App Hide');
});
</script>

<style>
@import '@/assets/style/colorui/main.css';
@import '@/assets/style/colorui/icon.css';
@import '@/assets/style/colorui/animation.css';
</style>
<style lang="scss">
page {
  background-color: #f2f2f2;
}
</style>
