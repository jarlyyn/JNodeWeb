var util = require("util");
var libs=require('../JsLib');
var WebModule=require('../WebModule');
var env=require('../Env');
var JForm=require('../JForm');
var async=libs.async;
JForm.buildinValidators.seUnique=function(callback,form,name,params){
  if (form.get(name)==null||form.hasError){return callback(null,false)}
  var model=params[0];
  var attirbure=params[1]||name;
  var query=params[2]||{};
  if (query.where==null){query.where={}}
  query.where[attirbure]=form.get(name);
  model.find(query).success(function(instance){
    return callback(null,instance==null);
  });
}

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
Form.prototype.registerForm=function(name,method)
{
  return this.JForm.register(name,method);
}
Form.prototype.doValidate=function(forms)
{
  var FormModule=this;
  var validateForms=FormModule.JForm.validateForms(forms);
  return function(runtime)
  {
    validateForms(runtime.req,runtime.res,runtime.next);
  };
}
Form.prototype._ifForm=function(name,condition)
{
  var FormModule=this;
  var validateForms=FormModule.JForm.validateForms([name]);  
  return function(runtime,callback)
  {
    if (runtime.forms[name]==null)
    {
      return validateForms(runtime.req,runtime.res,function(err){
	if (err) {return callback(err);}
	condition(runtime.forms[name],callback)
      });
    }
    return condition(null,runtime.forms[name],callback)
  }  
}
Form.prototype.isValidated=function(name)
{
  return this._ifForm(name,function(form,callback){
    return callback(null,form.validated)
  });
}
Form.prototype.isNotValidated=function(name)
{
  return this._ifForm(name,function(form,callback){
    return callback(null,!form.validated)
  });
}
module.exports=Form;