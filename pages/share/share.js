const app = getApp()
const utils = require('../../utils/util.js');
Page({

    
    data: {
      
    },

    onLoad(){
      this.setData({
        myOpenid:app.globalData.openid
      })
      this.getRecipesList()
      this.getVideoList()
    },
    onShow(){
      if(app.globalData.userInfo==null){
        wx.switchTab({
          url: "/pages/me/me",
          success(){
            wx.showToast({          
              title: '请先登录',
              icon:'none',
              duration:3000
          })
          }
        })
      }
      this.setData({
        myOpenid:app.globalData.openid
      })
      this.getRecipesList()
      this.getVideoList()

    },
    tochooseVideo(){
      if(app.globalData.userInfo==null){
        this.getUserProfile()
      }else{
        wx.navigateTo({
          url: '/pages/share/upVideo/upVideo',
        })
      }
      
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
    toAnnounce(){
        console.log(app.globalData.userInfo)
        if(app.globalData.userInfo==null){
             this.getUserProfile()
        }else{
           wx.navigateTo({
             url: '/pages/share/upfood/upfood',
            })
        }
        
    },
    getRecipesList(){
      wx.cloud.database().collection('recipes').get()
      .then(res=>{
        console.log(res)
        this.setData({
          recipesList:res.data
        })
      })
      
    },
    getVideoList(){
      wx.cloud.database().collection('videoList').get()
      .then(res=>{
        console.log(res)
        this.setData({
          videoList:res.data
        })
        console.log(this.data.videoList)

      })

    },
    deleteMyFood(e){
      var that=this
      console.log(e.currentTarget.dataset.id)
      wx.cloud.database().collection('recipes').doc(e.currentTarget.dataset.id).remove({
        success(res){
          console.log(res)
          wx.showToast({
            title: '删除成功！',
          })
          that.getRecipesList()
        }
      })
    },
    deleteMyVideo(e){
      var that=this
      console.log(e.currentTarget.dataset.id)
      wx.cloud.database().collection('videoList').doc(e.currentTarget.dataset.id).remove({
        success(res){
          console.log(res)
          wx.showToast({
            title: '删除成功！',
          })
          that.getVideoList()
        }
      })
    },
    toFoodDetail(event){
      console.log(event.currentTarget.dataset.id)
      let id=event.currentTarget.dataset.id
       wx.navigateTo({
         url: '/pages/foodDetail/foodDetail?id='+id,
       })
    }
   

    
})