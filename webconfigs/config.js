module.exports=
{
  "apps":__dirname+"../app",
//   "apps":{
//     "":__dirname+"/../app1",
//     "/mountpath/":__dirname+"/../app2",
//   },
//   "createApp":function(app,apps){return app;},
  "start":function(app,callback){
    app.listen(3000,callback);
  },
  "db":{
    "sequelize":{
      "url":"mysql://username:password@host/dbname",
      "options":{
	  "logging":false,
	  "dialectOptions":{
	    "charset":"UTF8"
	  },
	  "define":{
	    "charset":"UTF8"
	  }
      }
    }
  },
  "cache":{
    'mem':{store: 'memory', max: 100, ttl: 100}
  }
}
 
