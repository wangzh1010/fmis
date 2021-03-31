const config = require('../../config/config.js');
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
      remarks: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorage({
      key: config.BILL_DETAIL,
      success: res => {
        console.log(res.data)
        this.setData({
          'cached.id': res.data.id,
          'cached.key': res.data.key,
          'cached.type': res.data.type,
          'cached.date': res.data.date,
          'cached.amount': res.data.value,
          'cached.remarks': res.data.remarks
        })
        console.log(this.data.cached.key)
      }
    })
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
    wx.navigateTo({
      url: '../record/record',
    })
  },
  handleDelete() {
    wx.showModal({
      title: '提示',
      content: '确定要删除这条账单?',
      success: res => {
        if (res.confirm) {
          console.log('delete!')
          wx.navigateBack({
            delta: 0,
          })
        }
      }
    })
  }
})