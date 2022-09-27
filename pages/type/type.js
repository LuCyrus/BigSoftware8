// pages/type/type.js
const app=getApp()
Page({

   
    data: {
        typeList:["菜式","特殊场合","功效","人群"],
        dishes:["家常菜","素菜","肉菜","懒人食谱","甜品饮料"],
        occasion:["正餐","宴客","野餐"],
        effect:["减肥","美容","清热祛火"],
        crowd:["宝宝食谱","老人","孕妇"],
        allList:[["家常菜","素菜","肉菜","懒人食谱","甜品饮料"],["正餐","宴客","野餐"],["减肥","美容","清热祛火"],["宝宝食谱","老人","孕妇"]],
        currentType:0
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
        console.log(app.globalData.index)
        this.setData({
            in:app.globalData.index
        })
        
       
        
    },
    onLoad(){
      this.getTypeDetailFrist()
    },
    onHide(){
        app.globalData.index=0
    },
    getTypeDetailList(event){
        console.log(event.currentTarget.dataset.index)
      
        let index=event.currentTarget.dataset.index
       
        this.setData({
            currentType:index 
        })
        this.setData({
            detailList:this.data.allList[index]
        })
        
       
    },
    getTypeDetailFrist(){
      
       
     
        this.setData({
            detailList:this.data.allList[0]
        })
        
       
    },
    toDishDetail(event){
        console.log(event.currentTarget.dataset.index)
        wx.navigateTo({
          url: '/pages/type/dishDetail/dishDetail?currentType='+this.data.currentType+'&index='+event.currentTarget.dataset.index,
        })
        
    }
    
  

  
    
    

   
})