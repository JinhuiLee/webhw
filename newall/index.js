var http = require ('http');
var fs = require('fs');
var https = require('https');
var express  = require('express');
var app = express();
var request = require('request');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var Promise= require('promise');

var xmlBodyParser = require('express-xml-parser');
var crypto = require('crypto');

var md5 = function (str) {
var md5sum = crypto.createHash('md5');
md5sum.update(str);
str = md5sum.digest('hex');
return str;
};

app.use(express.static(__dirname + '/public'));

app.use('/', xmlBodyParser({
  type: 'text/xml',
  limit: '1mb'
}));


app.get('/',function(req,res) {
  console.log(req.query);
  res.end(req.query.echostr);
});


var savePic=function(url)
{
  return new Promise(function(resolve, reject){
    console.log("savePic url:  "+ url)
    http.get(url[0], function(res){
    var imgData = "";
    res.setEncoding("binary"); //一定要设置response的编码为binary否则会下载下来的图片打不开


    res.on("data", function(chunk){
        imgData+=chunk;
    });

    res.on("end", function(){
        var file=md5(String(url[0]));
        file="./public/image/"+file+".png";
        fs.writeFile(file, imgData, "binary", function(err){
            if(err){
                console.log("down fail");
            }
            console.log("down success");
	    resolve(md5(String(url[0]))+".png");
        });
    });
});
  });

}

app.post('/',function(req,res) {
  console.log(req.body);
  var body = req.body.xml;
  console.log(body.FromUserName);
  console.log(body.CreateTime);
  console.log(body.MsgType);
  console.log(body.Content);
  
  if (body.MsgType=='text')
  { 
   getUserInfo(body.FromUserName[0])
            .then(function(userInfo){
              //将消息通过websocket广播
              console.log("callback");
	      userInfo.reply=body.Content;
              userInfo.type='text'
              io.emit('message',userInfo);
	    })
  }else if (body.MsgType=='image')
  {
   getUserInfo(body.FromUserName[0])
            .then(function(userInfo){
              //将消息通过websocket广播
              console.log("Image callback");
	      userInfo.type='image'
	      savePic(body.PicUrl).then(function(filename){
                console.log("inner callback")
		userInfo.reply="http://172.110.27.168/image/"+filename;
		console.log(userInfo.reply);
		io.emit('message',userInfo);
              })
            })
  }

  //io.emit('message',{reply:body.Content[0]});
  var reply=replyText(req.body,"消息推送成功");
  res.end(reply);  
});

server.listen(80);


io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('message', function (data) {
    console.log(data);
    //socket.emit('message',{ reply:'ok'});
  });
});


function replyText(msg, replyText){
  
  //将要返回的消息通过一个简单的tmpl模板（npm install tmpl）返回微信
  var tmpl = require('tmpl');
  var replyTmpl = '<xml>' +
    '<ToUserName><![CDATA[{toUser}]]></ToUserName>' +
    '<FromUserName><![CDATA[{fromUser}]]></FromUserName>' +
    '<CreateTime><![CDATA[{time}]]></CreateTime>' +
    '<MsgType><![CDATA[{type}]]></MsgType>' +
    '<Content><![CDATA[{content}]]></Content>' +
    '</xml>';
  console.log("ready to send back info");
  return tmpl(replyTmpl, {
    toUser: msg.xml.FromUserName[0],
    fromUser: msg.xml.ToUserName[0],
    type: 'text',
    time: Date.now(),
    content: replyText
  });

}

token=""
function getToken()
{
  tmpl = require("tmpl");
  url="https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid={APPID}&secret={APPSECRET}";
  APPID="wx59e38f4f5e6cd31d";
  APPSECRET="df8252d4e01422274dd5b7a9815a9246";
  url=tmpl(url,{
    APPID:APPID,
    APPSECRET:APPSECRET
  });
  console.log(url);
  https.get(url, function(res) {
    console.log("Got response: " + res.statusCode);
    chunk="";
    res.on('data',function(data){
      chunk+=data;
    });

    res.on('end',function(data){
      token=JSON.parse(chunk).access_token;
      console.log(token);
      console.log(chunk);
    });

  });

  setTimeout(getToken,7200*1000);
}

function getUserInfo(openID){

    return new Promise(function(resolve, reject){
      request('https://api.weixin.qq.com/cgi-bin/user/info?access_token='+token+'&openid='+openID+'&lang=zh_CN', function(err, res, data){
          console.log(resolve);
 	  resolve(JSON.parse(data));
          console.log("finish resolve");
        });
  });
}

getToken();
