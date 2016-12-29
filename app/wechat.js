'use strict'
var Promise=require('bluebird')
var _=require('lodash')
var request=Promise.promisify(require('request'))
var fs=require('fs')
var prefix='https://api.weixin.qq.com/cgi-bin/'
var api={
    accessToken:prefix+'token?grant_type=client_credential',
    temporary:{
        upload:prefix+'media/upload?',
        fetch:prefix+'media/get?'
    },
    permanent:{
        upload:prefix+'material/add_material?',
        uploadNews:prefix+'material/add_news?',
        uploadNewsPic:prefix+'material/uploadimg?',
        fetch:prefix+'material/get_material?',
        del:prefix+'material/del_material?',
        update:prefix+'material/update_news?',
        count:prefix+'material/get_materialcount?',
        batch:prefix+'material/batchget_materialcount?'
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
                   // console.log(response.toJSON())
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


WeChat.prototype.fetchMaterial=function(media_id,type,permanent){
    var that=this
    var form={}
    var fetchUrl=api.temporary.fetch
    if(permanent){
        fetchUrl=api.permanent.fetch

    }

    return new Promise(function(resolve,reject){
        that
            .fetchAccessToken()
            .then(function(data){
                var url=fetchUrl+'&access_token='+data.access_token+'&media_id='+media_id
                if(!permanent && type==='video'){
                    url=url.replace("https://","http://")
                    url+='&type='+type
                }
                resolve(url)
            })
    })
}


WeChat.prototype.delMaterial=function(media_id){
    var that=this
    var form={
        media_id:media_id
    }
    var delUrl=api.permanent.del

    return new Promise(function(resolve,reject){
        that
            .fetchAccessToken()
            .then(function(data){
                var url=delUrl+'&access_token='+data.access_token+'&media_id='+media_id

                var options={
                    method:'POST',
                    url:url,
                    json:true

                }

                options.body=form

                request(options).then(function(response){
                   // console.log(response.toJSON())
                    var _data=response.toJSON().body

                    if(_data){
                        resolve(_data)
                    }else{
                        throw new Error('删除素材失败!')
                    }
                })
                    .catch(function(err){
                        reject(err)
                    })
            })
    })
}


WeChat.prototype.updateMaterial=function(media_id,news){
    var that=this
    var form={
        media_id:media_id
    }

    _.extend(form,news)

    var updateUrl=api.permanent.update

    return new Promise(function(resolve,reject){
        that
            .fetchAccessToken()
            .then(function(data){
                var url=updateUrl+'&access_token='+data.access_token+'&media_id='+media_id

                var options={
                    method:'POST',
                    url:url,
                    json:true

                }

                options.body=form

                request(options).then(function(response){
                    //console.log(response.toJSON())
                    var _data=response.toJSON().body

                    if(_data){
                        resolve(_data)
                    }else{
                        throw new Error('更新素材失败!')
                    }
                })
                    .catch(function(err){
                        reject(err)
                    })
            })
    })
}




WeChat.prototype.getMaterial=function(){
    var that=this


    var countUrl=api.permanent.count

    return new Promise(function(resolve,reject){
        that
            .fetchAccessToken()
            .then(function(data){
                var url=countUrl+'&access_token='+data.access_token

                var options={
                    method:'GET',
                    url:url,
                    json:true
                }

                request(options).then(function(response){
                    //console.log(response.toJSON())
                    var _data=response.toJSON().body

                    if(_data){
                        resolve(_data)
                    }else{
                        throw new Error('获取素材数量!')
                    }
                })
                    .catch(function(err){
                        reject(err)
                    })
            })
    })
}


WeChat.prototype.batchgetMaterial=function(opts){
    var that=this

    var form={
        type:opts.type||'iamge',
        offset:opts.offset||0,
        count:offset.count||1
    }

    var batchUrl=api.permanent.batch

    return new Promise(function(resolve,reject){
        that
            .fetchAccessToken()
            .then(function(data){
                var url=batchUrl+'&access_token='+data.access_token

                var options={
                    method:'GET',
                    url:url,
                    json:true
                }
                options.body=form

                request(options).then(function(response){
                    //console.log(response.toJSON())
                    var _data=response.toJSON().body

                    if(_data){
                        resolve(_data)
                    }else{
                        throw new Error('获取素材数量!')
                    }
                })
                    .catch(function(err){
                        reject(err)
                    })
            })
    })
}


module.exports=WeChat