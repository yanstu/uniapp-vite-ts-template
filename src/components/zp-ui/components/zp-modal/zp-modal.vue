<template>
	<view v-if="show">
		<view class="zp-modal" :class="[{ 'zp-modal-show': modelValue }]" @touchmove.stop="() => { }">
			<view class="zp-modal-content"
				:class="[{ 'zp-modal-content-show': modelValue }, { 'backdrop-filter': blurEffect }]">
				<view class="zp-modal-content-title">{{ title }}</view>
				<view class="zp-modal-content-text">{{ text }}</view>
				<view class="zp-modal-content-options">
					<view class="zp-modal-content-options-span"></view>
					<template v-for="(item, index) in options" :key="index">
						<view class="zp-modal-content-options-item" hover-class="hover-class" hover-stay-time="100"
							:style="item.style" @click="click(index)">{{ item.text }}
						</view>
					</template>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
export interface IOptionItem {
	text: string
	style: {
		[key: string]: string
	}
	end: () => void
}

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
	// 文本
	text: {
		type: [String],
		default: '此操作存在一定的风险，确定要这样做吗？'
	},
	// 选项
	options: {
		type: Array as () => IOptionItem[],
		default: [
			{ text: '取消', style: { color: '#0097ff' }, end: () => { } },
			{ text: '确定', style: { color: '#0097ff', 'font-weight': 'bold' }, end: () => { } },
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
.zp-modal {
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.3);
	pointer-events: none;
	opacity: 0;
	z-index: 100;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 230ms ease-out;
}

.zp-modal-show {
	opacity: 1;
	pointer-events: all;
}

@keyframes transform-show {
	from {
		transform: scale(1.2);
	}

	to {
		transform: scale(1);
	}
}

.zp-modal-content {
	box-sizing: border-box;
	width: 280px;
	opacity: 0;
	transition: all 230ms ease-out;
	border-radius: 12px;
	overflow: hidden;
	background-color: rgba(255, 255, 255, 0.7);
}

.zp-modal-content-show {
	opacity: 1;
	animation-name: transform-show;
	animation-duration: 230ms;
	animation-timing-function: ease-out;
	animation-delay: 0s;
	animation-iteration-count: 1;
}

.zp-modal-content-title {
	padding: 20px 20px 0 20px;
	height: 30px;
	display: flex;
	font-size: 16px;
	align-items: center;
	justify-content: center;
	font-weight: bold;

}

.zp-modal-content-text {
	padding: 0 20px 20px 20px;
	font-size: 14px;
	text-align: center;
}

.zp-modal-content-options {
	position: relative;
	border-top: 0.5px solid rgba(171, 169, 173, 0.7);
	display: flex;
}

.zp-modal-content-options-item {
	position: relative;
	flex: 1;
	height: 44px;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 230ms ease-out;
}

.zp-modal-content-options-span {
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	margin: auto;
	width: 0.5px;
	height: 44px;
	background-color: rgba(171, 169, 173, 0.7);
}

.hover-class {
	background-color: rgba(171, 169, 173, 0.7);
	z-index: 9;
}

@media (prefers-color-scheme: dark) {

	.zp-modal-content {
		background-color: rgba(46, 46, 46, 0.7);
	}

	.zp-modal-content-options {
		border-top: 0.5px solid rgba(78, 82, 88, 0.7);
	}

	.zp-modal-content-options-span {
		background-color: rgba(78, 82, 88, 0.7);
	}

	.hover-class {
		background-color: rgba(78, 82, 88, 0.7);
		z-index: 9;
	}
}

.backdrop-filter {
	backdrop-filter: saturate(180%) blur(20px);
}
</style>
