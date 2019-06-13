// pages/game/game.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: Array(9).fill(''),
    color: Array(9).fill('black'),
    next: 'X',
    haveWinner:false,
    winner: '',
    end: false,

  },
  resetGame:function(){
    const initDate = {
      data: Array(9).fill(''),
      color: Array(9).fill('black'),
      next: 'X',
      haveWinner: false,
      winner: '',
      end:false,
    };
    this.setData(initDate);
  },
  checkEndGame:function(data){
    return data.every(function(val){
      return val!==''
    })
  },
  tapSelect: function (e) {
    const idx = e.target.id;
    const _dummy = this.data.data;
    if (_dummy[idx] === '' && !this.data.haveWinner && !this.data.end) {
      _dummy[idx] = this.data.next;
      const winner = this.calculateWinner(_dummy);
      this.setData({
        data: _dummy,
        next: this.data.next === 'X' ? 'O' : 'X',
        haveWinner: winner?true:false,
        winner: winner,
        end: this.checkEndGame(_dummy)
      })
    }
  },
  calculateWinner: function (squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        const _color = this.data.color.map(function(color,idx){
          if(idx==a||idx==b||idx==c) return 'red';
          return color;
        });
        this.setData({ color: _color});
        return squares[a];
      }
    }
    return null;
  },
  /*
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