module.exports=function(webconfig)
{
  var Web=require('../lib/JNodeWeb');
  var config=require('./config.js');
  web=new Web(Web.libs.lodash.extend(config,webconfig||{}));
  var app=web.app();
  // var Settings=web.plugin('seSettings');
  // web.settings=new Settings('sequelize','mem','_app');
  app.load(__dirname+'/views');
  app.load(__dirname+'/actions');
  app.load(__dirname+'/models');
  app.load(__dirname+'/dataproviders');
  app.load(__dirname+'/forms');
  app.load(__dirname+'/routers');
  return app;
}
