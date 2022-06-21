<template>
	<view class="zp-navbar" :class="[{'zp-navbar-fixed':fixed},`zp-navbar-${theme}`,{ 'backdrop-filter':props['blurEffect'] }]" :style="[Style,customStyle]" @click="pageScrollTo"
		@touchmove.stop="()=>{}">
		<!-- 状态栏占位 -->
		<view class="zp-navbar-status-bar" :style="[Style_statusBar]"></view>
		<view v-if="$slots['default']" class="zp-navbar-content" :style="[Style_content]">
			<slot name="default"></slot>
		</view>
		<view v-else class="zp-navbar-content" :class="[{ 'autoTheme':props['autoTheme'] }]" :style="[Style_content]">
			<view class="content-title" :style="[Style_title,Style_fontSize]">
				<view v-if="$slots['title']" class="content-title-text">
					<slot name="title"></slot>
				</view>
				<view v-else class="content-title-text">{{ title }}</view>
			</view>
			<view v-if="$slots['left']" class="content-left" :style="[Style_content]">
				<slot name="left"></slot>
			</view>
			<view v-else-if="isBack" class="content-left" :style="[Style_content]">
				<view class="content-left-icons" :class="[{ 'content-left-show-home':backHome }]" :style="[Style_title,backHome&&Style_showHome]">
					<view class="content-left-icons-icon" hover-class="hover-class" :style="[Style_icon_size]" @click="back">
						<image class="content-left-icons-icon-image" :src="icons.back" mode=""></image>
					</view>
					<template v-if="backHome">
						<view class="content-left-icons-span"></view>
						<view class="content-left-icons-icon" hover-class="hover-class" :style="[Style_icon_size]" @click="backToHome">
							<image class="content-left-icons-icon-image" :src="icons.home" mode=""></image>
						</view>
					</template>
				</view>
			</view>
			<view v-if="$slots['right']" class="content-right" :style="[Style_content,Style_menuButton]">
				<slot name="right"></slot>
			</view>
		</view>
	</view>
	<view class="zp-navbar-span" :class="[{ 'zp-navbar-span-show':fixedPerch && fixed }]">
		<!-- 状态栏占位 -->
		<view :style="[Style_statusBar]"></view>
		<!-- 中间占位 -->
		<view :style="[Style_content,Style_title]"></view>
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
	import { ref, computed, watch } from 'vue'
	const emit = defineEmits(['getHeight'])

	const props = defineProps({
		// fixed布局
		fixed: {
			type: [Boolean],
			default: false // 默认禁用
		},
		// 添加fixed的文本流占位
		fixedPerch: {
			type: [Boolean],
			default: true // 默认占用
		},
		// 高斯模糊
		blurEffect: {
			type: [Boolean],
			default: true,
		},
		// 主题
		theme: {
			type: [String],
			default: 'light'
		},
		// 自动切换主题
		autoTheme: {
			type: [Boolean],
			default: true,
		},
		// 标题
		title: {
			type: [String],
			default: ''
		},
		// 返回按钮
		isBack: {
			type: [Boolean],
			default: true
		},
		// 返回按钮文字
		backText: {
			type: [String],
			default: '返回'
		},
		// 返回的路径 根据路径来判断显示的左上角按钮
		backPath: {
			type: [String],
			default: ''
		},
		// 显示首页按钮
		backHome: {
			type: [Boolean],
			default: false
		},
		// 自定义返回事件
		customBack: {
			type: [Function],
			default: null
		},
		// 状态栏高度 如果有胶囊 会根据胶囊动态改变整体高度
		height: {
			type: [String, Number],
			default: 44
		},
		// 自定义样式
		customStyle: {
			type: [Object],
			default: {}
		},
	})

	// 图标
	const icons = {
		back: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAABIBJREFUeF7t3b+uFVUUx/EvL4AvIAnBRiWEQgtjQUwsTCzsoOcFbOyoboeFHb0PoA9gYizsjIUhMREtTCBECxsK4QHIAFcvcM89+9+czNrrS71nr9nr9zl75s6cHM7hv9QdOJd69S4eASRHIAABJO9A8uW7AwggeQeSL98dQADJO5B8+e4AAkjegeTLdwcQQPIOJF++O4AAkncg+fLdAQSQvAPJl+8OMA7ATeA94BLwCHgIfA38Oa7E+JkE0N/Td4Ej4PqOqT4H7vSXWWcGAfT1dQn/G+DynmmuAr/2lVrnaAG097U0/KXC98An7aXWO1IAbb2tCf+4wgXgr7Zy6x0lgPretoS/VPkQ+Km+3LpHCKCuv63hL1XeAf6oK7f+aAGU97gn/KXKeeBxebnDjBRAWZ97w78N3CorddhRAtjf797w7wLXgCf7Sx1+hADO7nlv+L8BN4B7h4+2rKIAdvdp+vCXpQvgdAApwhdA8vAF8DqANJ/846V7CfgfQbrw3QGShy+A5wBSfvK9BBj+sw5kvgdI/cnPvgMY/gsBGXcAwz/x5282AIb/yrOPTAAM/5Qnn1kAGP6Ol14ZABj+GW+GZwdg+Hu+FjAzAMMv+E7IrAAMvyD8WZ8EGn5h+DMCMPyK8GcDYPiV4c8EwPAbwp8FgOE3hj8DAMPvCD86AMPvDD8yAMMfEH5UAIY/KPyIAAx/YPjRABj+4PAjATD8FcKPAsDwVwo/AgDDXzH8CAB+AD5u7MHmf5yhcV1DD9vy9wG+AL5qXK3hFzZuywB+B94uXMfJYYZf0bStAnir8Ve2Db8i/C3fA1wE7leuZRkugMqmbXUHWJax/Lr2lcr1iKCyYVsG4E1gZZgtw7cMYFmPfwa2pFpxzNYB+CCoIsyWoVsHsKxJBC3JFh4TAYAICsNsGRYFgAha0i04JhIAERQEWjskGgAR1Ca8Z3xEACIYiCAqABEMQhAZgAgGIIgOQASdCGYAIIIOBLMAEEEjgpkAiKABwWwARFCJYEYAIqhAMCsAERQimBmACAoQzA5ABJO+Cyiw/dIQv1Syo2MZdoDjpYvgFASZAHg5EMCzDrgTnICQbQfwcvDKLpAVgDvBCwiZAYgg+X8c6eVAAP9dENPeGGa/BJy8JUqJQAAv3xWnQyCA1x+OpEIggNOfkadBIIDdr5VSIBDA2e8Vp0cggP0vlnsR3AWuAU/2lzr8CAGU9bwXwW3gVlmpw44SQHm/exG8AfxbXu4wIwVQ1+ceBJeBe3Xl1h8tgPoetyL4APi5vty6Rwigrb8tCN4E/m4rt95RAmjvbQ2CX4D320utd6QA+npbiuBT4Lu+UuscLYD+vi4IjoDrO6a6AXzbX2adGQQwrq83gc+Aj4AHwI/Al8A/40qMn0kA43saakYBhIpr/MkKYHxPQ80ogFBxjT9ZAYzvaagZBRAqrvEnK4DxPQ01owBCxTX+ZAUwvqehZhRAqLjGn6wAxvc01IwCCBXX+JMVwPiehppRAKHiGn+yAhjf01AzCiBUXONPVgDjexpqxqfbVQyQNUPqfAAAAABJRU5ErkJggg==",
		home: "data:image/png;base64,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"
	}

	// 初始化
	let options = ref({})
	const init = () => {
		// 二次获取的uni.getSystemInfoSync() 不准确 所以首次获取保留
		if (!uni['$zp-navbar']) {
			const { statusBarHeight = 0, fontSizeSetting = 16 } = uni.getSystemInfoSync()
			const _statusBarHeight = statusBarHeight
			const _menuButtonInfo = uni.getMenuButtonBoundingClientRect()
			const { height = 40, top = 0 } = _menuButtonInfo
			// 计算胶囊上下差值
			let offsetTop = top - statusBarHeight
			let offsetbottom = Math.max(props.height, 40) - height
			offsetbottom = Math.max(offsetbottom, offsetTop) // 最小等于上方高度
			let navbarHeight = statusBarHeight + height + offsetTop + offsetbottom
			uni['$zp-navbar'] = { statusBarHeight: _statusBarHeight, fontSize: fontSizeSetting, menuButtonInfo: _menuButtonInfo, offsetTop, offsetbottom, navbarHeight }
		}
		options.value = uni['$zp-navbar']
		// console.log(`------->日志输出options.value:`, options.value);
	}
	init()

	// 返回
	const back = () => {
		// 自定义返回事件
		if (props.customBack) return props.customBack()
		// 默认返回上一页
		if (!props.backPath) return uni.navigateBack()
		// 根据backPath，来返回到指定页面
		let pages = getCurrentPages()
		// 查询指定页面的index
		let index = pages.findIndex(page => `/${page.route}`.includes(props.backPath))
		if (index === -1) return uni.redirectTo({ url: props.backPath })
		uni.navigateBack({ delta: pages.length - index - 1 })
	}

	// 返回到首页
	const backToHome = () => {
		let pages = getCurrentPages()
		uni.navigateBack({ delta: pages.length - 1 })
	}

	const pageScrollTo = () => {
		uni.pageScrollTo({ scrollTop: 0, duration: 230 });
	}

	// 整体样式
	const Style = computed(() => {
		let style = {}
		return style
	})

	// 状态栏字体大小
	const Style_fontSize = computed(() => {
		let style = { 'font-size': `${ options.value.fontSize }px` }
		return style
	})

	// 图标大小
	const Style_icon_size = computed(() => {
		let style = {}
		let size = 24 * (options.value.fontSize / 16)
		style['width'] = `${ size }px`
		style['height'] = `${ size }px`
		return style
	})

	// 状态栏高度 占位
	const Style_statusBar = computed(() => {
		let style = { 'height': `${ options.value.statusBarHeight }px` }
		return style
	})

	// 中间内容样式
	const Style_content = computed(() => {
		const { offsetTop = 0, offsetbottom = 0 } = options.value
		let style = { 'padding-top': `${ offsetTop }px`, 'padding-bottom': `${ offsetbottom }px` }
		return style
	})

	// 标题高度
	const Style_title = computed(() => {
		const { height = 40 } = options.value.menuButtonInfo
		let style = { 'height': `${ height }px` }
		return style
	})

	// 胶囊占位
	const Style_menuButton = computed(() => {
		const { width = 0 } = options.value.menuButtonInfo
		let style = { 'padding-right': `${ width + 16 }px` }
		return style
	})

	// 显示首页时胶囊样式
	const Style_showHome = computed(() => {
		const { height = 0 } = options.value.menuButtonInfo
		let style = { 'border-radius': `${ height / 2 }px` }
		return style
	})
