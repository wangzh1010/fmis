const API = require('../../config/api.js');
const config = require('../../config/config.js');
const Utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    details: [{
      date: '2021-03-28',
      data: [{
        type: 1,
        key: 4,
        value: 19950
      }]
    }, {
      date: '2021-03-27',
      data: [{
        type: 1,
        key: 1,
        value: 950
      }, {
        type: 1,
        key: 1,
        value: 99502
      }]
    }, {
      date: '2021-03-26',
      data: [{
        type: 1,
        key: 2,
        value: 99510
      }, {
        type: 1,
        key: 1,
        value: 90501
      }]
    }],
    type: '',
    amount: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    Utils.sendRequest({
      url: API.DETAILS,
      data: {
        date: options.date,
        type: options.type,
        bill_type: options.bill_type
      }
    }).then(resp => {
      let [amount, result] = this.formatData(resp.data);
      this.setData({
        details: result,
        amount: Utils.formatMoney(amount),
        type: options.type === config.IN ? '收入' : '支出',
      });
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
  formatData(sourceData) {
    let result = [];
    let keys = [];
    let amount = 0;
    sourceData.forEach(item => {
      let key = item.createtime.match(/\d{4}\-\d{2}\-\d{2}/)[0];
      let data = Object.create(null);
      data.type = item.type;
      data.key = item.bill_type;
      data.value = item.amount;
      // 总
      amount += item.amount;
      if (keys.includes(key)) {
        let target = result.find(item => item.date === key);
        // 分总
        target.total += data.value;
        target.data.push(data);
      } else {
        keys.push(key);
        result.push({
          date: key,
          total: data.value,
          data: [data]
        })
      }
    });
    return [amount, result];
  },
  showDetail() {
    wx.navigateTo({
      url: '../detail/detail',
    })
  }
})