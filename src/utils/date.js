import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

/**
 * 格式化日期
 */
export function formatDate(date, format = 'YYYY-MM-DD HH:mm') {
  if (!date) return ''
  return dayjs(date).format(format)
}

/**
 * 判断是否已过期
 */
export function isOverdue(deadline) {
  if (!deadline) return false
  return dayjs(deadline).isBefore(dayjs())
}

/**
 * 相对时间
 */
export function fromNow(date) {
  if (!date) return ''
  return dayjs(date).fromNow()
}