// app.js
const API = require('./config/api.js');
const {
  USER_INFO,
  ACCESS_TOKEN
} = require('./config/config.js');
const {
  sendRequest,
  accquireToken
} = require('./utils/util.js');

App({
  onLaunch() {
    try {
      let userInfo = wx.getStorageSync(USER_INFO);
      if (userInfo) {
        this.globalData.userInfo = JSON.parse(userInfo);
      }
    } catch (e) {
      console.error(e);
    }
    try {
      let token = wx.getStorageSync(ACCESS_TOKEN);
      // 如果可以从本地存储中获取token 使用获取的token登录
      if (!!token) {
        this.wechatLogin(token);
      } else {
        // 未获取到token 先去获取token
        this.register();
      }
    } catch (e) {
      // 调用接口失败
      console.error(e);
      // 重新获取token
      this.register();
    }
  },
  onShow() {
    console.log('show...' + this.route)
  },
  onHide() {
    console.log('hide...')
  },
  onError(err) {
    console.error(err)
  },
  onPageNotFound(res) {
    console.error(JSON.stringify(res))
  },
  onUnhandledRejection(res) {
    console.error(res.reason)
  },
  globalData: {
    userInfo: null,
    accessToken: null,
    pageLoaded: {
      more: false,
      bill: false,
      my: false
    }
  },
  wechatLogin(token) {
    sendRequest({
      url: API.LOGIN,
      data: {
        token
      }
    }).then(resp => {
      // 登录成功
      if (resp.code === 200) {
        if (resp.refresh) {
          // 需要刷新本地token
          try {
            wx.setStorageSync(ACCESS_TOKEN, resp.token);
            this.globalData.accessToken = resp.token;
          } catch (e) {
            console.error(e);
          }
        }
        // 如果已经打开了首页 则首页可以开始数据请求了
        if (this.accessTokenReadyCallback) {
          this.accessTokenReadyCallback();
        }
      } else if (resp.code === 403) {
        // 无效的token 重新获取
        this.register();
      } else {
        wx.showToast({
          title: resp.message,
          icon: 'none'
        });
      }
    }).catch(e => {
      wx.showToast({
        title: '网络异常，请稍后重试！',
        icon: 'none'
      });
    })
  },
  register() {
    accquireToken().then(resp => {
      this.globalData.accessToken = resp.token;
      wx.setStorage({
        data: resp.token,
        key: ACCESS_TOKEN
      });
      if (this.accessTokenReadyCallback) {
        this.accessTokenReadyCallback();
      }
    }).catch(e => {
      let message = (e && e.data && e.data.message) || '服务器繁忙，请稍后重试！';
      wx.showToast({
        title: message,
        icon: 'none'
      })
    });
  }
})