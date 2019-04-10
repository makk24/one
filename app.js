/**
 * 一ONE小程序
 * 项目：https://github.com/guren-cloud/weapp-one
 * 古人云小程序：https://guren.cloud
 * 作者微信：hack_fish
 */

//app.js
var API = require('./utils/api.js');
var FAV = require('./utils/fav.js');
const vPush = require("./vpush-pro-sdk/vpush.pro.js");

App({
  vPush: new vPush('wxe2e247dd3a071632'),
  API,
  FAV: new FAV(),
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    if (wx.canIUse('getUpdateManager')) {
      this.checkForUpdateApp();
    }
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
