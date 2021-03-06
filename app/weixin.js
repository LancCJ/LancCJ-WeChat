'use strict'

var Constant=require('../common/constant')
var config=require('../config/config')
var Wechat=require('./wechat')
var wechatApi=new Wechat(config.wechat)


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
        var reply='额，不清楚'+content+'很难理解，麻烦查看回复规则吧'

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
        }else if(content==='5'){
            var data=yield wechatApi.uploadMaterial('image',__dirname+'/../doc/1.jpeg')

            //console.log(data)

            reply={
                type:'image',
                mediaId:data.media_id
            }
        }else if(content==='6'){
            var data=yield wechatApi.uploadMaterial('video',__dirname+'/../doc/MP40.mp4')

            //console.log(data)

            reply={
                type:'video',
                mediaId:data.media_id,
                title:'我是视频',
                description:'我是描述'
            }
        }else if(content==='7'){
            var data=yield wechatApi.uploadMaterial('image',__dirname+'/../doc/1.jpeg')

            //console.log(data)

            reply={
                type:'music',
                mediaId:data.media_id,
                title:'我是音乐',
                description:'我是描述',
                musicUrl:'http://mpge.5nd.com/2015/2015-9-12/66325/1.mp3',
                hQMusicurl:'http://mpge.5nd.com/2015/2015-9-12/66325/1.mp3',
                thumbMediaid:data.media_id
            }
        }else if(content==='8'){
            var data=yield wechatApi.uploadMaterial('image',__dirname+'/../doc/1.jpeg',{
                type:'image'
            })

            //console.log(data)

            reply={
                type:'image',
                mediaId:data.media_id
            }
        }else if(content==='9'){
            var data=yield wechatApi.uploadMaterial('video',__dirname+'/../doc/MP40.mp4',{
                type:'video',
                description:'{"title":"永久title", "introduction":"永久introduction"}'//这里是字符串。。。干
            })

            //console.log(data)

            reply={
                type:'video',
                mediaId:data.media_id,
                title:'我是视频',
                description:'我是描述'
            }
        }

        this.body=reply
    }
    yield next
}