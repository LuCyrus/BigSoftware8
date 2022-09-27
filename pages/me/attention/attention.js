const app=getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userList:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getMyUserList()
    },
    getMyUserList(){
  
        wx.cloud.database().collection('attentionList').where({
          _openid:app.globalData.openid
        }).get()
        .then(res=>{
          console.log(res)
          this.setData({
              userList:res.data
          })
        })
      
    },
    toPersonalPage(event){
        console.log(event)
        wx.navigateTo({
            url: '/pages/me/personalPage/personalPage?id='+event.currentTarget.dataset.attentionid,
          })
    }
   
  
})