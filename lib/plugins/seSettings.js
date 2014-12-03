var libs=require('../JsLib');
var Sequelize=libs.sequelize;
module.exports=function(web){
  var settings=function(seName,cacheName,suffix)
  {
    if(suffix==null){suffix='';}
    this.se=web.MVC.getSe(seName);
    this.cache=web.Cache.get(cacheName);
    this.Model=this.se.define('JNW_plugin_settings', {
      key:{
	type:Sequelize.STRING,
	primaryKey:true,
      },
      value:Sequelize.TEXT,
    },
    {
      timestamps: false,
      tableName:'JNW_plugin_settings'+suffix
    }); 
    this.Model.sync();
  }
  settings.prototype.get=function(key,callback)
  {
    var settings=this;
    this.cache.wrap(key,function(cacheCallback){
      settings.getValueFromSe(key,cacheCallback)
    },callback);
  }
  settings.prototype.set=function(key,value,ttl,callback)
  {
    var settings=this;
    if (callback==null)
    {
      callback=ttl;
      ttl=null;
    };
    this.setValueToSe(key,value,function(err){
      settings.cache.set(key,value,ttl,callback);
    })
  }
  settings.prototype.getValueFromSe=function(key,callback)
  {
    this.Model.find({where:{key:key}})
      .success(function(model){
	var value=model==null?null:JSON.parse(model.value);
	return callback(null,value)
      })
      .fail(function(err){
	return callback(err,null);
      });
  };
  settings.prototype.setValueToSe=function(key,value,callback)
  {
      this.Model.findOrCreate({where:{key:key}})
      .success(function(model,created){
	model.value=JSON.stringify(value);
	model.save().success(function(){
	  return callback();
	})
      })
        .fail(function(err){
	  return callback(err);
        });    
  };
  return settings;
}
