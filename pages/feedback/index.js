// pages/feedback/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
      id: 0,
      value: "体验问题",
      isActive: true
    },
    {
      id: 1,
      value: "投诉",
      isActive: false
    }
  ],
  // 选住的图片路劲数组
  chooseImg:[],
  // 文本域的内容
  textVal:""
  },
  //外网图片路劲数组
  UploadImages:[],
  // 选择图片的·
  handleChooseImg(){
    wx.chooseImage({
      count: 9,
      sizeType: ['original','compressed'],
      sourceType: ['album','camera'],
      success: (result)=>{
        this.setData({
          chooseImg:[...this.data.chooseImg,...result.tempFilePaths]
        })
      }
    });
  },
  handleTabsItemChange(e) {
    //获取被点击的标题索引
    const {
      index
    } = e.detail;
    //修改原数组
    let {
      tabs
    } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    //3.复制到data里面
    this.setData({
      tabs
    })


  },
  // 点击删除图片
  handleClear(e){
    console.log(e);
    
    // 获取图片索引
    const {index} = e.currentTarget.dataset;
    // 获取data里面的图片数组
    let {chooseImg} = this.data;
    chooseImg.splice(index,1)
    this.setData({
      chooseImg
    })
  },
  handleInput(e){
    this.setData({
      textVal:e.detail.value
    })
  },
  handleBtn(){
    const {textVal,chooseImg} = this.data;
    if (!textVal.trim()) {
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: true
      });
      return;
    }

    //准备上传图片到服务器
    //告诉用户等待ing
    wx.showLoading({
      title: "正在上传中",
      mask: true
    });

    if(chooseImg.length!=0){
      chooseImg.forEach((v,i)=>{

  
        wx.uploadFile({
          url: 'https://img.coolcr.cn/index/api.html/',
          filePath: v,
          name: "image",
          formData: {},
          success: (result)=>{
            console.log(result);
            let url = JSON.parse(result.data).url;
            this.UploadImages.push(url);
    
            if (i===chooseImg.length-1) {
              wx.hideLoading();
              console.log("提交到后台，这里不做");
              //成功以后重置页面
              this.setData({
                textVal:"",
                chooseImg:[]
              })
              //返回上一个页面
              wx.navigateBack({
                delta: 1
              });
              
            }
            
          }
        });
      })
    }else{
      wx.hideLoading();
      console.log("只是提交了文本");
      
      wx.navigateBack({
        delta: 1
      });
    }
  
  }

})