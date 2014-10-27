var assert=require('assert');
var Web=require('../code/JExpressWeb');
var Model=require('../code/libs/modules/Model');
var web=new Web();
var model=web.registerModule(Model);
var runtime=web.createRuntime();
var testValue1='test a';
var testValue2='test b';
var correctMutliValue={ a: testValue1, b: testValue2 };
model.register('a',function(runtime,callback){callback(testValue1)})
model.register('b',function(runtime,callback){callback(testValue2)})
var modelRuntime=web.Model.createRuntime(runtime);
describe('Test Model',function(){
  it('single Model',function(){
    modelRuntime.fetchModel('a',function(data){
      assert.ok(data==testValue1,'fetchModel return value error')
    });
  });
  it('mutli Model',function(){
    modelRuntime.fetchModels(['a','b'],function(data){
      console.log(data);
      assert.ok(JSON.stringify(data)==JSON.stringify(correctMutliValue),'fetchModels return value error')
    });
  });  
});
