var Pager=function()
{
  this.pagers={};
}
Pager.prototype.register=function(name,paramName,pageSize)
{
  this.pagers[name]={
    'paramName':paramName||'name',
    'pageSize':pageSize||10,
  }
}
Pager.prototype.get=function(runtime,name)
{
  if (null==runtime.pagers){runtime.pagers={}};
  if (null==runtime.pagers[name])
  { 
    var settings=this.pagers[name];
    runtime.pagers[name]=new PagerModel(runtime,settings.paramName,settings.pageSize)
  }
  return runtime.pagers[name];
}
var PagerModel=function(runtime,paramName,pageSize)
{
  this.runtime=runtime;
  this.paramName=paramName;
  this.current=runtime.req.param(paramName)*1||1.
  this.pageSize=pageSize;
  this.itemCount=null;
  this.pageMax=null;
  this.getPageLabel=getPageLabel;
}
var getPageLabel=function(page)
{
  return page;
} 

PagerModel.prototype.setItemCount=function(count)
{
  this.itemCount=count;
  this.pageMax=Math.ceil(count/this.pageSize);
}
PagerModel.prototype.getCurrentPage=function()
{
  return this.current;
}
PagerModel.prototype.getLimit=function()
{
  return this.pageSize;
}
PagerModel.prototype.getOffset=function()
{
  return (this.current-1)*this.pageSize;
}
PagerModel.prototype.getFirst=function()
{
  if (null==this.itemCount){return null;}
  return this.result(1);
}
PagerModel.prototype.getPrev=function()
{
  if (null==this.itemCount){return null;}
  var prev=this.current-1;
  if (prev<1){return null}
  return this.result(prev);
}
PagerModel.prototype.getNext=function()
{
  if (null==this.itemCount){return null;}
  var next=this.current+1;
  if (next>this.pageMax){return null}
  return this.result(next);
}
PagerModel.prototype.getLast=function()
{
  if (null==this.itemCount){return null;}
  return this.result(this.pageMax);
}
PagerModel.prototype.getPages=function(pagecount)
{
  if (null==this.itemCount){return null;}
  var results=[];
  var from=1;
  var to=this.pageMax;
  var offsetLeft=Math.ceil((pagecount-1)/2);
  if (pagecount<this.pageMax)
  {
    from=this.current-offsetLeft;
    if (from<1){from=1;}
    to=from+pagecount-1;
    if (to>this.pageMax)
    {
      to=this.pageMax;
      from=this.pageMax+1-pagecount;
    }
  }
  for (var i=from;i<=to;i++)
  {
    results.push(this.result(i));
  }
  return results;
}
PagerModel.prototype.isCurrent=function(page)
{
  return page==this.current;
}
PagerModel.prototype.result=function(page)
{
  return page;
}
PagerModel.prototype.toUrl=function(page)
{
  var query={};
  query[this.paramName]=page;
  return this.runtime.toUrl(query);
}
PagerModel.prototype.getSeQuery=function()
{
  return {offset:this.getOffset(),limit:this.getLimit()};
}
PagerModel.prototype.getBootstrapHtml=function(pagecount,settings)
{
  if (null==settings)
  {
    settings={};
  }
  var first= this.getFirst();
  var firstLabel=settings['first']||'&laquo;';
  var prev= this.getPrev();
  var prevLabel=settings['prev']||'&lt;';      
  var next= this.getNext();
  var nextLabel=settings['next']||'&gt;';    
  var last= this.getLast();
  var lastLabel=settings['last']||'&raquo;';
  var pageFunc=settings['page']||this.getPageLabel;
  var pages=this.getPages(pagecount);
  var html='<ul class="pagination">';
  if (null!=first){html+='<li><a href="'+this.toUrl(first)+'">'+firstLabel+'</a></li>';};
  for (var i in pages)
  {
  html+='<li><a class="'+(this.isCurrent(pages[i])?'active':'')+'" href="'+this.toUrl(pages[i])+'">'+pageFunc(pages[i])+'</a></li>';
  }
  if (null!=last){html+='<li><a href="'+this.toUrl(last)+'">'+lastLabel+'</a></li>';};
  return html;
}
PagerModel.prototype.getPageLabel=function(page)
{
  return page;
} 
module.exports=Pager;