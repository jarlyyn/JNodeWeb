module.exports=function(app,web) 
{
  var Form=web.Form;
  var MVC=web.MVC; 
  var Http=web.Http;
  var run=web.expessRun();  
  var HttpError=web.expressHttpError();  
  var express=web.libs.express;  

  //  app.use('/assets',web.libs.express.static(__dirname + '/assets'));    
  //  app.use(web.libs.bodyParser());
//   app.all('/login',run(
//     web.IF(Form.isValidated('login'))(
//       'login',
//       web.Http.doRedirect('html/index.html')
//     ),
//     MVC.doRender('login')
//   ));
  
//   app.post('/api/setpassword',run(
//     web.IF(Form.isValidated('setpassword'))(
//       'setpassword'
//     ),
//     Http.notFoundIf(
//       Form.isPending('setpassword'),
//       Form.isError('setpassword','uid')
//     ),
//     Form.doJsonErrors('setpassword')
//   ));
  
//   app.get('/users',run(
//     Http.notFoundIfNot(Form.isValidated('listuser')),
//     MVC.doJsonData('usersjson')
//   ));  
  
  app.use(run(Http.doNotFound()));
  app.use(HttpError(404)(MVC.doRender('404')));  
}
