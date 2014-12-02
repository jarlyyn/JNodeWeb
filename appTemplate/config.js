module.exports=
{
  "viewpath":__dirname+"/views/",
  "db":{
    "sequelize":{
      "url":"mysql://username:password@host/dbname",
      "options":{
	  "dialectOptions":{
	    "charset":"UTF8"
	  },
	  "define":{
	    "charset":"UTF8"
	  }
      }
    }
  }
  "cache":{
    'mem':{store: 'memory', max: 100, ttl: 100}
  }

}
 
