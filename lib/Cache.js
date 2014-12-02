var libs=require('./JsLib');
var cacheManager=libs.cacheManager;
var Cache=function(web)
{
  this.web=web;
  this.caches={}
  this.settings=web.settings.cache;
}
Cache.prototype.get=function(name)
{
  if (name==null){name='mem';}
  if (this.caches[name]==null)
  {
    this.caches[name]=cacheManager.caching(this.settings[name]);
  }
  return this.caches[name];
}
module.exports=Cache
