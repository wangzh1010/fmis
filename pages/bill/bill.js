const API = require('../../config/api.js');
const config = require('../../config/config.js');
const {
    formatTime,
    sendRequest
} = require('../../utils/util.js');
const date = formatTime(new Date());
const year = parseInt(date.match(/^\d{4}/)[0]);
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
        results: [],
        list: [{
            type: 0,
            mont: '2021-04',
            amount: 330916
        }, {
            type: 1,
            mont: '2021-04',
            amount: 17981
        }, {
            type: 0,
            mont: '2021-03',
            amount: 403597
        }, {
            type: 1,
            mont: '2021-03',
            amount: 632716
        }, {
            type: 1,
            mont: '2021-02',
            amount: 153931
        }, {
            type: 0,
            mont: '2021-02',
            amount: 397812
        }, {
            type: 0,
            mont: '2021-01',
            amount: 378712
        }, {
            type: 1,
            mont: '2021-01',
            amount: 107893
        }]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let data = this.formatData(this.data.list);
        this.setData({
            results: data.results,
            surplus: data.surplus,
            incoming: data.incoming,
            outgoing: data.outgoing
        })
        return;
        sendRequest({
            url: API.BILL,
            data: {
                date: this.data.date
            }
        }).then(resp => {
            if (resp.code === 200) {
                let data = this.formatData(resp.data);
                this.setData({
                    results: data.results,
                    surplus: data.surplus,
                    incoming: data.incoming,
                    outgoing: data.outgoing
                })
            } else {
                wx.showToast({
                    title: resp.message,
                });
            }
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
    formatData(arr) {
        let data = Object.create(null);
        data.incoming = 0;
        data.outgoing = 0;
        data.surplus = 0;
        data.keys = [];
        data.results = {};
        arr.forEach(item => {
            let key = item.type === config.IN ? 'incoming' : 'outgoing';
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
    }
})