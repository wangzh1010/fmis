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
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
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
      }).then(data => {
        this.globalData.accessToken = data.token;
        wx.setStorage({
          data: data.token,
          key: ACCESS_TOKEN,
        })
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
        }).then(data => {
          this.globalData.accessToken = data.token;
          wx.setStorage({
            data: data.token,
            key: ACCESS_TOKEN,
          })
        })
      }
    })
  }
})