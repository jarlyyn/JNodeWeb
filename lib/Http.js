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

Http.doRedirect=function(url)
{
  var args=arguments;
  return function(runtime){
    runtime.Http.redirect.apply(runtime.Http,args);
  }
}
Http.prototype.json=function(data)
{
  this.res.json(data);
  this.runtime.stop();
}
module.exports=Http;