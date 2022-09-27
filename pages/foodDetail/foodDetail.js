const app=getApp()
Page({

  data: {

  },

  
  onLoad: function (options) {
    console.log(options)
   
    //根据传过来的id来查询商品
    wx.cloud.database().collection('recipes').doc(options.id.replace(app.globalData.openid,"")).get().then(res=>{
      console.log(res)
      this.setData({
          food:res.data,
          foodId:res.data._id
      })
      
      let food2 = this.data.food
      food2._id=this.data.food._id+app.globalData.openid
      food2._openid=app.globalData.openid
      this.setData({
        food2:food2
      })
      wx.cloud.database().collection('collectionList').where({
        _id:this.data.food2._id
      }).get().then(res=>{
        console.log(res)
        if(res.data.length>0){
           this.setData({
             collection:true
           })
        }else{
          this.setData({
            collection:false
          })
        }
      
        
        
      })
      
    })
    
  },
  collection(){  
    const db=wx.cloud.database()
    const _ = db.command;
    var that=this
    wx.cloud.database().collection('collectionList')
    .add({
      data:{
        ...this.data.food2
      }
    })
    .then(res=>{
      console.log(res)
      wx.showToast({
        title: '收藏成功',
      })
      this.setData({
        collection:true
      })
      wx.cloud.database().collection('recipes')
      .doc(that.data.foodId).update({
        data:{
          collectionNum: _.inc(1)
          
        }
      })
      .then(res=>{
          console.log(that.data.food._id)
          console.log(res)
      })

      
     
    })
    .catch(res=>{
       console.log(res)
     
     
      wx.cloud.database().collection('collectionList').doc(this.data.food2._id).remove()
      .then(res=>{
        console.log(res)
        wx.showToast({
          title: '取消成功',
        })
        this.setData({
          collection:false
        })
        wx.cloud.database().collection('recipes')
        .doc(that.data.foodId).update({
          data:{
            collectionNum: _.inc(-1)
            
          }
        })
      })
    })
  },
  
})