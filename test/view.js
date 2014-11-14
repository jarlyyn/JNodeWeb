var assert=require('assert');
var Web=require('../');
var libs=Web.libs;
var MVC=require('../lib/modules/MVC');
var web=new Web();
var EjsRender=require('../lib/renders/EjsRender');
var ejsRender=new EjsRender();
var view=web.registerModule(MVC);
var testValue1='test a';
var testValue2='test b';
var testValue3='test c';
var testValue4Defualt='test default d';
var testValue4='test d';
var testDataKey='testdatakey';
var testDataKey2='testdatakey2';
var correctMutliValue={ a: testValue1, b: testValue2 };
view.registerData('a',function(runtime,callback){callback(null,testValue1)})
view.registerData('b',function(runtime,callback){callback(null,testValue2)})
view.registerData('c',function(runtime,callback){callback(null,testValue3)})
view.registerData('d',function(data,callback){callback(null,data.params?data.params:testValue4Defualt)})
var render1=view.registerView('view1','view1').bindData('a');
var render2=view.registerView('view2').setLayout('view1').bindData('b').bindData('c');
var render3=view.registerView('view3').setLayout('view2');
var Render1layoutLength=1;
var Render1layout1Path='view1';
var Render1dataProvidersLength=1;
var Render1dataProvidersName='a';
var Render3layoutLength=3;
var Render3layout1Path1='view3';
var Render3layout1Path2='view2';
var Render3layout1Path3='view1';
var Render3dataProvidersLength=3;
var Render3dataProvidersName1='b';
var Render3dataProvidersName2='c';
var Render3dataProvidersName3='a';
var View1Params={'test':'testEnv'};
var View1Data={params:View1Params,content:''};
var View1Result='test testEnv ';
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
describe('Test runtime render',function(){
  it('Test layout',function(done){
    view.setViewPath('./views/');  
    runtime.render('view2',View1Params,function(err,data){
      assert.ok(data=='test testEnv view2 test a','view result error');
      done();
    });
  });
  it('Test layouts',function(done){
    view.setViewPath('./views/');  
    runtime.render('view3',View1Params,function(err,data){
      assert.ok(data=='test testEnv view2 test aview3','view result error');
      done();
    })
  });
})
describe('Test render',function(){
  it('Render Data',function(done){
    var layouts=render1.getLayouts();
    var dataProviders=render1.getDataProviders();
      assert.ok(layouts.length==Render1layoutLength,'Layout length error');
      assert.ok(layouts[0].viewpath==Render1layout1Path,'Layout view error');
      assert.ok(dataProviders.length==Render1dataProvidersLength,'Data length error');
      assert.ok(dataProviders[0]==Render1dataProvidersName,'Data Name error');
    var layouts=render3.getLayouts();
    var dataProviders=render3.getDataProviders();
      assert.ok(layouts.length==Render3layoutLength,'Layout length error');
      assert.ok(layouts[0].viewpath==Render3layout1Path1,'Layout view error');
      assert.ok(layouts[1].viewpath==Render3layout1Path2,'Layout view error');
      assert.ok(layouts[2].viewpath==Render3layout1Path3,'Layout view error');
      assert.ok(dataProviders.length==Render3dataProvidersLength,'Data length error');
      assert.ok(dataProviders[0]==Render3dataProvidersName1,'Data Name error');
      assert.ok(dataProviders[1]==Render3dataProvidersName2,'Data Name error');
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
it('Single Data With Object',function(done){
    runtime.fetchData({name:'b'},function(err,data){
      assert.ok(data==testValue2,'fetchModel return value error');
      assert.ok(runtime.dataProviders['b']==testValue2,'fetchModel return value error');
      done();
    });
  });    
  it('Single Data With Object',function(done){
    runtime.fetchData({name:'d',params:testValue4},function(err,data){
      assert.ok(data==testValue4,'fetchModel return value error');
      assert.ok(runtime.dataProviders['d']==testValue4,'fetchModel return value error');
      done();
    });
  });
  it('Single Data With Object',function(done){
    runtime.fetchData({name:'d',keyword:testDataKey,params:testValue4},function(err,data){
      assert.ok(data==testValue4,'fetchModel return value error');
      assert.ok(runtime.dataProviders[testDataKey]==testValue4,'fetchModel return value error');
      done();
    });
  });  
  it('Single Data With Object',function(done){
    runtime.fetchData(null,function(err,data){
      assert.ok(data==null,'fetchModel return value error');
      done();
    });
  });    
  it('Single Data With Object',function(done){
    runtime.fetchData({},function(err,data){
      assert.ok(data==null,'fetchModel return value error');
      done();
    });
  });  
  it('Mutli Data',function(done){
    runtime.fetchDatas(['a','b'],function(err,data){
      assert.ok(JSON.stringify(data)==JSON.stringify(correctMutliValue),'fetchModels return value error');
      done();
    });
  });
  it('Mutli Data With Object',function(done){
    runtime.fetchDatas([{name:'d',keyword:testDataKey2,params:testValue4}],function(err,data){
      assert.ok(runtime.dataProviders[testDataKey2]==testValue4,'fetchModel return value error');
      done();
    });
  });    
});