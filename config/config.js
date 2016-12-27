'use strict'

var path=require('path')
var util=require('../libs/util')
var wechat_file=path.join(__dirname,'./wechat_file.txt')
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

module.exports=config