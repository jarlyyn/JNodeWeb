var Web=require('./Web');
var libs=require('./JsLib');
var utils=libs.utils;
var Http=function(runtime)
{
  this.runtime=runtime;
  this.res=runtime.res;
}
Http.prototype.redirect=function()
{
  this.res.redirect.apply(this.res,arguments);
  this.runtime.stop();
}
Http.prototype.json=function(data,path)
{
  this.res.json(utils.get(data,path));
  this.runtime.stop();
}
Http.prototype.notFound=function(message)
{
  this.res.status(404).send(message);
  this.runtime.stop();
}
Http.doNotFound=function(message)
{
  var args=arguments;  
  return function(runtime){
    runtime.Http.notFound.apply(runtime.Http,args);
  }  
}
Http.notFoundIf=function(condition)
{
  var conditions=arguments;  
  return web.IF.apply(web,arguments)(
    function(runtime){return runtime.Http.notFound();}
  );
}
Http.notFoundIfNot=function(condition)
{
  return web.IFNot.apply(web,arguments)(
    function(runtime){return runtime.Http.notFound();}
  );
}
Http.doRedirect=function(url)
{
  var args=arguments;
  return function(runtime){
    runtime.Http.redirect.apply(runtime.Http,args);
  }
}
module.exports=Http;