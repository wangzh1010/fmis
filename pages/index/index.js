// index.js
const API = require('../../config/api.js');
const Config = require('../../config/config.js');
const {
  formatTime,
  sendRequest
} = require('../../utils/util.js');
const date = formatTime(new Date());
const year = parseInt(date.match(/^\d{4}/)[0]);
const yearMonth = date.match(/^\d{4}\-\d{2}/)[0];
// 获取应用实例
const app = getApp();
// 原始数据
let sourceData;
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    date: yearMonth,
    start: `${year - 5}-01-01`,
    end: `${year + 5}-01-01`,
    details: [{
      date: '2021-04-18',
      data: [{
        type: 1,
        key: 1,
        value: 2381
      }, {
        type: 0,
        key: 2,
        value: 2135
      }]
    }, {
      date: '2021-04-15',
      data: [{
          type: 0,
          key: 1,
          value: 300000
        }, {
          type: 0,
          key: 3,
          value: 28781
        },
        {
          type: 1,
          key: 1,
          value: 15600
        }
      ]
    }],
    surplus: 0,
    incoming: 0,
    outgoings: 0
  },
  onLoad() {
    if (app.globalData.accessToken) {
      // 请求数据
      this.fetchData();
    } else {
      app.accessTokenReadyCallback = () => {
        // 请求数据
        this.fetchData();
      }
    }
    let items = [0, 0, 0];
    this.data.details.forEach(item => {
      let arr = item.data;
      items[0] += this.calculate(arr, Config.IN);
      items[1] += this.calculate(arr, Config.OUT);
      items[2] += this.calculate(arr);
    });
    items = items.map(num => (num / 100).toFixed(2));
    this.setData({
      incoming: items[0],
      outgoings: items[1],
      surplus: items[2]
    })
  },
  onShow() {
    try {
      let status = wx.getStorageSync(Config.RELOAD_INDEX);
      status = parseInt(status);
      if (status === 1) {
        this.fetchData();
        wx.setStorageSync(Config.RELOAD_INDEX, 0);
      }
    } catch (e) {
      console.error(e);
    }
    try {
      let data = wx.getStorageSync(Config.REFRESH_INDEX);
      if (data) {
        data = JSON.parse(data);
        if (data.cmd === Config.BILL_DELETE) {
          let index = sourceData.findIndex(item => item.id === data.id);
          if (index !== -1) {
            sourceData.splice(index, 1);
            this.initViewData();
          }
        } else if (data.cmd === Config.BILL_UPDATE) {
          let item = sourceData.find(item => item.id === data.id);
          if (item) {
            item.remarks = data.remarks;
            item.bill_type = data.key;
            item.bill_date = data.date;
            item.amount = data.amount * 100;
            this.initViewData();
          }
        }
        wx.removeStorageSync(Config.REFRESH_INDEX);
      }
    } catch (e) {
      console.error(e);
    }
  },
  fetchData() {
    sendRequest({
      method: 'POST',
      url: API.INDEX,
      data: {
        date: this.data.date
      }
    }).then(resp => {
      // 保存原始数据
      sourceData = resp.data;
      this.initViewData();
    }).catch(e => {
      wx.showToast({
        title: '服务器繁忙，请稍后重试！',
        icon: 'none'
      })
    })
  },
  initViewData() {
    let data = this.formatData();
    let items = [0, 0, 0];
    data.forEach(item => {
      let arr = item.data;
      items[0] += this.calculate(arr, Config.IN);
      items[1] += this.calculate(arr, Config.OUT);
      items[2] += this.calculate(arr);
    });
    items = items.map(num => (num / 100).toFixed(2));
    this.setData({
      incoming: items[0],
      outgoings: items[1],
      surplus: items[2],
      details: data
    })
  },
  formatData() {
    let result = [];
    let keys = [];
    sourceData.forEach(item => {
      let key = item.bill_date;
      let data = Object.create(null);
      data.id = item.id;
      data.type = item.type;
      data.key = item.bill_type;
      data.value = item.amount;
      data.remarks = item.remarks;
      if (keys.includes(key)) {
        result.find(item => item.date === key).data.push(data);
      } else {
        keys.push(key);
        result.push({
          date: key,
          data: [data]
        })
      }
    });
    return result;
  },
  calculate(arr, type) {
    var totalAmount = arr.reduce(function (sum, item) {
      if (typeof type !== 'undefined') {
        var amount = item.type === type ? item.value : 0;
        return sum += amount;
      } else {
        var base = item.type === 0 ? 1 : -1;
        return sum += base * item.value;
      }
    }, 0);
    return totalAmount;
  },
  handleDateChange(e) {
    let arr = e.detail.value.split('-');
    this.setData({
      date: `${arr[0]}-${arr[1]}`
    });
    this.fetchData();
  },
  addRecord() {
    wx.navigateTo({
      url: '../record/record?type=add',
    })
  },
  showDetail(e) {
    let id = e.currentTarget.dataset.id;
    let idx = e.currentTarget.dataset.idx;
    let date = this.data.details[idx].date;
    let target = this.data.details[idx].data.find(item => item.id === id);
    wx.setStorage({
      data: {
        date,
        ...target
      },
      key: Config.BILL_DETAIL,
      complete() {
        wx.navigateTo({
          url: '../detail/detail'
        })
      }
    })
  }
})