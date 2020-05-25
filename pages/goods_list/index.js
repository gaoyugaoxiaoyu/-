//用户上滑页面数据加载效果
/**
 * 1.找到滚动条触底事件
 * 2.判断有没有下一页
 *     1.获取总页数
 *            1.总页数Math.ceil(总页数/页容量 pagesize)
 *                   Math.ceil(23/10)  3页
 *      2.判断当前页数pagenum
 *    3.判断当前页码是否大于总页数?有下一页数据：没有数据
 * 3.如果没有下一页，告诉用户没有了
 * 4.如果有，就加载下一页
 *    当前页码++
 *    重新发送请求
 * 
 * 2.下拉刷新页面
 * 触发下拉刷新事件 重置数组 充值页码为1
 * 数据请求回来关闭等待效果
 */

import {
  request
} from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      },
      {
        id: 2,
        value: "价格",
        isActive: false
      }
    ],
    goodsList: []
  },
  //接口要的参数
  QueryParams: {
    query: "",
    cid: "",
    pagenum: 1,
    pagesize: 10
  },
  //总页数
  totalPages: 1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid = options.cid||"";
    this.QueryParams.query = options.query||"";

    this.getGoodsList();
   
  },
  //获取商品列表的数据（请求成功代码）
  async getGoodsList() {
    const res = await request({
      url: "/goods/search",
      data: this.QueryParams
    });
    // 获取总条数
    const total = res.total;
    //计算总页数
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize);
    // console.log(this.totalPages);


    this.setData({
      // 拼接数组
      goodsList: [...this.data.goodsList, ...res.goods]
    })
    //请求成功后关闭下拉刷新效果
    wx.stopPullDownRefresh();

  },
  //子组件传递过来的
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
  //页面上滑滚动条触底事件
  onReachBottom: function () {
    if (this.QueryParams.pagenum >= this.totalPages) {
      wx.showToast({
        title: '没有下一页数据'
      });

    } else {
      // console.log("you");
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },
  //下拉刷新事件
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    //1.重置数组
    this.setData({
      goodsList: []
    })
    //2.充值页码
    this.QueryParams.pagenum = 1;
    //3.重新发送请求
    this.getGoodsList();
  },

})