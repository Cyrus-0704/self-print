const api = require('../../utils/api');

Page({
  data: {
    fileList: [],
    supportedTypes: ['doc', 'docx', 'pdf', 'png', 'jpg', 'jpeg'],
    uploading: false,
    currentUploadIndex: -1,
    uploadProgress: 0
  },

  onLoad: function() {
    // 获取打印配置
    api.print.getConfig().then(config => {
      this.setData({
        supportedTypes: config.supportedTypes || this.data.supportedTypes
      });
    }).catch(err => {
      console.error('获取配置失败', err);
    });
  },

  // 选择文件
  chooseFile: function() {
    wx.chooseMessageFile({
      count: 10,
      type: 'file',
      success: (res) => {
        const tempFiles = res.tempFiles;
        const fileList = this.data.fileList;
        
        tempFiles.forEach(file => {
          const extension = file.name.split('.').pop().toLowerCase();
          if (this.data.supportedTypes.includes(extension)) {
            fileList.push({
              name: file.name,
              size: (file.size / 1024).toFixed(2) + 'KB',
              path: file.path,
              type: extension,
              status: 'waiting' // waiting, uploading, success, fail
            });
          } else {
            wx.showToast({
              title: '不支持的文件格式',
              icon: 'none'
            });
          }
        });

        this.setData({ fileList });
      }
    });
  },

  // 上传单个文件
  uploadSingleFile: async function(fileInfo, index) {
    this.setData({
      currentUploadIndex: index,
      [`fileList[${index}].status`]: 'uploading'
    });

    try {
      // 上传文件
      const uploadResult = await api.file.upload(fileInfo.path, (progress) => {
        this.setData({
          uploadProgress: progress
        });
      });

      // 获取文件信息（页数等）
      const fileInfo = await api.file.getFileInfo(uploadResult.fileId);

      this.setData({
        [`fileList[${index}].status`]: 'success',
        [`fileList[${index}].fileId`]: uploadResult.fileId,
        [`fileList[${index}].pages`]: fileInfo.pages
      });

      return uploadResult;
    } catch (error) {
      console.error('上传失败', error);
      this.setData({
        [`fileList[${index}].status`]: 'fail'
      });
      throw error;
    }
  },

  // 上传所有文件
  uploadFiles: async function() {
    if (this.data.fileList.length === 0) {
      wx.showToast({
        title: '请先选择文件',
        icon: 'none'
      });
      return;
    }

    this.setData({ uploading: true });
    
    try {
      const uploadTasks = this.data.fileList
        .filter(file => file.status !== 'success')
        .map((file, index) => this.uploadSingleFile(file, index));

      const results = await Promise.all(uploadTasks);

      // 创建订单
      const orderData = {
        files: this.data.fileList.map(file => ({
          fileId: file.fileId,
          pages: file.pages
        }))
      };

      const order = await api.order.create(orderData);

      // 跳转到计算页面
      wx.navigateTo({
        url: `/pages/calculate/calculate?orderId=${order.orderId}`
      });
    } catch (error) {
      wx.showToast({
        title: '上传失败，请重试',
        icon: 'none'
      });
    } finally {
      this.setData({
        uploading: false,
        currentUploadIndex: -1,
        uploadProgress: 0
      });
    }
  },

  // 删除文件
  deleteFile: function(e) {
    const index = e.currentTarget.dataset.index;
    const fileList = this.data.fileList;
    fileList.splice(index, 1);
    this.setData({ fileList });
  }
}); 