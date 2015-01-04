var libs=require('../JsLib');
var _=libs.lodash;
var async=libs.async;
var validator=libs.validator;
var JForm=function()
{
      this.forms={};
      this.validators={};
      this.setForms=setForms;
      this.getBody=getBody;
      this.getQuery=getQuery;
}
JForm.prototype.register=function(name,method)
{
  var form=this.forms[name]=new FormModel(this,name,method);
  return form;
}
JForm.prototype.registerValidator=function(name,validator)
{
 return this.validators[name]=validator;
}
JForm.prototype.getForm=function(name)
{
  return this.forms[name];
}
JForm.prototype.setForm=function(name,form)
{
  return this.forms[name]=form;
}
setForms=function(req,forms)
{
  return req.forms=forms;
}
getBody=function(req,callback)
{
  return callback(null,req.body||{});
}
getQuery=function(req,callback)
{
  return callback(null,req.query||{});
}
JForm.prototype.getFormAttributes=function(keyword,data,method)
{
  return (method=='get')?data.query:data.body[keyword];
}
JForm.prototype.validate=function(req,forms,data,callback)
{
  var JForm=this;
  var models={};
  if (data==null){data={};}
  if (!(forms instanceof Array)){forms=[forms];}
  async.eachSeries(forms,
  function(formName,callback){
    var form=JForm.getForm(formName);
    var attributes=JForm.getFormAttributes(form.getKeyword(),data,form.method);
    var model=models[formName]=JForm.getForm(formName).create(attributes);
    model.req=req;
    if (attributes==null)
    {
      return callback();
    }    
    model.validate(callback);
  },
  function(err){
    callback(err,models);
  });
}
JForm.prototype.getData=function(req,callback)
{
  this.getBody(req,function(err,body){
    this.getQuery(req,function(err,query)
    {
      callback(err,{body:body,query:query})
    })
  });
}
JForm.prototype.validateBody=function(req,forms,callback)
{
  var JForm=this;
  this.getData(req,function(err,data){
    JForm.validate(req,forms,data,function(err,models)
    {
      JForm.setForms(req,models);
      callback(err);
    });
  });
}
JForm.prototype.validateForms=function(forms)
{
  var JForm=this;
  return function(req,res,next){
    JForm.validateBody(req,forms,next);
  };
}

var FormModel=function(module,name,method)
{
  this.module=module;
  this.name=name;
  this.method=method;
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
FormModel.prototype.getKeyword=function()
{
  return (this.keyword!=null)?
    this.keyword
  :(this.method=='get'?null:this.name);
}
var Form=function(formModel,attributes)
{
  this.formModel=formModel;
  this.attributes=attributes||{};
  this.errors={};
  this.hasError=false;
  this.pending=true;
  this.validated=false;
}
Form.prototype.getAttributes=function(fields)
{
  if (fields==null){fields=Object.keys(this.formModel.fields)}
  return _.pick(this.attributes,fields);
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
  async.eachSeries(
    Object.keys(this.formModel.fields),
    validateField.bind(this),
    function(callback,err){
      this.pending=false;
      this.validated=!this.hasError;
      callback(err,this)
    }.bind(this,callback)
    );
}
Form.prototype.name=function(fieldName)
{
  return this.formModel.getKeyword()+'['+fieldName+']';
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
  this.isRequired=false;
  this.validators=[];
}
var buildinValidators={};
buildinValidators.notNull=function(callback,form,name,params){callback(null,!validator.isNull.apply(validator,[form.get(name)].concat(params)));}
buildinValidators.compare=function(callback,form,name,params){callback(null,form.get(name)==form.get(params[0]));}
buildinValidators.isEmail=function(callback,form,name,params){callback(null,validator.isEmail.apply(validator,[form.get(name)].concat(params)));}
buildinValidators.matches=function(callback,form,name,params){callback(null,validator.matches.apply(validator,[form.get(name)].concat(params)));}
buildinValidators.isAlpha=function(callback,form,name,params){callback(null,validator.isAlpha.apply(validator,[form.get(name)].concat(params)));}
buildinValidators.isNumeric=function(callback,form,name,params){callback(null,validator.isNumeric.apply(validator,[form.get(name)].concat(params)));}
buildinValidators.isLength=function(callback,form,name,params){callback(null,validator.isLength.apply(validator,[form.get(name)].concat(params)));}
buildinValidators.isIn=function(callback,form,name,params){callback(null,validator.isIn.apply(validator,[form.get(name)].concat(params)));}
buildinValidators.isInt=function(callback,form,name,params){callback(null,validator.isInt.apply(validator,[form.get(name)].concat(params)));}
formField.prototype.addValidator=function(func,message)
{
  if (!(func instanceof Array)){func=[func];}
  this.validators.push({func:func,message:message||''});
  return this;
}
var validate=function(form,name,validator,callback)
{
  var func=validator.func[0];
  if (typeof func=='string'){func=buildinValidators[func]?buildinValidators[func]:form.formModel.module.validators[func];}
  var params=validator.func.length>1?validator.func.slice(1):[];
  var message=validator.message;
  func.call(this,function(err,validated){
    if (!validated){form.addError(name,message);}
    callback(err);
  },form,name,params);
}
formField.prototype.required=function(meassage)
{
  this.isRequired=true;
  this.requiredMessage=meassage||'required';
  return this;
}
formField.prototype.validate=function(form,name,callback)
{
    var value=form.get(name);
    if (_.isEmpty(value) && !_.isNumber(value))
    {
      if (this.isRequired)
      {
	form.addError(name,this.requiredMessage);
      }
      return callback();
    }
    async.eachSeries(
      this.validators,
      validate.bind(this,form,name),
      callback
    );
}
module.exports=JForm;
module.exports.buildinValidators=buildinValidators;