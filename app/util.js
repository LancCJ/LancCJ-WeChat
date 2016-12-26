'use strict'

var xml2js=require('xml2js')
var Promise=require('bluebird')

exports.parseXMLAsync=function (xml){
    return new Promise(function(resolve,reject){
        xml2js.parseString(xml,{trim:true},function(err,content){
            if(err)reject(err)
            resolve(content)
        })
    })
}

function formatMessage(result){
    var message={}
    console.log(typeof result)
    if(typeof result==='object'){
        var keys=Object.keys(result)
        console.log(keys.length)
        for (var i=0;i<keys.length;i++){

            var item=result[keys[i]]
            var key=keys[i]

            console.log('key='+key)

            console.log('item='+item)

            console.log('typeof result'+typeof result)

            if(!(typeof result==='object') || item.length===0){
                continue
            }

            console.log('item.length='+item.length)

            if(item.length===1){
                var val=item[0]

                console.log('typeof val='+typeof val)

                if(typeof val ==='object'){
                    console.log('1')
                    message[key]=formatMessage(val)

                }else {
                    console.log(message[key])
                    message[key]=(val||'').trim()

                }
            }else{
                console.log('2')
                message[key]=[]

                for (var j=0,k=item.length;j<k;j++){
                    message[key].push(formatMessage(item[j]))
                }
            }
        }
    }
    return message
}

exports.formatMessage=formatMessage