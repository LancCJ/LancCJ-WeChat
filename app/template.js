'use strict'

var ejs=require('ejs')
var heredoc=require('heredoc')

var tpl=heredoc(function(){/*
 <xml>
     <ToUserName><![CDATA[<%= fromUsername %>]]></ToUserName>
     <FromUserName><![CDATA[<%= toUsername %>]]></FromUserName>
     <CreateTime><%= createTime %></CreateTime>
     <MsgType><![CDATA[<%= msgType %>]]></MsgType>
     <MsgId><%= MsgId %></MsgId>
     <% if (msgType === 'text') {%>
     <Content><![CDATA[<%= content %>]]></Content>
     <% }else if (msgType === 'image') {%>
     <PicUrl><![CDATA[<%= content.picUrl %>]]></PicUrl>
     <MediaId><![CDATA[<%= content.mediaId %>]]></MediaId>
     <% }else if (msgType === 'voice') {%>
     <MediaId><![CDATA[<%= content.mediaId %>]]></MediaId>
     <Format><![CDATA[<%= content.format %>]]></Format>
     <% }else if (msgType === 'video') {%>
     <MediaId><![CDATA[<%= content.mediaId %>]]></MediaId>
     <ThumbMediaId><![CDATA[<%= content.thumbMediaid %>]]></ThumbMediaId>
     <% }else if (msgType === 'shortvideo') {%>
     <MediaId><![CDATA[<%= content.mediaId %>]]></MediaId>
     <ThumbMediaId><![CDATA[<%= content.thumbMediaid %>]]></ThumbMediaId>
     <% }else if (msgType === 'location') {%>
     <Location_X><%= content.location_X %></Location_X>
     <Location_Y><%= content.location_Y %></Location_Y>
     <Scale><%= content.scale %></Scale>
     <Label><![CDATA[<%= content.label %>]]></Label>
     <% }else if (msgType === 'news') {%>
     <ArticleCount><![CDATA[<%= content.length %>]]></ArticleCount>
     <Articles>
        <%content.forEach(function(item){%>
        <item>
            <Title><![CDATA[<%= item.title %>]]></Title>
            <Description><![CDATA[<%= item.description %>]]></Description>
            <PicUrl><![CDATA[<%= item.picUrl %>]]></PicUrl>
            <Url><![CDATA[<%= item.url %>]]></Url>
        </item>
        <%})%>
     </Articles>
     <% }else if (msgType === 'link') {%>
     <Title><![CDATA[<%= content.title %>]]></Title>
     <Description><![CDATA[<%= content.description %>]]></Description>
     <Url><![CDATA[<%= content.url %>]]></Url>
     <% }%>
 </xml>
*/})

var compiled=ejs.compile(tpl)

module.exports={
    compiled:compiled
}