const app = getApp()
const dbHis = wx.cloud.database().collection("history")

Page({
  data: {
    history: []
  },

  onShow: function () {
    dbHis.get({
      success: res => {
        this.setData({
          history: res.data
        })
      }
    })
  },
  onDelete: function(e) {
    const that = this
    // console.log(this.data.history)
    wx.showModal({
      title: '提醒',
      content: '是否确认删除本条历史记录',
      success (res) {
        if (res.confirm) {
          dbHis.where({
            _openid: e.currentTarget.dataset.openid,
            _id : e.currentTarget.dataset.id
          }).remove({
            success: (res) => {
              console.log('删除成功')
            }
          })
          var arr = that.data.history
          arr.splice(e.currentTarget.dataset.id,1)
          that.setData({
            history: arr,
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