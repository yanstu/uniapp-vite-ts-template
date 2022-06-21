<template>
  <view class="content">
    <zpButton @click="openModal">点我</zpButton>
    <zpModal :options="modalOption" :modelValue="modalShow" />

  </view>
</template>

<script setup lang="ts">
import zpModal, { IOptionItem } from '@/components/zp-ui/components/zp-modal/zp-modal.vue'
import zpButton from '@/components/zp-ui/components/zp-button/zp-button.vue'
const modalShow = ref(false)
const modalOption = ref<IOptionItem[]>([
  {
    text: '取消', style: { color: '#0097ff' }, end: () => {
      uni.showToast({
        title: '取消了',
        icon: 'none'
      })
      modalShow.value = false
    }
  },
  {
    text: '确定', style: { color: '#0097ff', 'font-weight': 'bold' }, end: () => {
      uni.showToast({
        title: '确定了',
        icon: 'none'
      })
      modalShow.value = false
    }
  },
])
const openModal = () => {
  modalShow.value = true
}
</script>

<style>
</style>
