var util = require("util");
var libs=require('../JsLib');
var WebModule=require('../WebModule');
var env=require('../Env');
var JForm=require('./lib/JFrom');
var async=libs.async;
var onCreateRuntime=function(data)
{
  var runtime=data.runtime;
  runtime.forms={};
}
var Form=function(web)
{
    this.moduleName='MVC';  
    this.JForm=new JForm();
    WebModule.call(this,web);
    web.on(env.eventCreateRuntime,onCreateRuntime.bind(this));
    
}
util.inherits(Form,WebModule);
Form.prototype.register=function(name)
{
  return this.JForm.register(name);
}

Form.prototype.validate(forms)=function()
{
  var Form=this;
  return function(req,res,next)
  {
    async
  }
}