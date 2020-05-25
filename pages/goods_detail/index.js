/**
 * 点击轮播图预览功能
 * 给伦布图绑定点击事件
 * 2.购物车
 *    绑定点击事件
 *    获取缓存，数组
 *    先判断在不在购物车
 *    已经存在，修改商品数据，购物车++
 *    不存在加添加一个，带上num属性
 *    弹出提示
 */
import {
  request
} from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {},
    isCollect:false
  },
  //商品对象
  GoodsInfo: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    var pages =  getCurrentPages();
    let currentPages = pages[pages.length-1];
    let options  =currentPages.options;
    const {
      goods_id
    } = options;
    // console.log(goods_id);
    this.getGoodsDetail(goods_id);

   

  },
  //获取商品详情数据
  async getGoodsDetail(goods_id) {
    const goodsObj = await request({
      url: "/goods/detail",
      data: {
        goods_id
      }

    });
    this.GoodsInfo = goodsObj;
    let collect = wx.getStorageSync("collect")||[];
    let isCollect = collect.some(v=>v.goods_id===this.GoodsInfo.goods_id);
    this.setData({
      //只用到了这四个，只写四个就行，避免不必要的加载
      goodsObj: {
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        //jpg替换webp用正则
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: goodsObj.pics,
      }
    }),
    isCollect

  },
  //点击轮播图预览效果
  handlePrevewImage: function (e) {
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid);
    //接收传递的url
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })

  },
  //点击加入购物车
  handleCartAdd: function () {
    //获取缓存中的购物车数据，数组
    let cart = wx.getStorageSync("cart") || [];
    //判断有没有
    let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    if (index === -1) {
      //不存在
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true;

      cart.push(this.GoodsInfo)
    } else {
      //存在 num++
      cart[index].num++;
    }
    //重新添加回缓存里面
    wx.setStorageSync("cart", cart);
    //弹窗提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      mask: true,
      success: (result) => {

      },
      fail: () => {},
      complete: () => {}
    });
  },
  //收藏
  handleCollect(){
    let isCollect = false;
    //获取缓存收藏数组
    let collect = wx.getStorageSync("collect")||[];
    //判断有么有被收藏
    let index = collect.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    // 当index！=-1
    if (index!==-1) {
      collect.splice(index,1);
      isCollect=false;
      wx.showToast({
        title: '取消成功',
        icon:'success',
        mask:true
      });
    }else{
      collect.push(this.GoodsInfo)
      isCollect=true;
      wx.showToast({
        title: '收藏成功',
        icon:'success',
        mask:true
      });
    }
    //把数组存到缓存里面
    wx.setStorageSync("collect", collect);
      this.setData({
        isCollect
      })
  }
})