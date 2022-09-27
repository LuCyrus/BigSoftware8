// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
     flag:1
  },
 
  
  onLoad() {
    var that=this
    wx.cloud.callFunction({
      name:'getUserOpenid',
      success(res){
         console.log(res.result.openid)
         app.globalData.openid=res.result.openid
         that.setData({
           openid:app.globalData.openid
         })
         that.getCollectionList()
      
      
         that.getVideoList()
        
      }
     
    })
    
  },
  onShow() {
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
    this.getCollectionList()
 
   
    this.getVideoList()
  },
  getRecipesList(){
    
    wx.cloud.database().collection('recipes').orderBy('collectionNum', 'desc').get()
    .then(res=>{
      var recipesList=res.data
      for(var i in recipesList){
         recipesList[i].collection=false
         for(var j in this.data.collectionId){
          if(this.data.collectionId[j]==recipesList[i]._id){
            recipesList[i].collection=true
            console.log("憨憨")
          }
        }
      }
      this.setData({
        recipesList:recipesList
      })
    })
  },
  getVideoList(){
    wx.cloud.database().collection('videoList').get()
    .then(res=>{
      console.log(res)
      var videoList=res.data
      for(var i in videoList){
        videoList[i].collection=false
         for(var j in videoList[i].collectionId){
           if(videoList[i].collectionId[j]==this.data.openid){
            videoList[i].collection=true
           }
         }
      }
      this.setData({
        videoList:videoList
      })
      console.log(this.data.videoList)

    })

  },
  getCollectionList(){
    wx.cloud.database().collection('collectionList').where({
         _openid:app.globalData.openid
    }).get()
    .then(res=>{
      var collectionId=[]
      console.log(res)
      for(var i in res.data){
         collectionId.push(res.data[i].dishName)
      }
      this.setData({
        collectionId:collectionId
      })
      this.getRecipesList()

    })
  },
  toSearch(){
    wx.navigateTo({
      url: '/pages/index/search/search',
    })
  },
  toFoodDetail(event){
    console.log(event.currentTarget.dataset.id)
    let id=event.currentTarget.dataset.id
     wx.navigateTo({
       url: '/pages/foodDetail/foodDetail?id='+id,
     })
  },
  textRed(){
    this.setData({
       flag:1
    })
  },
  videoRed(){
    this.setData({
       flag:0
    })
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
  collection1(event){
    var that=this
    if(app.globalData.userInfo==null){
      that.getUserProfile()
      return
    }   
    console.log(event)
    let id=event.currentTarget.dataset.id
    let collection=event.currentTarget.dataset.collection
    let index=event.currentTarget.dataset.index
    var recipesList=that.data.recipesList[index].collectionId
   
    console.log(event)
    if(collection==true){
        wx.showToast({
          icon:'none',
          title: '已经收藏过了！',
        })
        return
    }
    console.log(recipesList)
    recipesList.push(that.data.openid)
     wx.cloud.database().collection('collectionList').add({
        data:{
            dishName:id,
            nickName:app.globalData.userInfo.nickName,
            portrait:app.globalData.userInfo.avatarUrl,
        },
        success(res){
            console.log(res)
            wx.showToast({
                title: '收藏成功',
              })
            that.getCollectionList()
           
        }
      })
  },
  collection2(event){
    var that=this
    console.log(event)
    let id=event.currentTarget.dataset.id
    let collection=event.currentTarget.dataset.collection
    let index=event.currentTarget.dataset.index
    var videoList=that.data.videoList[index].collectionId
   
    console.log(event)
    if(collection==true){
        wx.showToast({
          icon:'none',
          title: '已经收藏过了！',
        })
        return
    }
    console.log(videoList)
    videoList.push(that.data.openid)
     wx.cloud.database().collection('videoList').doc(id).update({
        data:{
            collectionId:videoList,
        },
        success(res){
            console.log(res)
            wx.showToast({
                title: '收藏成功',
              })
            that.getVideoList()
        }
      })
  }
  
 
 
  
})
