var PORT = 9529;
var http = require("http");
var qs = require("qs");
var pServer= require("./pageServer");
var TOKEN="jinhui"

var getUserInfo = require('./lib/user').getUserInfo;
var replyText = require('./lib/reply').replyText; 

var wss = require('./lib/ws.js').wss;
var msgBuffer= require('./lib/ws.js').buffer;

function checkSignature(params,token){
  var key=[token,params.timestamp,params.nonce].sort().join('');
  var sha1= require("crypto").createHash('sha1');
  sha1.update(key);
  return sha1.digest('hex')==params.signature;
}

var server=http.createServer(function (request,response) {
  var query= require('url').parse(request.url).query;
  var params= qs.parse(query);

  console.log(params);
  console.log("Token --> ",TOKEN);

  if (checkSignature(params,TOKEN)){
    //response.end(params.echostr);
  }
  else{
    response.end('signature fail');
  }
  if (request.method == "GET")
  {response.end(params.echostr);}
  else{
    var postdata=""
    request.addListener('data',function(chunk){
      postdata+=chunk;
    });
    request.addListener('end',function(){
      var parseString = require('xml2js').parseString;
      parseString(postdata,function (err,result){
        if(result.xml.MsgType[0] === 'text'){
          getUserInfo(result.xml.FromUserName[0])
            .then(function(userInfo){
              //获得用户信息，合并到消息中
	      console.log("HERE**************");
              result.user = userInfo;
              console.log("HERE1*************");
              //将消息通过websocket广播
              console.log("HERE2*************");
              var res = replyText(result, '消息推送成功！<a href="http://123.206.79.164/index.html">查看微信墙</a>');
              console.log("HERE3**********");
              response.end(res);
	      wss.broadcast(result);
	      msgBuffer.push(result);
            })
        }
      });
    });
  }
});
pServer.start();
server.listen(PORT);
