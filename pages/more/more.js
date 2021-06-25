// pages/more/more.js
const {
    formatTime,
    sendRequest
} = require('../../utils/util.js');
const date = formatTime(new Date());
const year = parseInt(date.match(/^\d{4}/)[0]);
const month = parseInt(date.match(/^\d{4}-(\d{2})/)[1]);
const yearMonth = date.match(/^\d{4}\-\d{2}/)[0];
const config = require('../../config/config.js');
const API = require('../../config/api.js');
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
        month: month,
        date: yearMonth,
        start: `${year - 5}-01-01`,
        end: `${year + 5}-01-01`,
        currentTab: config.OUT,
        width: 320,
        height: 320,
        details: [{
            type: 0,
            key: 1,
            value: 300000
        }, {
            type: 0,
            key: 2,
            value: 53144
        }, {
            type: 0,
            key: 3,
            value: 28781
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
        incoming = this.classification(this.data.details, config.IN);
        outgoings = this.classification(this.data.details, config.OUT);
        this.refreshData();
        this.refreshPieChart();
        this.fetchData();
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
    fetchData() {
        sendRequest({
            method: 'POST',
            url: API.MORE,
            data: {
                date: this.data.date
            }
        }).then(resp => {
            console.log(resp);
            if (resp.code === 200) {
                let data = this.formatData(resp.data);
                incoming = this.classification(data, config.IN);
                outgoings = this.classification(data, config.OUT);
                this.refreshData();
                this.refreshPieChart();
            }
        });
    },
    handleDateChange(e) {
        this.setData({
            date: e.detail.value
        });
        this.fetchData();
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
        let series = this.formatSeries();
        if (!series.length) {
            return;
        }
        if (pieChart) {
            pieChart.updateData({
                series: series,
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
            series: series,
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
    formatData(arr) {
        let result = [];
        arr.forEach(item => {
            let data = Object.create(null);
            data.type = item.type;
            data.key = item.bill_type;
            data.value = item.amount;
            result.push(data);
        })
        return result;
    },
    classification(data, type) {
        let arr = data.filter(item => item.type === type);
        let amount = arr.reduce((sum, item) => {
            return sum += item.value;
        }, 0);
        arr.forEach(item => {
            item.rate = (item.value / amount * 100).toFixed(2);
        });
        console.log(amount);
        this.setData({
            ['total[' + type + ']']: amount
        });
        return arr;
    },
    showStatis(e) {
        let bill_type = e.currentTarget.dataset.key;
        let type = this.data.currentTab;
        wx.navigateTo({
            url: '../statis/statis?type=' + type + '&bill_type=' + bill_type + '&date=' + this.data.date,
        })
    }
})