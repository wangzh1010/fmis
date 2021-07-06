const {
    formatTime,
    sendRequest
} = require('../../utils/util.js');
const API = require('../../config/api.js');
const Config = require('../../config/config.js');
const app = getApp();
const date = formatTime(new Date());
const year = parseInt(date.match(/^\d{4}/)[0]);
let loaded = false;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        date: year,
        start: `${year - 5}-01-01`,
        end: `${year + 5}-01-01`,
        surplus: 0,
        incoming: 0,
        outgoing: 0,
        results: {},
        noResults: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        loaded = true;
        app.globalData.pageLoaded.bill = true;
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
            let status = wx.getStorageSync(Config.RELOAD_BILL);
            status = parseInt(status);
            if (loaded && status === 1) {
                this.fetchData();
                wx.setStorageSync(Config.RELOAD_BILL, 0);
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
            url: API.BILL,
            data: {
                date: this.data.date
            }
        }).then(resp => {
            let data = this.formatData(resp.data);
            this.setData({
                noResults: !data.keys.length,
                results: data.results,
                surplus: data.surplus,
                incoming: data.incoming,
                outgoing: data.outgoing
            });
        }).catch(e => {
            wx.showToast({
                title: '服务器繁忙，请稍后重试！',
                icon: 'none'
            });
        });
    },
    formatData(arr) {
        let data = Object.create(null);
        data.incoming = 0;
        data.outgoing = 0;
        data.surplus = 0;
        data.keys = [];
        data.results = {};
        arr.forEach(item => {
            let key = item.type === Config.IN ? 'incoming' : 'outgoing';
            if (data.keys.includes(item.mont)) {
                data.results[item.mont][item.type] = item.amount;
            } else {
                data.keys.push(item.mont);
                data.results[item.mont] = [0, 0];
                data.results[item.mont][item.type] = item.amount;
            }
            data[key] += item.amount;
        });
        data.surplus = data.incoming - data.outgoing;
        return data;
    },
    handleDateChange(e) {
        let date = parseInt(e.detail.value);
        if (this.data.date !== date) {
            this.setData({
                date: date
            });
            this.fetchData();
        }
    },
    addRecord() {
        wx.navigateTo({
            url: '../record/record?type=' + Config.ACT_ADD
        })
    }
})