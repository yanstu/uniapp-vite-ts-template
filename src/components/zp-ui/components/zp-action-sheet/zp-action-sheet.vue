<template>
	<view>
		<view class="zp-action-sheet" :class="[{ 'zp-action-sheet-show':modelValue }]" @touchmove.stop="()=>{}"
			@click.stop="emit('update:modelValue', false)">
			<view class="zp-action-sheet-content" :class="[{ 'zp-action-sheet-content-show':modelValue }]">
				<view class="zp-action-sheet-content-card" :class="[{ 'backdrop-filter':blurEffect }]">
					<template v-for="(item,index) in options" :key="index">
						<view class="zp-action-sheet-content-item"
							:class="[{ 'zp-action-sheet-content-item-border':index!==0 }]" :style="[item.style]"
							hover-class="hover-class" hover-stay-time="100">
							{{ item.text }}
						</view>
					</template>
				</view>
				<view style="height: 8px;"></view>
				<view class="zp-action-sheet-content-card zp-action-sheet-content-card-close"
					:class="[{ 'backdrop-filter':blurEffect }]">
					<view class="zp-action-sheet-content-item" hover-class="hover-class" hover-stay-time="100"
						@click="emit('update:modelValue', false)">取消</view>
				</view>
				<view style="min-height: 8px;">
					<!-- 底部安全距离占位 -->
					<view class="safe-area-inset-bottom"></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
const emit = defineEmits(['update:modelValue', 'click'])

const props = defineProps({
	// 默认状态
	modelValue: {
		type: [Boolean],
		default: false
	},
	// 标题
	title: {
		type: [String],
		default: '提示'
	},
	// 选项
	options: {
		type: [Array],
		default: [
			{ text: '拍摄', style: { color: '#0097ff', 'font-weight': 'bold' }, end: () => { } },
			{ text: '从相册选择', style: { color: '#0097ff' }, end: () => { } },
			{ text: '忽略设备', style: { color: '#D45B52' }, end: () => { } },
		]
	},
	// 高斯模糊
	blurEffect: {
		type: [Boolean],
		default: () => {
			return true
		},
	},
})

// 后加载
const show = ref(false)
const init = async () => {
	await nextTick()
	show.value = true
}
init()

const click = (index: number) => {
	let end = props['options'][index].end
	emit('update:modelValue', false)
	emit('click', index)
	end()
}
</script>

<style scoped>
.zp-action-sheet {
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.3);
	pointer-events: none;
	opacity: 0;
	z-index: 100;
	transition: all 230ms ease-out;
}

.zp-action-sheet-show {
	opacity: 1;
	pointer-events: all;
}

.zp-action-sheet-content {
	position: absolute;
	left: 0;
	bottom: 0;
	padding: 0 8px;
	box-sizing: border-box;
	width: 100%;
	transform: translateY(100%);
	transition: all 230ms ease-out;
}

.zp-action-sheet-content-show {
	transform: translateY(0);
}

.zp-action-sheet-content-card {
	border-radius: 12px;
	overflow: hidden;
	transform: rotate(0deg);
	background-color: rgba(255, 255, 255, 0.8);
	transition: all 230ms ease-out;
}

.zp-action-sheet-content-card-close {
	background-color: rgba(255, 255, 255, 1);
	font-weight: bold;
}

.zp-action-sheet-content-item {
	position: relative;
	width: 100%;
	height: 50px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 16px;
	color: #0097ff;
}

.zp-action-sheet-content-item-border {
	border-top: 1px solid rgba(221, 221, 221, 1.0);
	transition: all 230ms ease-out;
}

.hover-class {
	background-color: rgba(221, 221, 221, 1.0);
	box-shadow: 0 0 1px 1px rgba(221, 221, 221, 1.0);
	z-index: 9;
	transition: all 230ms ease-out;
}

@media (prefers-color-scheme: dark) {
	.zp-action-sheet-content-card {
		background-color: rgba(44, 44, 44, 0.8);
	}

	.zp-action-sheet-content-card-close {
		background-color: rgba(44, 44, 44, 1);
	}

	.zp-action-sheet-content-item-border {
		border-top: 1px solid rgba(55, 55, 57, 1);
	}

	.hover-class {
		background-color: rgba(55, 55, 57, 1);
		box-shadow: 0 0 1px 1px rgba(55, 55, 57, 1);
		z-index: 9;
	}
}

.backdrop-filter {
	backdrop-filter: saturate(180%) blur(20px);
}

.safe-area-inset-bottom {
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);
}
</style>
