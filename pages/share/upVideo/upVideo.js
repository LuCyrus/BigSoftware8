// pages/share/upVideo/upVideo.js
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

    },
    chooseVideo(e){
        var that = this;
        wx.chooseVideo({
          sourceType: ['album','camera'],
          maxDuration: 60,
          compressed: false,
          camera: 'back',
          success(res) {
            console.log(res)
            console.log(res.tempFilePath.match(/\.(\w+)$/)[1])
            wx.showLoading({
              title: '上传中',
            })
            wx.cloud.uploadFile({
              cloudPath:`actionVideos/${Math.random()}_${Date.now()}.${res.tempFilePath.match(/\.(\w+)$/)[1]}`,
              filePath: res.tempFilePath,
              success(suc){
                console.log(suc.fileID)
                that.setData({
                  videoUrl:suc.fileID
                })
                wx.hideLoading({})
              }
            })
          }
        })
      },
      saveData(event){
        var flag=0
        console.log(event.detail.value)
   

        var that=this;
        if(that.data.videoUrl==null){
            wx.showToast({
                title: '请选择视频！',
                icon:'none'
              })
              flag=1
        }
        if(event.detail.value.title.replace(/\s+/g, '')==""){
            wx.showToast({
                title: '请填写标题！',
                icon:'none'
              })
              flag=1
        }
        
        if(flag==0){
            wx.cloud.database().collection('videoList').add({
                data:{
                    title:event.detail.value.title,
                    video:this.data.videoUrl,
                    collectionId:[],
                    status:"1",

     
                },
                success(res){
                    console.log(res)
                    wx.navigateBack({
                        success(){
                           console.log('返回成功')
                           wx.showToast({
                             title: '发布成功',
                             duration:5000
                           })
                        }
                    })
                }
     
             })
        }
       
    },
})