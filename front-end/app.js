App({
  onLaunch() {
    // 获取系统信息
    wx.getSystemInfo({
      success: res => {
        this.globalData.systemInfo = res;
      }
    });

    // 检查更新
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(function (res) {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  updateManager.applyUpdate();
                }
              }
            });
          });
        }
      });
    }
  },

  globalData: {
    systemInfo: null,
    userInfo: null,
    baseUrl: 'https://your-api-domain.com', // 替换为你的后端API地址
    uploadPath: '/api/upload',
    printPath: '/api/print',
    fileTypes: {
      doc: true,
      docx: true,
      pdf: true,
      png: true,
      jpg: true,
      jpeg: true
    }
  }
}); 