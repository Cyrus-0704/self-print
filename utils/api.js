/**
 * API接口封装
 */

// API基础配置
const config = {
  baseUrl: 'https://api.example.com', // 实际项目中替换为真实的API地址
  version: 'v1'
}

// 请求方法封装
const request = (url, options = {}) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${config.baseUrl}/${config.version}${url}`,
      ...options,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          reject(new Error(res.data.message || '请求失败'))
        }
      },
      fail: (error) => {
        reject(new Error(error.errMsg || '网络错误'))
      }
    })
  })
}

// 模拟数据（实际项目中删除）
const mockData = {
  // 打印点列表
  locations: [
    {
      id: 1,
      name: '图书馆打印点',
      address: '图书馆一楼大厅',
      status: 'open',
      latitude: 39.908823,
      longitude: 116.397470
    },
    {
      id: 2,
      name: '教学楼打印点',
      address: '教学楼B座一楼',
      status: 'closed',
      latitude: 39.908723,
      longitude: 116.397370
    }
  ],
  // 文件信息
  files: [
    {
      id: 1,
      name: '课程作业.docx',
      pages: 5,
      type: 'doc'
    },
    {
      id: 2,
      name: '课程表.jpg',
      pages: 1,
      type: 'image'
    }
  ]
}

/**
 * 打印相关接口
 */
const print = {
  // 获取打印点列表
  getLocations: () => {
    // return request('/print/locations')
    return Promise.resolve(mockData.locations)
  },

  // 获取文件信息
  getFileInfo: (fileIds) => {
    // return request('/print/files', {
    //   method: 'POST',
    //   data: { fileIds }
    // })
    return Promise.resolve(mockData.files)
  },

  // 获取打印状态
  getStatus: (orderId) => {
    // return request(`/print/status/${orderId}`)
    return Promise.resolve({
      status: 'printing',
      progress: 45,
      message: '正在打印第2页'
    })
  },

  // 重新打印
  retry: (orderId) => {
    // return request(`/print/retry/${orderId}`, {
    //   method: 'POST'
    // })
    return Promise.resolve({ success: true })
  }
}

/**
 * 订单相关接口
 */
const order = {
  // 创建订单
  create: (data) => {
    // return request('/orders', {
    //   method: 'POST',
    //   data
    // })
    return Promise.resolve({
      id: 'ORDER' + Date.now(),
      ...data
    })
  },

  // 获取订单详情
  getDetail: (orderId) => {
    // return request(`/orders/${orderId}`)
    return Promise.resolve({
      id: orderId,
      status: 'pending',
      files: mockData.files,
      totalPages: 6,
      totalPrice: 3.0
    })
  }
}

/**
 * 支付相关接口
 */
const payment = {
  // 发起支付
  pay: (data) => {
    // return request('/payment/pay', {
    //   method: 'POST',
    //   data
    // })
    return Promise.resolve({ success: true })
  }
}

/**
 * 上传相关接口
 */
const upload = {
  // 上传文件
  uploadFile: (filePath, options = {}) => {
    // return new Promise((resolve, reject) => {
    //   const uploadTask = wx.uploadFile({
    //     url: `${config.baseUrl}/${config.version}/upload`,
    //     filePath,
    //     name: 'file',
    //     success: (res) => {
    //       if (res.statusCode === 200) {
    //         resolve(JSON.parse(res.data))
    //       } else {
    //         reject(new Error('上传失败'))
    //       }
    //     },
    //     fail: reject
    //   })
    //   
    //   if (options.onProgress) {
    //     uploadTask.onProgressUpdate((res) => {
    //       options.onProgress(res.progress)
    //     })
    //   }
    // })

    // 模拟上传进度
    return new Promise((resolve) => {
      let progress = 0
      const timer = setInterval(() => {
        progress += 10
        options.onProgress?.(progress)
        if (progress >= 100) {
          clearInterval(timer)
          resolve({
            success: true,
            fileId: 'FILE' + Date.now()
          })
        }
      }, 300)
    })
  }
}

module.exports = {
  print,
  order,
  payment,
  upload
} 