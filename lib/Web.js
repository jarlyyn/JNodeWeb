var util = require("util");
var events = require('events');
var Runtime=require('./Runtime');
var Cache=require('./Cache');
var libs=require('./JsLib');
var env=require('./Env');
var config=require('./config.json');
var Http=require('./Http');
var Action=require('./Action');
var Pager=require('./Pager');
var Web=function(settings)
{
   this.Module=[];
   this.plugins={}   
   this.initSettings(settings);   
   this.Action=new Action();
   this.Cache=new Cache(this);   
   this.Pager=new Pager();
   this.IF=IF;
   this.IFNot=IFNot;
   events.EventEmitter.call(this);
   for (var index in config.modules){this.registerModule(require(config.modules[index]));}
   this.loadModules();
   this.loadPlugins();
}
util.inherits(Web,events.EventEmitter);
Web.prototype.Http=Http;
Web.prototype.loadModules=function()
{
  var modules=this.settings.modules;
  if (modules==null){return;}
  for (var index in modules)
  {
    this.loadModule(modules[index]);
  }
}
Web.prototype.loadModule=function(name)
{
  if ("string"==typeof name){
      name=require('./modules/'+name);
  }
  return this.registerModule(name);
};
Web.prototype.loadPlugins=function()
{
  var plugins=this.settings.plugins;
  if (plugins==null){return;}
  for (var name in plugins)
  {
    this.loadPlugin(name,plugins[name]);
  }
};
Web.prototype.loadPlugin=function(name,config)
{
  if (this.plugins[name]==null)
  {
    config=libs.lodash.clone(config);    
    var keyword=config.keyword;
    if (keyword==null){keyword=name;}
    if ("string"==typeof keyword){
      keyword=require('./plugins/'+keyword);
      delete config[keyword];
    }
    this.plugins[name]=new(keyword)(this,config);
  }
  return this.plugins[name];
}
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
};
Web.prototype.expessRun=function()
{
  var web=this;
  return function (){
    var funcs=arguments;
    return function(req,res,next){
      var runtime=web.install(req,res);
      runtime.run(funcs,next);
    };
  };
};
Web.prototype.expressHttpError=function()
{
  var web=this;  
  return function(status){
      return function(){
      var funcs=arguments;
      return function(err,req,res,next){
	if (err instanceof Http.Error && err.status==status){
	  var runtime=web.install(req,res);
	  return runtime.run(funcs,next);
	}
	return next(err);
      }
    }
  }
};
var IFNot=Web.IFNot=function()
{
  var conditions=arguments;
  return this.IF(function(runtime,callback){
    any(runtime,conditions,function(err,result){callback(err,!result);});
  });
}
var any=function(runtime,conditions,next)
{
  var successed=false;
  libs.async.eachSeries(
    conditions,
    function(condition,callback)
    {
      if (successed){return callback()}
      return condition(runtime,function(err,result){
	if (result){successed=true;}
	return callback(err);
      });
    },
    function(err)
    {
      next(err,successed);
    });
}
var IF=Web.IF=function()
{
    var conditions=arguments;
    return function()
    {
      var funcs=arguments;
      return function(runtime){
	var next=runtime.next;
	any(runtime,conditions,function(err,result){
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
var createApp=function(app,apps)
{
  var rootApp=apps['']||apps[null];
  delete apps[''];
  delete apps[null];
  for(var index in apps)
  {
    app.use(index,apps[index]);
  }
  if (rootApp){
    app.use(rootApp);
  }
  return app;
}
module.exports=Web;
module.exports.start=function(config,callback)
{
  var app;
  if ("string"==typeof config)
  {
    config=require(config);
  }
  var fnCreateApp=config.createApps||createApp;
  var appsConfig=config.apps
  if ("string"==typeof appsConfig)
  {
    app=require(appsConfig)(config);
  }else{
    var apps={};
    for (var index in appsConfig)
    {
      apps[index]=require(appsConfig[index])(config);
    }
    app=fnCreateApp(libs.express(),apps);
  }
  config.start(app,callback);
};
