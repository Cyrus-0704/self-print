// app.js
App({
  globalData: {
    currentFile: null, // 当前选择的文件信息
    printOptions: null, // 打印选项
    currentOrder: null, // 当前订单信息
    // 支持的文件类型
    fileTypes: ["doc", "docx", "pdf", "png", "jpg", "jpeg"],
    // 打印价格配置
    priceConfig: {
      blackWhite: 0.2, // 黑白单价
      color: 0.4, // 彩色单价
      doubleSided: 0.9, // 双面打印折扣
    },
  },

  onLaunch() {
    console.log("小程序启动");
    // 初始化全局数据
    this.initGlobalData();
  },

  initGlobalData() {
    console.log("初始化全局数据");
    // 重置订单相关数据
    this.globalData.currentFile = null;
    this.globalData.printOptions = null;
    this.globalData.currentOrder = null;
  },

  // 清除订单数据
  clearOrderData() {
    console.log("清除订单数据");
    this.globalData.currentFile = null;
    this.globalData.printOptions = null;
    this.globalData.currentOrder = null;
  },
});
