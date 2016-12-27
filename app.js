'use strict'

var Koa=require('koa')
var config=require('./config/config')
var Validation=require('./app/validation')
var weixin=require('./app/weixin')
var Constant=require('./common/constant')
var app=new Koa()

app.use(Validation(config.wechat,weixin.reply))
app.listen(1234)
console.log('LancCJ公众号服务已经启动')