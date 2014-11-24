var assert=require('assert');
var Web=require('../');
var libs=Web.libs;
var MVC=require('../lib/modules/MVC');
var web=new Web();
var EjsRender=require('../lib/renders/EjsRender');
var ejsRender=new EjsRender();
var mvc=web.registerModule(MVC);
var testValue1='test a';
var testValue2='test b';
var testValue3='test c';
var testValue4Defualt='test default d';
var testValue4='test d';
var testDataKey='testdatakey';
var testDataKey2='testdatakey2';
var correctMutliValue={ a: testValue1, b: testValue2 };
mvc.registerData('a',function(callback,runtime,params){callback(null,testValue1)})
mvc.registerData('b',function(callback,runtime,params){callback(null,testValue2)})
mvc.registerData('c',function(callback,runtime,params){callback(null,testValue3)})
mvc.registerData('d',function(callback,runtime,params){callback(null,params?params:testValue4Defualt)})
var view1=mvc.registerView('view1','view1').bindData('a');
var view2=mvc.registerView('view2').setLayout('view1').bindData('b').bindData('c');
var view3=mvc.registerView('view3').setLayout('view2');
var View1layoutLength=1;
var View1layout1Path='view1';
var View1dataProvidersLength=1;
var View1dataProvidersName='a';
var View3layoutLength=3;
var View3layout1Path1='view3';
var View3layout1Path2='view2';
var View3layout1Path3='view1';
var View3dataProvidersLength=3;
var View3dataProvidersName1='b';
var View3dataProvidersName2='c';
var View3dataProvidersName3='a';
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
    mvc.setViewPath('');
    mvc.renderFile('view1',View1Data,function(err,str){
      assert.ok(err,'err not raised');
      mvc.setViewPath('./views/');
      mvc.renderFile('view1',View1Data,function(err,str){
	assert.ok(err==null,'error raised');
	assert.ok(str==View1Result,'view result error');
	done();
      });
    })
  });
});
describe('Test runtime render',function(){
  it('Test layout',function(done){
    mvc.setViewPath('./views/');  
    runtime.render('view2',View1Params,function(err,data){
      assert.ok(data=='test testEnv view2 test a','view result error');
      done();
    });
  });
  it('Test layouts',function(done){
    mvc.setViewPath('./views/');  
    runtime.render('view3',View1Params,function(err,data){
      assert.ok(data=='test testEnv view2 test aview3','view result error');
      done();
    })
  });
})
describe('Test render',function(){
  it('Render Data',function(done){
    var layouts=view1.getLayouts();
    var dataProviders=view1.getDataProviders();
      assert.ok(layouts.length==View1layoutLength,'Layout length error');
      assert.ok(layouts[0].viewpath==View1layout1Path,'Layout view error');
      assert.ok(dataProviders.length==View1dataProvidersLength,'Data length error');
      assert.ok(dataProviders[0]==View1dataProvidersName,'Data Name error');
    var layouts=view3.getLayouts();
    var dataProviders=view3.getDataProviders();
      assert.ok(layouts.length==View3layoutLength,'Layout length error');
      assert.ok(layouts[0].viewpath==View3layout1Path1,'Layout view error');
      assert.ok(layouts[1].viewpath==View3layout1Path2,'Layout view error');
      assert.ok(layouts[2].viewpath==View3layout1Path3,'Layout view error');
      assert.ok(dataProviders.length==View3dataProvidersLength,'Data length error');
      assert.ok(dataProviders[0]==View3dataProvidersName1,'Data Name error');
      assert.ok(dataProviders[1]==View3dataProvidersName2,'Data Name error');
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
