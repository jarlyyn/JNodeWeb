var util = require("util");
var libs=require('../JsLib');
var WebModule=require('../WebModule');
var env=require('../Env');
var _=libs.lodash;
var onCreateRuntime=function(data)
{
  var runtime=data.runtime;
  new htmlRuntime(runtime);
}
var HtmlModule=function(web)
{
    var htmlModule=this;
    this.moduleName='Html';  
    WebModule.call(this,web);
    web.on(env.eventCreateRuntime,onCreateRuntime.bind(this));
    
}
var htmlRuntime=function(runtime)
{
  runtime.html=this;
  this._data={
    css:[],
    javascripts:{
      head:[],
      end:[],
    },
    meta:{},
    title:null,
  };
}
htmlRuntime.prototype.setTitle=function(title)
{
  return this._data.title=title;
}
htmlRuntime.prototype.getTitle=function(defualtValue)
{
  return (null!=this._data.title)?this._data.title:title;
}
htmlRuntime.prototype._insertData=function(obj,name,config)
{
  var data={
    name:name,
    config:config,
  };
  var index=_.findIndex(obj,{'name':name});
  if (index>=0){
    obj[index]=data;
  }else{
    obj.push(data);
  }  
}
htmlRuntime.prototype.addCss=function(name,config)
{
  this._insertData(this._data.css,name,config);
}
htmlRuntime.prototype.addJs=function(name,code,position)
{
  if (null==position){
    position='head';
  }
  this._insertData(this._data.javascripts[position],name,{code:code});
}
htmlRuntime.prototype.addJsFile=function(name,position)
{
  if (null==position){
    position='head';
  }
  this._insertData(this._data.javascripts[position],name,{code:''});
}
htmlRuntime.prototype.setMeta=function(name,value)
{
  this._data.meta[name]=value;
}
htmlRuntime.prototype.getMeta=function(name,defaultValue)
{
  var value=this._data.meta[name];
  return (null==value)?value:defaultValue;
}
htmlRuntime.prototype.crlf="\r\n";
htmlRuntime.prototype.tag=function(tagName,content,attributes)
{
  if (null==attributes){attributes={}}
  var attributesList='';
  for(var name in attributes)
  {
    if (attributes[name]!=null)
    {
      attributesList+=' '+name+'="'+attributes[name]+'"';
    }
  }
  return '<'+tagName+attributesList+ (content==null?'/>':'>'+content+'</'+tagName+'>');
}
htmlRuntime.prototype.renderHead=function(defaultData)
{
  var output='';
  var data={};
  if (null!=defaultData){
    if (null!=defaultData.meta)
    {
      _.defaults(this._data.meta,defaultData.meta)
    }
  }
  if (null!=this._data.title)
  {
    output+=this.tag('title',this._data.title)+this.crlf;
  }
  for( var name in this._data.meta)
  {
    if (null!=this._data.meta[name])
    {
      output+=this.tag('meta',null,{
        name:name,
        content:this._data.meta[name],
      })+this.crlf;
    }
  }
  for (var index in this._data.css)
  {
    var config=this._data.css[index].config||{};
    output+=this.tag('link',null,{
      rel:"stylesheet",
      media:config.media||"all",
      href:config.href||this._data.css[index].name
    })+this.crlf;
  }
  for (var index in this._data.javascripts.head)
  {
    var config=this._data.javascripts.head[index].config||{};
      output+=this.tag('script',config.code,{
        src:(config.code?null:this._data.javascripts.head[index].name),
    })+this.crlf;
  }
  return output;
}
htmlRuntime.prototype.renderEnd=function()
{
    var output='';
  for (var index in this._data.javascripts.end)
  {
    var config=this._data.javascripts.end[index].config||{};
      output+=this.tag('script',config.code,{
        src:config.code?null:this._data.javascripts.end[index].name,
    })+this.crlf;
  }    
    return output;
}
util.inherits(HtmlModule,WebModule);
module.exports=HtmlModule;