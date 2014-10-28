var path = require('path')
,extname=path.extname;
var Render=function(settings)
{
}
Render.prototype.getFileName=function(path)
{
  var ext = extname(path);
  if (!ext) path += this.ext;
  return path;
}
/**
 * Render.prototype.render=function(str,data,callback)
 * {
 * }
 */
/**
 * Render.prototype.renderFile=function(path,data,callback)
 * {
 * }
 */
module.exports=Render;