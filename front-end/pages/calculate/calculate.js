const api = require('../../utils/api');

Page({
  data: {
    orderId: '',
    files: [],
    totalPages: 0,
    pricePerPage: 0.5,
    totalPrice: 0,
    printOptions: {
      color: false,    // 彩印/黑白
      doubleSided: true, // 双面/单面
      copies: 1        // 份数
    },
    loading: false
  },

  onLoad: async function(options) {
    if (!options.orderId) {
      wx.showToast({
        title: '订单信息不完整',
        icon: 'none'
      });
      return;
    }

    this.setData({ 
      orderId: options.orderId,
      loading: true 
    });

    try {
      // 获取打印配置（单价等）
      const config = await api.print.getConfig();
      // 获取订单详情
      const orderDetail = await api.order.getDetail(options.orderId);
      
      this.setData({
        pricePerPage: config.pricePerPage || this.data.pricePerPage,
        files: orderDetail.files,
        totalPages: orderDetail.files.reduce((sum, file) => sum + file.pages, 0)
      }, () => {
        this.calculatePrice();
      });
    } catch (error) {
      console.error('获取订单信息失败', error);
      wx.showToast({
        title: '获取订单信息失败',
        icon: 'none'
      });
    } finally {
      this.setData({ loading: false });
    }
  },

  // 切换打印选项
  toggleOption: function(e) {
    const { option } = e.currentTarget.dataset;
    const printOptions = this.data.printOptions;
    
    printOptions[option] = !printOptions[option];
    
    this.setData({ printOptions }, () => {
      this.calculatePrice();
    });
  },

  // 修改份数
  changeCopies: function(e) {
    const copies = parseInt(e.detail.value) || 1;
    const printOptions = this.data.printOptions;
    printOptions.copies = copies;
    
    this.setData({ printOptions }, () => {
      this.calculatePrice();
    });
  },

  // 计算总价
  calculatePrice: async function() {
    const { orderId, totalPages, printOptions } = this.data;
    
    try {
      // 调用后端计算价格
      const result = await api.order.create({
        orderId,
        printOptions,
        updateOnly: true // 仅更新订单，不创建新订单
      });

      this.setData({
        totalPrice: result.totalPrice
      });
    } catch (error) {
      console.error('计算价格失败', error);
      // 使用前端计算的价格作为备选
      const { pricePerPage } = this.data;
      let price = totalPages * pricePerPage;
      
      if (printOptions.color) {
        price *= 3;
      }
      
      if (!printOptions.doubleSided) {
        price *= 1.5;
      }
      
      price *= printOptions.copies;
      
      this.setData({
        totalPrice: price.toFixed(2)
      });
    }
  },

  // 确认订单
  confirmOrder: async function() {
    if (this.data.loading) return;

    this.setData({ loading: true });

    try {
      // 更新订单信息
      await api.order.create({
        orderId: this.data.orderId,
        printOptions: this.data.printOptions,
        totalPrice: this.data.totalPrice,
        updateOnly: true
      });

      // 跳转到支付页面
      wx.navigateTo({
        url: `/pages/payment/payment?orderId=${this.data.orderId}&price=${this.data.totalPrice}`
      });
    } catch (error) {
      console.error('确认订单失败', error);
      wx.showToast({
        title: '确认订单失败，请重试',
        icon: 'none'
      });
    } finally {
      this.setData({ loading: false });
    }
  }
}); 