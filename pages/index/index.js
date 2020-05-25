//Page Object
// 发送请求的方法
import {
  request
} from "../../request/index.js"

Page({
  data: {
    //轮播图数组
    swiperList: [],
    //导航数组
    createList:[],
    //楼层数据
    floorList:[]
  },
  //页面刚加载就会触发
  onLoad: function (options) {
    // let that = this;
    //发送异步请求获取轮播图数据  优化es6方法解决
    // var reqTask = wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: (result)=>{
    //     that.setData({
    //       swiperList:result.data.message
    //     })

    //   },
    // });
//之后再加的话就不断地.then就好，方便维护
this.getSwiperList();
this.getCreateList();
this.getFloorList();
  },

  //获取轮播图数据
getSwiperList(){
  let that = this;
    request({
        url: "/home/swiperdata"
      })
      .then(result => {
        that.setData({
          swiperList: result
        })
      })
},
  //获取导航数据
  getCreateList(){
    let that = this;
      request({
          url: "/home/catitems"
        })
        .then(result => {
          that.setData({
            createList: result
          })
        })
  },
    //获取楼层数据
    getFloorList(){
      let that = this;
        request({
            url: "/home/floordata"
          })
          .then(result => {
            that.setData({
              floorList: result
            })
          })
    }
});