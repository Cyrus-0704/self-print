const api = require("../../utils/api");
const util = require("../../utils/util");

Page({
  data: {
    loading: true,
    bannerList: [
      {
        id: 1,
        imageUrl: "/images/banner/banner1.png",
        title: "智能打印",
      },
      {
        id: 2,
        imageUrl: "/images/banner/banner2.png",
        title: "快速上传",
      },
    ],
    serviceList: [
      {
        id: 1,
        icon: "/images/icons/doc.png",
        title: "文档打印",
        desc: "支持PDF、Word等格式",
      },
      {
        id: 2,
        icon: "/images/icons/image.png",
        title: "图片打印",
        desc: "支持JPG、PNG等格式",
      },
    ],
    priceList: [
      {
        title: "黑白打印",
        price: "0.2元/页",
      },
      {
        title: "彩色打印",
        price: "0.4元/页",
      },
    ],
    contactPhone: "400-123-4567",
    businessHours: "周一至周日 8:00-22:00",
  },

  onLoad() {
    this.setData({
      loading: false,
    });
  },

  // 导航到打印页面
  navigateToPrint() {
    wx.switchTab({
      url: "/pages/upload/upload",
    });
  },

  // 拨打电话
  makePhoneCall() {
    wx.makePhoneCall({
      phoneNumber: this.data.contactPhone,
    });
  },

  // 分享设置
  onShareAppMessage() {
    return {
      title: "自助打印 - 快捷方便的打印服务",
      path: "/pages/index/index",
    };
  },

  onShareTimeline() {
    return {
      title: "自助打印 - 快捷方便的打印服务",
    };
  },
});
