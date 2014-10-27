var util = require("util");
var WebModule=require('../WebModule');
var View=function(web)
{
  this.moduleName='View';  
  WebModule.call(this,web);
}
util.inherits(View,WebModule);
module.exports=View;