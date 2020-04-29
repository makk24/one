/**
 * 一ONE小程序
 * 项目：https://github.com/guren-cloud/weapp-one
 * 古人云小程序：https://guren.cloud
 * 作者微信：hack_fish
 */

//app.js
require('./utils/push_sdk.js')
var API = require('./utils/api.js');
var FAV = require('./utils/fav.js');
App({
  API,
  FAV: new FAV(),
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    wx.login({
      success(res){
        console.log(res)
      }
    })
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    if (wx.canIUse('getUpdateManager')) {
      this.checkForUpdateApp();
    }
    wx.login({
      success(res){
        wx.request({
          url: `https://makunkun.cn/wx/getUser?appid=wxe2e247dd3a071632&code=${res.code}`,
          success(res){
            if (res.data.openid){
              wx.aldPushSendOpenid(res.data.openid)
            }
          }
        })
      }
    })
  },
  checkForUpdateApp() {
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
    })
  },
  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  }
})
