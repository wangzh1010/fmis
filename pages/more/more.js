// pages/more/more.js
const {
    formatTime
} = require('../../utils/util.js');
const date = formatTime(new Date());
const year = parseInt(date.match(/^\d{4}/)[0]);
const yearMonth = date.match(/^\d{4}\-\d{2}/)[0];
const config = require('../../config/config.js');
const Utils = require('../../utils/util.js');
const WxCharts = require('../../lib/wxcharts-min.js');
let incoming = null;
let outgoings = null;
let pieChart = null;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        date: yearMonth,
        start: year - 5,
        end: year + 5,
        currentTab: config.OUT,
        width: 320,
        height: 320,
        details: [{
            type: 0,
            key: 1,
            value: 9900
        }, {
            type: 0,
            key: 2,
            value: 1987
        }, {
            type: 0,
            key: 3,
            value: 19990
        }, {
            type: 0,
            key: 4,
            value: 9922
        }, {
            type: 1,
            key: 1,
            value: 9900
        }, {
            type: 1,
            key: 2,
            value: 1987
        }, {
            type: 1,
            key: 3,
            value: 19990
        }, {
            type: 1,
            key: 4,
            value: 9922
        }, {
            type: 1,
            key: 5,
            value: 9022
        }, {
            type: 1,
            key: 6,
            value: 7922
        }],
        total: [0, 0],
        list: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        incoming = this.classification(config.IN);
        outgoings = this.classification(config.OUT);
        this.refreshData();
        this.refreshPieChart();
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
    handleDateChange(e) {
        this.setData({
            date: e.detail.value
        })
    },
    handleTabChange(e) {
        this.setData({
            currentTab: e.target.dataset.type
        });
        this.refreshData();
        this.refreshPieChart();
    },
    refreshData() {
        this.setData({
            list: this.data.currentTab === config.OUT ? outgoings : incoming
        })
    },
    refreshPieChart() {
        let name = (this.data.total[this.data.currentTab] / 100).toFixed(2);
        let subname = this.data.currentTab === config.OUT ? '支出' : '收入';
        if (pieChart) {
            pieChart.updateData({
                series: this.formatSeries(),
                title: {
                    name: name
                },
                subtitle: {
                    name: subname
                }
            });
            return;
        }
        pieChart = new WxCharts({
            animation: true,
            canvasId: 'pieCanvas',
            type: 'ring',
            extra: {
                ringWidth: 25,
                pie: {
                    offsetAngle: -45
                }
            },
            title: {
                name: name,
                color: '#7cb5ec',
                fontSize: 16
            },
            subtitle: {
                name: subname,
                color: '#666666',
                fontSize: 16
            },
            series: this.formatSeries(),
            width: this.data.width,
            height: this.data.height,
            dataLabel: true,
            legend: false,
            disablePieStroke: true,
            background: '#fff'
        })
    },
    formatSeries() {
        let series = [];
        let data = this.data.currentTab === config.OUT ? outgoings : incoming;
        data.forEach(item => {
            series.push({
                name: Utils.transformType(item),
                data: item.value
            })
        })
        return series;
    },
    classification(type) {
        let arr = this.data.details.filter(item => item.type === type);
        let amount = arr.reduce((sum, item) => {
            return sum += item.value;
        }, 0);
        arr.forEach(item => {
            item.rate = (item.value / amount * 100).toFixed(2);
        })
        this.setData({
            ['total[' + type + ']']: amount
        });
        return arr;
    },
    showStatis(e){
        let key = e.currentTarget.dataset.key;
        console.log(key)
        wx.navigateTo({
          url: '../statis/statis?key' + key,
        })
    }
})