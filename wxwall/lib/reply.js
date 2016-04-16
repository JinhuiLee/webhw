function replyText(msg, replyText){
  if(msg.xml.MsgType[0] !== 'text'){
    console.log("not a text ");
    return '';
  }
  console.log("HERE4************");
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

function replyPic(msg, replyPic){
  console.log("HERE4************");
  //将要返回的消息通过一个简单的tmpl模板（npm install tmpl）返回微信
  var tmpl = require('tmpl');
  var replyTmpl = '<xml>' +
    '<ToUserName><![CDATA[{toUser}]]></ToUserName>' +
    '<FromUserName><![CDATA[{fromUser}]]></FromUserName>' +
    '<CreateTime><![CDATA[{time}]]></CreateTime>' +
    "<MsgType><![CDATA[image]]></MsgType>"+
    "<Image>"+
    "<MediaId><![CDATA[{imageid}]]></MediaId>"+
    "</Image>"+
    "</xml>";
  console.log("ready to send back info");
  return tmpl(replyTmpl, {
    toUser: msg.xml.FromUserName[0],
    fromUser: msg.xml.ToUserName[0],
    time: Date.now(),
    imageid: "7-XnmilOrKUF45ua0IgZ4bTij09CJ4sOeJYJJnFw6tH-Lw4ICOT6PS7lGCm9795B"
  });
}

function replyVoice(msg, replyPic){
  console.log("HERE4************");
  //将要返回的消息通过一个简单的tmpl模板（npm install tmpl）返回微信
  var tmpl = require('tmpl');
  var replyTmpl = '<xml>' +
    '<ToUserName><![CDATA[{toUser}]]></ToUserName>' +
    '<FromUserName><![CDATA[{fromUser}]]></FromUserName>' +
    '<CreateTime><![CDATA[{time}]]></CreateTime>' +
    "<MsgType><![CDATA[voice]]></MsgType>"+
    "<Voice>"+
    "<MediaId><![CDATA[{voiceid}]]></MediaId>"+
    "</Voice>"+
    "</xml>";
  console.log("ready to send back info");
  return tmpl(replyTmpl, {
    toUser: msg.xml.FromUserName[0],
    fromUser: msg.xml.ToUserName[0],
    time: Date.now(),
    voiceid: msg.xml.MediaId
  });
}

function replyVideo(msg, replyPic){
  console.log("HERE4************");
  //将要返回的消息通过一个简单的tmpl模板（npm install tmpl）返回微信
  var tmpl = require('tmpl');
  var replyTmpl = '<xml>' +
    '<ToUserName><![CDATA[{toUser}]]></ToUserName>' +
    '<FromUserName><![CDATA[{fromUser}]]></FromUserName>' +
    '<CreateTime><![CDATA[{time}]]></CreateTime>' +
    "<MsgType><![CDATA[shortvideo]]></MsgType>"+
    "<MediaId><![CDATA[{videoid}]]></MediaId>"+
    "<ThumbMediaId><![CDATA[{tmbid}]]></ThumbMediaId>"+
    "</xml>";
  console.log("ready to send back info");
  return tmpl(replyTmpl, {
    toUser: msg.xml.FromUserName[0],
    fromUser: msg.xml.ToUserName[0],
    time: Date.now(),
    videoid: msg.xml.MediaId,
    tmbid: msg.xml.ThumbMediaId
  });
}


module.exports = {
  replyText: replyText,
  replyPic: replyPic,
  replyVideo: replyVideo,
  replyVoice: replyVoice
};
