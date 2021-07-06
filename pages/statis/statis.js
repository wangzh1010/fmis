const API = require('../../config/api.js');
const Config = require('../../config/config.js');
const Utils = require('../../utils/util.js');
/**
 * 类型 收入或者支出
 */
let type;
/**
 * 原始数据
 */
let sourceData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    details: [],
    type: '',
    amount: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 记录类型 收入或者支出
    type = parseInt(options.type);
    Utils.sendRequest({
      url: API.DETAILS,
      data: {
        date: options.date,
        type: type,
        bill_type: options.bill_type
      }
    }).then(resp => {
      sourceData = resp.data;
      this.initViewData();
    }).catch(e => {
      wx.showToast({
        title: '服务器繁忙，请稍后重试！',
        icon: 'none'
      })
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
    try {
      // 查看缓存 是否需要刷新数据
      let data = wx.getStorageSync(Config.REFRESH_STATIS);
      if (data) {
        data = JSON.parse(data);
        // 删除了数据
        if (data.cmd === Config.BILL_DELETE) {
          let index = sourceData.findIndex(item => item.id === data.id);
          if (index !== -1) {
            sourceData.splice(index, 1);
            this.initViewData();
          }
        } else if (data.cmd === Config.BILL_UPDATE) {
          // 修改了数据
          let item = sourceData.find(item => item.id === data.id);
          if (item) {
            item.remarks = data.remarks;
            item.bill_type = data.key;
            item.bill_date = data.date;
            item.amount = data.amount * 100;
            this.initViewData();
          }
        }
        // 删除缓存
        wx.removeStorageSync(Config.REFRESH_STATIS);
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
  initViewData() {
    let [amount, result] = this.formatData();
    this.setData({
      details: result,
      amount: Utils.formatMoney(amount),
      type: type === Config.IN ? '收入' : '支出',
    });
  },
  formatData() {
    let result = [];
    let keys = [];
    let amount = 0;
    sourceData.forEach(item => {
      let key = item.bill_date;
      let data = Object.create(null);
      data.id = item.id;
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
  showDetail(e) {
    let id = e.currentTarget.dataset.id;
    let data = sourceData.find(item => item.id === id);
    wx.setStorage({
      data: {
        id: data.id,
        type: data.type,
        value: data.amount,
        key: data.bill_type,
        date: data.bill_date,
        remarks: data.remarks
      },
      key: Config.BILL_DETAIL,
      complete() {
        wx.navigateTo({
          url: '../detail/detail?referer=statis'
        })
      }
    });
  }
})