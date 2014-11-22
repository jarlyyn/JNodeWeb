var Http=require('./ExpressHttp');
var libs=require('./JsLib');
var async=libs.async;
var Runtime=function(web,req,res)
{
  this.web=web;
  this.req=req;
  this.res=res;
  this.stoped=false;
  this.http=new Http(req,res);
}
Runtime.prototype.stop=function()
{
  this.stoped=true;
}
Runtime.prototype.run=function(funcs,next)
{
  var runtime=this;
      async.eachSeries(funcs,
      function(func,callback)
      {
	if (runtime.stoped){return callback()}
	return func(runtime,callback);
      },
      function(err){
	if (!runtime.stoped){return next(err);}
      }
    )
}
module.exports=Runtime;
