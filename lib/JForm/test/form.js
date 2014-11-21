var assert=require('assert');
var Web=require('../../../');
var libs=Web.libs;
JForm=require('../');
var forms= new JForm();
var forms2= new JForm();
var unusedName='unusedName';
var defaultValue='default';
var testName1='test1';
var testLabel1='testlabel1';
var testValue1='testv2';
var testName2='test2';
var testValue2='testv2';
var validatorName1='test3';
var validatorValue='test3true';
var validatorErrorValue='test3false';
var validator=function(callback,form,name,params){
  callback(null,form.get(name)==testValue1);
}
var formdata1={}
formdata1[testName1]=testValue1
var form=forms.register('form1');
var model=form.create(formdata1);

validatedForm=forms.register('validate');
validatedFormModel=validatedForm.create();
validatedForm.field('notNull').addValidator('notNull','not NUll error');
validatedFormModel.set('notNull','1');
validatedForm.field('notNullError').addValidator('notNull','not NUll error');
validatedFormModel.set('notNullError',null);
validatedForm.field('isEmail').addValidator('isEmail','isEmail error');
validatedFormModel.set('isEmail','abc@qq.com');
validatedForm.field('isEmailError').addValidator('isEmail','isEmail error');
validatedFormModel.set('isEmailError','abc');
validatedForm.field('isAlpha').addValidator('isAlpha','isAlpha error');
validatedFormModel.set('isAlpha','abc');
validatedForm.field('isAlphaError').addValidator('isAlpha','isAlpha error');
validatedFormModel.set('isAlphaError','abc.');
validatedForm.field('isNumeric').addValidator('isNumeric','isNumeric error');
validatedFormModel.set('isNumeric','-123');
validatedForm.field('isNumericError').addValidator('isNumeric','isNumeric error');
validatedFormModel.set('isNumericError','123.a');
validatedFormModel.set('comapred','comapred')
validatedForm.field('compare').addValidator(['compare','comapred'],'compare error');
validatedFormModel.set('compare','comapred');
validatedForm.field('compareError').addValidator(['compare','comapred'],'compare error');
validatedFormModel.set('compareError','not comapred');
validatedForm.field('isLength').addValidator(['isLength',2,5],'isLength error');
validatedFormModel.set('isLength','-123');
validatedForm.field('isLengthMaxError').addValidator(['isLength',2,5],'isLength Max error');
validatedFormModel.set('isLengthMaxError','123.asd');
validatedForm.field('isLengthMinError').addValidator(['isLength',2,5],'isLength Min error');
validatedFormModel.set('isLengthMinError','1');
var field=form.field(testName1,testLabel1);
field.addValidator([validator,1],'test error');
forms2.setForm('form1',form);
forms2.setForm('form2',validatedForm);
describe('model base function',function(){
  it('get and set',function(done)
  {
    assert(model.get(testName1)==testValue1,'get value error.');
    assert(model.get(unusedName)==null,'get unset value error.');
    assert(model.get(unusedName,defaultValue)==defaultValue,'get default value error.');
    assert(model.set(testName2,testValue2)==testValue2,'return set value error');
    assert(model.get(testName2)==testValue2,'get setted value error');
    done();
  });
});
describe('validator',function(){
  it('validator',function(done)
  {
    model.validate(function(){
      done();
    });
  });
  it('buildin',function(done)
  {
    validatedFormModel.validate(function(){
      console.log('###');
      var errors=validatedFormModel.errors;
      console.log(errors);
      assert(errors.notNull==null);
      assert(errors.notNullError);
      assert(errors.isEmail==null);
      assert(errors.isEmailError);
      assert(errors.isAlpha==null);
      assert(errors.isAlphaError);
      assert(errors.isNumeric==null);
      assert(errors.isNumericError);
      assert(errors.isLength==null);
      assert(errors.isLengthMaxError);
      assert(errors.isLengthMinError);
      done();
    });
  });
});
describe('Jform',function(){
  it('',function(done){
    forms2.validate(['form1','form2'],{form2:{notNull:1,isEmail:'a@qq.com'}},function(err,models){
      console.log(models);
      done();
    });
  });
});
