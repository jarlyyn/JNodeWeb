var libs={};
var addLib=function(libname,func){
  Object.defineProperty(libs,libname,{get:func});
}
addLib('async',function(){return require('../node_modules/async')});
addLib('express',function(){return require('../node_modules/express')});
addLib('later',function(){return require('../node_modules/later')});
addLib('ejs',function(){return require('../node_modules/ejs')});
addLib('iconv',function(){return require('../node_modules/iconv-lite')});
addLib('sequelize',function(){return require('../node_modules/sequelize')});
addLib('moment',function(){return require('../node_modules/sequelize/node_modules/moment')});
addLib('uuid',function(){return require('../node_modules/sequelize/node_modules/node-uuid')});
addLib('validator',function(){return require('../node_modules/sequelize/node_modules/validator')});
addLib('request',function(){return require('../node_modules/request')});
addLib('fse',function(){return require('../node_modules/fs-extra')});
addLib('vhost',function(){return require('../node_modules/vhost')});
addLib('extend',function(){return require('../node_modules/node.extend')});
addLib('session',function(){return require('../node_modules/express-session')});
module.exports=libs;
