// pages/index/search/search.js
Page({

   
  data: {
      inputValue1:"",
      inputValue2:"",
      inputValue3:"",
      inputValue:[]

  },

  onLoad: function (options) {
 
  },
  getValue1(event){
      console.log(event.detail.value)
      this.data.inputValue=event.detail.value
      this.setData({
          inputValue1:this.data.inputValue
      })
    }, 
  getValue2(event){
      console.log(event.detail.value)
      this.data.inputValue=event.detail.value
      this.setData({
          inputValue2:this.data.inputValue
      })
    }, 
  getValue3(event){
      console.log(event.detail.value)
      this.data.inputValue=event.detail.value
      this.setData({
          inputValue3:this.data.inputValue
      })
    },  
    

    toSearch(){
      this.setData({
        recipesList:[]
      })
      const db=wx.cloud.database()
      const _ = db.command
      if(!this.data.inputValue1){
        wx.showToast({
          icon:"error",
          title: '第一个搜索为空',
        })
        return
      }
      if(this.data.inputValue1&&!this.data.inputValue2&&this.data.inputValue3){
        wx.showToast({
          icon:"error",
          title: '请按顺序填写！',
        })
        return
      }
      wx.cloud.database().collection('recipes').where(
          {
            ingredientsList:wx.cloud.database().RegExp({
              regexp:this.data.inputValue1,
              option:'i'
            }),
            status:"2"
          }
       ).get()
      .then(res1=>{
          console.log(res1.data);
          let list1 = res1.data
          this.setData({
            recipesList:list1
          })

          if(this.data.inputValue2){
            wx.cloud.database().collection('recipes').where({
              ingredientsList:wx.cloud.database().RegExp({
                regexp:this.data.inputValue2,
                option:'i'
              }),
              status:"2"

            })
            .get()
            .then(res2=>{
                console.log(res2.data);
                let list2 = res2.data
                list2 = list1.concat(list2)

                this.setData({
                  recipesList:list2
                })

                if(this.data.inputValue3){
                  wx.cloud.database().collection('recipes').where({
                    ingredientsList:wx.cloud.database().RegExp({
                      regexp:this.data.inputValue3,
                      option:'i'
                    }),
                    status:"2"

                  })
                  .get()
                  .then(res3=>{
                      console.log(res3.data);
                      let list3 = res3.data
                      list3 = list2.concat(list3)
                      this.setData({
                        recipesList:list3
                      })
    
                  })
                }
            })
          }

          
      })
    },

    


        

   

    

    toSearch2(){
    
      const db = wx.cloud.database()
		  const _ = db.command
      wx.cloud.database().collection('recipes').where(_.or([
        {
        
          ingredientsList:wx.cloud.database().RegExp({
              regexp:this.data.inputValue1,
              option:'i'
          })
          
        },
        {
          ingredientsList:wx.cloud.database().RegExp({
              regexp:this.data.inputValue2,
              option:'i'
          })
        },
        {
          ingredientsList:wx.cloud.database().RegExp({
              regexp:this.data.inputValue3,
              option:'i'
          })
        }
      ])).get()
    .then(res=>{
        console.log(res);
        this.setData({
          recipesList:res.data
        })
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