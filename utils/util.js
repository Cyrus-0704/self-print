/**
 * 通用工具函数
 */

/**
 * 格式化时间
 * @param {Date} date 日期对象
 * @param {string} format 格式化模板
 * @returns {string} 格式化后的时间字符串
 */
const formatTime = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return format
    .replace('YYYY', year)
    .replace('MM', padZero(month))
    .replace('DD', padZero(day))
    .replace('HH', padZero(hour))
    .replace('mm', padZero(minute))
    .replace('ss', padZero(second))
}

/**
 * 数字补零
 * @param {number} n 数字
 * @returns {string} 补零后的字符串
 */
const padZero = (n) => {
  return n < 10 ? '0' + n : '' + n
}

/**
 * 格式化文件大小
 * @param {number} size 文件大小(byte)
 * @returns {string} 格式化后的文件大小
 */
const formatFileSize = (size) => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let index = 0
  while (size >= 1024 && index < units.length - 1) {
    size /= 1024
    index++
  }
  return size.toFixed(2) + units[index]
}

/**
 * 格式化金额
 * @param {number} amount 金额
 * @param {number} decimals 小数位数
 * @returns {string} 格式化后的金额
 */
const formatAmount = (amount, decimals = 2) => {
  return Number(amount).toFixed(decimals)
}

/**
 * 生成订单号
 * @returns {string} 订单号
 */
const generateOrderId = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = padZero(now.getMonth() + 1)
  const day = padZero(now.getDate())
  const hour = padZero(now.getHours())
  const minute = padZero(now.getMinutes())
  const second = padZero(now.getSeconds())
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  
  return `${year}${month}${day}${hour}${minute}${second}${random}`
}

/**
 * 显示加载提示
 * @param {string} title 提示文字
 */
const showLoading = (title = '加载中...') => {
  wx.showLoading({
    title,
    mask: true
  })
}

/**
 * 隐藏加载提示
 */
const hideLoading = () => {
  wx.hideLoading()
}

/**
 * 显示消息提示
 * @param {string} title 提示内容
 * @param {string} icon 图标类型
 * @returns {Promise} Promise对象
 */
const showToast = (title, icon = 'none') => {
  return new Promise((resolve) => {
    wx.showToast({
      title,
      icon,
      duration: 2000,
      success: resolve
    })
  })
}

/**
 * 显示模态对话框
 * @param {string} title 标题
 * @param {string} content 内容
 * @param {boolean} showCancel 是否显示取消按钮
 * @returns {Promise} Promise对象
 */
const showModal = (title, content, showCancel = true) => {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title,
      content,
      showCancel,
      success: (res) => {
        if (res.confirm) {
          resolve(true)
        } else {
          reject(false)
        }
      }
    })
  })
}

/**
 * 检查文件类型是否支持
 * @param {string} fileName 文件名
 * @param {string[]} allowedTypes 允许的文件类型
 * @returns {boolean} 是否支持
 */
const checkFileType = (fileName, allowedTypes) => {
  const ext = fileName.split('.').pop().toLowerCase()
  return allowedTypes.includes(ext)
}

/**
 * 获取文件图标
 * @param {string} fileName 文件名
 * @returns {string} 图标名称
 */
const getFileIcon = (fileName) => {
  const ext = fileName.split('.').pop().toLowerCase()
  const iconMap = {
    pdf: 'pdf',
    doc: 'doc',
    docx: 'doc',
    jpg: 'album',
    jpeg: 'album',
    png: 'album'
  }
  return iconMap[ext] || 'file'
}

module.exports = {
  formatTime,
  formatFileSize,
  formatAmount,
  generateOrderId,
  showLoading,
  hideLoading,
  showToast,
  showModal,
  checkFileType,
  getFileIcon
} 