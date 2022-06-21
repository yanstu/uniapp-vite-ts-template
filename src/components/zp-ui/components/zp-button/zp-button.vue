<template>
	<view class="zp-button" hover-class="hover-class" hover-stay-time="100" @click="emit('click')">
		<slot></slot>
	</view>
</template>

<script lang="ts" setup>
	const emit = defineEmits(['click'])
</script>

<style scoped>
	.zp-button {
		width: 100%;
		height: 44px;
		border-radius: 12px;
		background-color: rgba(0, 151, 255, 0.9);
		color: #ffffff;
		display: flex;
		align-items: center;
		justify-content: center;
		backdrop-filter: saturate(180%) blur(20px);
		transition: all 230ms ease-out;
	}

	.hover-class {
		background-color: rgba(128, 128, 128, 1);
	}

	/* 	@media (prefers-color-scheme: dark) {

		.hover-class {
			transform: scale(0.95);
		}
	} */
</style>
