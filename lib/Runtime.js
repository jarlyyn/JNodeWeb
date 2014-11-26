var Http=require('./Http');
var libs=require('./JsLib');
var util = require("util");
var url = require('url');
var querystring=require("querystring");
var async=libs.async;
var _=libs.lodash;
var Runtime=function(web,req,res)
{
  this.web=web;
  this.req=req;
  this.res=res;
  this.stoped=false;
  this.Http=new Http(this);
}
Runtime.prototype.stop=function()
{
  this.stoped=true;
  this.next.apply(this,arguments);
}
Runtime.prototype.execAction=function(func,callback)
{
  this.next=callback;
  if (this.stoped){return this.next();}
  return func(this);
}
Runtime.prototype.run=function(funcs,next)
{
  var runtime=this;
      async.eachSeries(funcs,
      function(func,callback)
      {
	if (typeof(func)=='string'){func=runtime.web.Action.actions[func];}
	runtime.execAction(func,callback);
      },
      function(err){
	if (!runtime.stoped){return next(err);}
      }
    )
}
Runtime.prototype.getQuery=function(extend)
{
  var query=_.cloneDeep(this.req.query);
  if (null!=extend)
  {
    query=_.merge(query,extend);
  }
  return query;
}
Runtime.prototype.toUrl=function(path,query,absolute)
{
  var args=arguments;
  if (typeof path =='object'){
   query=path;    
   path=this.getPathname();
   absolute=query;
  }
  if (query!=null && Object.keys(query).length>0)
  {
    path=path+'?'+querystring.stringify(query);
  }
  if (true==absolute){}
  return path;
}
Runtime.prototype.getPathname=function()
{
  if (null==this.url)
  {
    this.url=url.parse(this.req.originalUrl);
  }
  return this.url.pathname;
}
module.exports=Runtime;
