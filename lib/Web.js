var util = require("util");
var events = require('events');
var Runtime=require('./Runtime');
var libs=require('./JsLib');
var env=require('./Env');
var config=require('./config.json');
var Http=require('./Http');
var Action=require('./Action');
var Pager=require('./Pager');
var Web=function(settings)
{
   this.Module=[];
   this.Action=new Action();
   this.initSettings(settings);
   this.Pager=new Pager();
   events.EventEmitter.call(this);
   for (var index in config.modules){this.registerModule(require(config.modules[index]));}
}
util.inherits(Web,events.EventEmitter);
Web.prototype.Http=Http;
Web.prototype.initSettings=function(settings,defaultSettings)
{
  var defaultSettings=defaultSettings||require('../example/webconfig.json');
  this.settings=libs.extend(true,defaultSettings,settings);
}
Web.prototype.createRuntime=function(req,res)
{
  var runtime= new Runtime(this,req,res);
  this.emit(env.eventCreateRuntime,{'runtime':runtime});
  return runtime;
};
Web.prototype.libs=libs;
var load=function(web,path)
{
  require(path)(this,web);
  return this;
}

Web.prototype.app=function(app)
{
  app=app?app:libs.express();
  app.load=load.bind(app,this);
  app.web=this;
  return app;
}
Web.prototype.router=function(options)
{
  var app=libs.express.Router(options)
  return this.app(app);
}
Web.prototype.expessRuntime=function()
{
  var web=this;
  return function (){
    var funcs=arguments;
    return function(req,res,next){
      var runtime=web.install(req,res);
      runtime.run(funcs,next);
    };
  };
}
Web.prototype.IF=function(condition)
{
    return function()
    {
      var funcs=arguments;
      return function(runtime){
	var next=runtime.next;
	condition(runtime,function(err,result){
	  if (err){return runtime.next(err)}
	  if (result){
	    return runtime.run(funcs,next);
	  }
	  return runtime.next();
	});
      }
    };
}
Web.prototype.install=function(req,res)
{
     if (req[env.runtimeName]==null){req[env.runtimeName]=this.createRuntime(req,res)}
     return req[env.runtimeName];
}
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
