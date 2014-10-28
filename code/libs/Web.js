var util = require("util");
var events = require('events');
var Runtime=require('./Runtime');
var libs=require('./JsLib');
var env=require('./Env')
var Web=function()
{
   this.Module=[];
   events.EventEmitter.call(this);
}
util.inherits(Web,events.EventEmitter);
Web.prototype.createRuntime=function(req,res)
{
  var runtime= new Runtime(this,req,res);
  this.emit(env.eventCreateRuntime,{'runtime':runtime});
  return runtime;
};
Web.prototype.libs=libs;
Web.prototype.connect=function()
{
  var connect=function (req,res,next)
  {
    req[env.runtimeName]=this.createRuntime(req,res);
    return next();
  }
  return connect.bind(this);
};
Web.prototype.getRuntime=function(req)
{
  return req[env.runtimeName];
}
Web.prototype.registerModule=function(Module)
{
  var module=new Module(this);
  this.Module.push(module);
  return module;
}
module.exports=Web;
