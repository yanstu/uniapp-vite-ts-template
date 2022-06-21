<template>
	<view class="zp-sticky">
		<slot></slot>
	</view>
</template>

<script lang="ts">
	export default {
		options: {
			virtualHost: true, //  将自定义节点设置成虚拟的，更加接近Vue组件的表现。我们不希望自定义组件的这个节点本身可以设置样式、响应 flex 布局等，而是希望自定义组件内部的第一层节点能够响应 flex 布局或者样式由自定义组件本身完全决定
		}
	}
</script>

<script setup lang="ts">

</script>

<style scoped>
	.zp-sticky {
		position: sticky;
		top: 0;
		z-index: 99;
	}
</style>
