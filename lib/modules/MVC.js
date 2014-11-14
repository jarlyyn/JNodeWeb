var util = require("util");
var WebModule=require('../WebModule');
var async=require('../JsLib').async;
var env=require('../Env');
var Render=require('../renders/EjsRender');
var onCreateRuntime=function(fetchData,fetchDatas,data)
{
  var runtime=data.runtime;
  runtime.fetchData=fetchData;
  runtime.fetchDatas=fetchDatas;
  runtime.dataProviders={};
  runtime.getContent=runtimeGetContent;
  runtime.render=render;
  runtime.getRenderData=getRenderData;
  runtime._viewdata={
    runtime:runtime,
    content:'',
  };
}
var runtimeGetContent=function (defaultContent)
{
  return this._viewdata.content||defaultContent;
}
var MVC=function(web)
{
  this.moduleName='MVC';
  this.viewpath=web.settings.view.path;
  WebModule.call(this,web);
  web.on(env.eventCreateRuntime,onCreateRuntime.bind(this,fetchData,fetchDatas));
  this.dataProviders={};
  this.viewProviders={};
  this.renderEngine=new Render();
}
util.inherits(MVC,WebModule);
MVC.prototype.setViewPath=function(path)
{
  this.viewpath=path;
}
MVC.prototype.render=function(str,data,callback)
{
  this.renderEngine.render(str,data,callback);
}
MVC.prototype.renderFile=function(path,data,callback)
{
  this.renderEngine.renderFile(this.viewpath+path,data,callback);
}
MVC.prototype.registerData=function(name,func)
{
  this.dataProviders[name]=func;
}
MVC.prototype.getData=function(name)
{
  if (null==name){return null}  
  return this.dataProviders[name];
}
MVC.prototype.registerView=function(name,viewpath,settings)
{
  var render=new ViewRender(this,viewpath||name,settings||{});
  this.viewProviders[name]=render;
  return render;
}
MVC.prototype.getView=function(name)
{
  if (null==name){return null}
  return this.viewProviders[name];
}
var getRenderData=function(data)
{
  if (null==data){data={};}
  this._viewdata.data=this.dataProviders;
  this._viewdata.params=data;
  return this._viewdata;
}
var afterRenderFetch=function(params,layouts,callback,err,data)
{
  var viewdata=this.getRenderData(params);
  async.eachSeries(layouts,function(view,callback){
    view.render(this,callback);
  }.bind(this),function(callback,err){
    if (callback)
    {
      callback(err,this.getContent());
    }else{
      this.res.send(this.getContent());
    }
  }.bind(this,callback));
}
var render=function(name,params,callback)
{
  var viewRender=this.web.MVC.getView(name);
  if (viewRender==null)
  {
    if (null!=callback)
    {
      callback();
    }
    return;
  }
  var renderData=viewRender.getData();
  var dataProviders=renderData['dataProviders']||[];
  var layouts=renderData['layouts']||[];
  this.fetchDatas(dataProviders,afterRenderFetch.bind(this,params,layouts,callback));
}
var afterEach=function(dataProviders,callback,keyword,err,data)
{
  dataProviders[keyword]=data;
  callback(err);
}
var eachFetch=function(dataProviders,keyword,callback)
{
  this.fetchData(keyword,afterEach.bind(this,dataProviders,callback,keyword));
}
var afterEachAll=function(dataProviders,callback,err)
{
  callback(err,dataProviders);
}
var fetchDatas=function(keywords,callback)
{
    var dataProviders={};
    async.each(keywords,eachFetch.bind(this,dataProviders),afterEachAll.bind(this,dataProviders,callback));
}
var afterFetch=function(keyword,callback,err,data)
{
  this.dataProviders[keyword]=data;
  callback(err,data);
}
var fetchData=function(keyword,callback)
{
  if (null!=keyword && this.dataProviders[keyword]===undefined)
  {
    var func=this.web.MVC.getData(keyword);
    if (func!=null)
    {
      return func(this,afterFetch.bind(this,keyword,callback));
    }
  }
  callback(null,this.dataProviders[keyword]);  
}

var ViewRender=function(module,viewpath)
{
  this.module=module;
  this.viewpath=viewpath;
  this.dataKeywords=[];
  this.layout=null;
  this._layouts=null;
  this._dataProviders=[];
  this._bindedDataProviders={};
}
ViewRender.prototype.render=function(runtime,callback)
{
  //var render=this.module.render;
  this.module.renderFile(this.viewpath,runtime._viewdata,function(err,data){
    runtime._viewdata.content=data;
    callback(err,data);
  });
}
ViewRender.prototype.setLayout=function(name)
{
  this.layout=name;
  return this;
}
ViewRender.prototype.bindData=function(keyword)
{
  this.dataKeywords.push(keyword);
  return this;
}
ViewRender.prototype.getLayout=function()
{
  if (null==this.layout)
  {
    return null
  }
  return this.module.getView(this.layout);
}
ViewRender.prototype.getLayouts=function()
{
  if (null==this._layouts)
  {
    var layouts=[];
    var layout=this;
    while(null!=layout){
      layouts.push(layout)
      this.registerDataProvider(layout.dataKeywords);
      layout=layout.getLayout();
    }
      this._layouts=layouts;
  }
  return this._layouts;
}
ViewRender.prototype.registerDataProvider=function(keywords)
{
  var keyword,i;
  for (i in keywords)
  {
    keyword=keywords[i];
    if (null==this._bindedDataProviders[keyword])
    {
      this._bindedDataProviders[keyword]=true;
      this._dataProviders.push(keyword);
    }
  }
}
ViewRender.prototype.getDataProviders=function()
{
  return this._dataProviders;
}
ViewRender.prototype.getData=function()
{
  var layouts=this.getLayouts();
  var dataProviders=this.getDataProviders();
  return {'layouts':layouts,'dataProviders':dataProviders};
}
module.exports=MVC;