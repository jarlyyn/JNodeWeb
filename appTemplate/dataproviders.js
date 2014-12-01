module.exports=function(app,web) 
{
  var MVC=web.MVC;
  var models=web.models;
  var _=web.libs.lodash;
  var moment=web.libs.moment;  
//   web.Pager.register('page','page',3)    
//   MVC.registerData('users',function(callback,runtime){
//     var pager=web.Pager.get(runtime,'page');
//     userModel.findAndCountAll(pager.getSeQuery()).success(function(result){
//       var users=result.rows;
//       pager.setItemCount(result.count);
//       callback(null,users);
//     })
//   });
//   MVC.registerData('usersjson',function(callback,runtime){
//     var form=runtime.forms.listuser;
//     var findQuery=form.getAttributes(['offset','limit']);
//     findQuery.where={};
//     var whereQuery=form.getAttributes(['id','name','username']);
//     for (var name in whereQuery)
//     {
//       if (!_.isEmpty(whereQuery[name])){
// 	var escaped=web.libs.utils.escapeSearch(whereQuery[name]);
// 	findQuery.where[name]={'like':'%'+escaped+'%'}
//       }
//     };
//     var equalQuery=form.getAttributes(['status']);
//     for (var name in equalQuery)
//     {
//       if (!_.isEmpty(equalQuery[name])){
//       findQuery.where[name]=equalQuery[name];
//       }
//     }
//     if (form.get('sort'))
//     {
//       findQuery.order=[[form.get('sort'),(form.get('asc')=='asc'?'ASC':'DESC')]];
//     }
//     if (form.hasError){return runtime.res.status(404).send('404');}
//     userModel.findAndCountAll(findQuery).success(function(result){
//       var users=result.rows;
//       callback(null,{
// 	count:result.count,
// 	data:web.libs.lodash.map(users,function(value){
// 	  return {createdAt:moment(value.createdAt).format('YYYY-MM-DD'),name:value.name,username:value.username,id:value.id,status:value.status}
// 	})
//       })
//     })
//   });
  
}
 
