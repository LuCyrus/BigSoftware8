const app = getApp()
const utils = require('../../../utils/util.js');

Page({
  data: {
   
  },
  // 事件处理函数
  
  onLoad(options) {
    var that=this
    that.setData({
      myOpenid:app.globalData.openid,
      id:options.id
    })
  
   
  },
  onShow(){
    this.getMyUserList()

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
  
  getActionList(){
    var that=this
    wx.cloud.database().collection('actions').orderBy('time','desc').where({
        _openid:that.data.id
    }).get({
      success(res){
        console.log(res.data)
        //格式化时间
        var list=res.data
        for(var l in list){
           
           list[l].time = utils.formatTime(new Date(list[l].time))

        }
     
      for(var l in list){
        for(var j in list[l].prizeList){
              if(list[l].prizeList[j].openid==app.globalData.openid){
                 list[l].isPrized=true;
              }
        }
      }
      for(var i in list){
        list[i].status=false
        for(var j in that.data.attentionId){
          if(that.data.attentionId[j]==list[i]._openid){
            list[i].status=true
          }
        }
       
      }
      for(var l in list){
        console.log(list[l].commentList.length)
        if(list[l].commentList.length !=0){

          for(var j in list[l].commentList){
             list[l].commentList[j].time=utils.formatTime(new Date(list[l].commentList[j].time))
          }
        }
      }
      
     
       that.setData({
        actionsList:list
       })
      }
    })
  },
  toPublish(){
    if(app.globalData.userInfo==null){
        this.getUserProfile()
    }else{
        wx.navigateTo({
            url: '/pages/publish/publish',
      })
    }
    
  },
  toDetail(event){
    console.log(event.currentTarget.dataset.id)
    if(app.globalData.userInfo==null){
      this.getUserProfile()
    }else{
      wx.navigateTo({
        url: '/pages/detail/detail?id='+event.currentTarget.dataset.id,
      })
    }
  },
  deleteAction(e){
    var that=this
    console.log(e.currentTarget.dataset.id)
    wx.cloud.database().collection('actions').doc(e.currentTarget.dataset.id).remove({
      success(res){
        console.log(res)
        wx.showToast({
          title: '删除成功！',
        })
        that.getActionList()
      }
    })
  },
  onPullDownRefresh(){
      this.getActionList()
  },
  prizeAction(e){
    if(app.globalData.userInfo==null){
        this.getUserProfile()
    }else{
      console.log(e.currentTarget.dataset.id)
      var that=this
      wx.cloud.database().collection('actions').doc(e.currentTarget.dataset.id).get({
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
              //之前点赞过  删除点赞记录
            action.prizeList.splice(index,1)
            
            console.log(action)
            console.log(e)
            //解决手机取消点赞设置为null的bug
            let prizeList=[]
            for(let i in action.prizeList){
              if(index!=i){
                prizeList.push(action.prizeList[i])
              }
            }
            wx.cloud.database().collection('actions').doc(e.currentTarget.dataset.id).update({
              data:{
                prizeList:prizeList
              },
              success(res){
                
                 console.log(res)
                 that.getActionList()
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
            wx.cloud.database().collection('actions').doc(e.currentTarget.dataset.id).update({
              data:{
                prizeList:action.prizeList
              },
              success(res){
                  console.log(res)
                  wx.showToast({
                    title: '点赞成功！',
                  })
                  that.getActionList()
              }
            })
          }

         
        }
      })  
    }
   
  },
  deleteComment(event){
    var that =this
    console.log(event.currentTarget.dataset.id)
    console.log(event.currentTarget.dataset.index)
    wx.showModal({
      title: '确定要删除刺评论吗？',
      success(res){
       if(res.confirm){
        var index=event.currentTarget.dataset.index
        wx.cloud.database().collection('actions').doc(event.currentTarget.dataset.id).get({
           success(res){
             console.log(res)
             var action=res.data
            
             action.commentList.splice(index,1)
           
             wx.cloud.database().collection('actions').doc(event.currentTarget.dataset.id).update({
                data:{
                  commentList:action.commentList
                },
                success(res){
                  console.log(res)
                  wx.showToast({
                    title: '删除成功',
                  })
                  that.getActionList()
                }
             })
           }
        })
       }else if(res.cancel){

       }
      }
    })
  
  },
  onShareAppMessage(event){
      
       if(event.from =='button'){
        console.log(event.target.dataset.index)
        var index=event.target.dataset.index
        return{
          title:this.data.actionsList[index].text,
          imageUrl:this.data.actionsList[index].images[0],
          path:'pages/detail/detail?id='+this.data.actionsList[index]._id
        }
       }
      
       if(event.from =='menu'){
 
        return{
          title:'欢迎进入朋友圈列表',
          imageUrl:'',
          path:'pages/index/index'
        }
      }
  },
  getMyUserList(){
   console.log("憨憨")
    wx.cloud.database().collection('attentionList').where({
        _openid:app.globalData.openid
    }).get()
    .then(res=>{
      var attentionId=[]
      console.log(res)
      for(var i in res.data){
        attentionId.push(res.data[i].attentionId)
      }
      this.setData({
        attentionId:attentionId
      })
      this.getActionList()

 })
    
  },
  getOtherUserList(otherOpenid){
  
    wx.cloud.database().collection('user').where({
      openid:otherOpenid
    }).get()
    .then(res2=>{
       this.setData({
        otherNickName:res2.data[0].nickName,
        otherPortrait:res2.data[0].portrait,
       })
       this.guanzhu(otherOpenid)
    })
  
  },
  follow(event){
    if(app.globalData.userInfo==null){
      this.getUserProfile()
      return
    }
    console.log(event)
    var that=this
    let otherOpenid=event.currentTarget.dataset.openid
    let status=event.currentTarget.dataset.status

    if(status==true){
      wx.showToast({
        icon:'none',
        title: '已经关注过了！',
      })
      return
    }
    that.getOtherUserList(otherOpenid)
  
  },
  guanzhu(otherOpenid){
    var that=this
    wx.cloud.database().collection('attentionList').add({
      data:{
        attentionId:otherOpenid,
        nickName:app.globalData.userInfo.nickName,
        portrait:app.globalData.userInfo.avatarUrl,
        otherNickName:this.data.otherNickName,
        otherPortrait:this.data.otherPortrait,

      },
      success(res){
        console.log(res)
        wx.showToast({
            title: '关注成功',
        })
        that.getMyUserList()
      }
    })
  }
})
