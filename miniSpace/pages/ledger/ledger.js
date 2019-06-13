// pages/ledger/ledger.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //公用
    dirctionSwitch: 0,
    pageHeight: 0,
    mode: {
      tabs: ["账单","修改"],
      activeIndex: 0
    },
    createTips: {
      textColor: 'black',
      text: '',
      hide: true
    },
    detailTips: {
      dirction: 'bottom',
    },
    poolSetting: {
      total: 0
    },
    prepaySetting: {
      person: [],
      currency: []
    },
    //经费管理模式用的数据
    poolLogTypeOption: ['支出', '收入'],
    poolLogType: 0,
    poolLogs: [],
    newPoolLog: {
      amount: '',
      desc: ''
    },
    poolTotal: 0,
    poolLeft: 0,
    //个人垫付模式用的数据
    prepayLogs: []
    //设置中的数据
  },
  deletePoolLogConfirm: function (e) {
    
    const index = (e.target.id || e.currentTarget.id).replace(/\_delete/ig,'');
    
    wx.showModal({
      title: '删除记录',
      content: '真要删除么？想清楚～',
      cancelText: '算了',
      confirmText: '删',
      confirmColor:'#f00',
      showCancel:true,
      success: (res) => { 
        if (res.confirm) {
          this.deletePoolLog(index);
        } else if (res.cancel) {
          this.hidePoolDelete();
        }},
      complete: () => { this.hidePoolDelete() },
    });
  },
  deletePoolLog: function (idx) {
    var poolLogs = this.data.poolLogs;
    poolLogs.splice(idx, 1);

    const poolTotal = poolLogs.map(item => (item.amount > 0 ? +item.amount : 0)).length > 0 ? poolLogs.map(item => (item.amount > 0 ? +item.amount : 0)).reduce((val1, val2) => (val1 + val2)) : 0;
    const poolLeft = poolLogs.map(item => +item.amount).length > 0 ? poolLogs.map(item => +item.amount).reduce((val1, val2) => (val1 + val2)) : 0;

    this.setData({
      poolLogs: poolLogs,
      poolLeft: poolLeft,
      poolTotal: poolTotal
    });
    const poolLogsStoprage = poolLogs.map(item => {
      return {
        amount: item.amount,
        desc: item.desc,
        time: item.time
      }
    });
    this.updateStorage(poolLogsStoprage, 'ledger_pool_logs');
  },
  toTime: function (t) {
    const time = new Date(t);
    const year = time.getFullYear();
    const month = (time.getMonth() + 1) < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1;
    const day = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();
    const hour = time.getHours() < 10 ? '0' + time.getHours() : time.getHours();
    const minute = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
    const second = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds();
    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
  },
  handleSelectChange: function (e) {
    var target = {};
    target[e.target.id] = e.detail.value
    this.setData(target)
  },
  updateStorage: function (data, target) {
    try {
      wx.setStorageSync(target, data);
    } catch (e) {
      console.error(e);
    }

  },
  showPoolDelete: function (e) {
    console.log('longtab');
    clearTimeout(this.deleteTimeoutHandle);
    const index = e.target.id || e.currentTarget.id;
    const list = this.data.poolLogs.map(function (item, idx) {
      if (idx == index) item.deleteHide = false;
      else item.deleteHide = true;
      return item
    })
    this.setData({ poolLogs: list });
    this.detailTimeoutHandle = setTimeout(() => { this.hidePoolDelete() }, 3000);
  },
  hidePoolDelete: function (e) {
    const list = this.data.poolLogs.map(function (item, idx) {
      item.deleteHide = true;
      return item
    })
    this.setData({ poolLogs: list })
  },
  showPoolDetail: function (e) {
    console.log('detail', e)
    clearTimeout(this.detailTimeoutHandle);
    const index = e.target.id || e.currentTarget.id;
    if (e.touches[0].clientY >= this.data.dirctionSwitch) {
      this.setData({ detailTips: { dirction: 'top' } })
    } else {
      this.setData({ detailTips: { dirction: 'bottom' } })
    }
    const list = this.data.poolLogs.map(function (item, idx) {
      if (idx == index) item.hide = !item.hide;
      return item
    })
    this.setData({ poolLogs: list });
    this.detailTimeoutHandle = setTimeout(() => { this.hidePoolDetail() }, 3000);
  },
  hidePoolDetail: function () {
    const list = this.data.poolLogs.map(function (item, idx) {
      item.hide = true;
      return item
    })
    this.setData({ poolLogs: list })
  },
  //新建按钮提示框
  showCreateTip: function (option) {
    const options = {
      textColor: option.textColor || 'black',
      text: option.text || '提示',
      hide: false
    };
    this.setData({
      createTips: options
    });
    const duration = option.time || 1000;
    setTimeout(() => { this.hideCreateTip() }, duration)
  },
  hideCreateTip: function () {
    this.setData({
      createTips: {
        textColor: 'black',
        text: '',
        hide: true
      }
    });
  },
  //切换模式
  tabClick: function (e) {
    var mode = {
      tabs: this.data.mode.tabs,
      activeIndex: e.currentTarget.id
    };
    this.setData({
      mode: mode
    });
  },
  //处理输入
  handleInput: function (e) {
    var field = (e.target.id).split('.');
    var value = e.detail.value;
    var newData = {};
    //console.log(field)
    if (field[0] == 'newPoolLog') {
      //console.log();
      newData = JSON.parse(JSON.stringify(this.data[field[0]]));
      newData[field[1]] = value;
      this.setData({ newPoolLog: newData });
    }

  },
  //处理新建
  handleCreate: function (e) {
    var field = e.target.id;
    if (field == 'newPoolCreate') {
      this.insertPoolLog();
    }
    //this.setData({ newFolderName: '' });
    //this.createSuc();
  },
  createSuc: function () {
    wx.showToast({
      title: '创建成功',
      icon: 'success',
      duration: 2000
    });
  },
  insertPoolLog: function () {
    if (this.data.newPoolLog.amount == '') {
      console.log('金额空')
      this.showCreateTip({ text: '请输入金额', textColor: 'red' });
      return;
    } else if (parseFloat(this.data.newPoolLog.amount) != this.data.newPoolLog.amount) {
      console.log('金额输入不是数字')
      this.showCreateTip({ text: '金额输入需要为数字', textColor: 'red' });
      return;
    }
    if (this.data.newPoolLog.desc == '') {
      console.log('详情空')
      this.showCreateTip({ text: '请输入详情', textColor: 'red' });
      return;
    }

    var poolLogs = this.data.poolLogs;
    var newPoolLog = JSON.parse(JSON.stringify(this.data.newPoolLog));
    newPoolLog.amount = this.data.poolLogType == 0 ? -parseFloat(newPoolLog.amount) : newPoolLog.amount;
    newPoolLog.time = (new Date()).getTime();
    newPoolLog.hide = true;
    newPoolLog.deleteHide = true;
    newPoolLog.toDate = (new Date(newPoolLog.time)).toLocaleDateString();
    newPoolLog.toTime = this.toTime(newPoolLog.time);
    poolLogs.push(newPoolLog);

    const poolTotal = poolLogs.map(item => (item.amount > 0 ? +item.amount : 0)).length > 0 ? poolLogs.map(item => (item.amount > 0 ? +item.amount : 0)).reduce((val1, val2) => (val1 + val2)) : 0;
    const poolLeft = poolLogs.map(item => +item.amount).length > 0 ? poolLogs.map(item => +item.amount).reduce((val1, val2) => (val1 + val2)) : 0;
    this.setData({
      poolLogs: poolLogs,
      newPoolLog: {
        amount: '',
        desc: ''
      },
      poolLeft: poolLeft,
      poolTotal: poolTotal
    });
    const poolLogsStoprage = poolLogs.map(item => {
      return {
        amount: item.amount,
        desc: item.desc,
        time: item.time
      }
    });
    this.updateStorage(poolLogsStoprage, 'ledger_pool_logs');
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const ledger_pool_logs = (wx.getStorageSync('ledger_pool_logs') || []).map(item => {
      item.deleteHide = true;
      item.hide = true;
      item.toDate = (new Date(item.time)).toLocaleDateString();
      item.toTime = this.toTime(item.time);
      return item
    });
    const ledger_prepay_logs = (wx.getStorageSync('ledger_prepay_logs') || []).map(item => {
      item.hide = true;
      return item
    });
    const ledger_pool_setting = wx.getStorageSync('ledger_pool_setting') || {};
    const ledger_prepay_setting = wx.getStorageSync('ledger_prepay_setting') || {
      person: [],
      currency: []
    };
    //console.log(app.globalData.devideInfo)
    const poolTotal = ledger_pool_logs.map(item => (item.amount > 0 ? +item.amount : 0)).length > 0 ? ledger_pool_logs.map(item => (item.amount > 0 ? +item.amount : 0)).reduce((val1, val2) => (val1 + val2)) : 0;
    const poolLeft = ledger_pool_logs.map(item => +item.amount).length > 0 ? ledger_pool_logs.map(item => +item.amount).reduce((val1, val2) => (val1 + val2)) : 0;
    this.setData({
      dirctionSwitch: app.globalData.devideInfo.windowHeight * 2 / 3,
      pageHeight: app.globalData.devideInfo.windowHeight,
      poolSetting: ledger_pool_setting,
      prepaySetting: ledger_prepay_setting,
      poolLogs: ledger_pool_logs,
      prepayLogs: ledger_prepay_logs,
      poolLeft: poolLeft,
      poolTotal: poolTotal
    });
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