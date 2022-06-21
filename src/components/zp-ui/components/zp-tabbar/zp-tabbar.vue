<template>
	<view @touchmove.stop="()=>{}">
		<view class="zp-tabbar" :class="[{ 'backdrop-filter':blurEffect }]" :style="[Style,customStyle]">
			<view class="zp-tabbar-content">
				<template v-show="$slots['default']">
					<slot></slot>
				</template>
				<view v-if="!$slots['default']" class="content-item" hover-class="hover-class" hover-stay-time="100" :style="[Style_contentItem]" v-for="(item,index) in list" :key="index"
					@click="selectClick(item,index)">
					<view class="content-item-icon" :style="[Style_icon_size]">
						<image class="content-item-icon-image" :style="[Style_icon(index,'default')]" :src="item.icon" mode="aspectFit"></image>
						<image class="content-item-icon-image" :style="[Style_icon(index,'active')]" :src="item.selectedIcon" mode="aspectFit"></image>
					</view>
					<view class="content-item-text" :style="[Style_text(index,item)]">{{ item.text }}</view>
				</view>
			</view>
			<!-- 底部安全距离占位 -->
			<view class="safe-area-inset-bottom"></view>
		</view>
		<view class="zp-tabbar-span" :class="[{ 'zp-tabbar-span-show':fixedPerch }]">
			<!-- 中间占位 -->
			<view :style="[Style_contentItem]"></view>
			<!-- 底部安全距离占位 -->
			<view class="safe-area-inset-bottom"></view>
		</view>
	</view>
</template>
<script setup lang="ts">
	import { ref, computed } from 'vue'
	const emit = defineEmits(['update:modelValue'])

	const props = defineProps({
		// 默认状态
		modelValue: {
			type: [Number],
			default: 0
		},
		// 选项卡集合
		list: {
			type: [Array],
			default: [
				{ icon: '', selectedIcon: '', text: '', color: '', selectedColor: '' }
			]
		},
		// 自定义样式
		customStyle: {
			type: [Object],
			default: {}
		},
		// 添加fixed的文本流占位
		fixedPerch: {
			type: [Boolean],
			default: true // 默认占用
		},
		// 高斯模糊
		blurEffect: {
			type: [Boolean],
			default: () => {
				return true
			},
		},
		// 默认高度
		height: {
			type: [String, Number],
			default: 60
		},
	})
	// 初始化
	let options = ref({})
	const init = async () => {
		try {
			await uni.hideTabBar()
		} catch (e) {
			//TODO handle the exception
		}
		// 二次获取的uni.getSystemInfoSync() 不准确 所以首次获取保留
		if (!uni['$zp-tabbar']) {
			const { fontSizeSetting = 16 } = uni.getSystemInfoSync()
			uni['$zp-tabbar'] = { fontSize: fontSizeSetting }
		}
		options.value = uni['$zp-tabbar']
	}
	init()

	// 选择菜单
	const selectClick = (item, index) => {
		emit('update:modelValue', index)
		item.path && uni.switchTab({ url: item.path })
	}

	// 整体样式
	const Style = computed(() => {
		let style = {}
		return style
	})

	// 中间item高度
	const Style_contentItem = computed(() => {
		let height = props.height * (options.value.fontSize / 16)
		let style = { height: `${height}px` }
		return style
	})

	// 图标选中样式
	const Style_icon = computed(() => {
		return function(index, mode = 'default') {
			let style = { opacity: 0, transform: 'scale(0.1)' }
			if (mode === 'default' && index !== props.modelValue) {
				style['opacity'] = 1
				style['transform'] = 'scale(1)'
			}
			if (mode === 'active' && index === props.modelValue) {
				style['opacity'] = 1
				style['transform'] = 'scale(1)'
			}
			return style
		}
	})

	// 图标大小
	const Style_icon_size = computed(() => {
		let style = {}
		let size = 24 * (options.value.fontSize / 16)
		style['width'] = `${ size }px`
		style['height'] = `${ size }px`
		return style
	})

	// 文字样式
	const Style_text = computed(() => {
		return function(index, item = {}) {
			const { color = '#333333', selectedColor = '#d81e06' } = item
			let style = { color: color }
			if (index === props.modelValue) {
				style['color'] = item.selectedColor
			}
			// 字体大小
			let size = 12 * (options.value.fontSize / 16)
			style['font-size'] = `${ size }px`
			return style
		}
	})
</script>
<style scoped>
	.zp-tabbar {
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 99;
		overflow: hidden;
		background-color: rgba(242, 241, 246, 0.5);
		transition: background-color 230ms ease-out;
	}

	.zp-tabbar-span {
		width: 750rpx;
		max-height: 0;
		transition: all 230ms ease-out;
	}

	.zp-tabbar-span-show {
		max-height: 200px;
	}

	.zp-tabbar-content {
		width: 750rpx;
		display: flex;
		justify-content: center;
		transition: all 230ms ease-out;
	}

	.content-item {
		padding-top: 10px;
		padding-bottom: 10px;
		box-sizing: border-box;
		flex: 1;
		min-width: 20%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-around;
		transition: all 230ms ease-out;
	}

	.content-item-icon {
		position: relative;
		height: 24px;
		width: 24px;
	}

	.content-item-icon-image {
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		width: 100%;
		opacity: 1;
		transition: all 230ms ease-out;
	}

	.content-item-text {
		font-size: 12px;
		color: #666666;
	}

	.hover-class {
		transform: scale(0.9);
	}

	@media (prefers-color-scheme: dark) {
		.zp-tabbar {
			background-color: rgba(0, 0, 0, 0.5);
		}

		.content-item {
			filter: invert(1) hue-rotate(180deg);
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
