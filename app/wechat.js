'use strict'
var Promise=require('bluebird')
var _=require('lodash')
var request=Promise.promisify(require('request'))
var fs=require('fs')
var prefix='https://api.weixin.qq.com/cgi-bin/'
var api={
    accessToken:prefix+'token?grant_type=client_credential',
    temporary:{
        upload:prefix+'media/upload?'
    },
    permanent:{
        upload:prefix+'material/add_material?',
        uploadNews:prefix+'material/add_news?',
        uploadNewsPic:prefix+'material/uploadimg?'
    },
    menu:{
        create:prefix+'menu/create?',
        get:prefix+'menu/get?',
        del:prefix+'menu/delete?',
        current:prefix+'menu/get_current_selfmenu_info?'
    }

}
var util=require('./util')


function WeChat(opts){
    var that=this
    this.appId=opts.appId
    this.appSecret=opts.appSecret
    this.getAccessToken=opts.getAccessToken
    this.saveAccessToken=opts.saveAccessToken

    this.fetchAccessToken()

}

WeChat.prototype.updateAccessToken=function(data){
    var appId=this.appId
    var appSecret=this.appSecret
    var url=api.accessToken+'&appid='+appId+'&secret='+appSecret

    return new Promise(function(resolve,reject){
        request({url:url,json:true}).then(function(response){
            //console.log(response.toJSON())
            var data=response.toJSON().body
            //console.log(data)
            var now=((new Date).getTime())
            var expires_in=now+(data.expires_in -20)*1000
            data.expires_in=expires_in

            resolve(data)
        })
    })
}

WeChat.prototype.fetchAccessToken=function(){
    var that=this
    if(this.access_token && this.expires_in){
        if(this.isValidAccessToken(this)){
            return Promise.resolve(this)
        }
    }

    this.getAccessToken()
        .then(function(data){
            try{
                data=JSON.parse(data)
            }
            catch(e){
                return that.updateAccessToken(data)
            }

            if(that.isValidAccessToken(data)){
                return Promise.resolve(data)
            }else{
                return that.updateAccessToken()
            }
        })
        .then(function(data){
            //console.log('读取')
            //console.log(data)
            that.access_token=data.access_token
            that.expires_in=data.expires_in

            that.saveAccessToken(data)

            return Promise.resolve(data)
        })
}

WeChat.prototype.isValidAccessToken=function(data){
    if(!data || !data.access_token || !data.expires_in){
        return false
    }

    var access_token=data.access_token
    var expires_in=data.expires_in
    var now=(new Date().getTime())

    if(now<expires_in){
        return true
    }else{
        return false
    }

}


WeChat.prototype.reply=function(){
    var content = this.body
    var message = this.weixin
    var xml = util.tpl(content,message)
    this.status=200
    this.type='application/xml'

    console.log('               返回消息              ');
    console.log('↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓');
    console.log(xml);
    console.log('↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓');

    this.body=xml
}


WeChat.prototype.uploadMaterial=function(type,material,permanent){
    var that=this
    var form={}
    var uploadUrl=api.temporary.upload
    if(permanent){
        uploadUrl=api.permanent.upload

        _.extend(form,permanent)
    }
    if(type==='pic'){
        uploadUrl=api.permanent.uploadNewsPic
    }

    if(type==='news'){
        uploadUrl=api.permanent.uploadNews
        form=material
    }else {
        form.media=fs.createReadStream(material)
    }



    return new Promise(function(resolve,reject){
        that
            .fetchAccessToken()
            .then(function(data){
                var url=uploadUrl+'&access_token='+data.access_token
                if(!permanent){
                    url+='&type='+type
                }
                var options={
                    method:'POST',
                    url:url,
                    json:true
                }
                if(type==='news'){
                    options.body=form
                }else{
                    options.formData=form
                }
                request(options).then(function(response){
                    console.log(response.toJSON())
                    var _data=response.toJSON().body

                    if(_data){
                        resolve(_data)
                    }else{
                        throw new Error('上传素材失败!')
                    }
                })
                    .catch(function(err){
                        reject(err)
                    })
            })

    })
}

module.exports=WeChat