'use strict'
var Sha=require('sha1')
var Promise=require('bluebird')
var getRawBody=require('raw-body')
var util=require('./util')

var request=Promise.promisify(require('request'))

var WeChat=require('./wechat')
var Constant=require('../common/constant')

module.exports=function(opts,handler){

    var wehcat=new WeChat(opts)

    return function *(next){
        var that=this
        var token=opts.token
        var nonce=this.query.nonce
        var signature=this.query.signature
        var echostr=this.query.echostr
        var timestamp=this.query.timestamp

        var str=[token,timestamp,nonce].sort().join('')
        var sha=Sha(str)

        if(this.method==='GET'){
            if(sha===signature){
                this.body=echostr+''
            }else{
                this.body=Constant.NO_WECHAT_SERVER
            }
        }else if(this.method==='POST'){
            if(sha!==signature){
                this.body=Constant.NO_WECHAT_SERVER
                return false
            }

            var data=yield getRawBody(this.req, {
                length:this.length,
                limit:'1mb',
                encoding:this.charset
            })

            //console.log(data.toString());

            var content=yield util.parseXMLAsync(data)

            //console.log(content);

            var message=util.formatMessage(content)

            console.log('               接收到消息              ');
            console.log('↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓');
            console.log(message);
            console.log('↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓');

            this.weixin=message

            yield handler.call(this,next)

            wehcat.reply.call(this)

        }
    }
}