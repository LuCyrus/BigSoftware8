const app=getApp()
const utils = require('../../utils/util.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
       cloudImgList:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      console.log(app.globalData.userInfo)
    },
    getValue(e){
        console.log(e.detail.value)
       
       this.setData({
        inputValue: e.detail.value
       })

       this.setData({
        judgeValue: e.detail.value.replace(/\s+/g, '')
       })
       
   
    },
    chooseImage(){
        var that=this;
       wx.chooseImage({
         count: 9-that.data.cloudImgList.length,
         sizeType:['original','compressed'],
         sourceType:['album','camera'],
         success(res){
             console.log(res)
             console.log(res.tempFilePaths)
             //上传图片
             that.data.tempImgList=res.tempFilePaths
             that.uploadImages()
         }
       })
    },
    uploadImages(){
        var that= this;
        for(var i=0;i<this.data.tempImgList.length;i++){
             wx.cloud.uploadFile({
                 cloudPath:`actionsImages/${Math.random()}_${Date.now()}.${this.data.tempImgList[i].match(/\.(\w+)$/)[1]}`,
                 filePath:this.data.tempImgList[i],
                 success(res){
                     console.log(res.fileID)
                     that.data.cloudImgList.push(res.fileID)
                     that.setData({
                         cloudImgList:that.data.cloudImgList
                     })
                 }
             })
        }
    },
    deleteImg(e){
       console.log(e.currentTarget.dataset.index)
       this.data.cloudImgList.splice(e.currentTarget.dataset.index,1)
       this.setData({
           cloudImgList:this.data.cloudImgList
       })
    },
    submitData(){

    
        if(!this.data.judgeValue){
            wx.showToast({
              title: '输入的内容不能为空！',
              icon:'none'
            })
        }else{
            wx.showLoading({
                title: '发布中',
                mask:'true'
              })
              wx.cloud.database().collection('actions').add({
                  data:{
                      nickName:app.globalData.userInfo.nickName,
                      faceImg:app.globalData.userInfo.avatarUrl,
                      text:this.data.inputValue,
                      images:this.data.cloudImgList,
                      time:utils.formatTime(new Date()),
                      prizeList:[],
                      commentList:[]
              },
              success(res){
                  console.log(res)
                  wx.navigateBack({
                    success(res){
                        wx.hideLoading({
                          success: (res) => {},
                        })
                        wx.showToast({
                          title: '发布成功！',
                        })
                    }
                  })
              }
          })
        }
       
}
})

