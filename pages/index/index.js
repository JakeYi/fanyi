//index.js
//获取应用实例
import {
  translate
} from '../../utils/api.js'
const app = getApp()
const dbHis = wx.cloud.database().collection("history")
const dbCollect = wx.cloud.database().collection("collect")
Page({
  data: {
    query: '',
    hideClearIcon: true,
    result: [],
    curLang: {}
  },
  onLoad: function (options) {
    if (options.query) {
      this.setData({
        query: options.query
      })
    }
  },
  onShow: function () {
    if (this.data.curLang.lang !== app.globalData.curLang.lang) {
      this.setData({
        curLang: app.globalData.curLang
      })
      this.onConfirm()
    }
  },
  onInput: function (e) {
    this.setData({
      'query': e.detail.value
    })
    if (this.data.query.length > 0) {
      this.setData({
        'hideClearIcon': false
      })
    } else {
      this.setData({
        'hideClearIcon': true
      })
    }
  },
  onTapClose: function () {
    this.setData({
      'query': '',
      'hideClearIcon': true
    })
  },
  onConfirm: function () {
    if (!this.data.query) return
    translate(this.data.query, {
      from: 'auto',
      to: this.data.curLang.lang
    }).then(res => {
      this.setData({
        'result': res.trans_result
      })
      this.addHistory(res.trans_result[0])
    })
  },
  addHistory(item) {
    dbHis.add({
      data: {
        dst: item.dst,
        src: item.src
      },
      success: res => {
        console.log(res)
        console.log('增加历史记录成功')
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  addCollect: function(e){
    wx.showModal({
      title: '提醒',
      content: '是否要添加为收藏词汇',
      success (res) {
        if (res.confirm) {
          dbCollect.add({
            data: {
              dst: e.currentTarget.dataset.dst,
              src: e.currentTarget.dataset.src
            },
            success: res => {
              console.log(res)
              console.log('增加收藏成功')
            },
            fail: err => {
              console.log(err)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})