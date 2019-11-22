/**
 * 通用工具
 */

/**
 * 防抖 debounce
 * @description 只要一直调用, callback 将不会被触发
 *              在一次调用结束后, 只有等待 cd(timeout) 时间, 才能继续调用 callback
 *              immediate 决定触发时机
 *              如：输入框校验
 * @param {Function} callback
 * @param {number} timeout
 * @param {boolean} immediate
 * @return {*}
 */
function debounce(
    callback: Function,
    timeout: number,
    immediate: boolean
): Function {
    let timer: number
    return function() {
        const context = this // 持有执行上下文
        const args = arguments // 记录传参
        const later = function() {
            timer = null // cd 过了，重振旗鼓，重置为初始状态
            if (!immediate) callback.apply(context, args) // 设置为尾部调用才延时触发
        }
        const callNow = immediate && !timer // 如果确认允许首部调用，且首次调用，那么本次立即触发
        clearTimeout(timer) // 杀掉上次的计时器，重新计时
        timer = setTimeout(later, timeout) // 重启一个计时器，过了 cd 之后才触发
        callNow && callback.apply(context, args) // 设置为首部调用立即触发
    }
}

/**
 * Format time
 *
 * @param {string} fmt format time type
 *
 * Usage:
 * Date.prototype.Format = timeFormat
 * new Date().Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 */
function timeFormat(fmt: string = 'yyyy-MM-dd hh:mm:ss.S'): string {
    let time = fmt
    const rules = {
        'M+': this.getMonth() + 1,
        'd+': this.getDate(),
        'h+': this.getHours(),
        'm+': this.getMinutes(),
        's+': this.getSeconds(),
        'q+': Math.floor((this.getMonth() + 3) / 3),
        S: this.getMilliseconds()
    }
    if (/(y+)/.test(time)) {
        time = time.replace(
            RegExp.$1,
            String(this.getFullYear()).substr(4 - RegExp.$1.length)
        )
    }

    Object.keys(rules).forEach(k => {
        if (new RegExp(`(${k})`).test(time)) {
            time = time.replace(
                RegExp.$1,
                RegExp.$1.length === 1
                    ? rules[k]
                    : `00${rules[k]}`.substr(String(rules[k]).length)
            )
        }
    })

    return time
}

/**
 * 获取url参数
 *
 * @param    {string}  variable  参数
 * @param    {string}  url       不传默认使用当前网页网址
 *
 * @usage
 * http://www.test.com/index?id=1&image=awesome.jpg
 * getQueryVariable("id") 返回 1
 * getQueryVariable("image") 返回 "awesome.jpg"
 * getQueryVariable() 返回 {id:'1', image:'awesome.jpg'}
 *
 */
function getUrlParam(variable: string, url: string): object | string {
    const query: string = url || window.location.search.substring(1)
    const vars: Array<string> = query.split('&')
    const params: object = {}
    for (let i = 0; i < vars.length; i += 1) {
        const [key, value]: string[] = vars[i].split('=')
        params[key] = value
        if (key === variable) {
            return value
        }
    }
    if (variable) return ''
    return params
}

export { debounce, timeFormat, getUrlParam }
