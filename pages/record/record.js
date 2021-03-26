const config = require('../../config/config.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentTab: config.OUT,
        list: [],
        open: false,
        key: -1,
        value: '请选择'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.refreshCategories();
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
    handleTabChange(e) {
        this.setData({
            currentTab: e.target.dataset.type
        });
        this.refreshCategories();
    },
    refreshCategories() {
        let list = this.data.currentTab === config.IN ? config.incoming : config.outgoings;
        this.setData({
            list
        })
    },
    showPopup() {
        this.setData({
            open: true
        });
    },
    handleCategorySelected(e) {
        this.setData({
            open: false
        });
        let key = this.data.currentTab === config.IN ? 'incoming' : 'outgoings';
        let target = config[key].find(item => item.key === e.currentTarget.dataset.key);
        this.setData({
            key: target.key,
            value: target.value
        })
    }
})