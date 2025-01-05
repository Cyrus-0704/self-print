/**
 * 打印状态页面
 * 实现打印状态查询和显示功能
 */

const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderInfo: null,
    printStatus: {
      status: "pending", // pending, printing, completed, failed
      progress: 0,
      message: "等待打印",
    },
    statusMap: {
      pending: "等待打印",
      printing: "打印中",
      completed: "打印完成",
      failed: "打印失败",
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const orderInfo = app.globalData.currentOrder;
    if (orderInfo) {
      this.setData({ orderInfo });
      this.startStatusPolling();
    } else {
      wx.showToast({
        title: "未找到订单信息",
        icon: "none",
        duration: 2000,
      });
      setTimeout(() => {
        wx.switchTab({
          url: "/pages/index/index",
        });
      }, 2000);
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // 清除轮询定时器
    if (this.statusTimer) {
      clearInterval(this.statusTimer);
    }
  },

  // 开始状态轮询
  startStatusPolling: function () {
    // 立即查询一次状态
    this.queryPrintStatus();

    // 每3秒查询一次打印状态
    this.statusTimer = setInterval(() => {
      this.queryPrintStatus();
    }, 3000);
  },

  // 查询打印状态（模拟数据）
  queryPrintStatus: function () {
    // 模拟打印进度
    const currentStatus = this.data.printStatus;
    let newStatus = { ...currentStatus };

    if (currentStatus.status === "pending") {
      // 等待状态持续2次查询后开始打印
      if (this.pendingCount === undefined) {
        this.pendingCount = 0;
      }
      this.pendingCount++;

      if (this.pendingCount >= 2) {
        newStatus.status = "printing";
        newStatus.progress = 0;
        newStatus.message = "正在打印...";
      }
    } else if (currentStatus.status === "printing") {
      // 打印进度每次增加15-25
      const increment = Math.floor(Math.random() * 10) + 15;
      newStatus.progress = Math.min(100, currentStatus.progress + increment);
      newStatus.message = `正在打印... ${newStatus.progress}%`;

      // 当进度达到100%时完成打印
      if (newStatus.progress >= 100) {
        newStatus.status = "completed";
        newStatus.message = "打印完成";
        // 停止轮询
        clearInterval(this.statusTimer);
      }
    }

    this.setData({ printStatus: newStatus });
  },

  // 重新打印
  retryPrint: function () {
    wx.showModal({
      title: "确认重新打印",
      content: "是否确认重新打印该文件？",
      success: (res) => {
        if (res.confirm) {
          this.setData({
            printStatus: {
              status: "pending",
              progress: 0,
              message: "等待打印",
            },
          });
          this.pendingCount = 0;
          this.startStatusPolling();
        }
      },
    });
  },

  // 返回首页
  goHome: function () {
    // 清除订单信息
    app.globalData.currentOrder = null;
    app.globalData.currentFile = null;
    app.globalData.printOptions = null;

    wx.switchTab({
      url: "/pages/index/index",
    });
  },
});
