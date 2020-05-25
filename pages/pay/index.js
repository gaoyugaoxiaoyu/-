/**
 * 企业账号可以多人编辑
 * 支付按钮：先判断缓存里面有没有token，没有跳转到授权页面，获取token，再跳回去
 * 有了token之后 开始创建订单 获取到订单编号
 */

import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast,
  requestPayment
} from "../../utils/asyncWx.js"
import {request} from "../../request/index.js"
Page({


  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
   

    //获取缓存里面的address信息
    const address = wx.getStorageSync("address");
    //获取购物车数据
    let cart = wx.getStorageSync("cart") || [];
    // 过滤后的购物车数组
    cart = cart.filter(v=>v.checked);
    this.setData({
      address
    })
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
     
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
    
    })
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    });
  },
  //获取token

  async handlePorderPay(){
    try {
      
    //判断有没有token
  wx.setStorageSync('token', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo')

    const token = wx.getStorageSync("token");
    //判断
    if(!token){
      wx.navigateTo({
        url: '../../pages/auth/index',
      });
      return;
    }
    //创建订单
    //准备请求头参数
    // const header = {Authorization:token};
    //请求体
    const order_price = thiss.data.totalPrice;
    const consignee_addr = this.data.address.all;
    const cart = this.data.cart;
    let goods = [];
    cart.forEach(v=>goods.push({
      goods_id:v.goods_id,
      goods_number:v.num,
      goods_price:v.goods_price
    }))
    const orderParams = {order_price,consignee_addr,goods};
    //发送请求，获取订单编号
    const {order_number} = request({url:"/my/orders/create",method:"POST",data:orderParams})
     //准备发起预支付的接口
     const {pay} = await request({url:"/my/orders/req_unifiedorder",method:"POST",data:order_number})
     //发起微信支付
    await requestPayment(pay);
      //查询后台是否成功
      const res = await request({url:"/my/orders/chkOrder",method:"POST",data:order_number})
  await showToast({title:"支付成功"});
  //删除缓存里面已经支付的商品
  let newCart = wx.getStorageSync("cart");
  newCart = newCart.filter(v=>!v.checked);
  wx.setStorageSync("cart", newCart);
  //跳转到订单页面
  wx.navigateTo({
    url: '../../pages/order/index'
  });
    
    } catch (error) {
  await showToast({title:"支付失败"})
      console.log(error);
      
    }
  }
})