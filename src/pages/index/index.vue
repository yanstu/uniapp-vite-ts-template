<script setup lang="ts">
import { ref } from 'vue';
import { router } from '@/utils/router';

const title = ref('uni-app vue3 ts --Vite');
const list = ref(['未付款', '待评价', '已付款'])
const current = ref(1)

const handleGetStarted = () => {
  router.pushTab('/pages/demo/index');
};

</script>
<template>
  <view class="content">
    <u-subsection style="width: 100%" inactive-color="#fafafa" active-color="#2979ff" :list="list" mode="subsection"
      :current="current"></u-subsection>
    <image class="logo" src="/static/svg/LOGO.svg" />
    <view class="text-area">
      <text class="">{{ title }}</text>
    </view>
    <u-button @click="handleGetStarted">Get Started → </u-button>
  </view>
</template>
<style lang="scss">
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin: 280rpx auto 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
  margin-bottom: 60rpx;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
