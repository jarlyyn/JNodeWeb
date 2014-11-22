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
    var FormModule=this;
    this.moduleName='Form';  
    this.JForm=new JForm();
    this.JForm.setForms=function(req,models){
      FormModule.web.install(req).forms=models;
    };
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
  var FormModule=this;
  var validateForms=FormModule.JForm.validateForms(forms);
  return function(runtime,next)
  {
    validateForms(runtime.req,runtime.res,next);
  };
}
module.exports=Form;