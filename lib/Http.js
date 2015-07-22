var Web=require('./Web');
var libs=require('./JsLib');
var utils=libs.utils;
var util = require("util");
var Http=function(runtime)
{
  this.runtime=runtime;
  this.res=runtime.res;
}
Http.prototype.send=function(message)
{
  this.res.send(message);
  this.runtime.stop();
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
Http.prototype.getIp=function()
{
  return this.runtime.req.ip;
}
Http.prototype.forbidden=function(message)
{
  this.res.status(403);
  this.runtime.next(new HttpError(403,message||'Forbidden'));
}
Http.doForbidden=function(message)
{
  var args=arguments;  
  return function(runtime){
    runtime.Http.forbidden.apply(runtime.Http,args);
  }  
}
Http.forbiddenIf=function(condition)
{
  var conditions=arguments;  
  return web.IF.apply(web,arguments)(
    function(runtime){return runtime.Http.forbidden();}
  );
}
Http.forbiddenIfNot=function(condition)
{
  return web.IFNot.apply(web,arguments)(
    function(runtime){return runtime.Http.forbidden();}
  );
}
Http.prototype.unauthorized=function(message)
{
  this.res.status(401);
  this.runtime.next(new HttpError(401,message||'Unauthorized'));
}
Http.doUnauthorized=function(message)
{
  var args=arguments;  
  return function(runtime){
    runtime.Http.unauthorized.apply(runtime.Http,args);
  }  
}
Http.unauthorizedIf=function(condition)
{
  var conditions=arguments;  
  return web.IF.apply(web,arguments)(
    function(runtime){return runtime.Http.unauthorized();}
  );
}
Http.unauthorizedIfNot=function(condition)
{
  return web.IFNot.apply(web,arguments)(
    function(runtime){return runtime.Http.unauthorized();}
  );
}
Http.prototype.notFound=function(message)
{
  this.res.status(404);
  this.runtime.next(new HttpError(404,message||'Page not found'));
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
var HttpError=function(status,message)
{
  this.status=status;
  this.message=message;
}
util.inherits(HttpError,Error)
module.exports=Http;
module.exports.Error=HttpError;