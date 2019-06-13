// pages/whacamole/whacamole.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    holes: Array(9).fill(''),
    color: Array(9).fill('black'),
    freq:0.5,
    readyTime: 3,
    gameTime: 10,
    end: false,
    score:0
  },
  resetGame: function () { 
    this.setData({
      holes: Array(9).fill(''),
      color: Array(9).fill('black'),
      freq: 0.5,
      readyTime: 3,
      gameTime: 10,
      end: false,
      score: 0
    });
    this.score = 0;
    this.readySet();
  },
  hit: function (e) {
    if(this.data.end) return;
    const idx = e.target.id;
    const hit = this.data.holes[idx]==='X';
    const holes = Array(9).fill('');
    holes[idx] = 'O';
    if(hit){
      this.score = this.score+1;
      this.setData({
        score: this.score
      });
      clearInterval(this.moleTimer);
      this.releaseMole();
      }
  },
  readySet: function () {
    this.readyTimer = setInterval(
      () => this.readyTick(),
      1000
    );
  },
  readyTick: function () {
    if (this.data.readyTime) {
      this.setData({ readyTime: (this.data.readyTime - 1) })
    } else {
      clearInterval(this.readyTimer);
      this.goMole();
      this.go();
    }
  },
  go: function () {
    this.gameTimer = setInterval(
      () => this.gameClock(),
      1000
    );
    this.score = 0;
    this.releaseMole();
  },
  releaseMole:function(){
    this.moleTimer = setInterval(
      () => this.moleTick(),
      (this.data.freq * 1000)
    );
  },
  gameClock:function(){
    //console.log(this.data.gameTime);
    if (this.data.gameTime-1) {
      this.setData({
        gameTime: this.data.gameTime - this.data.freq
      });
    } else {
      this.setData({
        end: true
      });
      clearInterval(this.gameTimer);
    }
  },
  moleTick:function(){
    console.log(this.data.gameTime);
    if (!this.data.end) {
      this.goMole();
    } else {
      this.setData({
        holes: Array(9).fill('X'),
      });
      clearInterval(this.moleTimer);
    }
  },
  goMole: function () {
    const hole = Math.floor(Math.random() * 9);
    const holes = Array(9).fill('');
    holes[hole] = 'X';
    this.setData({
      holes: holes,
    });
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
    this.readySet();
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
    clearInterval(this.moleTimer);
    clearInterval(this.gameTimer);
    clearInterval(this.readyTimer);
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