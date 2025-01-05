// 支付页面
const app = getApp();

Page({
  data: {
    order: null,
    loading: false, // 初始加载状态设为 false
    paying: false,
    paymentMethod: "wx",
  },

  onLoad: function (options) {
    console.log("支付页面加载");
    console.log("全局订单信息:", app.globalData.currentOrder);

    // 从全局数据获取订单信息
    const orderInfo = app.globalData.currentOrder;

    if (orderInfo) {
      console.log("订单信息获取成功:", orderInfo);
      this.setData({
        order: orderInfo,
        loading: false,
      });
    } else {
      console.log("未找到订单信息");
      wx.showToast({
        title: "未找到订单信息",
        icon: "none",
        duration: 3000, // 延长显示时间
        mask: true,
      });

      // 延长等待时间，确保用户看到提示
      setTimeout(() => {
        wx.navigateBack();
      }, 3000);
    }
  },

  selectPaymentMethod: function (e) {
    console.log("选择支付方式:", e.currentTarget.dataset.method);
    const method = e.currentTarget.dataset.method;
    this.setData({
      paymentMethod: method,
    });
  },

  startPayment: function () {
    if (this.data.paying) {
      console.log("支付进行中，请勿重复操作");
      return;
    }

    console.log("开始支付流程");
    this.setData({ paying: true });

    // 模拟支付过程
    wx.showLoading({
      title: "支付处理中...",
      mask: true,
    });

    setTimeout(() => {
      console.log("支付完成，准备跳转");
      wx.hideLoading();

      // 支付成功后跳转到状态页
      wx.redirectTo({
        url: "/pages/status/status",
        success: () => {
          console.log("跳转成功");
        },
        fail: (error) => {
          console.error("跳转失败:", error);
        },
      });
    }, 1500);
  },

  cancelPayment: function () {
    console.log("取消支付");
    wx.showModal({
      title: "提示",
      content: "确定要取消支付吗？",
      success: (res) => {
        if (res.confirm) {
          console.log("确认取消支付");
          wx.navigateBack({
            success: () => {
              console.log("返回成功");
            },
            fail: (error) => {
              console.error("返回失败:", error);
            },
          });
        }
      },
    });
  },

  onShow: function () {
    console.log("支付页面显示");
    console.log("当前订单信息:", this.data.order);
  },
});
