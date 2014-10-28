var Render=require('../WebRender')
,ejs=require('../JsLib').ejs
,util = require("util");
var EjsRender=function(settings)
{
  settings=settings||{};
  this.ext=settings.ext||'.ejs';
  Render.call(this,settings);
}
util.inherits(EjsRender,Render);
EjsRender.prototype.render=function(str,data,callback)
{
  ejs.render(str,{locals:data},callback);
}
EjsRender.prototype.renderFile=function(path,data,callback)
{
  ejs.renderFile(this.getFileName(path),{locals:data},callback);
}
module.exports=EjsRender;