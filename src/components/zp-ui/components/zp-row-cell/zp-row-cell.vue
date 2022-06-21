<template>
	<view>
		<view class="zp-row-cell" :hover-class="hover?'hover-class':''" hover-stay-time="100" :customStyle="[customStyle]" @click="click" @touchstart="touchstart" @touchend="touchend">
			<slot v-if="$slots['icon']" name="icon"></slot>
			<image v-else-if="icon" class="zp-row-cell-icon dark-filter-invert" :src="icon"></image>
			<slot v-else name="icon"></slot>
			<view class="zp-row-cell-content">
				<view v-if="border==='top'" class="zp-row-cell-content-border zp-row-cell-content-border-top"></view>
				<view v-if="border==='bottom'" class="zp-row-cell-content-border zp-row-cell-content-border-bottom"></view>
				<template v-show="$slots['default']">
					<slot></slot>
				</template>
				<view class="zp-row-cell-title" :class="[{'zp-row-cell-slot':$slots['title']}]">
					<template v-if="$slots['title']">
						<slot name="title"></slot>
					</template>
					<template v-else-if="title">
						<view class="zp-row-cell-title-text">{{ title }}</view>
					</template>
					<template v-else>
						<slot name="title"></slot>
					</template>
				</view>
				<view class="zp-row-cell-value" :class="[{'zp-row-cell-slot':$slots['value']}]">
					<template v-if="$slots['value']">
						<slot name="value"></slot>
					</template>
					<template v-else-if="value">
						<text class="zp-row-cell-value-text">{{ value }}</text>
					</template>
					<template v-else>
						<slot name="value"></slot>
					</template>
				</view>
				<template v-if="arrow">
					<image class="zp-row-cell-arrow-right dark-filter-invert" :src="icons['arrow-right']"></image>
				</template>
			</view>
		</view>
	</view>
</template>
<script lang="ts" setup>
	import { ref } from 'vue'
	const emit = defineEmits(['click'])
	const props = defineProps({
		// 图标
		icon: {
			type: [String],
			default: ''
		},
		// 标题
		title: {
			type: [String, Number],
			default: '标题'
		},
		// 内容
		value: {
			type: [String, Number],
			default: '内容'
		},
		// 按压反馈
		hover: {
			type: [Boolean],
			default: true
		},
		// 按压复制
		touchCopy: {
			type: [Boolean],
			default: false
		},
		// 自定义复制内容
		customCopyValue: {
			type: [String],
			default: ''
		},
		// 边框 top bottom none
		border: {
			type: [String],
			default: 'top'
		},
		// 右边箭头
		arrow: {
			type: [Boolean],
			default: true
		},
		// 自定义样式
		customStyle: {
			type: [Object],
			default: {}
		},
	})

	// 图标
	const icons = {
		'arrow-right': "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAABEZJREFUeF7t3b1uE1EQxfF/+kBBQwFCAlHwISFFFIgeIfEA8AD0FEg06VKlo+EF0ic9EgVNCkQBBUIEGhAIXgCeAC2KFcexvXP3rsO99xy3jLOeOT+P1+vErOGb9ATWpLt38xiAOAIDMADxCYi37w1gAOITEG/fG8AAxCcg3r43gAGIT0C8fW8AAxCfgHj73gAGID4B8fa9AQxAfALi7dewAa4Cj4FLwDngG/Ae2BHPbpT2SwfwBHixoNM9YAs4GGUSoj+kZAC3gA89uXwCHhnBcL0lA3gF3A+0ZgSBIS0qKRXAReBnQl9GkDCs6dJSAdwF3iT2ZASJA+vKSwVwDfg8oB8jSBxaqQDOAH8Se5mUG0HC4EoF0LWwDWwm9DJdagTBwZUMYB3YBzaCvcyWGUFgcCUD6B7+DWAXuBnoZV6JEfQMrnQARjBQfvRuNQAwgmiaA+pqAWAEA8KN3KUmAEYQSTSxpjYARpAYcF95jQCMoC/VhH+vFYARJIS8rLRmAEYwAoLaARhBJoIWABhBBoJWABjBQAQtATCCAQhaA2AEiQhaBGAECQhaBWAEQQQtAzCCAILWARhBDwIFAEawBIEKACNYgEAJgBHMQaAGwAhmECgCMIIpBKoAjOAQgTIAIyj4j0MDlzBGK5H+4xP1DTBRJIvAAI4WiSQCAzj+SiKHwABOnkpIITCA+eeSMggMYPGbCQkEBrD83WTzCAyg/3JCLoLXwL3+w/yfCgOIzT0XwTPgeexQp1tlAPF55yD4AlyPH+r0Kg0gbdY5CLpvPf+adrjVVxtA2oxzAFwGvqcdbvXVBhCfcU74H4Hu28+LuxlALJKc8Lsj+CQwNuciq3LD99vAImONPajc8Iv/okq/BPhScOypIFbV/DN/kqc3wEnZMuF3rRvAcQBS4RuAePgGcARA7pnvcwCH/28C6ucAss98bwD/byTSG0D+ma+8ARz+1LsftXMAhz9z4UsJgMOfcz1fBYDDX/BhjgIAh7/kk7zWATj8no9xWwbg8AOf4bcKwOEHwm/1UrDDD4bfIgCHnxB+awAcfmL4LQFw+APCbwWAwx8YfgsAHH5G+LUDcPiZ4dcMwOGPEH6tABz+SOHXCMDhjxh+bQAc/sjh1wTA4a8g/FoAOPwVhV8DAIe/wvBLB7AO7AMbA2dQ/JczDOxr1LuV/PsA28DmwG4dfnBwpQI4C/wO9jBb5vATBlcqgO61vwsy9ebwEydWKoA7wNvEXhx+4sBKPgm8APxK6MfhJwxrurTUDdA9xnfA7UBfDj8wpEUlJQN4ALzs6c3hZ4Rf8kvApK2HwO6CHveALeAgcwbSdy95A0yCOQ88Ba4A3dvDH4cniDvSyY3UfA0ARmrVP2beBAxA3IUBGID4BMTb9wYwAPEJiLfvDWAA4hMQb98bwADEJyDevjeAAYhPQLx9bwADEJ+AePveAAYgPgHx9r0BxAH8Bfq7EpCzC/67AAAAAElFTkSuQmCC",
	}

	// 按下
	let timer = 0
	const touchstart = () => {
		if (!props['touchCopy']) return
		timer = setTimeout(() => {
			// 设置剪切板内容
			uni.setClipboardData({
				data: props['customCopyValue'] || props['value'] || props['title'],
				success: function() {
					uni.vibrateShort({});
					uni.showToast({ title: '已复制内容', icon: 'none' })
				}
			});
		}, 1000)
	}

	// 松开
	const touchend = () => {
		timer && clearTimeout(timer)
	}

	// 点击
	const click = () => {
		emit('click')
	}
