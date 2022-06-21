// 颜色转rgba
const hex2rgba = (hex = '', opacity) => {
	if (hex.length !== 7) return hex
	return "rgba(" + parseInt("0x" + hex.slice(1, 3)) + "," + parseInt("0x" + hex.slice(3, 5)) + "," + parseInt("0x" + hex.slice(5, 7)) + "," + (opacity || "1") + ")";
}

// 格式化时间
const timeFormat = (dateTime = null, fmt = 'yyyy-mm-dd') => {
	if (!dateTime) dateTime = Number(new Date()) // 如果为null,则格式化当前时间
	// 如果dateTime长度为10或者13，则为秒和毫秒的时间戳，如果超过13位，则为其他的时间格式
	// if (dateTime.toString().length == 10) dateTime *= 1000;
	let date = new Date(Number(dateTime))
	let ret
	let opt = {
		'y+': date.getFullYear().toString(), // 年
		'm+': (date.getMonth() + 1).toString(), // 月
		'd+': date.getDate().toString(), // 日
		'h+': date.getHours().toString(), // 时
		'M+': date.getMinutes().toString(), // 分
		's+': date.getSeconds().toString() // 秒
		// 有其他格式化字符需求可以继续添加，必须转化成字符串
	}
	for (let k in opt) {
		ret = new RegExp('(' + k + ')').exec(fmt)
		if (ret) {
			fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')))
		};
	}
	return fmt
}
export default { hex2rgba, timeFormat }
