var express = require('express');
var app = express();


function start()
{
  app.use(express.static(__dirname + '/public'));

  app.get('/', function(req, res){
    res.send('hello world');
  }); 
  console.log("pageServer at 3001");
  app.listen(3001);
}


module.exports.start=start;
