const config = require('../config/config.js');
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
  let key = item.type === config.IN ? 'incoming' : 'outgoings';
  var arr = config[key];
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].key === item.key) {
      return arr[i].value;
    }
  }
  return '';
}

function sendRequest(options) {
  return new Promise((resolve, reject) => {
    let data = options.data;
    let times = config.RETRY_TIMES;
    let delay = config.RETRY_DELAY;
    let url = config.SERVER + options.url;
    let token = wx.getStorageSync(config.ACCESS_TOKEN);
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
        if (times > 0) {
          times--;
          setTimeout(attempt, delay);
        } else {
          reject(e);
        }
      })
    }
    attempt();
  });
}

module.exports = {
  formatTime,
  sendRequest,
  transformType
}