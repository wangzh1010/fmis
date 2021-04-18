const config = require('../../config/config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: config.OUT,
    categories: [],
    list: [
      [{
        name: '卖废品',
        icon: 'setting'
      }, {
        name: '打赏',
        icon: 'setting'
      }],
      [{
        name: '燃气费',
        icon: 'setting'
      }, {
        name: '文具',
        icon: 'pen'
      }, {
        name: 'Switch',
        icon: 'setting'
      }]
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.refreshCategories();
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
  handleTabChange(e) {
    this.setData({
      currentTab: e.target.dataset.type
    });
    this.refreshCategories();
  },
  refreshCategories() {
    this.setData({
      categories: this.data.list[this.data.currentTab]
    })
  },
  addClassify() {
    wx.navigateTo({
      url: '../addClassify/addClassify?type=' + this.data.currentTab
    })
  },
  modifyClassify(e) {
    console.log(e)
    let icon = e.currentTarget.dataset.icon;
    let name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '../addClassify/addClassify?type=' + this.data.currentTab + '&icon=' + icon + '&name=' + name
    })
  },
  removeClassify(e) {
    let name = e.currentTarget.dataset.name;
    wx.showModal({
      title: '提示',
      content: `确定要删除"${name}"分类?`,
      success: res => {
        if (res.confirm) {
          console.log('delete!')
        }
      }
    })
  }
})