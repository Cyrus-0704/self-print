// pages/payment/payment.js
const api = require('../../utils/api');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderInfo: {
            orderId: '',
            totalPrice: 0,
            files: [],
            printOptions: {},
            createTime: ''
        },
        loading: false,
        paymentStatus: '', // '', 'success', 'fail'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function(options) {
        if (!options.orderId) {
            wx.showToast({
                title: '订单信息不完整',
                icon: 'none'
            });
            return;
        }

        this.setData({ 
            'orderInfo.orderId': options.orderId,
            loading: true 
        });

        try {
            // 获取订单详情
            const orderDetail = await api.order.getDetail(options.orderId);
            this.setData({
                orderInfo: {
                    ...this.data.orderInfo,
                    ...orderDetail
                }
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

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },

    // 发起支付
    startPayment: async function() {
        if (this.data.loading) return;
        
        this.setData({ loading: true });

        try {
            // 获取支付参数
            const payParams = await api.payment.getPayParams(this.data.orderInfo.orderId);
            
            // 调用微信支付
            await this.wxRequestPayment(payParams);
            
            // 支付成功
            this.setData({ paymentStatus: 'success' });
            
            // 检查支付状态
            await this.checkPaymentStatus();
            
            // 跳转到打印状态页
            wx.redirectTo({
                url: `/pages/status/status?orderId=${this.data.orderInfo.orderId}`
            });
        } catch (error) {
            console.error('支付失败', error);
            this.setData({ paymentStatus: 'fail' });
            wx.showToast({
                title: '支付失败，请重试',
                icon: 'none'
            });
        } finally {
            this.setData({ loading: false });
        }
    },

    // 包装微信支付API为Promise
    wxRequestPayment: function(payParams) {
        return new Promise((resolve, reject) => {
            wx.requestPayment({
                timeStamp: payParams.timeStamp,
                nonceStr: payParams.nonceStr,
                package: payParams.package,
                signType: 'MD5',
                paySign: payParams.paySign,
                success: resolve,
                fail: reject
            });
        });
    },

    // 检查支付状态
    checkPaymentStatus: async function() {
        let retryCount = 0;
        const maxRetries = 3;
        
        while (retryCount < maxRetries) {
            try {
                const result = await api.payment.queryStatus(this.data.orderInfo.orderId);
                if (result.paid) {
                    return true;
                }
                
                // 等待1秒后重试
                await new Promise(resolve => setTimeout(resolve, 1000));
                retryCount++;
            } catch (error) {
                console.error('查询支付状态失败', error);
                retryCount++;
            }
        }
        
        throw new Error('支付状态查询失败');
    },

    // 取消支付
    cancelPayment: function() {
        wx.showModal({
            title: '确认取消',
            content: '确定要取消支付吗？',
            success: (res) => {
                if (res.confirm) {
                    // 取消订单
                    api.order.cancel(this.data.orderInfo.orderId).catch(error => {
                        console.error('取消订单失败', error);
                    });
                    wx.navigateBack();
                }
            }
        });
    },

    // 重试支付
    retryPayment: function() {
        this.setData({ paymentStatus: '' });
        this.startPayment();
    }
})