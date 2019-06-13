const pageData = {
  data: {},
  toGo: function () {
    wx.redirectTo({
      url: '../game/game',
    })
  },

   f0: function () {
    wx.redirectTo({
      url: '../game/game?gametime=60&select=2'
    });
  },
  f1: function () {
    wx.redirectTo({
      url: '../game/game?gametime=50&select=1'
    });
  },
  f2: function () {
    wx.redirectTo({
      url: '../game/game?gametime=40&select=0'
    });
  },
  // 跳转到游戏说明
  torecommand: function () {
    wx.redirectTo({
      url: '/pages/recommand/recommand',
    })
  }

};
Page(pageData);