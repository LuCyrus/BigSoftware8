// pages/publish/publish.js
const app=getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
       cloudImg:null,
       cloudImg_step1:null,
       cloudImg_step2:null,
       cloudImg_step3:null,
       cloudImg_step4:null,
       cloudImg_step5:null,
       cloudImg_step6:null,
       cloudImg_step7:null,
       cloudImg_step8:null,
       cloudImg_step9:null,
       cloudImg_step10:null,
       cloudImgStepList:[],
       typeList:["菜式","特殊场合","功效","人群"],
       dishes:["家常菜","素菜","肉菜","懒人食谱","甜品饮料"],
       occasion:["正餐","宴客","野餐"],
       effect:["减肥","美容","清热祛火"],
       crowd:["宝宝食谱","老人","孕妇"],
       allList:[["家常菜","素菜","肉菜","懒人食谱","甜品饮料"],["正餐","宴客","野餐"],["减肥","美容","清热祛火"],["宝宝食谱","老人","孕妇"]],
    },


    onLoad: function (options) {
         console.log(this.data.cloudImg)
    },
    chooseImage(){
       
        var that=this;
        wx.chooseImage({
         count: 1,
         sizeType:['original','compressed'],
         sourceType:['album','camera'],
         success(res){
             console.log(res)
             console.log(res.tempFilePaths)
             //上传图片
             that.data.tempImg=res.tempFilePaths[0]
             that.uploadImages()
         }
       })
    },
    uploadImages(){
        var that= this;
        
             wx.cloud.uploadFile({
                 cloudPath:`actionsImages/${Math.random()}_${Date.now()}.${this.data.tempImg.match(/\.(\w+)$/)[1]}`,
                 filePath:this.data.tempImg,
                 success(res){
                     console.log(res.fileID)

                     that.data.cloudImg=res.fileID
                     that.setData({
                         cloudImg:that.data.cloudImg
                         
                     })
                     console.log(that.data.cloudImg)
                 }
             })
             console.log(that.data.cloudImg)

    },
    deleteImg(){
       this.data.cloudImg=null
       this.setData({
           cloudImg:this.data.cloudImg
       })
    },
    saveData(event){
        this.setStepImgList()
        var flag=0
        console.log(event.detail.value)
        let value=event.detail.value
        this.setStepTextList(value)
        this.setIngredientsList(value)
       

        var that=this;
        if(that.data.stepTextList.length!=that.data.cloudImgStepList.length){
            wx.showToast({
                title: '填写的步骤数量必须和步骤图数量相同！',
                icon:'none'
              })
            return
        }
        if(that.data.stepTextList.length<2){
            wx.showToast({
                title: '请至少填写两项步骤',
                icon:'none'
              })
              return
            }
        if(that.data.cloudImgStepList.length<2){
            wx.showToast({
                title: '请至少添加两个步骤图',
                icon:'none'
              })
              return
        }
        if(that.data.ingredientsList.length==0){
            wx.showToast({
              title: '请至少填写一项食材清单',
              icon:'none'
            })
            return
          }
        if(event.detail.value.title.replace(/\s+/g, '')==""){
          wx.showToast({
            title: '请输入菜谱名称',
            icon:'none'
          })
          return       
         }
        if(that.data.cloudImg==null){
            wx.showToast({
                title: '请选择封面图片',
                icon:'none'
              })
              return
      
        }
        if(!that.data.index){
            wx.showToast({
                title: '请选择菜式',
                icon:'none'
              })
            return
        }
        if(!that.data.index1){
            wx.showToast({
                title: '请选择特殊场合',
                icon:'none'
              })
            return
        }
        if(!that.data.index2){
            wx.showToast({
                title: '请选择特殊功效',
                icon:'none'
              })
            return
        }
        if(!that.data.index3){
            wx.showToast({
                title: '请选择特殊人群',
                icon:'none'
              })
            return
        }
        if(flag==0){
            wx.cloud.database().collection('recipes').add({
                data:{
                    title:event.detail.value.title,
                    ingredientsList:that.data.ingredientsList,
                    cover:that.data.cloudImg,
                    step_img:that.data.cloudImgStepList,
                    step_text:that.data.stepTextList,
                    note:event.detail.value.note,
                    collectionId:[],
                    dishes:String(that.data.index),
                    occasion:String(that.data.index1),
                    effect:String(that.data.index2),
                    crowd:String(that.data.index3),
                    collectionNum:0,
                 

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
    setIngredientsList(e){
        var ingredientsList=[]
        console.log(e)
        for(var i in e){
            
            if(e[i]!=""&&e[i].replace(/\s+/g, '')&&i.indexOf("ingredients") != -1 ){
                ingredientsList.push(e[i])
            }
        }
        this.setData({
            ingredientsList:ingredientsList
        })
        console.log(this.data.ingredientsList)
       
    },
    chooseImage_step1(){
       
        var that=this;
        wx.chooseImage({
         count: 1,
         sizeType:['original','compressed'],
         sourceType:['album','camera'],
         success(res){
             console.log(res)
             console.log(res.tempFilePaths)
             //上传图片
             that.data.tempImg=res.tempFilePaths[0]
             that.uploadImages_step1()
         }
       })
    },
    uploadImages_step1(){
        var that= this;
        
             wx.cloud.uploadFile({
                 cloudPath:`actionsImages/${Math.random()}_${Date.now()}.${this.data.tempImg.match(/\.(\w+)$/)[1]}`,
                 filePath:this.data.tempImg,
                 success(res){
                     console.log(res.fileID)

                     that.data.cloudImg_step1=res.fileID
                     that.setData({
                         cloudImg_step1:that.data.cloudImg_step1
                         
                     })
                     console.log(that.data.cloudImg_step1)
                 }
             })

    },
    deleteImg_step1(){
       this.data.cloudImg_step1=null
       this.setData({
           cloudImg_step1:this.data.cloudImg_step1
       })
    },
    chooseImage_step2(){
       
        var that=this;
        wx.chooseImage({
         count: 1,
         sizeType:['original','compressed'],
         sourceType:['album','camera'],
         success(res){
             console.log(res)
             console.log(res.tempFilePaths)
             //上传图片
             that.data.tempImg=res.tempFilePaths[0]
             that.uploadImages_step2()
         }
       })
    },
    uploadImages_step2(){
        var that= this;
        
             wx.cloud.uploadFile({
                 cloudPath:`actionsImages/${Math.random()}_${Date.now()}.${this.data.tempImg.match(/\.(\w+)$/)[1]}`,
                 filePath:this.data.tempImg,
                 success(res){
                     console.log(res.fileID)

                     that.data.cloudImg_step2=res.fileID
                     that.setData({
                         cloudImg_step2:that.data.cloudImg_step2
                         
                     })
                     console.log(that.data.cloudImg_step2)
                 }
             })

    },
    deleteImg_step2(){
       this.data.cloudImg_step2=null
       this.setData({
           cloudImg_step2:this.data.cloudImg_step2
       })
    },
    chooseImage_step3(){
       
        var that=this;
        wx.chooseImage({
         count: 1,
         sizeType:['original','compressed'],
         sourceType:['album','camera'],
         success(res){
             console.log(res)
             console.log(res.tempFilePaths)
             //上传图片
             that.data.tempImg=res.tempFilePaths[0]
             that.uploadImages_step3()
         }
       })
    },
    uploadImages_step3(){
        var that= this;
        
             wx.cloud.uploadFile({
                 cloudPath:`actionsImages/${Math.random()}_${Date.now()}.${this.data.tempImg.match(/\.(\w+)$/)[1]}`,
                 filePath:this.data.tempImg,
                 success(res){
                     console.log(res.fileID)

                     that.data.cloudImg_step3=res.fileID
                     that.setData({
                         cloudImg_step3:that.data.cloudImg_step3
                         
                     })
                     console.log(that.data.cloudImg_step3)
                 }
             })

    },
    deleteImg_step3(){
       this.data.cloudImg_step3=null
       this.setData({
           cloudImg_step3:this.data.cloudImg_step3
       })
    },
    chooseImage_step4(){
       
        var that=this;
        wx.chooseImage({
         count: 1,
         sizeType:['original','compressed'],
         sourceType:['album','camera'],
         success(res){
             console.log(res)
             console.log(res.tempFilePaths)
             //上传图片
             that.data.tempImg=res.tempFilePaths[0]
             that.uploadImages_step4()
         }
       })
    },
    uploadImages_step4(){
        var that= this;
        
             wx.cloud.uploadFile({
                 cloudPath:`actionsImages/${Math.random()}_${Date.now()}.${this.data.tempImg.match(/\.(\w+)$/)[1]}`,
                 filePath:this.data.tempImg,
                 success(res){
                     console.log(res.fileID)

                     that.data.cloudImg_step4=res.fileID
                     that.setData({
                         cloudImg_step4:that.data.cloudImg_step4
                         
                     })
                     console.log(that.data.cloudImg_step4)
                 }
             })

    },
    deleteImg_step4(){
       this.data.cloudImg_step4=null
       this.setData({
           cloudImg_step4:this.data.cloudImg_step4
       })
    },
    chooseImage_step5(){
       
        var that=this;
        wx.chooseImage({
         count: 1,
         sizeType:['original','compressed'],
         sourceType:['album','camera'],
         success(res){
             console.log(res)
             console.log(res.tempFilePaths)
             //上传图片
             that.data.tempImg=res.tempFilePaths[0]
             that.uploadImages_step5()
         }
       })
    },
    uploadImages_step5(){
        var that= this;
        
             wx.cloud.uploadFile({
                 cloudPath:`actionsImages/${Math.random()}_${Date.now()}.${this.data.tempImg.match(/\.(\w+)$/)[1]}`,
                 filePath:this.data.tempImg,
                 success(res){
                     console.log(res.fileID)

                     that.data.cloudImg_step5=res.fileID
                     that.setData({
                         cloudImg_step5:that.data.cloudImg_step5
                         
                     })
                     console.log(that.data.cloudImg_step5)
                 }
             })

    },
    deleteImg_step5(){
       this.data.cloudImg_step5=null
       this.setData({
           cloudImg_step5:this.data.cloudImg_step5
       })
    },
    chooseImage_step6(){
       
        var that=this;
        wx.chooseImage({
         count: 1,
         sizeType:['original','compressed'],
         sourceType:['album','camera'],
         success(res){
             console.log(res)
             console.log(res.tempFilePaths)
             //上传图片
             that.data.tempImg=res.tempFilePaths[0]
             that.uploadImages_step6()
         }
       })
    },
    uploadImages_step6(){
        var that= this;
        
             wx.cloud.uploadFile({
                 cloudPath:`actionsImages/${Math.random()}_${Date.now()}.${this.data.tempImg.match(/\.(\w+)$/)[1]}`,
                 filePath:this.data.tempImg,
                 success(res){
                     console.log(res.fileID)

                     that.data.cloudImg_step6=res.fileID
                     that.setData({
                         cloudImg_step6:that.data.cloudImg_step6
                         
                     })
                     console.log(that.data.cloudImg_step6)
                 }
             })

    },
    deleteImg_step6(){
       this.data.cloudImg_step6=null
       this.setData({
           cloudImg_step6:this.data.cloudImg_step6
       })
    },
    chooseImage_step7(){
       
        var that=this;
        wx.chooseImage({
         count: 1,
         sizeType:['original','compressed'],
         sourceType:['album','camera'],
         success(res){
             console.log(res)
             console.log(res.tempFilePaths)
             //上传图片
             that.data.tempImg=res.tempFilePaths[0]
             that.uploadImages_step7()
         }
       })
    },
    uploadImages_step7(){
        var that= this;
        
             wx.cloud.uploadFile({
                 cloudPath:`actionsImages/${Math.random()}_${Date.now()}.${this.data.tempImg.match(/\.(\w+)$/)[1]}`,
                 filePath:this.data.tempImg,
                 success(res){
                     console.log(res.fileID)

                     that.data.cloudImg_step7=res.fileID
                     that.setData({
                         cloudImg_step7:that.data.cloudImg_step7
                         
                     })
                     console.log(that.data.cloudImg_step7)
                 }
             })

    },
    deleteImg_step7(){
       this.data.cloudImg_step7=null
       this.setData({
           cloudImg_step7:this.data.cloudImg_step7
       })
    },
    chooseImage_step8(){
       
        var that=this;
        wx.chooseImage({
         count: 1,
         sizeType:['original','compressed'],
         sourceType:['album','camera'],
         success(res){
             console.log(res)
             console.log(res.tempFilePaths)
             //上传图片
             that.data.tempImg=res.tempFilePaths[0]
             that.uploadImages_step8()
         }
       })
    },
    uploadImages_step8(){
        var that= this;
        
             wx.cloud.uploadFile({
                 cloudPath:`actionsImages/${Math.random()}_${Date.now()}.${this.data.tempImg.match(/\.(\w+)$/)[1]}`,
                 filePath:this.data.tempImg,
                 success(res){
                     console.log(res.fileID)

                     that.data.cloudImg_step8=res.fileID
                     that.setData({
                         cloudImg_step8:that.data.cloudImg_step8
                         
                     })
                     console.log(that.data.cloudImg_step8)
                 }
             })

    },
    deleteImg_step8(){
       this.data.cloudImg_step8=null
       this.setData({
           cloudImg_step8:this.data.cloudImg_step8
       })
    },
    chooseImage_step9(){
       
        var that=this;
        wx.chooseImage({
         count: 1,
         sizeType:['original','compressed'],
         sourceType:['album','camera'],
         success(res){
             console.log(res)
             console.log(res.tempFilePaths)
             //上传图片
             that.data.tempImg=res.tempFilePaths[0]
             that.uploadImages_step9()
         }
       })
    },
    uploadImages_step9(){
        var that= this;
        
             wx.cloud.uploadFile({
                 cloudPath:`actionsImages/${Math.random()}_${Date.now()}.${this.data.tempImg.match(/\.(\w+)$/)[1]}`,
                 filePath:this.data.tempImg,
                 success(res){
                     console.log(res.fileID)

                     that.data.cloudImg_step9=res.fileID
                     that.setData({
                         cloudImg_step9:that.data.cloudImg_step9
                         
                     })
                     console.log(that.data.cloudImg_step9)
                 }
             })

    },
    deleteImg_step9(){
       this.data.cloudImg_step9=null
       this.setData({
           cloudImg_step9:this.data.cloudImg_step9
       })
    },
    chooseImage_step10(){
       
        var that=this;
        wx.chooseImage({
         count: 1,
         sizeType:['original','compressed'],
         sourceType:['album','camera'],
         success(res){
             console.log(res)
             console.log(res.tempFilePaths)
             //上传图片
             that.data.tempImg=res.tempFilePaths[0]
             that.uploadImages_step10()
         }
       })
    },
    uploadImages_step10(){
        var that= this;
        
             wx.cloud.uploadFile({
                 cloudPath:`actionsImages/${Math.random()}_${Date.now()}.${this.data.tempImg.match(/\.(\w+)$/)[1]}`,
                 filePath:this.data.tempImg,
                 success(res){
                     console.log(res.fileID)

                     that.data.cloudImg_step10=res.fileID
                     that.setData({
                         cloudImg_step10:that.data.cloudImg_step10
                         
                     })
                     console.log(that.data.cloudImg_step10)
                 }
             })

    },
    deleteImg_step10(){
       this.data.cloudImg_step10=null
       this.setData({
           cloudImg_step10:this.data.cloudImg_step10
       })
    },

    setStepImgList(){
        var cloudImgStepList=[]
        if(this.data.cloudImg_step1!=null){
            cloudImgStepList.push(this.data.cloudImg_step1)
        }
        if(this.data.cloudImg_step2!=null){
            cloudImgStepList.push(this.data.cloudImg_step2)
        }
        if(this.data.cloudImg_step3!=null){
            cloudImgStepList.push(this.data.cloudImg_step3)
        }
        if(this.data.cloudImg_step4!=null){
            cloudImgStepList.push(this.data.cloudImg_step4)
        }
        if(this.data.cloudImg_step5!=null){
            cloudImgStepList.push(this.data.cloudImg_step5)
        }
        if(this.data.cloudImg_step6!=null){
            cloudImgStepList.push(this.data.cloudImg_step6)
        }
        if(this.data.cloudImg_step7!=null){
            cloudImgStepList.push(this.data.cloudImg_step7)
        }
        if(this.data.cloudImg_step8!=null){
            cloudImgStepList.push(this.data.cloudImg_step8)
        }
        if(this.data.cloudImg_step9!=null){
            cloudImgStepList.push(this.data.cloudImg_step9)
        }
        if(this.data.cloudImg_step10!=null){
            cloudImgStepList.push(this.data.cloudImg_step10)
        }
        this.setData({
            cloudImgStepList:cloudImgStepList
        })
        console.log(this.data.cloudImgStepList)
    },
    setStepTextList(e){
        var stepTextList=[]
        console.log(e)
        for(var i in e){
            
            if(e[i]!=""&&e[i].replace(/\s+/g, '')&&i.indexOf("step") != -1 ){
                stepTextList.push(e[i])
            }
        }
        this.setData({
            stepTextList:stepTextList
        })
        console.log(this.data.stepTextList)
       
    },
    bindPickerChange: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
          index: e.detail.value
        })
      },
      bindPickerChange1: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
          index1: e.detail.value
        })
      },
      bindPickerChange2: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
          index2: e.detail.value
        })
      },
      bindPickerChange3: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
          index3: e.detail.value
        })
      },
      
      
      
    
   
   
    

   
   
})