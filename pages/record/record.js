const {
    formatTime,
    sendRequest
} = require('../../utils/util.js');
const API = require('../../config/api.js');
const Config = require('../../config/config.js');
const app = getApp();
const date = formatTime(new Date());
let year = parseInt(date.match(/^\d{4}/)[0]);
let day = date.match(/^\d{4}\-\d{2}\-\d{2}/)[0];
let reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: '',
        type: '',
        currentTab: '',
        list: [],
        open: false,
        key: -1,
        value: '请选择',
        icon: '',
        day: day,
        money: '',
        remarks: '',
        start: `${year - 5}-01-01`,
        end: `${year + 5}-01-01`
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 缓存数据
        let data = {
            id: 0,
            type: options.tab ? parseInt(options.tab) : Config.OUT
        };
        // 当前页面是新增还是修改标识
        let type = options.type;
        // 修改
        if (type === Config.ACT_MODIFY) {
            // 获取缓存数据
            try {
                data = wx.getStorageSync(Config.BILL_MODIFY);
            } catch (e) {
                console.error(e);
            }
        }
        // 设置当前页面类型标识
        this.setData({
            id: data.id,
            type: type
        });
        // 刷新数据
        this.refreshCategories(data);
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
        try {
            wx.removeStorageSync(Config.BILL_MODIFY);
        } catch (e) {
            console.error(e);
        }
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
        // 新增时可选择收入还是支出
        let type = e.target.dataset.type;
        if (this.data.currentTab !== type) {
            this.refreshCategories({
                type: type
            });
        }
    },
    refreshCategories(data) {
        this.setData({
            currentTab: data.type,
            list: data.type === Config.IN ? Config.incoming : Config.outgoings,
            key: data.key || -1,
            value: data.category || '请选择',
            icon: data.icon || '',
            money: data.amount || '',
            remarks: data.remarks || '',
            day: data.date || day
        });
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
        let key = this.data.currentTab === Config.IN ? 'incoming' : 'outgoings';
        let target = Config[key].find(item => item.key === e.currentTarget.dataset.key);
        this.setData({
            key: target.key,
            value: target.value,
            icon: '../../assets/' + target.pinyin + '_on.png'
        });
    },
    handleDateChange(e) {
        let day = e.detail.value;
        if (this.data.day !== day) {
            this.setData({
                day: day
            });
        }
    },
    handleMoneyChange(e) {
        this.setData({
            money: e.detail.value
        })
    },
    handleRemarksChange(e) {
        this.setData({
            remarks: e.detail.value
        })
    },
    handleSaveBtnClick() {
        if (this.data.key === -1) {
            wx.showToast({
                title: '请选择分类',
                icon: 'none'
            });
            return;
        }
        if (this.data.money === '') {
            wx.showToast({
                title: '请输入金额',
                icon: 'none'
            });
            return;
        }
        if (!reg.test(this.data.money)) {
            wx.showToast({
                title: '请输入正确的金额',
                icon: 'none'
            });
            return;
        }
        if (this.data.money > 9999999) {
            wx.showToast({
                title: '超出金额范围',
                icon: 'none'
            });
            return;
        }
        if (this.data.type === Config.ACT_ADD) {
            // index more bill
            this.addBill();
        } else if (this.data.type === Config.ACT_MODIFY) {
            // detail
            this.modifyBill();
        } else {
            wx.showToast({
                title: '系统异常，请稍后重试！',
                icon: 'none'
            });
        }
    },
    addBill() {
        sendRequest({
            method: 'POST',
            url: API.ADD,
            data: {
                type: this.data.currentTab,
                date: this.data.day,
                key: this.data.key,
                amount: this.data.money,
                remarks: this.data.remarks
            }
        }).then(resp => {
            try {
                // 刷新首页
                wx.setStorageSync(Config.RELOAD_INDEX, 1);
                // 如果其他TAB页已加载过则刷新
                let {
                    more,
                    bill,
                    my
                } = app.globalData.pageLoaded;
                if (more) {
                    wx.setStorageSync(Config.RELOAD_MORE, 1);
                }
                if (bill) {
                    wx.setStorageSync(Config.RELOAD_BILL, 1);
                }
                if (my) {
                    wx.setStorageSync(Config.RELOAD_MY, 1);
                }
            } catch (e) {
                console.error(e);
            }
            wx.showToast({
                title: resp.message,
                icon: 'none',
                success() {
                    setTimeout(() => {
                        wx.navigateBack();
                    }, 300);
                }
            });
        }).catch(e => {
            wx.showToast({
                title: '服务器繁忙，请稍后重试！',
                icon: 'none'
            })
        })
    },
    modifyBill() {
        let data = {
            id: this.data.id,
            date: this.data.day,
            key: this.data.key,
            amount: this.data.money,
            remarks: this.data.remarks
        };
        sendRequest({
            method: 'POST',
            url: API.UPDATE,
            data: data
        }).then(resp => {
            // 详情页刷新数据
            try {
                wx.setStorageSync(Config.REFRESH_DETAIL, JSON.stringify(data));
            } catch (e) {
                console.error(e);
            }
            // TAB页重新请求数据
            try {
                // 首页
                wx.setStorageSync(Config.RELOAD_INDEX, 1);
                // 如果其他TAB页已加载过则在页面显示的时候重新请求
                let {
                    more,
                    bill,
                    my
                } = app.globalData.pageLoaded;
                if (more) {
                    wx.setStorageSync(Config.RELOAD_MORE, 1);
                }
                if (bill) {
                    wx.setStorageSync(Config.RELOAD_BILL, 1);
                }
                if (my) {
                    wx.setStorageSync(Config.RELOAD_MY, 1);
                }
            } catch (e) {
                console.error(e);
            }
            wx.showToast({
                title: resp.message,
                icon: 'none',
                success() {
                    setTimeout(() => {
                        wx.navigateBack();
                    }, 300);
                }
            });
        }).catch(e => {
            wx.showToast({
                title: '服务器繁忙，请稍后重试！',
                icon: 'none'
            })
        })
    }
})