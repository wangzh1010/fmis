const Config = require('../../config/config.js');
const Utils = require('../../utils/util.js');
const API = require('../../config/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cached: {
      id: 0,
      type: 0,
      key: 0,
      amount: 0,
      date: '',
      remarks: '',
      icon: '',
      category: '',
      name: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorage({
      key: Config.BILL_DETAIL,
      success: res => {
        this.setData({
          'cached.id': res.data.id,
          'cached.key': res.data.key,
          'cached.type': res.data.type,
          'cached.date': res.data.date,
          'cached.remarks': res.data.remarks,
          'cached.category': Utils.transformType(res.data),
          'cached.amount': Utils.formatMoney(res.data.value),
          'cached.icon': Utils.transformImageURL(res.data, 'on'),
          'cached.name': res.data.type === Config.IN ? '收入' : '支出'
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('detail onShow.')
    try {
      let data = wx.getStorageSync(Config.REFRESH_DETAIL);
      if (data) {
        data = JSON.parse(data);
        this.setData({
          'cached.key': data.key,
          'cached.date': data.date,
          'cached.remarks': data.remarks,
          'cached.category': Utils.transformType(data),
          'cached.amount': Utils.formatMoney(data.amount * 100),
          'cached.icon': Utils.transformImageURL(data, 'on')
        });
        wx.removeStorageSync(Config.REFRESH_DETAIL);
      }
    } catch (e) {
      console.error(e);
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  handleEdit() {
    let type;
    wx.setStorage({
      data: this.data.cached,
      key: Config.BILL_MODIFY,
      success() {
        type = Config.ACT_MODIFY;
      },
      fail() {
        type = Config.ACT_ADD;
      },
      complete() {
        wx.navigateTo({
          url: '../record/record?type=' + type,
        })
      }
    })
  },
  handleDelete() {
    wx.showModal({
      title: '提示',
      content: '确定要删除这条账单?',
      success: res => {
        if (res.confirm) {
          Utils.sendRequest({
            url: API.DELETE,
            data: {
              bid: this.data.cached.id
            }
          }).then(resp => {
            try {
              wx.setStorageSync(Config.REFRESH_INDEX, JSON.stringify({
                cmd: Config.BILL_DELETE,
                id: this.data.cached.id
              }));
            } catch (e) {
              console.error(e);
            }
            wx.showToast({
              title: resp.message,
              icon: 'none',
              success() {
                setTimeout(() => {
                  wx.navigateBack();
                }, 300);
              }
            })
          }).catch(e => {
            wx.showToast({
              title: '服务器繁忙，请稍后重试！',
              icon: 'none'
            })
          })
        }
      }
    })
  }
})