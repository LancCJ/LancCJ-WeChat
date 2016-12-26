'use strict'

var Koa=require('koa');
var Validation=require('./app/validation');
var config = {
    wechat:{
        appId:'wx5be0aea4ed58cb68',
        appsecret:'792aabac3f1bd3c7dde5a9c8d63cae43',
        token:'lanccj'
    }
}

var app=new Koa();
app.use(Validation(config.wechat));
app.listen(1234);//监听端口
console.log('LancCJ公众号服务器已经启动');