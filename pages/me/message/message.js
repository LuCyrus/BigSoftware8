const app=getApp()
Page({

   
    data: {
      sex:["男","女"]
  
    },

   
    onLoad: function (options) {
        wx.cloud.database().collection('user').where({
            openid:app.globalData.openid
          }).get()
          .then(res=>{
            console.log(res)
            this.setData({
                user:res.data[0]
            })
           
          })
       
    },
    
    
    saveData(event){
        var that=this;
        console.log(event.detail.value)
        
       
        if(!(event.detail.value.name.replace(/\s+/g, ''))){
          wx.showToast({
            icon:'error',
            title: '请填写名称！',
          })
          return
        }
    //    if(!that.data.index){
    //       wx.showToast({
    //         icon:'error',
    //         title: '请选择性别！',
    //       })
    //     return
    //     }
    //     if(!(event.detail.value.birthday.replace(/\s+/g, ''))){
    //         wx.showToast({
    //           icon:'error',
    //           title: '请填写生日！',
    //         })
    //         return
    //       }
 
       
        wx.cloud.database().collection('user').where({
          openid:app.globalData.openid
        }).update({
           data:{
            name:event.detail.value.name,
            sex:that.data.sex[that.data.index],
            birthday:event.detail.value.birthday,
            text:event.detail.value.text,

               
           },
           success(res){
               console.log(res)
               wx.navigateBack({
                   success(){
                      console.log('返回成功')
                      wx.showToast({
                        title: '上传成功',
                        duration:3000
                      })
                      
                   }
               })
           }

        })
    },
   
    bindPickerChange: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
          index: e.detail.value
        })
      },

 

    
})