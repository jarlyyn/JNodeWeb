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
Http.prototype.json=function(data)
{
  this.res.json(data);
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
Http.doRedirect=function(url)
{
  var args=arguments;
  return function(runtime){
    runtime.Http.redirect.apply(runtime.Http,args);
  }
}
Http.prototype.json=function(data,path)
{
  this.res.json(utils.get(data,path));
  this.runtime.stop();
}
module.exports=Http;