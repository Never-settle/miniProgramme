//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    list: [
      {
        id: 'utils',
        name: '功能',
        open: false,
        pages: [{ id: 'ledger', name: '支出记账' }]
      },
      {
        id: 'games',
        name: '休闲',
        open: false,
        pages: [{ id: 'tictactoe', name: '井字游戏' }, { id: 'whacamole', name: '打地鼠' }, { id: 'color', name: '识色游戏' }]
      },
    ],
    newFileName: ''
  },
  handleInput:function(e){
    this.setData({ newFileName: e.detail.value})
  },
  touchMove:function(e){
    console.log(e)
  },
  kindToggle: function (e) {
    var id = e.currentTarget.id, list = this.data.list;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      list: list
    });
  }, 
  handleNavTap:function(e){
    const id = e.currentTarget.id;
    const list = this.data.list;
    list.forEach((item)=>{item.open=false});
    this.setData({
      list: list
    });
    
  },
  getPic: function () {
    wx.chooseImage({ count: 1, success: (tempFilePaths) => { console.log(tempFilePaths) } })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      this.showInfo()
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        this.showInfo()
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          this.showInfo()
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    console.log(e.detail);
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    });
    this.showInfo()
  },
  showInfo: function () {
    const text = `Welcome ${this.data.userInfo.nickName} from ${this.data.userInfo.country}`;
    this.setData({
      motto: text
    })
  }
})