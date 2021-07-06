const {
    formatTime,
    sendRequest,
    transformType
} = require('../../utils/util.js');
const Config = require('../../config/config.js');
const API = require('../../config/api.js');
const WxCharts = require('../../lib/wxcharts-min.js');
const app = getApp();
const date = formatTime(new Date());
const year = parseInt(date.match(/^\d{4}/)[0]);
const month = parseInt(date.match(/^\d{4}-(\d{2})/)[1]);
const yearMonth = date.match(/^\d{4}\-\d{2}/)[0];
let incoming = null;
let outgoings = null;
let pieChart = null;
let loaded = false;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        month: month,
        date: yearMonth,
        start: `${year - 5}-01-01`,
        end: `${year + 5}-01-01`,
        currentTab: Config.OUT,
        width: 320,
        height: 320,
        details: [],
        total: [0, 0],
        list: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        loaded = true;
        app.globalData.pageLoaded.more = true;
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
        try {
            let status = wx.getStorageSync(Config.RELOAD_MORE);
            status = parseInt(status);
            if (loaded && status === 1) {
                this.fetchData();
                wx.setStorageSync(Config.RELOAD_MORE, 0);
            }
        } catch (e) {
            console.error(e)
        }
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
            if (resp.code === 200) {
                let data = this.formatData(resp.data);
                incoming = this.classification(data, Config.IN);
                outgoings = this.classification(data, Config.OUT);
                this.refreshData();
                this.refreshPieChart();
            }
        }).catch(e => {
            wx.showToast({
                title: '服务器繁忙，请稍后重试！',
                icon: 'none'
            });
        });
    },
    handleDateChange(e) {
        let date = e.detail.value;
        if (this.data.date !== date) {
            let month = date.match(/\d{4}-(\d{2})/)[1];
            this.setData({
                month: parseInt(month),
                date: date
            });
            this.fetchData();
        }
    },
    handleTabChange(e) {
        let type = e.target.dataset.type;
        if (this.data.currentTab !== type) {
            this.setData({
                currentTab: e.target.dataset.type
            });
            this.refreshData();
            this.refreshPieChart();
        }
    },
    refreshData() {
        this.setData({
            list: this.data.currentTab === Config.OUT ? outgoings : incoming
        })
    },
    refreshPieChart() {
        let name = (this.data.total[this.data.currentTab] / 100).toFixed(2);
        let subname = this.data.currentTab === Config.OUT ? '支出' : '收入';
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
        let data = this.data.currentTab === Config.OUT ? outgoings : incoming;
        data.forEach(item => {
            series.push({
                name: transformType(item),
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
    },
    addRecord() {
        wx.navigateTo({
            url: '../record/record?type=' + Config.ACT_ADD + '&tab=' + this.data.currentTab,
        })
    }
})