</script>
<style scoped>
	.zp-row-cell {
		position: relative;
		padding-left: 16px;
		padding-top: 7px;
		padding-bottom: 7px;
		box-sizing: border-box;
		width: 100%;
		min-height: 44px;
		background-color: #ffffff;
		transition: all 230ms ease-out;
		display: flex;
		align-items: stretch;
		gap: 16px;
	}

	.zp-row-cell-icon {
		flex-shrink: 0;
		width: 28px;
		height: 28px;
		transition: all 230ms ease-out;
	}

	.zp-row-cell-content {
		position: relative;
		padding-right: 16px;
		box-sizing: border-box;
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.zp-row-cell-slot {
		height: auto;
		max-height: none;
	}

	.zp-row-cell-content-border {
		position: absolute;
		left: 0;
		width: 100%;
		height: 1px;
		transform: scaleY(0.5);
		background-color: rgba(229, 228, 233, 1);
		z-index: 1;
		transition: all 230ms ease-out;
	}

	.zp-row-cell-content-border-top {
		top: -8px;
	}

	.zp-row-cell-content-border-bottom {
		bottom: -8px;
	}

	.zp-row-cell-title {
		width: fit-content;
		display: flex;
		align-items: center;
		overflow: hidden;
	}

	.zp-row-cell-title-text {
		box-sizing: border-box;
		padding: 6px 0;
		line-height: 1;
		word-break: break-all;
	}

	.zp-row-cell-value {
		flex: 1;
		color: #999999;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		overflow: hidden;
		word-break: break-all;
	}

	.zp-row-cell-value-text {
		margin-left: 10px;
		padding: 6px 0;
		box-sizing: border-box;
		line-height: 1;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}

	.zp-row-cell-arrow-right {
		margin-left: 10px;
		flex-shrink: 0;
		width: 14px;
		height: 14px;
		opacity: 0.3;
	}

	.hover-class {
		background-color: rgba(229, 228, 233, 1);
		box-shadow: 0 0 1px 1px rgba(229, 228, 233, 1);
		z-index: 9;
	}

	@media (prefers-color-scheme: dark) {
		.dark-filter-invert {
			filter: invert(1) hue-rotate(180deg);
		}

		.zp-row-cell {
			background-color: rgba(28, 28, 28, 1);
		}

		.zp-row-cell-content-border {
			background-color: rgba(55, 55, 57, 1);
		}

		.hover-class {
			background-color: rgba(55, 55, 57, 1);
			box-shadow: 0 0 1px 1px rgba(55, 55, 57, 1);
			z-index: 9;
		}
	}
</style>
