<template>
	<view>
		<view class="zp-input">
			<template v-if="type==='textarea'">
				<textarea class="zp-input-content" style="height: 90px;padding-bottom: 10px;" :disable-default-padding="true" :value="input_val" :show-confirm-bar="false" :maxlength="maxlength"
					:pattern="pattern" confirm-type="done" :placeholder="placeholder" :hold-keyboard="holdKeyboard" :focus="focus" @input="input" @confirm="confirm"></textarea>
				<view v-if="type==='textarea'" class="zp-input-length">
					<view>
						<text>{{ input_val.length }}</text>
						<text>/{{ maxlength }}</text>
					</view>
				</view>
			</template>
			<template v-else-if="type">
				<input class="zp-input-content" :value="input_val" :type="type" :maxlength="maxlength" :pattern="pattern" :placeholder="placeholder" :hold-keyboard="holdKeyboard" :focus="focus"
					@input="input" @confirm="confirm">
				<view v-if="input_val" class="zp-input-clear" @click="clear">
					<view class="zp-input-clear-icon">
						<image class="zp-input-clear-icon-image" :src="icons['cross']" mode=""></image>
					</view>
				</view>
			</template>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import { computed, watch, ref, nextTick } from 'vue'

	const emit = defineEmits(['update:modelValue', 'confirm'])

	const props = defineProps({
		// 默认状态
		modelValue: {
			type: [String],
			default: ''
		},
		// 聚焦
		'hold-keyboard': {
			type: [Boolean],
			default: true
		},
		// 聚焦
		focus: {
			type: [Boolean],
			default: false
		},
		// 最大输入长度
		maxlength: {
			type: [Number],
			default: 200
		},
		// 输入框为空时占位符
		placeholder: {
			type: [String],
			default: '请输入内容'
		},
		// input 的类型
		type: {
			type: [String],
			default: ''
		},
		// 规则
		pattern: {
			type: [String, Array],
			default: ''
		},
	})

	const icons = {
		'cross': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAABg5JREFUeF7tnb9uFUsMxj+3PApXCBAFQqKAl6CiouCPKBG0QAvU/JPoqO5LQEEJilLAo9Aazb27SohOzu6esWdsj6dJpN2dsb/vt945ziYh5BhaARo6+0weCcDgECQACcDgCgyeflaABGBwBQZPPytAAjC4AoOnnxUgARhcgcHTzwqQAAyuwODpZwVIAAZXYPD0swIkAIMrMHj6KhWAmS8DuAHgEoCLAH4A+AXgiIiOBtd8b/rMfBXA9R3aHRNR0VF0iAPAzA8BvDsnyt8AXgN4RUTl+xyTAsx8AcAzAE8BlO93jY9E9EBSNFEAmJlXBleqwF0iKlVh+MHMpUp+BlDu/sVBRGK+iU3EzB8A3F+M/uSEnwDujA7BZP6/AP7ZoN0jInq/4fxzTxUBgJmvAfh+QEBDQ3Cg+bPMV4jo+ADN/7pECoB7AD4dGMyQEFSaX6QWqQJSALwB8ORAAMplQ0EgYH7R7C0RPa7Q/L9LpQD4AuBWZTBDQCBkfpH6KxHdrtRcDIDaCjDnERoCQfPNVYCaPcBZiENCIGy+uT1A+fz6bU8DY2ulCgWBgvmliXZToqsqsgco7jLzCwDPtzq95/wQECiYXyR7SURF7+ohCUBpX5YqsKqbtTJy1xAomV+6qOXuF2mliwEwVYHS0tza1VpiwSUESuaLayEKQELwP8tezBfrA5y9hT0JsFR+th73lrt4BZgF8ybEVqN3ne8xZzUAvJXCWgA8mq/2CDgtpldhtgDhOUfVCjDC48Cz+U0qQGQIvJvfFIBoe4II5jcHIAoEUczvAoB3CCKZ3w0ArxBEM78rAN4giGh+dwC8QBDVfBMAWIcgsvlmALAKQXTzTQFgDYIRzDcHgBUIRjHfJAC9IRjJfLMA9IJgNPNNA9AaghHNNw9AKwhGNd8FANoQTD+uHvZN5iYvhMzvBNR8VbxLS1hb/jjDUhrir24vLVhz3A0AipWgRr+z17oy380j4LTKSpVAAgJ35rsEwGglcGm+WwCMQeDWfNcAGIHAtfnuAegMgXvzQwDQCYIQ5ocBoDEEYcwPBUAjCEKZHw4AZQjCmZ8AbGv/JADb9Gp/doMuYTgIXP0sYB9SDcyflw8FQQgAGpofDgL3AHQwPxQErgHoaH4YCNwCYMD8EBC4BMCQ+e4hcAeAQfNdQ+AKAMPmu4XADQBK5pfP9GXkS6Ht+3brV1Q0/84URb4Wvt6Otmdqmj//z8IWa7RVbf1qph8BLY1pudZ6e/TPNAtAD0N6rKlv8f4VTALQ04iea/eAwRwAFgywEEMrGEwBYEl4S7FowmAGAIuCW4xJGgYTAFgW2nJsEjB0B8CDwB5iPBSGrgB4EtZTrFtg6AaAR0E9xrwEQxcAPAvpOfZdMDQHIIKAEXKYYWgKQCThouTSDIAogp0uoxFyagJABKHO20x5z00dAO8CLe2iy3HPOaoC4FmYNcZHeByoATCS+TMIHnNWAcCjEFvv+Ch7AnEARjbfYyUQBSDNP6kLXrQQA4CZLwD4BuCqVDkF4Pp38ZUgOAJwk4h+S+gsCcALAM8lgprmcG2+8uPgJREVvauHCADMXO76cveXKiAxQpivCEG5+0sVKNWgakgBcA/Ap6pITi4OZb4iBI+I6H2t5lIAvAHwpDYY78/8pfyF9wRviejx0ppLx6UA+ALg1tJiC8dD3vlncxaE4CsR3a7UHFIA1FaAIcwXfhyYqgA1e4ChzBeEwNQe4BqA7weUoyHNF4LgChEdH6D5X5eIPALKjMz8AcD9DQENbX4lBCJ3f4lBDIAJAl4JQPn8enf+/fyV14Q9bdoYfl7bRSUiMd/EJjpF9EMA785xqzQwXgN4JdXKjELF1Ep/BuDpnobaRyJ6IJmzOABTJbgM4AaASwAuAvgB4BeAI4nulaQA1uaauqrXd2h3TERFR9GhAoBohDmZqgIJgKq89idPAOx7pBphAqAqr/3JEwD7HqlGmACoymt/8gTAvkeqESYAqvLanzwBsO+RaoQJgKq89idPAOx7pBphAqAqr/3JEwD7HqlGmACoymt/8gTAvkeqESYAqvLanzwBsO+RaoR/ABLrzq7AvwdwAAAAAElFTkSuQmCC'
	}

	const input_val = ref('')
	input_val.value = props['modelValue']

	// 清除
	const clear = () => {
		input_val.value = ''
	}

	// 修改外层v-model的值
	const input = (e) => {
		emit('update:modelValue', e.detail.value)
	}

	// 完成
	const confirm = () => {
		emit('confirm', input_val.value)
	}
</script>

<style scoped>
	.zp-input {
		position: relative;
		width: 100%;
		display: flex;
		align-items: center;
	}

	.zp-input-content {
		flex: 1;
		word-wrap: break-all;
	}

	.zp-input-clear {
		padding-left: 8px;
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.zp-input-length {
		position: absolute;
		bottom: 0;
		right: 0;
		height: 20px;
		font-size: 10px;
		color: #999999;
		width: fit-content;
		display: flex;
		justify-content: flex-end;
	}

	.zp-input-clear-icon {
		box-sizing: border-box;
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background-color: #C9C9C9;
		display: flex;
		align-items: center;
		justify-content: center;
		line-height: 1;
		transition: all 230ms ease-out;
	}

	.zp-input-clear-icon-image {
		width: 10px;
		height: 10px;
		transition: all 230ms ease-out;
	}

	@media (prefers-color-scheme: dark) {
		.zp-input-clear-icon {
			background-color: #4B4B4B;
		}

		.zp-input-clear-icon-image {
			filter: invert(1) hue-rotate(180deg);
		}
	}
</style>
