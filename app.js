// app.js
App({
  onLaunch() {
    wx.cloud.init({
      env:"bigsoftware8-9g52gvfy99ed34a8"//修改成自己的环境名称
    })
    var that=this;
    wx.cloud.callFunction({
      name:'getUserOpenid',
      success(res){
        console.log(res.result.openid)
        
        that.globalData.openid=res.result.openid
        
      }
    })
    if(wx.getStorageSync('userInfo')){
      this.globalData.userInfo=wx.getStorageSync('userInfo')
   }
  },
  globalData: {
    userInfo: null,
    openid:null,
    index:0,
  }
})


//食谱推荐小程序
//饮食美食推荐食谱
//食谱菜谱小程序
//健康食谱微信小程序