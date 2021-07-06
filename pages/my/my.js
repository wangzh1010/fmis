const app = getApp();
const API = require('../../config/api.js');
const Utils = require('../../utils/util.js');
const Config = require('../../config/config.js');
let loaded = false;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUseGetUserProfile: false,
        days: 0,
        billDays: 0,
        billNums: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        loaded = true;
        app.globalData.pageLoaded.my = true;
        this.fetchData();
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            });
        }
        if (wx.getUserProfile) {
            this.setData({
                canIUseGetUserProfile: true
            });
        }
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
            let status = wx.getStorageSync(Config.RELOAD_MY);
            status = parseInt(status);
            if (loaded && status === 1) {
                this.fetchData();
                wx.setStorageSync(Config.RELOAD_MY, 0);
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
        Utils.sendRequest({
            url: API.MY
        }).then(resp => {
            this.setData({
                days: resp.data.days,
                billDays: resp.data.bill_days,
                billNums: resp.data.bill_nums,
            })
        }).catch(e => {
            wx.showToast({
                title: '网络异常，请稍后重试！',
                icon: 'none'
            });
        });
    },
    getUserProfile(e) {
        wx.getUserProfile({
            desc: '获取微信头像和昵称',
            success: (res) => {
                try {
                    wx.setStorageSync(Config.USER_INFO, JSON.stringify(res.userInfo));
                } catch (e) {
                    console.error(e);
                }
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        })
    },
    getUserInfo(e) {
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },
    showClassify() {
        wx.navigateTo({
            url: '../classify/classify'
        })
    },
    showApply() {
        wx.navigateTo({
            url: '../apply/apply'
        })
    },
    showAboutUs() {
        wx.navigateTo({
            url: '../about/about'
        })
    }
})