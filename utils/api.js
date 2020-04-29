Date.prototype.format = function (format) {
  var o = {
    "M+": this.getMonth() + 1, //month
    "d+": this.getDate(),    //day
    "h+": this.getHours(),   //hour
    "m+": this.getMinutes(), //minute
    "s+": this.getSeconds(), //second
    "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
    "S": this.getMilliseconds() //millisecond
  }
  if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
    (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o) if (new RegExp("(" + k + ")").test(format))
    format = format.replace(RegExp.$1,
      RegExp.$1.length == 1 ? o[k] :
        ("00" + o[k]).substr(("" + o[k]).length));
  return format;
}

class API_OLD {
  constructor () {
    this.KEY = 'DATAS';
    this.API = 'https://api.hibai.cn/api/index/index';
  }

  /**
   * 解析数据格式
   */
  formatData (data) {
    var new_data = [];
    data.map(function (d) {
      new_data.push({
        id: d.hpcontent_id,
        title: d.hp_title,
        img_url: d.hp_img_url,
        picture_author: d.hp_author,
        date: d.hp_makettime.split(' ')[0].replace(/-/g, ' / '),
        content: d.hp_content,
        text_authors: d.text_authors,
        word_id: d.author_id,
        maketime: d.maketime
      })
    });
    return new_data;
  }

  /**
   * 获取数据
   */
  getData () {
    return new Promise((RES, REJ) => {
      // 获取缓存
      var HAS_CACHE = this.getCache();
      if (HAS_CACHE !== false) return RES(HAS_CACHE);
      // 请求数据
      wx.request({
        url: "https://makunkun.cn/hp/more",
        method: 'POST',
        dataType: 'json',
        data: {
          'TransCode': '030112',
          'OpenId': '123456789',
          'Body': ''
        },
        success: ret => {
          console.log(ret)
          let data = ret.data.data||[]
          data.reverse()
          var datas = this.formatData(data);
          // 存储缓存
          wx.setStorageSync(this.KEY, datas);
          RES(datas);
        },
        fail: REJ
      })
    });
  }

  /**
   * 获取本地缓存
   */
  getCache () {
    var datas = wx.getStorageSync(this.KEY);
    if (!datas || datas.length==0) return false;
    // 判断时间
    var data = datas[0];
    if (data.date === new Date().format('yyyy / MM / dd')) return datas;
    return false;
  }

  /**
   * 根据ID获取单条数据
   * 如果不存在，则重新获取
   */
  getDataById (id) {
    return new Promise((RES, REJ) => {
      this.getData().then(datas => {
        var data = {};
        datas.map(d => {
          if (d.id === parseInt(id)) data = d;
        });
        return RES(data);
      })
    })
  }
}

/**
 * f
 */
class API {
  constructor () {
    this.KEY = 'DATAS_ONE';
    this.TOKEN = '';
    this.COOKIE = '';
    this.API = 'https://one.safedog.cc/one';
  }

  /**
   * 获取数据接口token
   */
  getToken () {
    return new Promise((RES, REJ) => {
      if (this.TOKEN) return RES(this.TOKEN);
      wx.request({
        url: this.API,
        success: ret => {
          var { data } = ret;
          // cookie
          this.COOKIE = ret.header['Set-Cookie'];
          // 解析出token
          var token = data.split("One.token = '")[1].split("'")[0];
          if (token.length === 40) {
            this.TOKEN = token;
            return RES(token);
          }
          REJ('获取token失败');
        },
        fail: REJ
      })
    })
  }

  /**
   * 获取数据接口
   */
  getData () {
    return new Promise((RES, REJ) => {
      // 获取缓存
      var HAS_CACHE = this.getCache();
      if (HAS_CACHE !== false) return RES(HAS_CACHE);
      this.getToken().then(token => {
        wx.request({
          url: this.API + '/ajaxlist/0?_token=' + token,
          dataType: 'json',
          header: {
            'Cookie': this.COOKIE
          },
          success: res => {
            var { data } = res.data;
            if (Array.isArray(data)) {
              // 存储缓存
              wx.setStorageSync(this.KEY, data);
              return RES(data);
            }
            REJ('获取数据失败');
          },
          fail: REJ
        })
      }).catch(REJ);
    })
  }

  /**
   * 获取本地缓存
   */
  getCache() {
    var datas = wx.getStorageSync(this.KEY);
    if (!datas) return false;
    // 判断时间
    var data = datas[0];
    if (data.date === new Date().format('yyyy / MM / dd')) return datas;
    return false;
  }

  /**
   * 根据ID获取单条数据
   * 如果不存在，则重新获取
   */
  getDataById(id) {
    return new Promise((RES, REJ) => {
      this.getData().then(datas => {
        var data = {};
        datas.map(d => {
          if (parseInt(d.id) === parseInt(id)) data = d;
        });
        return RES(data);
      })
    })
  }
}


module.exports = new API_OLD();