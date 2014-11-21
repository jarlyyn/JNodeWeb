var util = require("util");
var libs=require('../JsLib');
var WebModule=require('../WebModule');
var env=require('../Env');
var JForm=require('../JForm');
var async=libs.async;
var onCreateRuntime=function(data)
{
  var runtime=data.runtime;
  runtime.forms={};
}
var Form=function(web)
{
    this.moduleName='Form';  
    this.JForm=new JForm();
    WebModule.call(this,web);
    web.on(env.eventCreateRuntime,onCreateRuntime.bind(this));
    
}
util.inherits(Form,WebModule);
Form.prototype.registerForm=function(name)
{
  return this.JForm.register(name);
}

Form.prototype.validate=function(forms)
{
  return this.JForm.validateForms(forms,function(err,models,req,res,next){
      this.web.install(req,res).forms=models;
    return next(err);
  });
}
module.exports=Form;