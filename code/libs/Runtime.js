var Http=require('./ExpressHttp');
var Runtime=function(web,req,res)
{
  this.web=web;
  this.req=req;
  this.res=res;
  this.http=new Http(req,res);
}
module.exports=Runtime;
