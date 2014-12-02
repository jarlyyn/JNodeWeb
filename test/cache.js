var assert=require('assert');
var webconfig={
 "db":{
    "sequelize":{
      "url":"mysql://JNWSeSettings:JNWSeSettings@localhost/JNWSeSettings",
      "options":{}
    }
  },
  "cache":{
    'mem':{store: 'memory', max: 100, ttl: 100}
  }  
}
var Web=require('../');
var libs=Web.libs;
web=new Web(webconfig);
var cacheManager=libs.cacheManager;
var SettingsPlugin=require('../lib/plugins/seSettings');
var settings=new (SettingsPlugin(web))();
describe('Test cache',function(){
  it('test set',function(done){
    settings.set('test','15',function(err){
      settings.get('test',function(err,result){
	 assert.ok(result=='15');
	 done();
      });
    });
  });
});
