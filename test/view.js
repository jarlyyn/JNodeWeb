var assert=require('assert');
var Web=require('../code/JExpressWeb');
var View=require('../code/libs/modules/View');
var web=new Web();
var view=web.registerModule(View);
var testValue1='test a';
var testValue2='test b';
var testValue3='test c';
var correctMutliValue={ a: testValue1, b: testValue2 };
view.registerData('a',function(runtime,callback){callback(testValue1)})
view.registerData('b',function(runtime,callback){callback(testValue2)})
view.registerData('c',function(runtime,callback){callback(testValue3)})
var render1=view.registerView('view1','./view1').bindData('a');
var render2=view.registerView('view2','./view2').setLayout('view1').bindData('b').bindData('c');
var Render1layoutLength=1;
var Render1layout1Path='./view1';
var Render1dataProvidersLength=1;
var Render1dataProvidersName='a';
var Render2layoutLength=2;
var Render2layout1Path1='./view2';
var Render2layout1Path2='./view1';
var Render2dataProvidersLength=3;
var Render2dataProvidersName1='b';
var Render2dataProvidersName2='c';
var Render2dataProvidersName3='a';
var runtime=web.createRuntime({},{});

describe('Test render',function(){
  it('Render Data',function(){
    var layouts=render1.getLayouts();
    var dataProviders=render1.getDataProviders();
      assert.ok(layouts.length==Render1layoutLength,'Layout length error')
      assert.ok(layouts[0].viewpath==Render1layout1Path,'Layout view error')
      assert.ok(dataProviders.length==Render1dataProvidersLength,'Data length error')
      assert.ok(dataProviders[0]==Render1dataProvidersName,'Data Name error')
    var layouts=render2.getLayouts();
    var dataProviders=render2.getDataProviders();
      assert.ok(layouts.length==Render2layoutLength,'Layout length error')
      assert.ok(layouts[0].viewpath==Render2layout1Path1,'Layout view error')
      assert.ok(layouts[1].viewpath==Render2layout1Path2,'Layout view error')
      assert.ok(dataProviders.length==Render2dataProvidersLength,'Data length error')
      assert.ok(dataProviders[0]==Render2dataProvidersName1,'Data Name error')
      assert.ok(dataProviders[1]==Render2dataProvidersName2,'Data Name error')
      assert.ok(dataProviders[2]==Render2dataProvidersName3,'Data Name error')
  });
});

describe('Test Data',function(){
  it('single Data',function(){
    runtime.fetchData('a',function(data){
      assert.ok(data==testValue1,'fetchModel return value error')
    });
  });
  it('mutli Data',function(){
    runtime.fetchDatas(['a','b'],function(data){
      assert.ok(JSON.stringify(data)==JSON.stringify(correctMutliValue),'fetchModels return value error')
    });
  });  
});
