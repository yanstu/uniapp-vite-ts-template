<template>
	<view>
		<view class="zp-verification-code" @click="start">{{ Text }}</view>
	</view>
</template>

<script lang="ts" setup>
	import { ref, computed, onBeforeUnmount } from 'vue'
	const emit = defineEmits(['update:modelValue'])
	const props = defineProps({
		// 默认状态
		modelValue: {
			type: [Boolean],
			default: true
		},
		// 唯一标识
		key: {
			type: [String],
			default: 'zp-verification-code'
		},
		text: {
			type: [String],
			default: '获取验证码'
		},
		contentText: {
			type: [String],
			default: '重新获取$s'
		},
		endText: {
			type: [String],
			default: '再次获取'
		},
		// 获取验证码执行的方法
		getCode: {
			type: [Function],
			default: () => {}
		},
		// 间隔时间
		interval: {
			type: [Number, String],
			default: 60
		},
		// 自定义样式
		customStyle: {
			type: [Object],
			default: {}
		}
	})

	const time = ref(-1)
	let timer = 0
	const setTimer = (interval) => {
		if (interval <= 0) return
		emit('update:modelValue', false)
		time.value = interval

		timer = setInterval(() => {
			time.value -= 1
			// console.log(`------->日志输出time.value:`, time.value);
			if (time.value === 0) {
				emit('update:modelValue', true)
				return clearInterval(timer)
			}
		}, 1000)
		let end_time = new Date().getTime() + 1000 * time.value
		uni.setStorageSync(`zp-verification-code-${props['key']}`, end_time) // 保存结束时间戳到本地
	}
	
	onBeforeUnmount(() => {
		timer && clearInterval(timer)
	})
	
	// 获取验证码
	const start = async () => {
		if (time.value > 0) return
		try {
			const getCode = props['getCode']
			await getCode()
		} catch (e) {
			emit('update:modelValue', true)
			return
		}
		setTimer(props['interval'])
	}

	const init = async () => {
		// 获取code
		let end_time = uni.getStorageSync(`zp-verification-code-${props['key']}`)
		if (end_time) {
			let now = new Date().getTime()
			let _time = parseInt((end_time - now) / 1000)
			_time = Math.max(-1, _time)
			setTimer(_time)
		}
	}
	init()

	const Text = computed(() => {
		let str = props['text']
		if (time.value > 0) {
			str = props['contentText']
		}
		if (time.value === 0) {
			str = props['endText']
		}
		str = str.replace('$', time.value)
		return str
	})
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

	.zp-switch:active .zp-switch-round {
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
