<template>
	<view>
		<view class="zp-card">
			<template v-if="$slots['title']">
				<slot name="title"></slot>
			</template>
			<view v-else-if="titleGap" class="zp-card-title">
				<view v-if="title" class="zp-card-title-text">{{ title }}</view>
			</view>
			<view class="zp-card-content">
				<slot></slot>
			</view>
			<template v-if="$slots['tip']">
				<slot name="tip"></slot>
			</template>
			<view v-else class="zp-card-tip">
				<view v-if="tip" class="zp-card-tip-text">{{ tip }}</view>
			</view>
		</view>
	</view>
</template>
<script lang="ts" setup>
	const emit = defineEmits(['click'])
	const props = defineProps({
		// 图标
		icon: {
			type: [String],
			default: ''
		},
		// 标题
		title: {
			type: [String],
			default: ''
		},
		// 标题间距
		titleGap: {
			type: [Boolean],
			default: true
		},
		// 提示
		tip: {
			type: [String],
			default: ''
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
</script>
<style scoped>
	.zp-card {
		position: relative;
	}

	.zp-card-title {
		padding: 0 16px;
		padding-top: 16px;
		box-sizing: border-box;
		min-height: 32px;
		color: #939297;
	}

	.zp-card-title-text {
		padding-top: 8px;
		padding-bottom: 8px;
		box-sizing: border-box;
		min-height: 32px;
		line-height: 16px;
		font-size: 12px;
	}

	.zp-card-content {
		border-radius: 12px;
		overflow: hidden;
	}

	.zp-card-tip {
		padding: 0 16px;
		box-sizing: border-box;
		color: #939297;
	}

	.zp-card-tip-text {
		padding-top: 8px;
		padding-bottom: 8px;
		box-sizing: border-box;
		min-height: 32px;
		line-height: 16px;
		font-size: 12px;
	}

	@media (prefers-color-scheme: dark) {
		.zp-card-title-text {
			/* height: 30px; */
		}

		.zp-card-tip-text {
			/* height: 30px; */
		}
	}
</style>
