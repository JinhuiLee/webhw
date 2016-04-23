var fs = require('fs');
var path = require('path');




module.exports=function(session) {
  var sessionDir="./session";
  var Store = session.Store;


  console.log("myfs");
  function MyFStore(options) {
    var self = this;
    sessionDir = options;
    Store.call(self, options);
  }

  function dirExists(dir)
  {
    var exists = fs.existsSync(path.normalize(dir));
    if (!exists) return false;

    var stats = fs.statSync(path.normalize(dir));
    if ( !stats.isDirectory() ) return false;
    return true;
  }

  MyFStore.prototype.__proto__ = Store.prototype;
  function sid2Path(sid)
  {
    var filePath = path.normalize(path.join(sessionDir,sid));
    console.log(filePath);
    return filePath;
  }


  MyFStore.prototype.get = function(sid,callback)
  {
    console.log("get");
    var filePath = sid2Path(sid);
    var sjson = fs.readFileSync(filePath,'utf8');
    var session = JSON.parse(sjson);
    callback(null,session);
  }


  MyFStore.prototype.set = function(sid,session,callback)
  {
    console.log("set");
    if (!dirExists(sessionDir))
      fs.mkdirSync(sessionDir);


    var filePath = sid2Path(sid);
    var sjson = JSON.stringify(session);
    fs.writeFileSync(filePath,sjson,'utf8');
    callback(null);
  }


  MyFStore.prototype.destroy = function(sid,callback)
  {
    var filePath = sid2Path(sid);
    fs.unlinkSync(filePath);
    callback(null);
  }
  return MyFStore;
}
