const Config = require('../config/config.js');
const API = require('../config/api.js');
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('-')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

function transformType(item) {
  let key = item.type === Config.IN ? 'incoming' : 'outgoings';
  var arr = Config[key];
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].key === item.key) {
      return arr[i].value;
    }
  }
  return '';
}

function transformImageURL(item, suffix = '') {
  var key = item.type === Config.IN ? 'incoming' : 'outgoings';
  var arr = Config[key];
  if (suffix) {
    suffix = '_' + suffix;
  }
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].key === item.key) {
      return '../../assets/' + arr[i].pinyin + suffix + '.png';
    }
  }
  return '';
}

function formatMoney(data) {
  if (!data) {
    return data;
  }
  if (typeof data !== 'object') {
    return (data / 100).toFixed(2);
  }
  var base = data.type === 0 ? 1 : -1;
  return (base * data.value / 100).toFixed(2);
}

function accquireToken() {
  return new Promise((resolve, reject) => {
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        sendRequest({
          url: API.REGISTER,
          data: {
            code: res.code
          }
        }).then(resp => {
          resolve(resp);
        }).catch(e => {
          console.error(e);
          reject(e);
        });
      }
    })
  });
}

function sendRequest(options) {
  return new Promise((resolve, reject) => {
    let data = options.data;
    let times = Config.RETRY_TIMES;
    let delay = Config.RETRY_DELAY;
    let url = Config.SERVER + options.url;
    let token = wx.getStorageSync(Config.ACCESS_TOKEN);
    data.token = token;

    function ajax() {
      return new Promise((resolve, reject) => {
        wx.request({
          url: url,
          data: data,
          dataType: 'json',
          method: options.method || 'POST',
          header: options.header || {
            'content-type': 'application/json'
          },
          success(resp) {
            if (resp.statusCode === 200 && resp.data && resp.data.code === 200) {
              resolve(resp.data)
            } else {
              reject(resp)
            }
          },
          fail(e) {
            reject(e)
          }
        });
      });
    }

    function attempt() {
      ajax().then(data => {
        resolve(data);
      }).catch(e => {
        let code = e && e.data && e.data.code;
        if (code === 400) {
          // 无效的请求
          reject(e);
        } else if (code === 403) {
          // 无效的token
          accquireToken().then(resp => {
            data.token = resp.token;
            try {
              wx.setStorageSync(Config.ACCESS_TOKEN, resp.token);
            } catch (e) {
              console.error(e);
            }
            if (times > 0) {
              times--;
              setTimeout(attempt, delay);
            } else {
              reject(e);
            }
          }).catch(e => {
            reject(e)
          })
        } else {
          // 更新 token
          if (code === 201) {
            data.token = e.data.token;
            try {
              wx.setStorageSync(Config.ACCESS_TOKEN, e.data.token);
            } catch (e) {
              console.error(e);
            }
          }
          if (times > 0) {
            times--;
            setTimeout(attempt, delay);
          } else {
            reject(e);
          }
        }
      })
    }
    attempt();
  });
}

module.exports = {
  formatTime,
  formatMoney,
  sendRequest,
  transformType,
  accquireToken,
  transformImageURL
}