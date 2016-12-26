'use strict'

var Koa=require('koa');
var Sha1=require('sha1');
var config = {
    wechat:{
        appId:'wx5be0aea4ed58cb68',
        appsecret:'792aabac3f1bd3c7dde5a9c8d63cae43',
        token:'lanccj'
    }
}

var app=new Koa();

app.use(function *(next){
     console.log(this.query);

     var token=config.wechat.token;
     var signature=this.query.signature;
     var nonce = this.query.nonce;
     var timestamp=this.query.timestamp;
     var echostr=this.query.echostr;
     var str=[token,timestamp,nonce].sort().join('');
     var sha=Sha1(str);

     if(sha===signature){
         this.body=echostr+'';
     }else{
         this.body='不好意思不接受不是来自微信的请求!请滚开咯！！';
     }

});

app.listen(1234);
console.log('LancCJ公众号服务器已经启动');