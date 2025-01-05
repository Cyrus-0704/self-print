const app = getApp();

// 请求基础配置
const baseConfig = {
  timeout: 10000,  // 超时时间10s
  header: {
    'content-type': 'application/json'
  }
};

// 请求拦截器
const requestInterceptor = config => {
  // 添加token等认证信息
  const token = wx.getStorageSync('token');
  if (token) {
    config.header['Authorization'] = `Bearer ${token}`;
  }
  return config;
};

// 响应拦截器
const responseInterceptor = response => {
  if (response.statusCode === 401) {
    // token过期，重新登录
    wx.removeStorageSync('token');
    wx.redirectTo({
      url: '/pages/index/index'
    });
    return Promise.reject(new Error('未授权，请重新登录'));
  }
  
  if (response.statusCode !== 200) {
    return Promise.reject(response.data);
  }
  
  return response.data;
};

// 统一的请求函数
const request = (method, url, data = {}) => {
  const config = {
    ...baseConfig,
    method,
    url: `${app.globalData.baseUrl}${url}`,
    data
  };

  // 应用请求拦截器
  const finalConfig = requestInterceptor(config);

  return new Promise((resolve, reject) => {
    wx.request({
      ...finalConfig,
      success: res => {
        try {
          const result = responseInterceptor(res);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      },
      fail: err => {
        reject(err);
      }
    });
  });
};

// 导出具体的请求方法
module.exports = {
  get: (url, data) => request('GET', url, data),
  post: (url, data) => request('POST', url, data),
  put: (url, data) => request('PUT', url, data),
  delete: (url, data) => request('DELETE', url, data)
}; 