// getSetting的
export const getSetting=()=>{
    return new Promise((resolve,reject)=>{
        wx.getSetting({
            success: (result)=>{
                resolve(result)
            },
            fail: (err)=>{reject(err)},
            complete: ()=>{}
        });
    })
}

// chooseAddress的
export const chooseAddress=()=>{
    return new Promise((resolve,reject)=>{
        wx.chooseAddress({
            success: (result)=>{
                resolve(result)
            },
            fail: (err)=>{reject(err)},
            complete: ()=>{}
        });
    })
}


// openSetting的
export const openSetting=()=>{
    return new Promise((resolve,reject)=>{
        wx.openSetting({
            success: (result)=>{
                resolve(result)
            },
            fail: (err)=>{reject(err)},
            complete: ()=>{}
        });
    })
}

// showModal的
export const showModal=({content})=>{
    return new Promise((resolve,reject)=>{
        wx.showModal({
            title: '提示',
            content: content,
            success :(res)=> {
                resolve(res);
            },
            fail:(err)=>{
                reject(err)
            }
          })
    })
}

// showToast的
export const showToast=({title})=>{
    return new Promise((resolve,reject)=>{
        wx.showToast({
            title: title,
            icon: 'none',
            success :(res)=> {
                resolve(res);
            },
            fail:(err)=>{
                reject(err)
            }
          })
    })
}

// 支付的
export const login=()=>{
    return new Promise((resolve,reject)=>{
    wx.login({
        timeout:10000,
        success: (result)=>{
            resolve(result)
        },
        fail: (err)=>{
            reject(err)
        }
    });
    })
}

// 吊起微信支付的
export const requestPayment=(pay)=>{
    return new Promise((resolve,reject)=>{
  wx.requestPayment({
    ...pay,
      success: (result)=>{
        resolve(result)
      },
      fail: (err)=>{
        reject(err)
      },
      complete: ()=>{}
  });
    })
}