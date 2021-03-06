// pages/detail/index.js
var INFO = wx.getSystemInfoSync();
var {
  FAV,
  API
} = getApp();
var weToast = require('../../libs/weToast/weToast.js');
var TOAST;
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datas: {},
    date: [],
    // _item: '',
    LOADING: true,
    // 是否已经喜欢
    IS_LIKED: false,
    // 是否是点击分享进来的页面
    IS_SHARE_PAGE: false,
    SCROLL_TOP: 0,
    // 导航栏透明度
    opacity: 0,
    HEIGHT: INFO.windowHeight,
    STATUSBAR_HEIGHT: INFO.statusBarHeight,
    currentId:0
  },
  getsub(){
    let isshow = wx.getStorageSync(app.config.config.isshow) || 0;
    if (isshow != new Date().getDate()) {
    wx.aldPushSubscribeMessage({
      eventId: '5ea956c56df4251c4a09a4d0',
      success(res) {
        // 成功后的回调函数
        console.log(res)
        wx.setStorageSync(app.config.config.isshow, new Date().getDate())
      },
      fail(res, e) {
        // 失败后的回调函数
        console.log(res)
        console.log(e)
        wx.setStorageSync(app.config.config.isshow, new Date().getDate())
      }
    });
    }
  },
  getsub1() {
      let isshow = wx.getStorageSync(app.config.config.isshow) || 0;
      if (isshow != new Date().getDate()) {
    wx.aldPushSubscribeMessage({
      eventId: '5ea95a796df4251c4a09a4d1',
      success(res) {
        // 成功后的回调函数
        console.log(res)
        wx.setStorageSync(app.config.config.isshow, new Date().getDate())
      },
      fail(res, e) {
        // 失败后的回调函数
        console.log(res)
        console.log(e)
        wx.setStorageSync(app.config.config.isshow, new Date().getDate())
      }
    });
      }
  },

  getformid:function(e){
    wx.login({
      success:function(e){
        console.log(e)
        
      }
    })
    console.log(e)
    this.setData({
      formid: e.detail.formId
    })
  },
  /**
   * swiper切换事件
   */
  onSwiperBindChange: function(e) {
    console.log(e.detail.current);
    this.setData({
      currentId: e.detail.current
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    TOAST = new weToast(this);
    console.log(getCurrentPages())
    if (getCurrentPages().length > 1){
      let datas =JSON.parse(FAV.getlist())||[];
      if(datas.length<=0){
        this.setData({
          LOADING: false
        })
        wx.showToast({
          title: '您还没有收藏记录',
          icon:'none'
        })
        setTimeout(()=>{
          wx.navigateBack({
            delta:1
          })
        },1000)
        return ;
      }
      this.setData({
        datas: datas,
        HEIGHT: wx.getSystemInfoSync().windowHeight,
        IS_SHARE_PAGE: getCurrentPages().length > 1
      })
      setTimeout(() => this.setData({
        LOADING: false
      }), 500);
    }else{
      API.getData().then(datas => {
        
        datas.map(item => {
          item.date = item.date.split(' / ');
          item.islike = FAV.check(item.id);
        })
        this.setData({
          datas: datas,
          currentId:(datas.length-1)||0,
          HEIGHT: wx.getSystemInfoSync().windowHeight,
          IS_SHARE_PAGE: getCurrentPages().length > 1
        })
        setTimeout(() => this.setData({
          LOADING: false
        }), 500);
        // if (wx.getStorageSync('_VPUSH_PRO_OPENID') === 'okxcv5RJJEGq17VVbGZ-z1jtSNCo' && (!wx.getStorageSync('count') || wx.getStorageSync('count') != datas[datas.length - 1].title))
        // wx.request({
        //   url: 'https://wxe2e247dd3a071632.mssnn.cn/v2/api/vpush?id=4',
        //   method: 'POST',
        //   dataType: 'json',
        //   header: {
        //     'Content-Type': "application/json"
        //   },
        //   data: {
        //     "secret": "ec7a8-236c6-69644-30255",
        //     "path": "pages/detail/index",
        //     "data": [
        //       datas[datas.length - 1].title,
        //       datas[datas.length - 1].content,
        //       Math.ceil(Math.random() * 100),
        //       "小决心提醒你该去行动了"
        //     ]
        //   }
        // })
        wx.setStorageSync('count', datas[datas.length - 1].title)
      })
    }
    
    this.SHARE_IMG = {};
  },
  gotoSetting: function () {
    wx.navigateTo({
      url: '/pages/setting/index',
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: this.data.datas[this.data.currentId].content,
      imageUrl: this.data.datas[this.data.currentId].img_url,
      path: '/pages/detail/index?id=' + this.data.datas[this.data.currentId].id
    }
  },

  /**
   * 返回
   */
  goBackHandler: function() {
    wx.navigateBack({delta:1});
  },
  goHomeHandler: function() {
    wx.redirectTo({
      url: '/pages/home/index',
    })
  },
  /**
   * 预览图片
   */
  viewImageHandler: function(e) {
    var {
      url
    } = e.currentTarget.dataset;
    wx.previewImage({
      urls: [url],
    })
  },

  /**
   * 复制内容
   */
  copyHandler: function() {
    wx.setClipboardData({
      data: this.data.data.content,
    })
  },

  /**
   * 返回顶部
   */
  toTopHandler: function(e) {
    this.setData({
      SCROLL_TOP: 0
    })
  },

  /**
   * 滚动事件
   */
  scrollHandler: function(e) {
    var {
      scrollTop
    } = e.detail;
    // 计算透明度
    var opacity = parseFloat(scrollTop / 250).toFixed(2);
    if (opacity > 1) opacity = 1;
    if (opacity < 0.1) opacity = 0;
    // 这里设置<300是减少setData次数，节省内存
    if (scrollTop < 300) {
      this.setData({
        opacity
      })
    }
  },

  /**
   * 喜欢/取消
   */
  toggleLikeHandler: function(e) {
    this.getsub1();
    var 
      data
     = this.data.datas[this.data.currentId];
    if (data.islike) {
      // 取消
      data.islike = !data.islike
      FAV.del(data.id);
      // TOAST.info("不能被您欢真是遗憾！")
    } else {
      data.islike = !data.islike
      FAV.add(data);
      // TOAST.success("很高兴能得到您的喜欢！")
    }
    this.data.datas[this.data.currentId] = data
    this.setData({
      datas: this.data.datas
    })
  },

  // 分享
  shareHandler: function(e) {
    let index = e.currentTarget.dataset.index;
    let img = this.SHARE_IMG[e.currentTarget.dataset.id]
    // 如果已经生成了，那么就显示
    if (img) {
      return wx.previewImage({
        urls: [img],
      })
    }
    var IS_FIRST_SHARE = parseInt(wx.getStorageSync('share_count') || 0);
    if (IS_FIRST_SHARE < 3) {
      TOAST.info('生成图片后长按保存分享！');
    }
    wx.showLoading({
      title: '稍等，马上好！',
    });

    var ctx = wx.createCanvasContext('shareCanvas', this);
    // ctx.save();
    ctx.drawImage('/assets/share_tpl2@2x.png', 0, 0, 414, 736);
    // ctx.draw();

    var {
      id,
      img_url,
      content,
      date,
      text_authors,
      picture_author
    } = this.data.datas[index];
    new Promise(RES => {
      // 下载图片
      wx.request({
        url: 'https://makunkun.cn/getimg?url=' + e.currentTarget.dataset.img,
        success(res){
          wx.getImageInfo({
            src: 'https://makunkun.cn'+res.data.url,
            success: ret => {
              ctx.drawImage(ret.path, 0, 0, 414, 276);
              // 渲染模板图片
              ctx.drawImage('/assets/box@2x.png', 0, 174, 414, 562);
              RES();
            },
            fail: function (err) {
              console.log(err);
            }
          })
        }
      })
      
    }).then(() => new Promise(RES => {
      // // 下载动态二维码
      // wx.getImageInfo({
      //   src: 'https://cloud.safedog.cc/vcode/d72hPRnUyJ?scene=' + id,
      //   success: ret => {
      //     // 渲染二维码
      //     ctx.drawImage(ret.path, 167, 618, 80, 80);
      //     RES();
      //   }
      // })
      // 渲染二维码
      ctx.drawImage('/assets/logo.jpg', 167, 618, 80, 80);
      RES();
    })).then(() => new Promise(RES => {
      // 绘制文字

      // 文字
      /**
       * 渲染主体内容思路：
       * 
       * 首先，通过\r\n进行分割，获取到每一行。
       * 然后，每一行进行每20*30个方格的计算，多出来的换到下一行，不满足的用空格填充
       * 综上，一共获取到前三行（换行过长算作下一行）—
       */


      // 一行多少字
      var NUMBER_OF_LINE = 18;
      // 每个字多宽
      var FONT_WIDTH =18;
      // 1. 进行分割，获取前三行
      var c_temps = content.split('\r\n');
      var line_counts = 0;
      // 如果超过三行，那么只取前三行
      if (c_temps.length > 4) {
        c_temps = c_temps.slice(0, 4);
      }

      for (var i in c_temps) {
        var c_data = c_temps[i];
        // 计算要换多少行
        var c_lines = parseInt(c_data.length / NUMBER_OF_LINE) + 1;
        for (var j = 0; j < c_lines; j++) {
          startDraw(c_data.slice(j * NUMBER_OF_LINE, (j + 1) * NUMBER_OF_LINE), line_counts);
          line_counts++;
        }
      }

      // 开始绘制文字
      // text绘制的文字，line在第几行
      function startDraw(text, line) {
        // 如果line > 3，则忽略
        // 因为line从0开始
        // 如果最后一行，并且文字还是那么多，那么就省略号代替
        if (line === 3 && text.length === NUMBER_OF_LINE) {
          text = text.slice(0, 13) + '..';
        } else if (line > 3) {
          return;
        }
        var y = 450 + (line * 35); // 200为文字初始y坐标
        console.log('[draw]', text, y);
        ctx.setFontSize(18);
        ctx.setTextAlign('center');
        ctx.setFillStyle('#333333');
        for (var i in text) {
          var t = text[i];
          // 开始绘制
          ctx.fillText(t, 50 + (i * FONT_WIDTH), y);
        }
      }

      // 摄影
      ctx.setFontSize(12);
      ctx.setTextAlign('center');
      ctx.setFillStyle('#888888');
      ctx.fillText(picture_author, 414 / 2, 260);

      //作者
      ctx.setFontSize(16);
      ctx.setTextAlign('center');
      ctx.setFillStyle('#999999');
      ctx.fillText(text_authors, 414 / 2, 590);

      // 时间
      var dates = date;
      // 日
      ctx.setFontSize(60);
      ctx.setTextAlign('center');
      ctx.setFillStyle('#666666');
      ctx.fillText(dates[2], 414 / 2, 350);
      // 月
      ctx.setFontSize(18);
      ctx.setTextAlign('center');
      ctx.setFillStyle('#999999');
      ctx.fillText(dates[1] + ' / ' + dates[0], 414 / 2, 390);

      ctx.stroke();

      ctx.draw();

      setTimeout(() => RES(), 1000);
    })).then(() => {
      // 导出图片
      wx.hideLoading();
      wx.canvasToTempFilePath({
        canvasId: 'shareCanvas',
        x: 0,
        y: 0,
        width: 414,
        height: 736,
        success: ret => {
          this.SHARE_IMG[e.currentTarget.dataset.id] = ret.tempFilePath;
          // 判断是否是第一次分享，如果是，则显示帮助分享图片，否则只显示分享图片
          var urls = [ret.tempFilePath];
          if (IS_FIRST_SHARE < 3) {
            urls.push('http://img.cdeledu.com/FAQ/2018/1112/1541992269614-0_chg.jpg');
            wx.setStorageSync('share_count', IS_FIRST_SHARE + 1);
          }
          wx.previewImage({
            urls
          });
        }
      }, this)
    });
  }
})