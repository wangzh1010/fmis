// index.js
// 获取应用实例
const app = getApp()
let date = new Date();
let year = date.getFullYear();
let month = date.getMonth() + 1;
month = month < 10 ? '0' + month : month;
const config = require('../../config/config.js')
Page({
  data: {
    date: `${year}-${month}`,
    list: [{
      type: 0,
      key: 1,
      value: 9950
    }, {
      type: 1,
      key: 1,
      value: 10034
    }],
    motto: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  handleDateChange(e) {
    let arr = e.detail.value.split('-');
    this.setData({
      date: `${arr[0]}-${arr[1]}`
    });
  }
})