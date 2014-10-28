var assert=require('assert');
var Web=require('../code');
var libs=Web.libs;
var View=require('../code/lib/modules/View');
var web=new Web();
var EjsRender=require('../code/lib/renders/EjsRender');
var ejsRender=new EjsRender();
var view=web.registerModule(View);
var testValue1='test a';
var testValue2='test b';
var testValue3='test c';
var correctMutliValue={ a: testValue1, b: testValue2 };
view.registerData('a',function(runtime,callback){callback(null,testValue1)})
view.registerData('b',function(runtime,callback){callback(null,testValue2)})
view.registerData('c',function(runtime,callback){callback(null,testValue3)})
var render1=view.registerView('view1','view1').bindData('a');
var render2=view.registerView('view2','view2').setLayout('view1').bindData('b').bindData('c');
var Render1layoutLength=1;
var Render1layout1Path='view1';
var Render1dataProvidersLength=1;
var Render1dataProvidersName='a';
var Render2layoutLength=2;
var Render2layout1Path1='view2';
var Render2layout1Path2='view1';
var Render2dataProvidersLength=3;
var Render2dataProvidersName1='b';
var Render2dataProvidersName2='c';
var Render2dataProvidersName3='a';
var View1Data={'test':'testEnv'};
var View1Result='test testEnv';
var runtime=web.createRuntime({},{});
describe('Test ejs',function(){
  it('Ejs render not exist',function(done)
  {
    ejsRender.renderFile('./notExist/view',{},function(err,str)
    {
      assert.ok(err,'error not raised');
      done();
    });
  });
  it('Ejs render view',function(done){
    ejsRender.renderFile('./views/view1',View1Data,function(err,str){
      assert.ok(err==null,'error raised');
      assert.ok(str==View1Result,'view result error');
      done();
    });
  });
});
describe('Test view',function(){
  it('Test view path',function(done){
    view.setViewPath('');
    view.renderFile('view1',View1Data,function(err,str){
      assert.ok(err,'err not raised');
      view.setViewPath('./views/');
      view.renderFile('view1',View1Data,function(err,str){
	assert.ok(err==null,'error raised');
	assert.ok(str==View1Result,'view result error');
	done();
      });
    })
  });
});
describe('Test render',function(){
  it('Render Data',function(done){
    var layouts=render1.getLayouts();
    var dataProviders=render1.getDataProviders();
      assert.ok(layouts.length==Render1layoutLength,'Layout length error');
      assert.ok(layouts[0].viewpath==Render1layout1Path,'Layout view error');
      assert.ok(dataProviders.length==Render1dataProvidersLength,'Data length error');
      assert.ok(dataProviders[0]==Render1dataProvidersName,'Data Name error');
    var layouts=render2.getLayouts();
    var dataProviders=render2.getDataProviders();
      assert.ok(layouts.length==Render2layoutLength,'Layout length error');
      assert.ok(layouts[0].viewpath==Render2layout1Path1,'Layout view error');
      assert.ok(layouts[1].viewpath==Render2layout1Path2,'Layout view error');
      assert.ok(dataProviders.length==Render2dataProvidersLength,'Data length error');
      assert.ok(dataProviders[0]==Render2dataProvidersName1,'Data Name error');
      assert.ok(dataProviders[1]==Render2dataProvidersName2,'Data Name error');
      assert.ok(dataProviders[2]==Render2dataProvidersName3,'Data Name error');
      done();
  });
});

describe('Test Data',function(){
  it('Single Data',function(done){
    runtime.fetchData('a',function(err,data){
      assert.ok(data==testValue1,'fetchModel return value error');
      done();
    });
  });
  it('Mutli Data',function(done){
    runtime.fetchDatas(['a','b'],function(err,data){
      assert.ok(JSON.stringify(data)==JSON.stringify(correctMutliValue),'fetchModels return value error');
      done();
    });
  });  
});
