import {
  request
} from "../../request/index.js"
Page({
  data: {
    goods: [],
    //取消按钮一开始不显示
    isFocus:false,
    inputval:""
  },

  TimeId:-1,
  // 输入框的值改变
  handleSearch(e) {
    // console.log(e);
    
    const {value} = e.detail;
    if (!value.trim()) {
      this.setData({
        goods:[],
        isFocus:false
      })
      return;
    }
    this.setData({
      isFocus:true
    })
    clearTimeout(this.TimeId);
    this.TimeId=setTimeout(() => {
    this.qsearch(value)
      
    }, 1000);
  },
  // 点击取消的时候
  handlebtn(){
this.setData({
  inputval:"",
  isFocus:false,
  goods: []
})
  },
  async qsearch(query) {
    const res = await request({
      url: "/goods/qsearch",
      data: {query}
    })
    console.log(res);
    this.setData({
      goods: res
    })

  }
})