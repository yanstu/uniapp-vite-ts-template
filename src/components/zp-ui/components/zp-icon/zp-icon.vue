<template>
	<view>
		<view id="zp-icon" class="zp-icon" :style="[Style]">
			<text v-if="Icon_name" class="zp-icon-text" :style="[Style_icon]">{{ Icon_name }}</text>
			<image v-else class="zp-icon-image" :style="[Style_icon]" :src="name"></image>
		</view>
	</view>
</template>

<script setup lang="ts">
	import zpIcon from './iconfont.json'

	import { ref, computed, nextTick, getCurrentInstance } from 'vue'

	const props = defineProps({
		// 图标名称
		name: {
			type: [String],
			default: 'home'
		},
		// 图标颜色
		color: {
			type: [String],
			default: '#333333'
		},
		// 背景颜色
		bg: {
			type: [String],
			default: ''
		},
		// 内边距
		padding: {
			type: [String],
			default: ''
		},
		// 圆角
		radius: {
			type: [String, Number],
			default: ''
		},
		// 图标大小 px
		size: {
			type: [String, Number],
			default: '30'
		}
	})
	const { proxy } = getCurrentInstance()
	// 初始化
	let options = {}
	const w_width = ref(30)
	const init = async () => {
		// 首次加载zp-icon-text才处理 节约性能
		if (!uni['$zp-icon']) {
			let glyphs = {}
			// 把引入的json文件遍历转为Unicode
			for (let icon of zpIcon.glyphs) {
				glyphs[icon.name] = unescape(`%u${ icon.unicode }`)
			}
			uni['$zp-icon'] = { glyphs }
		}
		options = uni['$zp-icon']
		await nextTick()
		let view = uni.createSelectorQuery().in(proxy).select("#zp-icon");
		view.fields({
			size: true,
			scrollOffset: true
		}, data => {
			// console.log(`------->日志输出data:`, data);
			w_width.value = data.width
		}).exec();
		// view.boundingClientRect(data => {
		// 	console.log(`------->日志输出data:`, data);
		// }).exec();
	}
	init()

	// 返回字体图标 如果没有检索到当前字体图标则使用image渲染
	const Icon_name = computed(() => {
		let { glyphs = null } = options
		if (!glyphs || !glyphs[props.name]) return ''
		return glyphs[props.name]
	})

	// 整体样式
	const Style = computed(() => {
		let size = props.size * 2
		let style = {
			'width': `${ size }rpx`,
			'height': `${ size }rpx`,
			'max-width': `${ size * 0.6 }px`,
			'max-height': `${ size * 0.6 }px`,
			'background-color': `${ props.bg }`,
			'color': props.color,
		}
		if (props.radius) {
			style['border-radius'] = props.radius || '0'
		}
		if (props.bg) {
			style['padding'] = props.padding || '2px'
		}
		// console.log(`------->日志输出style:`, style);
		return style
	})
	// 动态生成图标的样式
	const Style_icon = computed(() => {
		let style = {
			'font-size': `${ w_width.value * 0.8 }px`,
		}
		return style
	})
</script>

<style scoped>
	@font-face {
		font-family: 'zpIcon';
		/* Project id 3282510 */
		src: url('//at.alicdn.com/t/font_3282510_m0jsg1o157q.woff2?t=1652352845886') format('woff2'),
			url('//at.alicdn.com/t/font_3282510_m0jsg1o157q.woff?t=1652352845886') format('woff'),
			url('//at.alicdn.com/t/font_3282510_m0jsg1o157q.ttf?t=1652352845886') format('truetype');
	}

	.zp-icon {
		position: relative;
		overflow: hidden;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.zp-icon-text {
		font-family: zpIcon;
		text-decoration: none;
		text-align: center;
		font-style: normal;
		transition: all 230ms cubic-bezier(.41, 1.01, .67, 1.15);
	}

	.zp-icon-image {
		width: 100%;
		height: 100%;
	}

	.zp-icon-text:active {
		opacity: 0.5;
	}
</style>
