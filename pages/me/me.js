// pages/auth/auth.js
const app=getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
       
        this.setData({
            userInfo: app.globalData.userInfo,
          })
       wx.setStorageSync('userInfo', this.data.userInfo)

    },
    onShow(){
      this.setData({
        userInfo: app.globalData.userInfo,
      })
       wx.setStorageSync('userInfo', this.data.userInfo)
    },
    getUserProfile() {
      wx.getUserProfile({
          desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
          success: (res) => {
            console.log(res)
            this.setData({
              userInfo: res.userInfo,
            })
            console.log(this.data.userInfo)
            app.globalData.userInfo=this.data.userInfo
            wx.setStorageSync('userInfo', this.data.userInfo)
            wx.cloud.database().collection('user').where({
              openid:app.globalData.openid
            }).get({
               success(res){
                 console.log(res)
                 if(res.data.length==0){
                  wx.cloud.database().collection('user').add({
                    data:{
                        openid:app.globalData.openid,
                        nickName:app.globalData.userInfo.nickName,
                        portrait:app.globalData.userInfo.avatarUrl,
                        attentionId:[],
                        fansId:[]
                    },
                })
                 }
               }
            })
           
          }
        })
    },
    logOff(){
        app.globalData.userInfo=null
        this.setData({
            userInfo: app.globalData.userInfo,
          })
       wx.setStorageSync('userInfo', this.data.userInfo)
    },
    toShare(){
        if(app.globalData.userInfo==null){
            this.getUserProfile()
        }else{
            wx.switchTab({
                url: '/pages/share/share',
              })
        }
    },
    toService(){
      if(app.globalData.userInfo==null){
        this.getUserProfile()
    }else{
      wx.navigateTo({
        url: '/pages/customerService/customerService',
      })
      }
    },
    toCollection(){
      wx.navigateTo({
        url: '/pages/me/collection/collection',
      })
    },
    toAttention(){
      wx.navigateTo({
        url: '/pages/me/attention/attention',
      })
    },
    toFans(){
      wx.navigateTo({
        url: '/pages/me/fans/fans',
      })
    },
    toMyWorks(){
       wx.navigateTo({
         url: '/pages/me/personalPage/personalPage?id='+app.globalData.openid,
       })
    },
    toMessage(){
      wx.navigateTo({
        url: '/pages/me/message/message'
      })
    }
})