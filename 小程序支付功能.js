const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    });
    wx.login({
      //获取code
      success: function (res) {
        var code = res.code
        wx.request({
          url: App.globalData.ajaxdomain + '&ac=openid&code=' +code,
          method: 'GET',
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          },
          success: function (res) {
            var openid = res.data.openid;
            console.log(App.globalData.ajaxdomain + '&ac=pay');
            wx.request({
              url: App.globalData.ajaxdomain+'&ac=pay', //你服务器code.php文件地址，默认GET。小程序只支持https ，
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
              },
              data: {
                order_id:options.order_id,
                openid: openid,
              },
              success: function (res) {
                wx.hideLoading();
                wx.requestPayment({
                  'timeStamp': res.data.timeStamp+'',
                  'nonceStr': res.data.nonceStr,
                  'package': res.data.package,
                  'signType': 'MD5',
                  'paySign': res.data.paySign,
                  'success': function (res) {
                    if (res.errMsg == 'requestPayment:ok') {
                      wx.showToast({
                        title: '恭喜您，支付成功',
                        icon: 'success',
                        duration: 6000,
                        success: function () {
                          var pages = getCurrentPages();
                          var currPage = pages[pages.length - 1];
                          var prevPage = pages[pages.length - 2];
                          options.notify_url ? prevPage.setData({ path: decodeURIComponent(options.notify_url) }) : prevPage.setData({path:App.globalData.domain});
                          wx.navigateBack();
                        }
                      });
                    } else {
                      wx.navigateBack();
                    }
                  },
                  'fail': function (res) {
                    wx.navigateBack();
                  },
                  'complete': function (res) {
                    if (res.errMsg == 'requestPayment:ok'){
                      wx.showToast({
                        title: '恭喜您，支付成功',
                        icon: 'success',
                        duration: 6000,
                        success:function(){
                          var pages = getCurrentPages();
                          var currPage = pages[pages.length - 1];
                          var prevPage = pages[pages.length - 2];  
                          options.notify_url ? prevPage.setData({ path: decodeURIComponent(options.notify_url) }) : prevPage.setData({ path: App.globalData.domain });
                          wx.navigateBack();
                        }
                      });
                    }else{
                      wx.navigateBack();
                    }

                  }
                });

              },
              fail: function (res) {
                console.log(res.data)
              }
            })

          }
        })
      }
    })
  }
})
