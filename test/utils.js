var assert=require('assert');
var Web=require('../');
var libs=Web.libs;
var utils=libs.utils;
var getDataLevel3Value=3
var getDataLevel3NullValue=4
var getData={};
getData.level2={};
getData.level2.level3=getDataLevel3Value;
describe('Test ejs',function(){
  it('get',function(done)
  {
    assert.ok(utils.get(getData)==getData);;
    assert.ok(utils.get(getData,['level2'])==getData.level2);
    assert.ok(utils.get(getData,'level2')==getData.level2);
    assert.ok(utils.get(getData,['level2','level3'])==getDataLevel3Value);
    assert.ok(utils.get(getData,['level2','level32'])==null);
    assert.ok(utils.get(getData,'level2a')==null);
    assert.ok(utils.get(getData,['level2','level32'],getDataLevel3NullValue)==getDataLevel3NullValue);
    done();
  });
  it('checkChildren',function(done){
    assert.ok(utils.checkChildren(getData,['level2','level3'])===true)
    assert.ok(utils.checkChildren(getData,['level2','level3a'])===false)
    done();
  });
});
