var Action=function() 
{
  this.actions={};
}
Action.prototype.do=function()
{
  var args=arguments;
  var action=this;
  return function(runtime)
  {
    var actions=[];
    for(var index in args){actions.push(action.actions[args[index]])};
    runtime.run(actions,runtime.next);
  }
}
Action.prototype.register=function(name,action)
{
  this.actions[name]=action;
}
module.exports=Action;