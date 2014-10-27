var util = require("util");
var WebModule=require('../WebModule');
var async=require('../JsLib').async;
var Model=function(web)
{
  this.moduleName='Model';
  WebModule.call(this,web);
  this.providers={};
}
util.inherits(Model,WebModule);
Model.prototype.register=function(name,func)
{
  this.providers[name]=func;
}
Model.prototype.getModel=function(name)
{
  if (null==name){return null}  
  return this.providers[name];
}
Model.prototype.createRuntime=function(runtime)
{
  return new ModelRuntime(runtime);
}
var ModelRuntime=function(runtime)
{
  this.runtime=runtime;
  this.web=runtime.web;
  this.models={};
}
var afterEach=function(modelData,callback,keyword,data)
{
  modelData[keyword]=data;
  callback();
}
var eachFetch=function(modelData,keyword,callback)
{
  this.fetchModel(keyword,afterEach.bind(this,modelData,callback,keyword));
}
var afterEachAll=function(modelData,callback)
{
  callback(modelData);
}
ModelRuntime.prototype.fetchModels=function(keywords,callback)
{
    var modelData={};
    async.each(keywords,eachFetch.bind(this,modelData),afterEachAll.bind(this,modelData,callback));
}
var afterFetch=function(keyword,callback,data)
{
  this.models[keyword]=data;
  callback(data);
}
ModelRuntime.prototype.fetchModel=function(keyword,callback)
{
  if (null!=keyword && this.models[keyword]===undefined)
  {
    var func=this.web.Model.getModel(keyword);
    if (func!=null)
    {
      return func(this.runtime,afterFetch.bind(this,keyword,callback));
    }
  }
  callback(this.models[keyword]);  
}
module.exports=Model;