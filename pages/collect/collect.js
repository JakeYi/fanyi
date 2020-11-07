const app = getApp()
const dbCollect = wx.cloud.database().collection("collect")

Page({
  data: {
    collect: []
  },

  onShow: function () {
    dbCollect.get({
      success: res => {
        this.setData({
          collect: res.data
        })
      }
    })
  },
  onDelete: function(e) {
    const that = this
    // console.log(this.data.history)
    wx.showModal({
      title: '提醒',
      content: '是否确认删除本条收藏',
      success (res) {
        if (res.confirm) {
          dbCollect.where({
            _openid: e.currentTarget.dataset.openid,
            _id : e.currentTarget.dataset.id
          }).remove({
            success: (res) => {
              console.log('删除成功')
            }
          })
          var arr = that.data.collect
          arr.splice(e.currentTarget.dataset.id,1)
          that.setData({
            collect: arr,
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },
  onTapItem: function (e) {
    console.log(e)
    wx.reLaunch({
      url: `/pages/index/index?query=${e.currentTarget.dataset.query}`
    })
  }
})