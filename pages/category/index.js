import {
  request
} from "../../request/index.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //左侧商品数据
    leftMenuList: [],
    //右侧数据
    rightContent: [],
    //被点击左侧菜单
    currentIndex: 0,
    //右侧每次刷新在最上面
    scrollTop:0
  },
  //接口返回数据
  Cates: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //1.判断一下页面有米有旧的数据，没有旧数据值接发送，有旧数据，还没过期，就使用本地数据即可
    // 1.获取本地数据中的数据，小程序中存在本地储存技术
    const Cates = wx.getStorageSync("cates");
    //2.判断
    if (!Cates) {
      //不存在
      this.getCates();
    }else{
      if(Date.now()-Cates.time>1000*10){
        //重新发送
        this.getCates();
      }else{
        //否则可以使用旧的数据
        this.Cates = Cates.data;
        let leftMenuList = this.Cates.map(v => v.cat_name);
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
    // this.getCates();
  },
  //获取分类数据
  async getCates() {
    // request({
    //     url: "/categories"
    //   })
    //   .then(res => {
    //     this.Cates = res.data.message;
    //     //将接口文件储存到本地中
    //     wx.getStorageSync("cates",{time:Date.now(),data:this.Cates});
    //     //构造左侧大菜单数据
    //     let leftMenuList = this.Cates.map(v => v.cat_name);
    //     //构造右侧商品数据
    //     let rightContent = this.Cates[0].children;
    //     this.setData({
    //       leftMenuList,
    //       rightContent
    //     })
    //   })

    //使用es7的async的await来发送请求
    const res  = await request({url:"/categories"});
    this.Cates = res;
        //将接口文件储存到本地中
        wx.getStorageSync("cates",{time:Date.now(),data:this.Cates});
        //构造左侧大菜单数据
        let leftMenuList = this.Cates.map(v => v.cat_name);
        //构造右侧商品数据
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
  },
  //菜单左侧点击事件
  handleItemTap(e) {
    // console.log(e);
    //获取被点击身上的索引
    //给data中的currentIndex复制就可以
    //根据不同的索引来显示商品内容
    const {
      index
    } = e.currentTarget.dataset;
    let rightContent = this.Cates[index].children;
        //点击完重新加载scrollTop顶部不距离
    this.setData({
      currentIndex: index,
      rightContent,
      scrollTop:0
    })


  }
})