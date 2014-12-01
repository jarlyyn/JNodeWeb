module.exports=function(app,web) 
{
  var Form=web.Form;

//   var customerValidator=function(callback,form,name,params){
//     if (form.hasError){return callback(null,true)}
//     if (form.get(name)=='value')
//     {
//       return callback(null,true);
//     }
//     return callback(null,false);
//   }   
//   
//   var getUpdateUnquieQuery=function(form,name){return {where:{'id':{'ne':form.get('id')}}};}
// 
//   var updateForm=Form.registerForm('update');
//   updateUserForm.field('name')
//     .required('姓名必填');
//   updateUserForm.field('username')
//     .required('用户名必填')
//     .addValidator('isEmail','信箱格式不对')
//     .addValidator(['seUnique',web.models.userModel,'username',getUpdateUnquieQuery],'用户名已经被使用');
//   updateUserForm.field('id')
//     .required('没有ID')
//     .addValidator(userExistsValidator,'用户不存在');
//     