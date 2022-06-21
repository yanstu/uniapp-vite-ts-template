<template>
	<view v-if="visible" @touchmove.stop="()=>{}">
		<view class="zp-calendar-mask" :style="[Style_mask]" @click="close"></view>
		<view class="zp-calendar" :class="[{ 'backdrop-filter':blurEffect,'zp-calendar-show':modelValue }]">
			<view class="zp-calendar-menu">
				<view @click="close">取消</view>
				<view class="menu-title" @click="generateDays">{{ Title }}</view>
				<view :style="[{ 'color':color }]" @click="complete">完成</view>
			</view>
			<view class="zp-calendar-select" :class="[{ 'zp-calendar-select-disabled':options.showTime }]">
				<view class="select-icon select-icon-reverse" :class="[{ 'select-icon-disabled':Select_icon_disabled('year') }]" hover-class="select-icon-hover-class" hover-stay-time="100">
					<image class="select-icon-image" :src="icons['arrow-right-double']" @click="offsetDays(-12)">
					</image>
				</view>
				<view class="select-icon select-icon-reverse" :class="[{ 'select-icon-disabled':Select_icon_disabled('month') }]" hover-class="select-icon-hover-class" hover-stay-time="100">
					<image class="select-icon-image" :src="icons['arrow-right']" @click="offsetDays(-1)"></image>
				</view>
				<view class="select-title">{{ options.year_text }}年{{ options.month_text }}月{{ options.showTime_day_str }}</view>
				<view class="select-icon" hover-class="select-icon-hover-class" hover-stay-time="100">
					<image class="select-icon-image" :src="icons['arrow-right']" @click="offsetDays(+1)"></image>
				</view>
				<view class="select-icon" hover-class="select-icon-hover-class" hover-stay-time="100">
					<image class="select-icon-image" :src="icons['arrow-right-double']" @click="offsetDays(+12)"></image>
				</view>
			</view>
			<view class="zp-calendar-content" :class="[{ 'zp-calendar-content-show-time' : options.showTime }]">
				<view class="content-lables">
					<view class="content-lables-lable" v-for="(item,index) in options.lables_month" :key="index">{{ item }}</view>
					<view class="content-lables-span"></view>
					<view class="content-lables-lable" v-for="(item,index) in options.lables_time" :key="index">{{ item }}</view>
				</view>
				<view class="content-list">
					<view class="content-list-days" :class="[{ 'content-list-days-hide':options.showTime }]">
						<view class="content-list-days-bg">{{ options.month_text }}</view>
						<view class="content-list-days-day" v-for="(item,index) in options.days" :key="index">
							<view class="content-list-days-day-bgs">
								<view class="content-list-days-day-bgs-bg" :style="[Style_day(item,'left').style]"></view>
								<view class="content-list-days-day-bgs-bg" :style="[Style_day(item,'right').style]"></view>
							</view>
							<view v-if="item.currentMonth || onlyCurrentMonth===false" class="content-list-days-day-content" :class="[{ 'content-list-days-day-content-disabled':item.disabled }]"
								:style="[Style_day(item,'center').style]" @click="selectDate(item)">
								<view class="content-list-days-day-content-text"
									:class="[{ 'content-list-days-day-content-text-disabled':item.disabled,'content-list-days-day-content-text-hasTimeDisabled':item.hasTimeDisabled && !item.disabled }]">
									{{ item.day_text }}
								</view>
								<view class="content-list-days-day-content-tip-top">{{ Style_day(item,'center').top_tip }}</view>
								<view class="content-list-days-day-content-tip-bottom">{{ Style_day(item,'center').bottom_tip }}</view>
							</view>
						</view>
					</view>
					<view class="content-list-times">
						<picker-view v-if="options.times" @change="pickerChange" class="content-list-times-view" indicator-class="picker-view-indicator-class" mask-class="picker-view-mask-class"
							:value="options.select_times">
							<picker-view-column>
								<view v-if="options.times.h_list && options.times.h_list.length" class="content-list-times-view-time" v-for="(item,index) in options.times.h_list" :key="index">
									<view class="content-list-times-view-time-text" :class="[{ 'content-list-times-view-time-text-disabled':item.disabled }]">{{ item.text }}</view>
								</view>
							</picker-view-column>
							<picker-view-column>
								<view v-if="options.times.m_list && options.times.m_list.length" class="content-list-times-view-time" v-for="(item,index) in options.times.m_list" :key="index">
									<view class="content-list-times-view-time-text" :class="[{ 'content-list-times-view-time-text-disabled':item.disabled }]">{{ item.text }}</view>
								</view>
							</picker-view-column>
							<picker-view-column>
								<view v-if="options.times.s_list && options.times.s_list.length" class="content-list-times-view-time" v-for="(item,index) in options.times.s_list" :key="index">
									<view class="content-list-times-view-time-text" :class="[{ 'content-list-times-view-time-text-disabled':item.disabled }]">{{ item.text }}</view>
								</view>
							</picker-view-column>
						</picker-view>
						<view class="content-list-times-span"></view>
						<view class="content-list-times-mask" :class="[{ 'content-list-times-mask-show':options.showTime }]">
							<view class="content-list-times-mask-steps">
								<view class="content-list-times-mask-steps-step" hover-class="content-list-times-mask-steps-step-hover-class" hover-stay-time="100" :style="[Style_btn_color]"
									@click="selectTime('revious')">
									上一步</view>
								<view class="content-list-times-mask-steps-step" hover-class="content-list-times-mask-steps-step-hover-class" hover-stay-time="100" :style="[Style_btn_color]"
									@click="selectTime('next')">下一步
								</view>
							</view>
						</view>
						<view class="content-list-times-checked">
							<view class="content-list-times-checked-box" :style="[Style_box_color]"></view>
							<view class="content-list-times-checked-colon">:</view>
							<view class="content-list-times-checked-box" :style="[Style_box_color]"></view>
							<view class="content-list-times-checked-colon">:</view>
							<view class="content-list-times-checked-box" :style="[Style_box_color]"></view>
						</view>
					</view>
				</view>
			</view>
			<view class="safe-area-inset-bottom"></view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import tools from './tools.js'
	import { computed, watch, ref, nextTick } from 'vue'

	const emit = defineEmits(['update:modelValue', 'complete'])

	const props = defineProps({
		// 默认状态
		modelValue: {
			type: [Boolean],
			default: false
		},
		// 高斯模糊
		blurEffect: {
			type: [Boolean],
			default: true,
		},
		// 仅显示本月
		onlyCurrentMonth: {
			type: [Boolean],
			default: true,
		},
		// 模式 单选radio；多选multiple；区间单选interval-radio；区间多选interval-multiple
		mode: {
			type: [String],
			default: 'radio',
		},
		// 选择时间 h m s
		time: {
			type: [String],
			default: '',
		},
		// 禁用 [禁用后会显示] 但是不可选
		// 1、[选点],某一天不能选，某个时间点不能选
		// 2、[区间],某个时间区间不能选
		disabled: {
			type: [Array],
			default: [
				['2022-04-24 09:30:05'], // 选点
				['2022-04-06 00:00:00', '2022-04-07 23:59:59'], // 区间
				['2022-04-06 08:00:00', '2022-04-07 09:30:00'], // 区间
			]
		},
		// 时间可选项配置 [只显示可选项] 只能选择早上八点到晚上八点，并且中午两个小时休息不可选
		timeOptional: {
			type: [Array],
			default: []
		},
		// 主题颜色
		color: {
			type: [String],
			default: '#0097ff',
		},
		// 周末颜色
		weekendColor: {
			type: [String],
			default: '#ff9700',
		},
	})

	// 图标
	const icons = {
		'arrow-right': "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAABEZJREFUeF7t3b1uE1EQxfF/+kBBQwFCAlHwISFFFIgeIfEA8AD0FEg06VKlo+EF0ic9EgVNCkQBBUIEGhAIXgCeAC2KFcexvXP3rsO99xy3jLOeOT+P1+vErOGb9ATWpLt38xiAOAIDMADxCYi37w1gAOITEG/fG8AAxCcg3r43gAGIT0C8fW8AAxCfgHj73gAGID4B8fa9AQxAfALi7dewAa4Cj4FLwDngG/Ae2BHPbpT2SwfwBHixoNM9YAs4GGUSoj+kZAC3gA89uXwCHhnBcL0lA3gF3A+0ZgSBIS0qKRXAReBnQl9GkDCs6dJSAdwF3iT2ZASJA+vKSwVwDfg8oB8jSBxaqQDOAH8Se5mUG0HC4EoF0LWwDWwm9DJdagTBwZUMYB3YBzaCvcyWGUFgcCUD6B7+DWAXuBnoZV6JEfQMrnQARjBQfvRuNQAwgmiaA+pqAWAEA8KN3KUmAEYQSTSxpjYARpAYcF95jQCMoC/VhH+vFYARJIS8rLRmAEYwAoLaARhBJoIWABhBBoJWABjBQAQtATCCAQhaA2AEiQhaBGAECQhaBWAEQQQtAzCCAILWARhBDwIFAEawBIEKACNYgEAJgBHMQaAGwAhmECgCMIIpBKoAjOAQgTIAIyj4j0MDlzBGK5H+4xP1DTBRJIvAAI4WiSQCAzj+SiKHwABOnkpIITCA+eeSMggMYPGbCQkEBrD83WTzCAyg/3JCLoLXwL3+w/yfCgOIzT0XwTPgeexQp1tlAPF55yD4AlyPH+r0Kg0gbdY5CLpvPf+adrjVVxtA2oxzAFwGvqcdbvXVBhCfcU74H4Hu28+LuxlALJKc8Lsj+CQwNuciq3LD99vAImONPajc8Iv/okq/BPhScOypIFbV/DN/kqc3wEnZMuF3rRvAcQBS4RuAePgGcARA7pnvcwCH/28C6ucAss98bwD/byTSG0D+ma+8ARz+1LsftXMAhz9z4UsJgMOfcz1fBYDDX/BhjgIAh7/kk7zWATj8no9xWwbg8AOf4bcKwOEHwm/1UrDDD4bfIgCHnxB+awAcfmL4LQFw+APCbwWAwx8YfgsAHH5G+LUDcPiZ4dcMwOGPEH6tABz+SOHXCMDhjxh+bQAc/sjh1wTA4a8g/FoAOPwVhV8DAIe/wvBLB7AO7AMbA2dQ/JczDOxr1LuV/PsA28DmwG4dfnBwpQI4C/wO9jBb5vATBlcqgO61vwsy9ebwEydWKoA7wNvEXhx+4sBKPgm8APxK6MfhJwxrurTUDdA9xnfA7UBfDj8wpEUlJQN4ALzs6c3hZ4Rf8kvApK2HwO6CHveALeAgcwbSdy95A0yCOQ88Ba4A3dvDH4cniDvSyY3UfA0ARmrVP2beBAxA3IUBGID4BMTb9wYwAPEJiLfvDWAA4hMQb98bwADEJyDevjeAAYhPQLx9bwADEJ+AePveAAYgPgHx9r0BxAH8Bfq7EpCzC/67AAAAAElFTkSuQmCC",
		"arrow-right-double": "data:image/png;base64,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"
	}

	// 初始化
	let options = ref({
		lables_month: ['日', '一', '二', '三', '四', '五', '六'],
		lables_time: ['时', '分', '秒'],
		days: [], // 当前日历天集合
		times: [], // 可选时间
		select_dates: [], // 选中日期
		select_times: [0, 0, 0], // 选中时间
		showTime: false, // 是否显示选择时间
		showTime_day_str: '', // 选择哪一天的时间
	})
	const visible = ref(false)
	const init = async () => {
		// 后渲染
		await nextTick()
		// 生成日历
		generateDays()
		options.value.select_dates = []
		// generateDays('1971/10/29')
		visible.value = true

	}
	init()
	// 选择时间回调
	const pickerChange = (e) => {
		let select_times = e.detail.value
		let h_index = select_times[0]
		let m_index = select_times[1]
		let s_index = select_times[2]
		let old_h_index = options.value.select_times[0]
		let old_m_index = options.value.select_times[1]
		let old_s_index = options.value.select_times[2]
		options.value.select_times = [h_index, m_index, s_index]
		// 选择后 重新生成分钟和秒并且重置分钟和秒的index
		// 更改了h  重新生成m，s, 重置m，s的index为上一级
		if (h_index !== old_h_index) {
			m_index = 0
			s_index = 0
			generateTimes('m', options.value.times.h_list[h_index].text)
			options.value.select_times = [h_index, m_index, s_index]
			return
		}
		// 更改了m 重新生成s，重置s的index为上一级
		if (m_index !== old_m_index) {
			s_index = 0
			generateTimes('s', `${options.value.times.h_list[h_index].text}:${options.value.times.m_list[m_index].text}`)
			options.value.select_times = [h_index, m_index, s_index]
			return
		}
		// console.log(`------->日志输出options:`, options.value);

	}

	// 生成时间选择列表
	const generateTimes = async (mode = 'h', e = '00') => {
		const { year_text, month_text, showTime_day_str } = options.value
		// 当前选择的是哪一天的时间
		let day_str = `${year_text}/${month_text}/${showTime_day_str}`
		day_str = day_str.replace('日', '')
		// 是否被禁用
		const isDisabled = (day_timestamp = '') => {
			let _disabled = false // 默认不被禁用
			const timeOptional = props.timeOptional
			// 如果配置了可选项 默认为禁用
			if (timeOptional.length !== 0) {
				_disabled = true
			}
			// 遍历可选项
			for (let times of timeOptional) {
				let start_str = times[0]
				let end_str = times[1]
				if (mode === 'h') {
					start_str = `${start_str.slice(0,2)}:00:00`
					end_str = `${end_str.slice(0,2)}:00:00`
				}
				if (mode === 'm') {
					start_str = `${start_str.slice(0,5)}:00`
					end_str = `${end_str.slice(0,5)}:00`
				}
				let start_timestamp = new Date(`${day_str} ${start_str}`).getTime()
				let end_timestamp = new Date(`${day_str} ${end_str}`).getTime()
				// 开始
				if (start_timestamp <= day_timestamp && day_timestamp <= end_timestamp) {
					_disabled = false
					break
				}
			}
			// 查询禁用列表
			let disabled_timestamps = Disabled_timestamps.value
			for (let disabled_timestamp of disabled_timestamps) {
				// 时间点
				if (disabled_timestamp.length === 1 && mode === 's') {
					if (day_timestamp === disabled_timestamp[0]) {
						_disabled = true
						break
					}
				}
				// 时间段
				if (disabled_timestamp.length === 2) {
					let left_difference = day_timestamp - disabled_timestamp[0] // 当前时间距离左边的差值
					let right_difference = -(day_timestamp - disabled_timestamp[1]) // 当前时间距离右边的差值
					// 大于一小时
					// 小时 ['2022-04-23 11:04:23', '2022-04-23 13:24:05'], 则只有12:00:00被禁用
					if (mode === 'h' && disabled_timestamp[0] <= day_timestamp && day_timestamp + 1000 * 60 * 60 <= disabled_timestamp[1]) {
						_disabled = true
						break
					}
					// 分钟 ['2022-04-23 11:04:23', '2022-04-23 13:24:05'], 则只有11:04,13:24不会被禁用
					if (mode === 'm' && disabled_timestamp[0] <= day_timestamp && day_timestamp + 1000 * 60 <= disabled_timestamp[1]) {
						_disabled = true
						break
					}
					if (mode === 's' && disabled_timestamp[0] <= day_timestamp && day_timestamp <= disabled_timestamp[1]) {
						_disabled = true
						break
					}
				}
			}
			return _disabled
		}
		switch (mode) {
			// 生成小时
			case 'h': {
				let h_list = [{ text: '00', disabled: false }]
				if (['h', 'm', 's'].includes(props['time'])) {
					h_list = []
					for (let i = 0; i < 24; i++) {
						let text = i < 10 ? `0${i}` : `${i}`
						let str = `${day_str} ${text}:00:00`
						let timestamp = new Date(str).getTime()
						let disabled = isDisabled(timestamp) // 计算当前时间戳是否被禁用
						h_list.push({ text, disabled })
					}
					// 去掉两边的禁用的选项
					let start_index = h_list.findIndex(e => e.disabled === false)
					h_list = h_list.slice(start_index)
					h_list = h_list.reverse()
					let end_index = h_list.findIndex(e => e.disabled === false)
					h_list = h_list.slice(end_index)
					h_list = h_list.reverse()
				}
				options.value.times.h_list = h_list
				// console.log(`------->日志输出h_list:`, h_list);
				let h_str = h_list[0].text
				await generateTimes('m', h_str) // 通过小时生成分钟
				break;
			}
			case 'm': {
				// 生成分钟
				let m_list = [{ text: '00', disabled: false }]
				if (['m', 's'].includes(props['time'])) {
					// console.log(`------->日志输出生成分钟:`, e);
					m_list = []
					for (let i = 0; i < 60; i++) {
						let text = i < 10 ? `0${i}` : `${i}`
						let str = `${day_str} ${e}:${text}:00`
						let timestamp = new Date(str).getTime()
						let disabled = isDisabled(timestamp) // 计算当前时间戳是否被禁用
						m_list.push({ text, disabled })
					}
					// 去掉两边的禁用的选项
					let start_index = m_list.findIndex(e => e.disabled === false)
					m_list = m_list.slice(start_index)
					m_list = m_list.reverse()
					let end_index = m_list.findIndex(e => e.disabled === false)
					m_list = m_list.slice(end_index)
					m_list = m_list.reverse()
				}
				options.value.times.m_list = m_list
				// console.log(`------->日志输出m_list:`, m_list);
				let h_index = options.value.select_times[0]
				let m_str = `${options.value.times.h_list[h_index].text}:${m_list[0].text}`
				await generateTimes('s', m_str) // 通过分钟生成秒
				break;
			}
			// 生成秒
			case 's': {
				let s_list = [{ text: '00', disabled: false }]
				if (['s'].includes(props['time'])) {
					// console.log(`------->日志输出生成秒:`, e);
					s_list = []
					for (let i = 0; i < 60; i++) {
						let text = i < 10 ? `0${i}` : `${i}`
						let str = `${day_str} ${e}:${text}`
						let timestamp = new Date(str).getTime()
						let disabled = isDisabled(timestamp) // 计算当前时间戳是否被禁用
						s_list.push({ text, disabled })
					}
					// 去掉两边的禁用的选项
					let start_index = s_list.findIndex(e => e.disabled === false)
					s_list = s_list.slice(start_index)
					s_list = s_list.reverse()
					let end_index = s_list.findIndex(e => e.disabled === false)
					s_list = s_list.slice(end_index)
					s_list = s_list.reverse()
				}
				options.value.times.s_list = s_list
			}
		}
	}

	// 选择时间 上一步 下一步
	const selectTime = (mode = 'next') => {
		// 最后一个区间索引
		let end_index = options.value['select_dates'].length - 1
		// 获取最后一个区间
		let end_interval_date = options.value['select_dates'][end_index] || []
		// 上一步
		if (mode === 'revious') {
			// 删除上次选择的日期
			options.value['select_dates'][end_index].splice(end_interval_date.length - 1, 1)
		} else {
			// 把选择的时间添加到所选日期中
			let h = options.value.times.h_list[options.value.select_times[0]].text || '00'
			let m = options.value.times.m_list[options.value.select_times[1]].text || '00'
			let s = options.value.times.s_list[options.value.select_times[2]].text || '00'
			options.value['select_dates'][end_index][end_interval_date.length - 1]['day_time'] = `${h}:${m}:${s}`
		}
		options.value.showTime = false
		options.value.showTime_day_str = ''
		// console.log(`------->日志输出options.value:`, options.value);
	}

	// 选择日期
	const selectDate = async (e) => {
		// console.log(`------->日志输出e:`, e);
		// 判断所选区间是否包含禁用时间
		const hasDisabled = (day_timestamps = []) => {
			// console.log(`------->日志输出day_timestamp:`,day_timestamp);
			let has = false // 默认不包含
			let disabled_timestamps = Disabled_timestamps.value
			let start_timestamp = day_timestamps[0]
			let end_timestamp = day_timestamps[1]
			for (let disabled_timestamp of disabled_timestamps) {
				// 时间点
				if (disabled_timestamp.length === 1) {
					if (start_timestamp <= disabled_timestamp[0] && disabled_timestamp[0] <= end_timestamp) {
						has = true
						break
					}
				}
				// 时间段
				if (disabled_timestamp.length === 2) {
					//  开始时间 禁用开始 禁用结束 结束时间
					if (start_timestamp <= disabled_timestamp[0] && disabled_timestamp[1] <= end_timestamp) {
						has = true
						break
					}
				}
			}
			// console.log(`------->日志输出_disabled:`, _disabled);
			return has
		}
		switch (props.mode) {
			// 单选[[天]] 每次覆盖所选的结果
			case 'radio': {
				options.value['select_dates'] = [] // 清除之前所选结果
				options.value['select_dates'].push([e])
				break;
			}
			// 多选[[天],[天]]  每次添加所选结果
			case 'multiple': {
				options.value['select_dates'].push([e])
				break;
			}
			// 区间单选[[天-开始，天-结束]] 每次覆盖所选结果
			case 'interval-radio': {
				// 最后一个区间索引
				let end_index = 0
				// console.log(`------->日志输出end_index:`, end_index);
				// 获取最后一个区间
				let end_interval_date = options.value['select_dates'][end_index] || []
				// 如果一个都没选 先添加一个空集合
				if (end_interval_date.length === 0) {
					options.value['select_dates'][end_index] = [] // 清除之前所选结果
				}
				// 如果结束时间小于开始时间 覆盖为开始时间
				if (end_interval_date.length === 1 && end_interval_date[0].day_timestamp > e.day_timestamp) {
					options.value['select_dates'].splice(end_index, 1) // 删除该区间
					// 删除后重新模拟点击一次 并终止本次点击
					return selectDate(e)
				}
				// 关闭时间选择时 如果选择的区间中有被禁用项 覆盖为开始时间
				if (['h', 'm', 's'].includes(props['time']) === false && end_interval_date.length === 1 && hasDisabled([end_interval_date[0].day_timestamp, e.day_timestamp])) {
					options.value['select_dates'].splice(end_index, 1) // 删除该区间
					// 删除后重新模拟点击一次 并终止本次点击
					return selectDate(e)
				}
				// 如果已经选满了
				if (end_interval_date.length === 2) {
					options.value['select_dates'][end_index] = []
				}
				options.value['select_dates'][end_index].push(e)
				break;
			}
			// 区间多选[[天-开始，天-结束],[天-开始，天-结束]] 如果已经被选中先清除之前所选记录，再添加所选结果
			case 'interval-multiple': {
				// 最后一个区间索引
				let end_index = options.value['select_dates'].length - 1
				// 获取最后一个区间
				let end_interval_date = options.value['select_dates'][end_index] || []
				// 再次选择时 需要修正所选中区间集合
				if (end_index !== -1) {
					// 准备再次保存开始时间
					if (end_interval_date.length === 2) {
						let { select_dates = [] } = options.value
						for (let index = select_dates.length - 1; index >= 0; index--) {
							let select_date = select_dates[index]
							if (!select_date) continue
							let start_day = select_date[0] || null
							let end_day = select_date[1] || null
							if (!start_day || !end_day) continue
							// 当前选择的时间属于某个区间 则需要删除该区间
							if (start_day.day_timestamp <= e.day_timestamp && e.day_timestamp <= end_day.day_timestamp) {
								options.value['select_dates'].splice(index, 1) // 删除该区间
							}
						}
					}
					// 准备保存结束时间
					if (end_interval_date.length === 1) {
						// 如果结束时间小于开始时间 覆盖为开始时间
						if (end_interval_date[0].day_timestamp > e.day_timestamp) {
							options.value['select_dates'].splice(end_index, 1) // 删除该区间
							// 删除后重新模拟点击一次 并终止本次点击
							return selectDate(e)
						}
						// 只选择日期时 如果选择的区间中有被禁用项 覆盖为开始时间 开启选择时间时 全部可以选
						if (['h', 'm', 's'].includes(props['time']) === false && hasDisabled([end_interval_date[0].day_timestamp, e.day_timestamp])) {
							options.value['select_dates'].splice(end_index, 1) // 删除该区间
							// 删除后重新模拟点击一次 并终止本次点击
							return selectDate(e)
						}
						let { select_dates = [] } = options.value
						for (let index = select_dates.length - 1; index >= 0; index--) {
							let select_date = select_dates[index]
							if (!select_date) continue
							let start_day = select_date[0] || null
							let end_day = select_date[1] || null
							if (!start_day || !end_day) continue
							// 最后一个区间包含了其他区间 需要移除其他区间
							if (end_interval_date[0].day_timestamp <= start_day.day_timestamp && start_day.day_timestamp <= e.day_timestamp) {
								options.value['select_dates'].splice(index, 1) // 删除该区间
							}
						}

					}
				}
				// 如果一个都没选 先添加一个空区间
				if (end_index === -1) {
					options.value['select_dates'][0] = []
					end_index = 0
				}
				// 如果最后一个已经选满了新加一个空区间
				if (end_interval_date.length === 2) {
					options.value['select_dates'].push([])
				}
				end_index = options.value['select_dates'].length - 1 // 重新获取最新的index
				options.value['select_dates'][end_index].push(e)
				break;
			}
		}
		// 如果配置了需要选择时间
		if (['h', 'm', 's'].includes(props['time'])) {
			options.value.showTime_day_str = Number(e.day_text) < 9 ? `0${e.day_text}日` : `${e.day_text}日`
			options.value.showTime = true
			generateTimes()
			options.value.select_times = [0, 0, 0]
		}
	}

	// 把props['disabled']内所有数据转化为时间戳 方便后面对比计算
	const Disabled_timestamps = computed(() => {
		let { disabled = [] } = props
		let disabled_timestamps = JSON.parse(JSON.stringify(disabled))
		for (let i = 0; i < disabled_timestamps.length; i++) {
			let interval_disabled = disabled_timestamps[i] // 禁用区间
			for (let j = 0; j < interval_disabled.length; j++) {
				let time = interval_disabled[j]
				time = time.replace(/-/g, '/')
				// 把所有时间统一转换为时间戳
				let timestamp = new Date(time).getTime()
				disabled_timestamps[i][j] = timestamp // 禁用时间项
			}
		}
		// console.log(`------->日志输出disabled_timestamps:`, disabled_timestamps);
		return disabled_timestamps
	})

	// 传入天 生成本月数据
	const generateDays = (day = '') => {
		// 获取当前时间戳
		let now_timestamp = new Date().getTime()
		// let now_timestamp = new Date('2022/04/03').getTime()
		let now_str = tools.timeFormat(now_timestamp, 'yyyy/mm/dd')
		// 获取传入时间戳
		let day_timestamp = day ? new Date(`${day} 00:00:00`).getTime() : now_timestamp
		options.value.day_timestamp = day_timestamp // 保存生成点时间戳
		// 获取传入的时间戳月份
		options.value.year_text = tools.timeFormat(day_timestamp, 'yyyy') // 保存生成点年文字
		options.value.month_text = tools.timeFormat(day_timestamp, 'mm') // 保存生成点月文字
		// 当前月第一天
		let first_day_str = `${options.value.year_text}/${options.value.month_text}/01 00:00:00`
		let first_day_timestamp = new Date(first_day_str).getTime()
		// 生成当前月的所有天
		let days = []
		// 当前日期是否属于禁用区间内
		const isDisabled = (day_timestamp) => {
			// console.log(`------->日志输出day_timestamp:`,day_timestamp);
			let _disabled = false // 默认不被禁用
			let disabled_timestamps = Disabled_timestamps.value
			for (let disabled_timestamp of disabled_timestamps) {
				// 只能使用时间段来禁用 ['2022-04-19 00:00:00', '2022-04-19 23:59:59'] 表示 19号一整天被禁用
				if (disabled_timestamp.length === 2) {
					if (disabled_timestamp[0] <= day_timestamp && day_timestamp + 1000 * 60 * 60 * 24 - 1000 <= disabled_timestamp[1]) {
						_disabled = true
						break
					}
				}
			}
			// console.log(`------->日志输出_disabled:`, _disabled);
			return _disabled
		}
		// 判断当前日期内 全天是否有被禁用的时间
		const timeDisabled = (day_timestamp) => {
			let has = false // 默认没有
			// 遍历禁用列表
			let disabled_timestamps = Disabled_timestamps.value
			for (let disabled_timestamp of disabled_timestamps) {
				if (disabled_timestamp.length === 1) {
					if (day_timestamp <= disabled_timestamp[0] && disabled_timestamp[0] <= day_timestamp + 1000 * 60 * 60 * 24 - 1000) {
						has = true
						break
					}
				}
				if (disabled_timestamp.length === 2) {
					if (day_timestamp <= disabled_timestamp[0] && disabled_timestamp[0] <= day_timestamp + 1000 * 60 * 60 * 24 - 1000) {
						has = true
						break
					}
					if (day_timestamp <= disabled_timestamp[1] && disabled_timestamp[1] <= day_timestamp + 1000 * 60 * 60 * 24 - 1000) {
						has = true
						break
					}
				}
			}
			return has
		}
		for (let i = 0; i < 31; i++) {
			let day_timestamp = first_day_timestamp + (1000 * 60 * 60 * 24) * i // 时间戳
			let day_day = new Date(day_timestamp).getDay() // 周几
			let day_text = tools.timeFormat(day_timestamp, 'd') // 多少号
			let day_str = tools.timeFormat(day_timestamp, 'yyyy/mm/dd hh:MM:ss') // 完整时间字符串
			let isToday = now_str === day_str.split(' ')[0] // 是否为今天
			let disabled = isDisabled(day_timestamp) // 是否被禁用
			let hasTimeDisabled = timeDisabled(day_timestamp) // 是否有部分时间被禁用
			// console.log(`------->日志输出disabled:`, disabled);
			let day = { day_str, day_text, day_timestamp, day_day, currentMonth: true, isToday, disabled, hasTimeDisabled }
			// 判断是否为本月
			if (i < 28 || i < Number(day_text)) {
				days.push(day)
			}
		}
		// 判断当月第一天是否为周日
		let first_day = days[0]
		if (first_day.day_day !== 0) {
			for (let i = 1; i <= first_day.day_day; i++) {
				let day_timestamp = first_day.day_timestamp - (1000 * 60 * 60 * 24) * i // 时间戳
				let day_day = new Date(day_timestamp).getDay() // 周几
				let day_text = tools.timeFormat(day_timestamp, 'd') // 多少号
				let day_str = tools.timeFormat(day_timestamp, 'yyyy/mm/dd hh:MM:ss') // 完整时间字符串
				let isToday = now_str === day_str.split(' ')[0] // 是否为今天
				let disabled = isDisabled(day_timestamp) // 是否被禁用
				let day = { day_str, day_text, day_timestamp, day_day, currentMonth: false, isToday, disabled }
				days.unshift(day)
			}
		}
		// 判断当月最后一天是否为周六
		let end_day = days[days.length - 1]
		if (end_day.day_day !== 6) {
			for (let i = 1; i <= (6 - end_day.day_day); i++) {
				let day_timestamp = end_day.day_timestamp + (1000 * 60 * 60 * 24) * i // 时间戳
				let day_day = new Date(day_timestamp).getDay() // 周几
				let day_text = tools.timeFormat(day_timestamp, 'd') // 多少号
				let day_str = tools.timeFormat(day_timestamp, 'yyyy/mm/dd hh:MM:ss') // 完整时间字符串
				let isToday = now_str === day_str.split(' ')[0] // 是否为今天
				let disabled = isDisabled(day_timestamp) // 是否被禁用
				let day = { day_str, day_text, day_timestamp, day_day, currentMonth: false, isToday, disabled }
				days.push(day)
			}
		}
		options.value.days = days
		// console.log(`------->日志输出options.value:`, options.value.days);
	}

	// 切换月份 
	const offsetDays = (offset) => {
		// 获取当前月
		let months = Number(options.value['year_text']) * 12 + Number(options.value['month_text'])
		months = months + offset
		let m = parseInt(months % 12)
		if (m === 0) {
			m = 12
			months = months - 12
		}
		let y = parseInt(months / 12)
		// 最多选择1970年01/01
		if (y < 1970) return
		// console.log(`------->日志输出:`, `${y}/${m}/01`);
		generateDays(`${y}/${m}/01`)
	}

	// 关闭
	const close = () => {
		emit('update:modelValue', false)
		options.value.select_dates = []
		options.value.showTime = false
	}

	// 完成
	const complete = () => {
		const { select_dates } = options.value
		emit('complete', select_dates)
		close()
	}

	// 遮罩层样式
	const Style_mask = computed(() => {
		let style = { 'opacity': '0', 'width': '0' }
		if (props.modelValue) {
			style['opacity'] = '1'
			style['width'] = '100%'
		}
		return style
	})

	// 是否禁用日历选择
	const Select_icon_disabled = computed(() => {
		return function(type = '') {
			let active = false
			if (type === 'year' && options.value.year_text === '1970') {
				active = true
			}
			if (type === 'month' && options.value.year_text === '1970' && options.value.month_text === '01') {
				active = true
			}
			return active
		}
	})

	// 上方标题
	const Title = computed(() => {
		let str = '选择'
		let type = options.value.showTime ? '时间' : '日期'
		let position = ''
		// 区间
		if (props['mode'].includes('interval')) {
			// 最后一个区间索引
			let end_index = options.value['select_dates'].length - 1
			// 获取最后一个区间
			let end_interval_date = options.value['select_dates'][end_index] || []
			if ((end_interval_date.length !== 1 && !options.value.showTime) || (end_interval_date.length === 1 && options.value.showTime)) {
				position = '开始'
			}
			if ((end_interval_date.length === 1 && !options.value.showTime) || (end_interval_date.length === 2 && options.value.showTime)) {
				position = '结束'
			}
		}
		str = `${str}${position}${type}`
		return str
	})

	// 判断天类型
	const Is_type_day = computed(() => {
		return function(day) {
			let _type = ''
			// 便利所选列表判断
			let { select_dates = [] } = options.value
			for (let select_date of select_dates) {
				if (!select_date) continue
				let start_day = select_date[0] || null
				let end_day = select_date[1] || null
				// 选一天
				if (start_day && start_day.day_timestamp === day.day_timestamp) {
					_type = 'select'
				}
				// 开始和结束是同一天
				if (start_day && end_day && day.day_timestamp === start_day.day_timestamp && day.day_timestamp === end_day.day_timestamp) {
					_type = 'start-end'
					break
				}
				// 开始
				if (start_day && start_day.day_timestamp === day.day_timestamp && end_day && start_day.day_timestamp !== end_day.day_timestamp) {
					_type = 'start'
					break
				}
				// 结束
				if (end_day && end_day.day_timestamp === day.day_timestamp && start_day.day_timestamp !== end_day.day_timestamp) {
					_type = 'end'
					break
				}
				// 选中区间
				if (end_day && start_day.day_timestamp < day.day_timestamp && day.day_timestamp < end_day.day_timestamp) {
					_type = 'select-content'
					break
				}
			}
			return _type
		}
	})

	// 天的样式
	const secondaryColor = tools.hex2rgba(props['color'], 0.2) // 次要主题颜色
	const Style_day = computed(() => {
		return function(item, position = 'center') {
			let top_tip = '' //上方已选时间提示
			let bottom_tip = '' //下方文字提示
			let style = {}
			let type = Is_type_day.value(item)
			// console.log(`------->日志输出type:`, type);
			let color = props['color'] // 文字颜色
			let weekendColor = props['weekendColor'] // 周末文字颜色
			// 天
			if (position === 'center') {
				// 今天
				if (item.isToday) {
					bottom_tip = '今天'
					style = { color }
				}
				// 周末文字颜色
				if (item.day_day === 0 || item.day_day === 6) {
					style = { color: weekendColor }
				}
				// 如果不是当前月
				if (!item.currentMonth) {
					style = { color: 'rgba(128,128,128,1)' }
				}
				// 选中
				if (type === 'select') {
					bottom_tip = '已选'
					top_tip = item.day_time || ''
					style = { color: '#ffffff', 'background-color': color, 'box-shadow': '0 0 20px 5rpx rgba(0, 0, 0, 0.1)' }
				}
				// 开始-结束
				if (type === 'start-end') {
					bottom_tip = '开始-结束'
					style = { color: '#ffffff', 'background-color': color, 'box-shadow': '0 0 20px 5rpx rgba(0, 0, 0, 0.1)' }
				}
				// 开始
				if (type === 'start') {
					top_tip = item.day_time || ''
					bottom_tip = '开始'
					style = { color: '#ffffff', 'background-color': color, 'box-shadow': '0 0 20px 5rpx rgba(0, 0, 0, 0.1)' }
				}
				// 结束
				if (type === 'end') {
					top_tip = item.day_time || ''
					bottom_tip = '结束'
					style = { color: '#ffffff', 'background-color': color, 'box-shadow': '0 0 20px 5rpx rgba(0, 0, 0, 0.1)' }
				}
				// 区间
				if (type === 'select-content') {
					style = { color: color }
				}
			}
			// 天 左背景
			if (position === 'left') {
				// 结束
				if (type === 'end' && item.day_day !== 0) {
					style = { 'background-color': color }
				}
				// 区间-左侧周末
				if (type === 'select-content' && item.day_day === 0) {
					style = { 'background-color': color, 'border-radius': '8rpx 0 0 8rpx', 'margin-left': '10rpx' }
				}
				// 区间-右侧周末
				if (type === 'select-content' && item.day_day === 6) {
					style = { 'background-color': color }
				}
				// 区间-不包括两侧周末
				if (type === 'select-content' && item.day_day !== 6 && item.day_day !== 0 && position) {
					style = { 'background-color': color }
				}
			}
			// 天 右背景
			if (position === 'right') {
				// 开始
				if (type === 'start' && item.day_day !== 6) {
					style = { 'background-color': color }
				}
				// 区间-左侧周末
				if (type === 'select-content' && item.day_day === 0) {
					style = { 'background-color': color }
				}
				// 区间-右侧周末
				if (type === 'select-content' && item.day_day === 6) {
					style = { 'background-color': color, 'border-radius': ' 0 8rpx 8rpx 0', 'margin-right': '10rpx' }
				}
				// 区间-不包括两侧周末
				if (type === 'select-content' && item.day_day !== 6 && item.day_day !== 0 && position) {
					style = { 'background-color': color }
				}
			}
			return { style, bottom_tip, top_tip }
		}
	})

	// 显示选择时间的样式
	const Style_box_color = computed(() => {
		let style = { 'border-color': props['color'] }
		return style
	})

	// 颜色样式
	const Style_btn_color = computed(() => {
		let style = { 'color': props['color'], 'background-color': secondaryColor }
		return style
	})
