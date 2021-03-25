// pages/more/more.js
const {
    formatTime
} = require('../../utils/util.js');
const date = formatTime(new Date());
const year = date.match(/^\d{4}/)[0];
const yearMonth = date.match(/^\d{4}\-\d{2}/)[0];
const config = require('../../config/config.js');
const WxCharts = require('../../lib/wxcharts-min.js')
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
        details: {
            incoming: [{
                key: 1,
                value: 9900
            }, {
                key: 2,
                value: 1987
            }, {
                key: 3,
                value: 19990
            }, {
                key: 4,
                value: 9922
            }],
            outgoings: [{
                key: 1,
                value: 9900
            }, {
                key: 2,
                value: 1987
            }, {
                key: 3,
                value: 19990
            }, {
                key: 4,
                value: 9922
            }, {
                key: 5,
                value: 9022
            }, {
                key: 6,
                value: 7922
            }]
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        new WxCharts({
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
                name: '10%',
                color: '#7cb5ec',
                fontSize: 20
            },
            subtitle: {
                name: '收益率',
                color: '#666666',
                fontSize: 15
            },
            series: [{
                name: 'A',
                data: 10
            }, {
                name: 'B',
                data: 10
            }, {
                name: 'C',
                data: 12
            }, {
                name: 'D',
                data: 15
            }, {
                name: 'E',
                data: 20
            }, {
                name: 'E',
                data: 25
            }],
            width: this.data.width,
            height: this.data.height,
            dataLabel: true,
            legend: false,
            disablePieStroke: true,
            background: '#fff'
        })
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
    }
})