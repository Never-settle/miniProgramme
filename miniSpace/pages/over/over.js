const pageData = {
    data: {
        level: ''
    },

    onShow: function(){
        let app = getApp();
        let level = app.level;
        this.setData({
            level: level
        });
    },

    goAgain: function(){
        wx.redirectTo({
          url: '../game/game'
        })
    }
};

Page(pageData);