// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
     flag:1
  },
 
  
  onLoad() {
         
     
    
    
  },
  onShow() {
      this.getRecipesList()
    
    // this.getVideoList()
  },
  getRecipesList(){
    
    wx.cloud.database().collection('collectionList').where({
      _openid:app.globalData.openid
    }).get()
    .then(res=>{
      console.log(res)
   
      var recipesList=res.data
    
   
      this.setData({
        recipesList:recipesList
      })
    })
  },
  
//   getVideoList(){
//     wx.cloud.database().collection('videoList').get()
//     .then(res=>{
//       console.log(res)
//       var ve=[]
//       var videoList=res.data
//       for(var i in videoList){
     
//          for(var j in videoList[i].collectionId){
//            if(videoList[i].collectionId[j]==app.globalData.openid){
//               ve.push(videoList[i])
//            }
//          }
//       }
//       this.setData({
//         videoList:ve
//       })
//       console.log(this.data.videoList)

//     })

//   },
 
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
  
  
 
 
  
})
