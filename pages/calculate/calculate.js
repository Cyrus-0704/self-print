const app = getApp();

Page({
  data: {
    fileInfo: {
      name: "",
      pageCount: 0,
      size: 0,
    },
    printOptions: {
      copies: 1,
      color: false,
      doubleSided: false,
      pageSize: "A4",
    },
    priceInfo: {
      totalPrice: 0,
    },
  },

  onLoad(options) {
    console.log("计算页面加载");
    // 从上一页获取文件信息
    const fileInfo = app.globalData.currentFile;
    if (fileInfo) {
      console.log("文件信息:", fileInfo);
      this.setData({
        fileInfo: fileInfo,
      });
      this.calculatePrice();
    } else {
      console.log("未找到文件信息");
      wx.showToast({
        title: "未找到文件信息",
        icon: "none",
        duration: 2000,
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 2000);
    }
  },

  // 份数减少
  decreaseCopies() {
    if (this.data.printOptions.copies > 1) {
      this.setData({
        "printOptions.copies": this.data.printOptions.copies - 1,
      });
      this.calculatePrice();
    }
  },

  // 份数增加
  increaseCopies() {
    this.setData({
      "printOptions.copies": this.data.printOptions.copies + 1,
    });
    this.calculatePrice();
  },

  // 份数输入变化
  onCopiesChange(e) {
    const copies = parseInt(e.detail.value) || 1;
    this.setData({
      "printOptions.copies": copies,
    });
    this.calculatePrice();
  },

  // 颜色选择变化
  onColorChange(e) {
    const isColor = e.detail.value === "color";
    this.setData({
      "printOptions.color": isColor,
    });
    this.calculatePrice();
  },

  // 单双面选择变化
  onSideChange(e) {
    const isDoubleSided = e.detail.value === "double";
    this.setData({
      "printOptions.doubleSided": isDoubleSided,
    });
    this.calculatePrice();
  },

  // 纸张大小选择变化
  onPageSizeChange(e) {
    this.setData({
      "printOptions.pageSize": e.detail.value,
    });
    this.calculatePrice();
  },

  // 计算价格
  calculatePrice() {
    const { copies, color, doubleSided, pageSize } = this.data.printOptions;
    const pageCount = this.data.fileInfo.pageCount;

    // 基础单价（黑白0.2，彩色0.4）
    let pricePerPage = color ? 0.4 : 0.2;

    // 计算A3加价
    if (pageSize === "A3") {
      pricePerPage += 0.5;
    }

    // 计算总价
    let totalPrice = pricePerPage * pageCount * copies;

    // 双面打印优惠10%
    if (doubleSided) {
      totalPrice *= 0.9;
    }

    // 保留两位小数
    totalPrice = totalPrice.toFixed(2);

    this.setData({
      "priceInfo.totalPrice": totalPrice,
    });

    // 构建并保存订单信息到全局数据
    const orderInfo = {
      fileInfo: this.data.fileInfo,
      printOptions: this.data.printOptions,
      priceInfo: {
        totalPrice: totalPrice,
        basePrice: pricePerPage,
        totalPages: pageCount * copies,
      },
      orderNo: this.generateOrderNo(),
    };

    console.log("更新订单信息:", orderInfo);
    app.globalData.currentOrder = orderInfo;
  },

  // 生成订单号
  generateOrderNo() {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    return `P${timestamp}${random}`;
  },

  // 提交订单
  submitOrder() {
    // 重新计算价格并保存订单信息
    this.calculatePrice();

    console.log("提交订单");
    console.log("订单信息:", app.globalData.currentOrder);

    if (!app.globalData.currentOrder) {
      wx.showToast({
        title: "订单信息无效",
        icon: "none",
        duration: 2000,
      });
      return;
    }

    // 跳转到支付页面
    wx.navigateTo({
      url: "/pages/payment/payment",
      success: () => {
        console.log("跳转到支付页面成功");
      },
      fail: (error) => {
        console.error("跳转到支付页面失败:", error);
        wx.showToast({
          title: "跳转失败，请重试",
          icon: "none",
          duration: 2000,
        });
      },
    });
  },
});
