Http=function(req,res)
{
  this.req=req;
  this.res=res;
}
Http.prototype.redirect=function(status,url)
{
  return this.req.redirect(status,url);
}
Http.prototype.status=function(code)
{
  this.req.status(code);
  return this;
}
Http.prototype.status=function(name, value,options)
{
  this.res.cookie(name, value, [options]);
  return this;
}
Http.prototype.send=function(body)
{
  this.res.send(body);
  return this;
}
module.exports=Http;
