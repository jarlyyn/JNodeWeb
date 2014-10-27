var util = require("util");
var events = require('events');
var Runtime=require('./Runtime');
var libs=require('./JsLib');
var Web=function()
{
   events.EventEmitter.call(this);
}
util.inherits(Web,events.EventEmitter);
Web.prototype.createRuntime=function(req,res)
{
  var runtime= new Runtime(this,req,res);
  
  return runtime;
};
Web.prototype.libs=libs;
Web.prototype.connect=function()
{
  var connect=function (req,res,next)
  {
    req.webruntime=this.createRuntime(req,res);
    this.emit('onCreateRuntime',{runtime:req.webruntime});
    return next();
  }
  return connect.bind(this);
};
module.exports=Web;
