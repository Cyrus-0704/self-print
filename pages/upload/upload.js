/**
 * 上传页面
 * 实现文件选择和上传功能
 */

const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    fileList: [],
    uploading: false,
    supportedTypes: {
      pdf: {
        icon: "/images/icons/doc.png",
        name: "PDF文档",
      },
      doc: {
        icon: "/images/icons/doc.png",
        name: "Word文档",
      },
      docx: {
        icon: "/images/icons/doc.png",
        name: "Word文档",
      },
      jpg: {
        icon: "/images/icons/image.png",
        name: "图片",
      },
      jpeg: {
        icon: "/images/icons/image.png",
        name: "图片",
      },
      png: {
        icon: "/images/icons/image.png",
        name: "图片",
      },
    },
  },

  onLoad() {
    // 检查是否有未完成的上传
    const currentFile = getApp().globalData.currentFile;
    if (currentFile) {
      this.setData({
        fileList: [currentFile],
      });
    }
  },

  /**
   * 选择文件
   */
  chooseFile: function () {
    wx.chooseMessageFile({
      count: 1,
      type: "file",
      success: (res) => {
        const file = res.tempFiles[0];
        const fileExt = file.name.split(".").pop().toLowerCase();

        // 检查文件类型
        if (!this.data.supportedTypes[fileExt]) {
          wx.showToast({
            title: "不支持的文件类型",
            icon: "none",
          });
          return;
        }

        // 检查文件大小（最大20MB）
        if (file.size > 20 * 1024 * 1024) {
          wx.showToast({
            title: "文件大小不能超过20MB",
            icon: "none",
          });
          return;
        }

        // 构建文件信息
        const fileInfo = {
          name: file.name,
          size: (file.size / 1024).toFixed(0), // 转换为KB
          path: file.path,
          type: fileExt,
          icon: this.data.supportedTypes[fileExt].icon,
          typeName: this.data.supportedTypes[fileExt].name,
          pageCount: 1, // 默认页数，实际应该从服务器获取
        };

        this.setData({
          fileList: [fileInfo],
        });

        // 预览文件
        this.previewFile(fileInfo);
      },
    });
  },

  /**
   * 预览文件
   * @param {Object} file 文件信息
   */
  previewFile: function (file) {
    if (["jpg", "jpeg", "png"].includes(file.type)) {
      // 图片预览
      wx.previewImage({
        urls: [file.path],
      });
    } else if (file.type === "pdf") {
      // PDF预览
      wx.openDocument({
        filePath: file.path,
        showMenu: true,
        success: function (res) {
          console.log("打开PDF成功");
        },
        fail: function (error) {
          console.error("打开PDF失败:", error);
          wx.showToast({
            title: "预览失败",
            icon: "none",
          });
        },
      });
    } else {
      wx.showToast({
        title: "该文件类型暂不支持预览",
        icon: "none",
      });
    }
  },

  /**
   * 删除文件
   * @param {Object} e 事件对象
   */
  deleteFile: function (e) {
    wx.showModal({
      title: "提示",
      content: "确定要删除这个文件吗？",
      success: (res) => {
        if (res.confirm) {
          this.setData({
            fileList: [],
          });
          // 清除全局数据
          getApp().globalData.currentFile = null;
        }
      },
    });
  },

  /**
   * 开始打印
   */
  startPrint: function () {
    if (this.data.fileList.length === 0) {
      wx.showToast({
        title: "请先选择文件",
        icon: "none",
      });
      return;
    }

    if (this.data.uploading) {
      return;
    }

    this.setData({ uploading: true });
    wx.showLoading({
      title: "正在处理...",
      mask: true,
    });

    // 模拟文件上传和处理
    setTimeout(() => {
      // 保存文件信息到全局数据
      getApp().globalData.currentFile = this.data.fileList[0];

      wx.hideLoading();
      this.setData({ uploading: false });

      // 跳转到计算价格页面
      wx.navigateTo({
        url: "/pages/calculate/calculate",
      });
    }, 1500);
  },
});
