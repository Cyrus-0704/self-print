// pages/status/status.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderId: '',
        status: 'pending', // pending, printing, completed, failed
        statusText: {
            pending: '待打印',
            printing: '打印中',
            completed: '已完成',
            failed: '打印失败'
        },
        progress: 0,
        errorMessage: '',
        printInfo: {
            location: '一号打印点',
            estimatedTime: '3-5分钟'
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        if (options.orderId) {
            this.setData({ orderId: options.orderId });
            this.startPrintStatusPolling();
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
        // 清除轮询定时器
        if (this.statusTimer) {
            clearInterval(this.statusTimer);
        }
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

    // 开始轮询打印状态
    startPrintStatusPolling: function() {
        // 模拟打印过程
        let progress = 0;
        this.statusTimer = setInterval(() => {
            progress += 10;
            
            if (progress < 50) {
                this.setData({
                    status: 'pending',
                    progress: progress
                });
            } else if (progress < 90) {
                this.setData({
                    status: 'printing',
                    progress: progress
                });
            } else {
                this.setData({
                    status: 'completed',
                    progress: 100
                });
                clearInterval(this.statusTimer);
            }
        }, 1500);

        // TODO: 实际项目中应该调用后端API获取状态
        // this.checkPrintStatus();
    },

    // 检查打印状态
    checkPrintStatus: function() {
        // TODO: 调用后端API获取打印状态
        wx.request({
            url: getApp().globalData.baseUrl + '/api/print/status',
            data: {
                orderId: this.data.orderId
            },
            success: (res) => {
                if (res.data.success) {
                    this.setData({
                        status: res.data.status,
                        progress: res.data.progress
                    });
                }
            },
            fail: (err) => {
                console.error('获取打印状态失败', err);
                this.setData({
                    status: 'failed',
                    errorMessage: '获取打印状态失败'
                });
            }
        });
    },

    // 返回首页
    backToHome: function() {
        wx.reLaunch({
            url: '/pages/index/index'
        });
    },

    // 重新打印
    retryPrint: function() {
        if (this.data.status === 'failed') {
            // TODO: 调用重新打印接口
            this.setData({
                status: 'pending',
                progress: 0,
                errorMessage: ''
            });
            this.startPrintStatusPolling();
        }
    }
})