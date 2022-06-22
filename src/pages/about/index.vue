<script lang="ts" setup>
  import { router } from '@/utils/router';
  import { useAuthStore } from '@/state/modules/auth';
  import { ref } from 'vue';
  import { onShow } from '@dcloudio/uni-app';
  const authStore = useAuthStore();
  const isLogin = ref(false);
  onShow(() => {
    isLogin.value = authStore.isLogin;
  });
  const handleJump = (url: string) => {
    router.push(url);
  };

  // 登出
  const handleLoginOut = () => {
    authStore.loginOut().then((res) => {
      isLogin.value = false;
    });
  };
</script>

<template>
  <view class="container">
    <view class="head-wrap">
      <view class="avatar">
        <image class="img" src="/static/images/avatar.png"></image>
      </view>
      <view class="desc">{{ isLogin ? '测试' : '未登入' }}</view>
    </view>
    <view class="cell"><u-button @click="handleJump('/pages/log/index')">log</u-button></view>
    <view class="cell" v-if="isLogin"><u-button @click="handleLoginOut">登出</u-button></view>
    <view class="cell" v-else
      ><u-button @click="handleJump('/pages/login/index')">登入</u-button></view
    >
  </view>
</template>

<style lang="scss" scoped>
  .container {
    padding: 96rpx 24rpx;
    .head-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      .avatar {
        height: 120rpx;
        width: 120rpx;
        border: 2rpx solid #d1d5db;
        border-radius: 120rpx;
        overflow: hidden;
        padding: 6rpx;
        .img {
          height: 100%;
          width: 100%;
        }
      }
      .desc {
        font-size: 28rpx;
        line-height: 120rpx;
      }
    }
    .cell {
      margin-top: 60rpx;
      text-align: center;
    }
  }
</style>
