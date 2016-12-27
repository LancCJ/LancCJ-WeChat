'use strict'

var Constant=require('../common/constant')

exports.reply=function *(next) {
    var message=this.weixin

    if(message.MsgType==='event'){
        if(message.Event==='subscribe'){
            if(message.EventKey){
                console.log('扫码关注'+message.EventKey+message.ticket)
            }
            console.log('关注')
            this.body='欢迎关注LancCJ公众订阅号'
        }else if(message.Event==='unsubscribe'){
            console.log('取消关注')
            this.body=''
        }else if(message.Event==='LOCATION'){
            this.body='您上报的位置是:'+message.Latitude+'/'+message.Longitude+'-'+message.Precision
        }else if(message.Event==='CLICK'){
            this.body='您点击了菜单'+message.EventKey
        }else if(message.Event==='SCAN'){
            console.log('关注扫二维码'+message.EventKey+' '+message.Ticket)
            this.body='看到了扫一下'
        }else if(message.Event==='VIEW'){
            this.body='您点击了链接'+message.EventKey
        }
    }else if(message.MsgType==='text'){
        var content=message.Content
        var reply='额，不清楚'+content+'很难理解'

        if(content==='1'){
            reply='11111'
        }else if(content==='2'){
            reply='22222'
        }else if(content==='3'){
            reply='33333'
        }else if(content==='4'){
            reply=[
                {
                    title:'百度',
                    description:'搜索你想要的东西',
                    picUrl:'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/logo_white_fe6da1ec.png',
                    url:'https://www.baidu.com'
                }
                //,
                // {
                //     title:'港剧网',
                //     description:'可以看TVB',
                //     picUrl:'http://www.tvbmove.com/templets/mystyle/images/logo.png',
                //     url:'http://www.tvbmove.com/'
                // }
            ]
        }

        this.body=reply
    }
    yield next
}