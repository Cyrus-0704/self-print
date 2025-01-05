const request = require('./request');

// 文件相关接口
const fileAPI = {
  // 上传文件
  upload: (filePath, onProgress) => {
    return new Promise((resolve, reject) => {
      const uploadTask = wx.uploadFile({
        url: `${getApp().globalData.baseUrl}/api/file/upload`,
        filePath: filePath,
        name: 'file',
        success: res => {
          if (res.statusCode === 200) {
            resolve(JSON.parse(res.data));
          } else {
            reject(res.data);
          }
        },
        fail: reject
      });

      if (onProgress) {
        uploadTask.onProgressUpdate(res => {
          onProgress(res.progress);
        });
      }
    });
  },

  // 获取文件信息（页数等）
  getFileInfo: (fileId) => {
    return request.get('/api/file/info', { fileId });
  }
};

// 订单相关接口
const orderAPI = {
  // 创建订单
  create: (data) => {
    return request.post('/api/order/create', data);
  },

  // 获取订单详情
  getDetail: (orderId) => {
    return request.get('/api/order/detail', { orderId });
  },

  // 取消订单
  cancel: (orderId) => {
    return request.post('/api/order/cancel', { orderId });
  }
};

// 支付相关接口
const paymentAPI = {
  // 获取支付参数
  getPayParams: (orderId) => {
    return request.post('/api/payment/create', { orderId });
  },

  // 查询支付状态
  queryStatus: (orderId) => {
    return request.get('/api/payment/status', { orderId });
  }
};

// 打印相关接口
const printAPI = {
  // 获取打印状态
  getStatus: (orderId) => {
    return request.get('/api/print/status', { orderId });
  },

  // 重新打印
  retry: (orderId) => {
    return request.post('/api/print/retry', { orderId });
  },

  // 获取打印配置（价格等）
  getConfig: () => {
    return request.get('/api/print/config');
  }
};

// 用户相关接口
const userAPI = {
  // 登录
  login: (code) => {
    return request.post('/api/user/login', { code });
  },

  // 获取用户信息
  getUserInfo: () => {
    return request.get('/api/user/info');
  },

  // 更新用户信息
  updateUserInfo: (userInfo) => {
    return request.put('/api/user/info', userInfo);
  }
};

module.exports = {
  file: fileAPI,
  order: orderAPI,
  payment: paymentAPI,
  print: printAPI,
  user: userAPI
}; 