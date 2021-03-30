// app.js
const {
  ACCESS_TOKEN
} = require('./config/config.js');
const {
  sendRequest
} = require('./utils/util.js');
App({
  onLaunch() {
    try {
      let token = wx.getStorageSync(ACCESS_TOKEN);
      this.wechatLogin(token);
    } catch (error) {
      this.wechatLogin();
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
    accessToken: null
  },
  wechatLogin(token) {
    if (token) {
      sendRequest({
        url: '/fmis/login',
        data: {
          token
        }
      }).then(resp => {
        if (resp.code === 200) {
          this.globalData.accessToken = resp.token;
          wx.setStorage({
            data: resp.token,
            key: ACCESS_TOKEN,
          });
          if (this.accessTokenReadyCallback) {
            this.accessTokenReadyCallback(resp.token);
          }
        } else {
          this.register();
        }
      })
    } else {
      this.register();
    }
  },
  register() {
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        sendRequest({
          url: '/fmis/register',
          data: {
            code: res.code
          }
        }).then(resp => {
          if (resp.code === 200) {
            this.globalData.accessToken = resp.token;
            wx.setStorage({
              data: resp.token,
              key: ACCESS_TOKEN,
            });
            if (this.accessTokenReadyCallback) {
              this.accessTokenReadyCallback(resp.token);
            }
          } else {
            wx.showToast({
              title: '服务器异常，请稍后重试！',
            })
          }
        })
      }
    })
  }
})