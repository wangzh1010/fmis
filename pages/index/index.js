// index.js
const config = require('../../config/config.js')
const {
  formatTime
} = require('../../utils/util.js');
const date = formatTime(new Date());
const year = parseInt(date.match(/^\d{4}/)[0]);
const yearMonth = date.match(/^\d{4}\-\d{2}/)[0];
// 获取应用实例
const app = getApp()
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    date: yearMonth,
    start: `${year - 5}-01-01`,
    end: `${year + 5}-01-01`,
    details: [{
      date: '2021-03-24',
      data: [{
          type: 0,
          key: 1,
          value: 9950
        },
        {
          type: 1,
          key: 1,
          value: 10034
        }
      ]
    }, {
      date: '2021-03-20',
      data: [{
          type: 0,
          key: 3,
          value: 1752389
        },
        {
          type: 1,
          key: 1,
          value: 10034
        }
      ]
    }],
    surplus: 0,
    incoming: 0,
    outgoings: 0
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
    let items = [0, 0, 0];
    this.data.details.forEach(item => {
      let arr = item.data;
      items[0] += this.calculate(arr, config.IN);
      items[1] += this.calculate(arr, config.OUT);
      items[2] += this.calculate(arr);
    });
    items = items.map(num => (num / 100).toFixed(2));
    this.setData({
      incoming: items[0],
      outgoings: items[1],
      surplus: items[2]
    })
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
  },
  addRecord() {
    wx.navigateTo({
      url: '../record/record',
    })
  },
  showDetail() {
    wx.navigateTo({
      url: '../detail/detail',
    })
  }
})