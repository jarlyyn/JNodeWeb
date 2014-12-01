var utils=module.exports;
var crypto = require('crypto');  
utils.randomBase64=function(len)
{
  return crypto.randomBytes(Math.ceil(len * 3 / 4))
        .toString('base64')   // convert to base64 format
        .slice(0, len)        // return required number of characters
}
utils.escapeSearch=function(string)
{
  return string.replace(/([%_\\])/,'\\$1');
}
utils.get=function(object,path,defaultValue)
{
  var ret=object;
  if (path==null){return object;}
  if (typeof path=='string'){return object[path];}
  for (var index in path)
  {
    if (ret==null){return defaultValue}
    ret=ret[path[index]];
  }
  return (ret==null)?defaultValue:ret;
}
utils.conditions={};
utils.checkChildren=function(object,path,condition)
{
  if (condition==null){return utils.get(object,path)?true:false;}
  return false;
}