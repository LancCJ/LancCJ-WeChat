'use strict'

var Koa=require('koa')
var path=require('path')
var util=require('./libs/util')
var Validation=require('./app/validation')
var wechat_file=path.join(__dirname,'./config/wechat_file.txt')
var config = {
    wechat:{
        appId:'wx5be0aea4ed58cb68',
        appSecret:'792aabac3f1bd3c7dde5a9c8d63cae43',
        token:'lanccj',
        getAccessToken:function(){
            return util.readFileAsync(wechat_file)
        },
        saveAccessToken:function(data){
          //console.log(data)
          data=JSON.stringify(data)
          return util.writeFileAsync(wechat_file,data)
        }
    }
}

var app=new Koa()
app.use(Validation(config.wechat))
app.listen(1234)//监听端口
console.log('LancCJ公众号服务已经启动')