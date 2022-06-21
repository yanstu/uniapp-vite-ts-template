<template>
	<view @click.stop="()=>{}" @touchmove.stop="()=>{}">
		<view class="zp-switch" :class="[{ 'zp-switch-active':modelValue },{ 'zp-switch-disabled':disabled}]" @click="change">
			<view class="zp-switch-left-span"></view>
			<view class="zp-switch-round" hover-class="hover-class" hover-stay-time="100"></view>
			<view class="zp-switch-right-span"></view>
		</view>
	</view>
</template>
<script lang="ts" setup>
	const emit = defineEmits(['update:modelValue', 'change'])
	const props = defineProps({
		// 默认状态
		modelValue: {
			type: [Boolean],
			default: false
		},
		// 禁用
		disabled: {
			type: [Boolean],
			default: false
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

	const change = () => {
		uni.vibrateShort({});
		emit('update:modelValue', !props['modelValue'])
	}
</script>
<style scoped>
	.zp-switch {
		position: relative;
		padding: 2px;
		box-sizing: border-box;
		width: 50px;
		height: 30px;
		border-radius: 16px;
		overflow: hidden;
		background-color: #E9E9E9;
		transition: all 230ms ease-out;
		display: flex;
		align-items: center;
	}

	.zp-switch-active {
		background-color: #65C468;
	}

	.zp-switch-left-span {
		flex: 0;
		transition: all 230ms ease-out;
	}

	.zp-switch-right-span {
		flex: 1;
		transition: all 230ms ease-out;
	}

	.zp-switch-round {
		position: relative;
		left: 0;
		width: 26px;
		height: 26px;
		border-radius: 13px;
		background-color: #ffffff;
		transition: all 230ms ease;
	}

	.zp-switch-active .zp-switch-left-span {
		flex: 1;
	}

	.zp-switch-active .zp-switch-right-span {
		flex: 0;
	}

	.hover-class {
		width: 75%;
	}

	@media (prefers-color-scheme: dark) {
		.zp-switch {
			background-color: #36363A;
		}

		.zp-switch-active {
			background-color: #65C468;
		}
	}

	.zp-switch-disabled {
		pointer-events: none;
		opacity: 0.5;
	}
</style>
