import {
  request
} from "../../request/index.js"
import {login} from "../../utils/asyncWx.js"
Page({
//获取用户信息
async handleGetUserInfo(e){
 try {
    //获取用户信息
  const {encryptedData,rawdata,iv,signature} = e.detail;
  //获取登陆成功的code值
  const {code} = await login();
  const loginParams = {encryptedData,rawdata,iv,signature,code}
  //发送请求，获取用户token值(这一步没有企业级appid是不可能成功的，也就是结果为null)
  const {token} = await request({url:"/users/wxlogin",data:loginParams,method:"post"});
  //吧token存入缓存里面，跳转回上一个页面
  wx.setStorageSync("token", token);
  //1是返回上一层
  wx.navigateBack({
    delta: 1
  });
 } catch (error) {
   console.log(error);
   
 }
}
})