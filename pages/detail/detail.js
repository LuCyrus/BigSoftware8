const utils = require('../../utils/util.js');
const app=getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        placeHolder:'评论'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
     
        this.setData({
            openid:app.globalData.openid
        })
        console.log(options.id)
        this.data.id=options.id
        this.getDetail()
    },

    getDetail(){
      
      var that=this;
      wx.cloud.database().collection('actions').doc(this.data.id).get({
          success(res){
              console.log(res)
              var action=res.data
              action.time=utils.formatTime(new Date(action.time))
              for(var l in action.prizeList){
        
               if(action.prizeList[l].openid==app.globalData.openid){
                  action.isPrized=true;
                  }
                
              }
              for(var l in action.commentList){
                 action.commentList[l].time=utils.formatTime(new Date(action.commentList[l].time))
              }
              that.setData({
                  action:res.data
              })
          }
      })
    },
    delete(){
       console.log(this.data.id)
       var that=this
       wx.cloud.database().collection('actions').doc(this.data.id).remove({
        success(res){
          console.log(res)
         
           wx.navigateBack({
              success(res){
                wx.showToast({
                    title: '删除成功！',
                  })
              }
           })
        }
      })
    },
    prizeAction(e){
      var that=this
     
        console.log(that.data.id)
        wx.cloud.database().collection('actions').doc(that.data.id).get({
          success(res){
            console.log(res)
            var action=res.data
            var tag=false
            var index
            for(var l in action.prizeList){
                if(action.prizeList[l].openid==app.globalData.openid){
                  tag=true
                  index=l
                  break
                }
            }
            if(tag){
              action.prizeList.splice(index,1)
              console.log(action)
              console.log(e)
              //之前点赞过  删除点赞记录
              wx.cloud.database().collection('actions').doc(that.data.id).update({
                data:{
                  prizeList:action.prizeList
                },
                success(res){
                  
                   console.log(res)
                   that.getDetail()
                }
              })
            }else{
              //之前未点赞  添加点赞记录
              var user={}
              user.nickName=app.globalData.userInfo.nickName
              user.faceImg=app.globalData.userInfo.avatarUrl
              user.openid=app.globalData.openid
              action.prizeList.push(user)
      
              console.log(action.prizeList)
              wx.cloud.database().collection('actions').doc(that.data.id).update({
                data:{
                  prizeList:action.prizeList
                },
                success(res){
                    console.log(res)
                    wx.showToast({
                      title: '点赞成功！',
                    })
                    that.getDetail()
                }
              })
            }
  
           
          }
        })  
      
     
    },
    getInputValue(event){
      this.setData({
        inputValue: event.detail.value
       })

       this.setData({
        judgeValue: event.detail.value.replace(/\s+/g, '')
       })
    },
    publishComment(){
     
      var that=this
     
        if(!this.data.judgeValue){
          wx.showToast({
            title: '输入的内容不能为空！',
            icon:'none'
          })
       }else{

        console.log(that.data.id)
        wx.cloud.database().collection('actions').doc(that.data.id).get({
           success(res){
             var action=res.data
             var comment={}
             comment.nickName=app.globalData.userInfo.nickName
             comment.faceImg=app.globalData.userInfo.avatarUrl
             comment.openid=app.globalData.openid
             comment.text=that.data.inputValue
             comment.time=Date.now()
             comment.toOpenid=that.data.toOpenid
             comment.toNickName=that.data.toNickName
             action.commentList.push(comment)
             wx.cloud.database().collection('actions').doc(that.data.id).update({
              data:{
                commentList:action.commentList
              },
              success(res){
                  console.log(res)
                  wx.showToast({
                    title: '评论成功！',
                  })
                  that.getDetail()
                  that.setData({
                    inputValue:'',
                    judgeValue:'',
                    placeHolder:'评论'

                  })
              }
            })
           }
        })
      }
       
    },
    deleteComment(event){
      var that =this
      
      console.log(event.currentTarget.dataset.index)
      wx.showModal({
        title: '确定要删除此评论吗？',
        success(res){
         if(res.confirm){
          var index=event.currentTarget.dataset.index
          wx.cloud.database().collection('actions').doc(that.data.id).get({
             success(res){
               console.log(res)
               var action=res.data
              
               action.commentList.splice(index,1)
             
               wx.cloud.database().collection('actions').doc(that.data.id).update({
                  data:{
                    commentList:action.commentList
                  },
                  success(res){
                    console.log(res)
                    wx.showToast({
                      title: '删除成功',
                    })
                    that.getDetail()
                  }
               })
             }
          })
         }else if(res.cancel){
  
         }
        }
      })
    
    },
    huifuComment(event){
      console.log(event)
      console.log(event.currentTarget.dataset.index)
      var index=event.currentTarget.dataset.index
      console.log(this.data.action.commentList[index].openid)
      var thisOpenId=this.data.action.commentList[index].openid
      if(app.globalData.openid!=thisOpenId){
        this.setData({
          placeHolder:'回复'+this.data.action.commentList[index].nickName,
          toOpenid:this.data.action.commentList[index].openid,
          toNickName:this.data.action.commentList[index].nickName
  
        })
      }
      
    },
    onShareAppMessage(event){
      
      console.log(event)
      
      return{
        title:this.data.action.text,
        imageUrl:this.data.action.images[0],
        path:'pages/detail/detail?id='+this.data.id
      }
 },
 onShareTimeline(){
    return {
      title:this.data.action.text,
      imageUrl:this.data.action.images[0],
      query:'pages/detail/detail?id'+this.data.id
    }


 }
 
})