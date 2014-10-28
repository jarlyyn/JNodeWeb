var WebModule=function(web)
{
  this.web=web;
  if (this.moduleName){web[this.moduleName]=this};
}
module.exports=WebModule;
