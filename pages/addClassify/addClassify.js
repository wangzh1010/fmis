const config = require('../../config/config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    open: false,
    icon: null,
    currentTab: 0,
    tabName: '',
    categoryName: '',
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let icon = options.icon;
    let categoryName = options.name;
    let tabName = options.type === config.IN ? '收入' : '支出';
    let list = options.type === config.IN ? config.custom : config.custom;
    this.setData({
      icon: icon,
      list: list,
      tabName: tabName,
      currentTab: options.type,
      categoryName: categoryName
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
  showPopup() {
    this.setData({
      open: true
    });
  },
  handleCategorySelected(e) {
    this.setData({
      open: false
    });
    let key = this.data.currentTab === config.IN ? 'incoming' : 'outgoings';
    let target = config.custom.find(item => item.key === e.currentTarget.dataset.key);
    this.setData({
      key: target.key,
      value: target.value,
      icon: target.pinyin
    })
  },
  handleCategoryNameChange(e) {
    this.setData({
      categoryName: e.detail.value
    })
  }
})