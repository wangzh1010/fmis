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

module.exports = {
  formatTime,
  transformType
}