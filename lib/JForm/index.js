var libs=require('../JsLib');
var async=libs.async;
var validator=libs.validator;
var JForm=function()
{
      this.forms={};
}
JForm.prototype.register=function(name)
{
  var form=this.forms[name]=new FormModel();
  return form;
}
JForm.prototype.getForm=function(name)
{
  return this.forms[name];
}
JForm.prototype.setForm=function(name,form)
{
  return this.forms[name]=form;
}
JForm.prototype.getData=function(req,res,callback)
{
  return callback(null,req.body||{});
}
JForm.prototype.getFormAttributes=function(formName,data)
{
  return data[formName];
}
JForm.prototype.validate=function(forms,data,callback)
{
  var JForm=this;
  var models={};
  if (data==null){data={};}
  async.eachSeries(forms,
  function(formName,callback){
    var attributes=JForm.getFormAttributes(formName,data);
    var model=models[formName]=JForm.getForm(formName).create(attributes);
    model.validate(callback);
  },
  function(err){
    callback(err,models);
  });
}
JForm.prototype.validateForms=function(forms)
{
  var JForm=this;
  return function(req,res,next){
    JForm.getData(req,res,function(err,data)
    {
      JForm.validate(forms,data,next);
    });
  }
}

var FormModel=function()
{
  this.fields={};
  this.attributes={};
  this.errors=[];
}
FormModel.prototype.field=function(name,label,fieldObj)
{
  fieldObj=fieldObj?fieldObj:new formField();
  this.fields[name]=fieldObj;
  return fieldObj;
}
FormModel.prototype.create=function(data)
{
  return new Form(this,data);
}
var Form=function(formModel,attributes)
{
  this.formModel=formModel;
  this.attributes=attributes||{};
  this.errors={};
  this.hasError=false;
  this.validated=false;
}
Form.prototype.get=function(name,defaultValue)
{
  return this.attributes[name]!=null?this.attributes[name]:defaultValue;
}
Form.prototype.set=function(name,value)
{
  return this.attributes[name]=value;
}
var validateField=function(fieldName,callback)
{
  var field=this.formModel.fields[fieldName];
  field.validate(this,fieldName,callback);
}
Form.prototype.validate=function(callback)
{
  async.each(
    Object.keys(this.formModel.fields),
    validateField.bind(this),
    function(callback,err){
      callback(err,this)
    }.bind(this,callback)
    );
}
Form.prototype.serialize=function(callback)
{
}
Form.prototype.unSerialize=function(callback)
{
}
Form.prototype.addError=function(name,message)
{
  this.hasError=true;
  if (this.errors[name]==null){this.errors[name]=[];}
  this.errors[name].push(message);
}
var formField=function()
{
  this.validators=[];
}
var buildinValidators={};
buildinValidators.notNull=function(callback,value,params,form){callback(null,value!=null);}
buildinValidators.compare=function(callback,value,params,form){callback(null,value==form.get(params[0]));}
buildinValidators.isEmail=function(callback,value,params,form){callback(null,validator.isEmail.apply(validator,[value].concat(params)));}
buildinValidators.matches=function(callback,value,params,form){callback(null,validator.matches.apply(validator,[value].concat(params)));}
buildinValidators.isAlpha=function(callback,value,params,form){callback(null,validator.isAlpha.apply(validator,[value].concat(params)));}
buildinValidators.isNumeric=function(callback,value,params,form){callback(null,validator.isNumeric.apply(validator,[value].concat(params)));}
buildinValidators.isLength=function(callback,value,params,form){callback(null,validator.isLength.apply(validator,[value].concat(params)));}
formField.prototype.addValidator=function(func,message)
{
  if (!(func instanceof Array)){func=[func];}
  this.validators.push({func:func,message:message||''});
  return this;
}
var validate=function(form,name,validator,callback)
{
  var func=validator.func[0];
  if (typeof func=='string'){func=buildinValidators[func];}
  var value=form.get(name);
  var params=validator.func.length>1?validator.func.slice(1):[];
  var message=validator.message;
  func.call(this,function(err,validated){
    if (!validated){form.addError(name,message);}
    callback(err);
  },value,params,form);
}
formField.prototype.validate=function(form,name,callback)
{
    async.eachSeries(
      this.validators,
      validate.bind(this,form,name),
      callback
    );
}
module.exports=JForm;