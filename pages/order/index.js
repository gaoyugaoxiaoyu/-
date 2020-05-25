import {
  request
} from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: [],
    tabs: [{
        id: 0,
        value: "全部订单",
        isActive: true
      },
      {
        id: 1,
        value: "代付款",
        isActive: false
      },
      {
        id: 2,
        value: "代发货",
        isActive: false
      },
      {
        id: 3,
        value: "退货/退款",
        isActive: false
      }
    ]
  },
  changeTitleIndex(index) {
    let {
      tabs
    } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    //3.复制到data里面
    this.setData({
      tabs
    })
  },
  handleTabsItemChange(e) {
    //获取被点击的标题索引
    const {
      index
    } = e.detail;
    //修改原数组
    this.changeTitleIndex(index);
    this.getOrders(index+1);
  },

  /**
   * 生命周期函数--监听页面显示
   */
 
  onShow: function (options) {

    //这是评论里面的token
    wx.setStorageSync('token', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo')
    const token = wx.getStorageSync("token");
    //这删了就可以跳转 因为没有tokenif这个语句
    if (!token) {
      wx.navigateTo({
        url: '../../pages/auth/index'
      });
      return;
    }
    var pages = getCurrentPages();
    let currentpages = pages[pages.length - 1];
    const {
      type
    } = currentpages.options;
    this.changeTitleIndex(type - 1);
    this.getOrders(type);

  },
  //获取订单列表的方法
  async getOrders(type) {
    const res = await request({
      url: "/my/orders/all",
      data: {
        type
      }
    });
    this.setData({
      orders: res.orders.map(v=>({...v,create_time_cn:new Date(v.create_time*1000).toLocaleString()}))
    })

  }
})