</script>
<style scoped>
	.zp-navbar {
		position: sticky;
		left: 0;
		top: 0;
		z-index: 99;
		overflow: hidden;
		background-color: rgba(242, 241, 246, 0.5);
		transition: all 230ms ease-out;
	}

	.zp-navbar-fixed {
		position: fixed;
	}

	.zp-navbar-span {
		width: 750rpx;
		max-height: 0;
		transition: all 230ms ease-out;
	}

	.zp-navbar-span-show {
		max-height: 200px;
	}

	.zp-navbar-status-bar {
		width: 750rpx;
	}

	.zp-navbar-content {
		position: relative;
		width: 750rpx;
	}

	.zp-navbar-dark .zp-navbar-content {
		filter: invert(1) hue-rotate(180deg);
	}

	.content-title {
		padding-left: 200rpx;
		padding-right: 200rpx;
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		/* background-color: red; */
	}

	.content-title-text {
		color: #000000;
		transition: all 230ms ease-out;
		font-weight: bold;
		display: -webkit-box;
		text-overflow: ellipsis;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
		text-align: center;
		word-break: break-all;
	}

	.content-left {
		position: absolute;
		top: 0;
		left: 0;
		padding-left: 16px;
		padding-right: 16px;
		box-sizing: border-box;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.content-left-icons {
		display: flex;
		align-items: center;
		transition: all 230ms ease-out;
	}

	.content-left .hover-class {
		opacity: 0.5;
	}

	.content-left-show-home {
		padding-left: 8px;
		padding-right: 8px;
		border-radius: 16px;
		border: 0.5px solid rgba(232, 231, 236, 1);
		box-sizing: border-box;
		background-color: #ffffff;
	}

	.content-left-icons-span {
		margin-left: 10px;
		margin-right: 10px;
		width: 1px;
		border-radius: 0.5px;
		height: 50%;
		background-color: rgba(232, 231, 236, 1);
	}

	.content-left-icons-icon {
		width: 24px;
		height: 24px;
	}

	.content-left-icons-icon-image {
		width: 100%;
		height: 100%;
	}

	.content-right {
		position: absolute;
		top: 0;
		right: 0;
		padding-left: 16px;
		padding-right: 16px;
		box-sizing: border-box;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.backdrop-filter {
		backdrop-filter: saturate(180%) blur(20px);
	}

	@media (prefers-color-scheme: dark) {
		.zp-navbar {
			background-color: rgba(0, 0, 0, 0.5);
		}

		.autoTheme .content-left-show-home {
			border: 0.5px solid rgba(189, 189, 189, 1.0);
		}

		.autoTheme .content-title-text {
			color: #ffffff;
		}

		.autoTheme .content-left-icons {
			filter: invert(1) hue-rotate(180deg);
		}

		.autoTheme .content-left-icons-span {
			background-color: rgba(189, 189, 189, 1.0);
		}
	}
</style>
