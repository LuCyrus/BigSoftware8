const app=getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        typeList:["菜式","特殊场合","功效","人群"],
        dishes:["家常菜","素菜","肉菜","懒人食谱","甜品饮料"],
        occasion:["正餐","宴客","野餐"],
        effect:["减肥","美容","清热祛火"],
        crowd:["宝宝食谱","老人","孕妇"],
        allList:[["家常菜","素菜","肉菜","懒人食谱","甜品饮料"],["正餐","宴客","野餐"],["减肥","美容","清热祛火"],["宝宝食谱","老人","孕妇"]],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        this.setData({
            currentType:options.currentType,
            index:options.index,

        })
        wx.setNavigationBarTitle({
          title: this.data.allList[this.data.currentType][this.data.index],
        })
        this.getRecipesList()
    },
    getRecipesList(){
        let currentType=this.data.currentType
        let index=this.data.index
        if(currentType==0){
            wx.cloud.database().collection('recipes').where({
                dishes:String(index)
            }).get()
            .then(res=>{
              this.setData({
                recipesList:res.data
              })
            })
        }
        if(currentType==1){
            wx.cloud.database().collection('recipes').where({
                occasion:String(index)
            }).get()
            .then(res=>{
              this.setData({
                recipesList:res.data
              })
            })
        }
        if(currentType==2){
            wx.cloud.database().collection('recipes').where({
                effect:String(index)
            }).get()
            .then(res=>{
              this.setData({
                recipesList:res.data
              })
            })
        }
        if(currentType==3){
            wx.cloud.database().collection('recipes').where({
                crowd:String(index)
            }).get()
            .then(res=>{
              this.setData({
                recipesList:res.data
              })
            })
        }
       
      },
      toFoodDetail(event){
        console.log(event.currentTarget.dataset.id)
        let id=event.currentTarget.dataset.id
         wx.navigateTo({
           url: '/pages/foodDetail/foodDetail?id='+id,
         })
      },


})