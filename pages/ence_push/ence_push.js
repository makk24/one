let PUSH = require('../../utils/push_conf.js');

let isOver = false;

let api = 'https://openapi2.xiaoshentui.com/'

Page({
  data: {
  },
  onShow() {
    let _this = this;
    if (wx.getStorageSync('push_avatarurl') && wx.getStorageSync('push_nickname')){
      this.setData({
        avatarurl: wx.getStorageSync('push_avatarurl'),
        nickname: wx.getStorageSync('push_nickname'),
      })
    }
  },
  onGotUserInfo: function(e) {
    this.setData({
      avatarurl: e.detail.userInfo.avatarUrl,
      nickname: e.detail.userInfo.nickName,
    })
    wx.setStorageSync('push_avatarurl', e.detail.userInfo.avatarUrl)
    wx.setStorageSync('push_nickname', e.detail.userInfo.nickName)
  },
  subscribe: function(e) {
    if (!wx.getStorageSync('ald_push_openid')) {
      return this.debugModel('openid未上报');
    };
    if (isOver) return;
    isOver = true;
    if (!this.isSubscribe()){
      return this.debugModel('基础库版本不支持订阅消息');
    }
    let _this = this;
    let data = {
      avatarurl: this.data.avatarurl,
      nickname: this.data.nickname,
      app_key: PUSH.app_key,
      openid: wx.getStorageSync('ald_push_openid')
    }
    wx.request({
      url: api + 'api/v1/getpt',
      data: {
        app_key: PUSH.app_key
      },
      method: 'POST',
      success(res) {
        let tlis = res.data.data.list.map(function(item){
          return item.template_id;
        })
        wx.requestSubscribeMessage({
          tmplIds: tlis,
          success(_res) {
            let tmplIdsArr = [];
            for (let i in _res) {
              if (_res[i] === 'accept') {
                tmplIdsArr.push(i);
              }
            }
            if (!tmplIdsArr.length) {
              isOver = false;
              return _this.debugModel('未订阅模版');
            }
            data.tlis = tmplIdsArr;
            wx.request({
              url: api + 'api/v1/reportdt',
              data: data,
              method: 'POST',
              success: function (__res) {
                isOver = false;
                _this.debugModel('订阅成功');
              },
              fail(e) {
                isOver = false;
                _this.debugModel('订阅成功模版上报失败');
              }
            })
          },
          fail(e) {
            isOver = false;
            _this.debugModel('订阅失败');
          }
        })
      },
      fail(e) {
        isOver = false;
        _this.debugModel('获取模版ID请求失败');
      }
    });
  },
  isSubscribe() {
    var SyStemRes = wx.getSystemInfoSync();
    if (typeof SyStemRes.SDKVersion !== 'undefined') {
      let v = parseInt(SyStemRes.SDKVersion.split('.').join(''));
      if (v >= 282) {
        return true;
      }
      return false;
    }
    return false;
  },
  debugModel(msg) {
    wx.showModal({
      title: '小神推提示',
      content: msg,
    });
  }
});