</script>

<style scoped>
	.zp-calendar-mask {
		position: fixed;
		left: 0;
		top: 0;
		width: 100vw;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.4);
		z-index: 100;
		transition: opacity 230ms ease-out;
	}

	.zp-calendar {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100vw;
		z-index: 101;
		background-color: rgba(249, 249, 249, 0.9);
		font-size: 16px;
		transform: translateY(100%);
		transition: transform 230ms ease-out;
	}

	.zp-calendar-show {
		transform: translateY(0);
		box-shadow: 0px -20px 40px 10px rgba(128, 128, 128, 0.1);
	}

	.zp-calendar-menu {
		padding-left: 8px;
		padding-right: 8px;
		height: 100rpx;
		max-height: 100px;
		width: 750rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.menu-title {
		font-weight: bold;
	}

	.zp-calendar-select {
		padding-left: 8px;
		padding-right: 8px;
		width: 750rpx;
		height: 100rpx;
		max-height: 100px;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.zp-calendar-select-disabled {
		opacity: 0.3;
		pointer-events: none;
	}

	.select-title {
		width: 300rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.select-icon {
		margin-left: 10rpx;
		padding: 16rpx;
		width: 64rpx;
		max-width: 64px;
		height: 64rpx;
		max-height: 64px;
		border-radius: 8rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0.8;
		transition: all 230ms ease-out;
	}

	.select-icon-hover-class {
		background-color: rgba(128, 128, 128, 0.5);
		opacity: 0.5;
	}

	.select-icon-disabled {
		opacity: 0.3;
		pointer-events: none;
	}

	.select-icon-reverse {
		transform: rotateZ(180deg);
	}

	.select-icon-image {
		width: 100%;
		height: 100%;
	}

	.zp-calendar-content {
		padding-left: 25rpx;
		padding-right: 25rpx;
		box-sizing: border-box;
		width: 750rpx;
		transition: all 230ms ease-out;
		transform: translateX(0);
	}

	.zp-calendar-content-show-time {
		transform: translateX(-425rpx);
	}

	.content-lables {
		display: flex;
		flex-wrap: nowrap;
	}

	.content-lables-lable {
		flex-shrink: 0;
		width: 100rpx;
		height: 80rpx;
		color: #333333;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.content-lables-span {
		flex-shrink: 0;
		width: 150rpx;
		height: 80rpx;
	}

	.content-list {
		height: 600rpx;
		display: flex;
		flex-wrap: nowrap;
	}

	.content-list-days {
		flex-shrink: 0;
		width: 700rpx;
		display: flex;
		flex-wrap: wrap;
		align-content: flex-start;
	}

	.content-list-days-hide {
		opacity: 0.5;
		filter: blur(20px);
	}

	.content-list-days-day {
		position: relative;
		padding-top: 10rpx;
		padding-bottom: 10rpx;
		box-sizing: border-box;
		width: 100rpx;
	}

	.content-list-days-bg {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		top: 0;
		margin: auto;
		width: 600rpx;
		height: 260rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		color: rgba(128, 128, 128, 1);
		font-weight: bolder;
		font-size: 260rpx;
		z-index: 1;
		opacity: 0.1;
		pointer-events: none;
	}

	.content-list-days-day-bgs {
		padding-left: 0;
		padding-right: 0;
		box-sizing: border-box;
		width: 100rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.content-list-days-day-bgs-bg {
		position: relative;
		box-sizing: border-box;
		width: 50rpx;
		height: 80rpx;
		z-index: 1;
		pointer-events: none;
		opacity: 0.2;
	}

	.content-list-days-day-content {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		margin: auto;
		width: 80rpx;
		height: 80rpx;
		border-radius: 8rpx;
		z-index: 2;
		display: flex;
		align-items: center;
		justify-content: center;
		/* transition: all 230ms ease-out; */
	}

	.content-list-days-day-content-disabled {
		pointer-events: none;
	}

	.content-list-days-day-content-disabled::before {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		margin: auto;
		width: 40%;
		height: 2rpx;
		background-color: rgba(255, 0, 0, 1);
		transform: rotate(-20deg);
	}

	.content-list-days-day-content-text {
		position: relative;
	}

	.content-list-days-day-content-text-disabled {
		opacity: 0.3;
		pointer-events: none;
	}

	.content-list-days-day-content-text-hasTimeDisabled::before {
		content: '!';
		color: rgba(255, 170, 0, 1.0);
	}

	.content-list-days-day-content-tip-top {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		padding-bottom: 7px;
		box-sizing: border-box;
		width: 100%;
		height: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: calc(1vmax - 3px);
		pointer-events: none;
	}

	.content-list-days-day-content-tip-bottom {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		padding-top: 7px;
		box-sizing: border-box;
		width: 100%;
		height: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: calc(1vmax - 2px);
		pointer-events: none;
	}

	.content-list-times {
		position: relative;
		flex-shrink: 0;
		padding-left: 150rpx;
		width: 450rpx;
		height: 500rpx;
		box-sizing: border-box;
	}

	.content-list-times-view {
		height: 500rpx;
	}

	.content-list-times-view-time {
		position: relative;
		width: 100rpx;
		height: 100rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.content-list-times-view-time-text-disabled::before {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		margin: auto;
		width: 40%;
		height: 2rpx;
		background-color: rgba(255, 0, 0, 1);
	}

	.content-list-times-checked {
		position: absolute;
		top: 0;
		bottom: 0;
		margin: auto;
		width: 300rpx;
		height: 100rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;
	}

	.content-list-times-checked-box {
		position: relative;
		margin: auto;
		box-sizing: border-box;
		width: 80rpx;
		max-width: 80px;
		height: 80rpx;
		max-height: 80px;
		border: 4rpx solid;
		border-radius: 16rpx;
		transform: scale(0.8);
		background-color: #ffffff;
		opacity: 0.3;
		box-shadow: 0 0 20px 20px rgba(0, 0, 0, 0.1);
		z-index: -1;
	}

	.content-list-times-checked-colon {
		width: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #000000;
	}

	.content-list-times-span {
		position: absolute;
		left: 74rpx;
		top: 0;
		height: 500rpx;
		background-color: rgba(128, 128, 128, 0.1);
		width: 2rpx;
	}

	.content-list-times-mask {
		position: absolute;
		left: -300rpx;
		top: 0;
		width: 300rpx;
		height: 100%;
		transition: all 230ms ease-out;
		pointer-events: none;
		opacity: 0;
	}

	.content-list-times-mask-show {
		pointer-events: auto;
		opacity: 1;
	}

	.content-list-times-mask-steps {
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.content-list-times-mask-steps-step {
		margin: 10rpx;
		box-sizing: border-box;
		width: 160rpx;
		height: 80rpx;
		max-height: 80px;
		background-color: #ffffff;
		border: 2rpx solid;
		border-radius: 16rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 0 20px 20px rgba(0, 0, 0, 0.05);
		transform: scale(0.9);
		z-index: 9;
	}

	.content-list-times-mask-steps-step-hover-class {
		background-color: rgba(128, 128, 128, 0.5);
		opacity: 0.5;
	}

	/deep/ .picker-view-indicator-class {
		position: relative;
		height: 100rpx;
		border-radius: 16rpx;
		box-sizing: border-box;
	}

	/deep/ .picker-view-mask-class {
		/* background-color: 'none'; */
		background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0));
	}

	@media (prefers-color-scheme: dark) {
		.zp-calendar {
			/* filter: invert(1) hue-rotate(180deg); */
			transition: all 230ms ease-out;
			color: #ffffff;
			background-color: rgba(9, 9, 9, 0.9);
		}

		.zp-calendar-select {
			filter: invert(1) hue-rotate(180deg);
		}

		.content-list-days-bg {
			opacity: 0.2;
		}

		.content-list-times-checked-colon {
			color: #ffffff;
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
