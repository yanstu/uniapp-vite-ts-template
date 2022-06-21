<template>
	<view>
		<view class="zp-animation animation" :class="[`animation-${mode}`]">
			<view class="zp-animation-content">
				<slot></slot>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, computed, nextTick } from 'vue'
	const emit = defineEmits(['update:modelValue', 'complete'])

	const props = defineProps({
		// 模式
		mode: {
			type: [String],
			default: 'to-top',
		},
	})
	const Style = computed(() => {
		let style = {}
		style['animation-delay'] = `${props['delay']}ms`
		return style
	})
</script>

<style scoped>
	.zp-animation {
		position: relative;
		overflow: hidden;
		margin: auto;
	}

	.animation {
		animation-name: to-top;
		animation-duration: 1000ms;
		animation-timing-function: cubic-bezier(.24,1.02,.65,1.24);
		animation-delay: 0s;
		animation-iteration-count: 1;
	}

	@keyframes to-top {
		0% {
			top: 100px;
			opacity: 0;
		}

		80% {
			top: 0px;
			opacity: 1;
		}

		100% {
			top: 0;
			opacity: 1;
		}
	}

	.animation-top {
		animation-name: to-top;
	}

	@keyframes aa {
		from {
			max-height: 0;
			opacity: 0;
		}

		to {
			max-height: 100px;
			opacity: 1;
		}
	}

	.animation-aa {
		animation-name: aa;
		animation-timing-function: ease;
	}
</style>
