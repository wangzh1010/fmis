// pages/more/more.js
const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const day = date.getDate()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        date: `${year}-${month}-${day}`,
        start: year - 5,
        end: year + 5
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

    },

    add() {

    },

    handleDateChange(e) {
        this.setData({
            date: e.detail.value
        })
    }
})