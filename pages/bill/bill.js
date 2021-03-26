// pages/bill/bill.js
const {
    formatTime
} = require('../../utils/util.js');
const date = formatTime(new Date());
const year = date.match(/^\d{4}/)[0];
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
        outgoings: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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

    }
})