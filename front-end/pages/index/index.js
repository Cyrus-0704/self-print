Page({
  data: {
    // 页面的初始数据
  },
  onLoad() {
    // 页面加载时执行
  },
  onReady() {
    // 页面初次渲染完成时执行
  },
  onShow() {
    // 页面显示时执行
  },
  // 跳转到打印服务页面
  navigateToPrint() {
    wx.navigateTo({
      url: '/pages/upload/upload'
    });
  }
}) 