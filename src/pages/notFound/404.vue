<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue';
import { router } from '@/utils/router';

const go = ref<string>('');
const redirect = ref<string>('');

onLoad((query) => {
  go.value = query.go || '';
  redirect.value = query.redirect || '';
});

/**
 * 返回首页
 */
const backHome = () => {
  router.pushTab(redirect.value);
};
</script>

<template>
  <view class="w-screen flex flex-col items-center pt-320rpx">
    <image class="w-360rpx" mode="widthFix" src="/static/svg/weep.svg" />
    <view class="mb-40rpx">
      <text>{{ go }} 页面找不到了~</text>
    </view>
    <van-button @click="backHome">返回首页</van-button>
  </view>
</template>

<style lang="scss" scoped>
.mb-40rpx {
  margin-bottom: 40rpx;
}

.w-360rpx {
  width: 360rpx;
}

.pt-320rpx {
  padding-top: 320rpx;
}

.w-screen {
  width: 100vw;
}

.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.items-center {
  item-align: center;
}
</style>
