import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast
} from "../../utils/asyncWx.js"
Page({


  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    //获取缓存里面的address信息
    const address = wx.getStorageSync("address");
    //获取购物车数据
    const cart = wx.getStorageSync("cart") || [];
    this.setData({
      address
    })
    this.setCart(cart);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  async handleChooseAddress() {
    try {
      // wx.chooseAddress({
      //   success: (result)=>{
      //     console.log(result);

      //   },
      //   fail: ()=>{},
      //   complete: ()=>{}
      // });
      //获取用户权限代码
      // wx.getSetting({
      //   success: (result)=>{
      //     const scopeAddress = result.authSetting["scope.address"];
      //     if(scopeAddress===true||scopeAddress===undefined){
      //       wx.chooseAddress({
      //         success: (result1)=>{
      //           console.log(result1);
      //         }
      //       });
      //     }else{
      //       //拒绝过授予权限
      //       wx.openSetting({
      //         success: (result2)=>{
      //           wx.chooseAddress({
      //             success: (result3)=>{
      //               console.log(result3);
      //             }
      //           });
      //         }
      //       });
      //     }
      //   }
      // });

      // 获取权限状态
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      //2.判断权限状态
      if (scopeAddress === false) {
        await openSetting();
      }
      let address = await chooseAddress();
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
      //存入缓存里面
      wx.setStorageSync("address", address);
    } catch (error) {
      console.log(error);

    }
  },
  //商品选中
  handleItemChange(e) {
    const goods_id = e.currentTarget.dataset.id;
    // console.log(goods_id);
    //获取购物车数组
    let {
      cart
    } = this.data;
    //找到被修改商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id);
    //选中状态取反
    cart[index].checked = !cart[index].checked;
    this.setCart(cart);




  },
  //设置购物车的同时，重新计算购物车价格数据
  setCart(cart) {
    let allChecked = true;
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
    })
    //判断数组是否为空
    allChecked = cart.length != 0 ? allChecked : false;
    this.setData({
      cart,
      totalPrice,
      totalNum,
      allChecked
    });
    wx.setStorageSync("cart", cart);

  },
  //全选反选
  handleItemAllChecked() {
    //获取data里面的数据
    let {
      cart,
      allChecked
    } = this.data;
    //修改值
    allChecked = !allChecked;
    //循环修改cart数组，中选中的状态
    cart.forEach(v => v.checked = allChecked);
    this.setCart(cart);
  },
  //加减功能
  async handleItemNumEdit(e) {
    // wx.showModal({
    //   title: '提示',
    //   content: '这是一个模态弹窗',
    //   success (res) {
    //     if (res.confirm) {
    //       console.log('用户点击确定')
    //     } else if (res.cancel) {
    //       console.log('用户点击取消')
    //     }
    //   }
    // })
    //获取事件源
    const {
      operation,
      id
    } = e.currentTarget.dataset;
    //获取购物车数组
    let {
      cart
    } = this.data;
    //找到需要修改商品的索引
    const index = cart.findIndex(v => v.goods_id === id);
    //判断是否执行删除
    if (cart[index].num===1&&operation===-1) {
      //弹窗提示
     

    const res = await showModal({content:'您是否要删除?'});
    if (res.confirm) {
      cart.splice(index,1)
      this.setCart(cart);
    }
    }else{
 //进行修改数量
 cart[index].num += operation;
 //设置回缓存
 this.setCart(cart);
    }
   
  },
  //总计
  async handlePay(e){
    //判断收货地址
    const {address,totalNum} = this.data;
    if (!address.userName) {
     await showToast({title:"您还没有填写或者选择收货地址"});
      return;
    } 
    //判断用户有么有选购商品
if(totalNum===0){
  await showToast({title:"您还没有选择商品"});
  return;
}
//跳转
wx.navigateTo({
  url: '../../pages/pay/index'
});
  }

})