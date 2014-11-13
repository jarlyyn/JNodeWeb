var assert=require('assert');
var Web=require('../');
var express=Web.libs.express;
var request=Web.libs.request;
var app=express();
var testport=23823;
var testText='runtimeTest';
var web=new Web();
var correntWebConfigA='testa';
var correntWebConfigB='testb';
var webDefaultConfig={'test':{a:correntWebConfigA,b:'test'}};
var webConfig={'test':{b:correntWebConfigB}};
web.testText=testText;
app.use(web.connect());
app.get('/showRuntime',function(req,res){
  var runtime=web.getRuntime(req);
  runtime.http.send(runtime.web.testText);
});
var server = app.listen(testport, function() {
  console.log('Listening on port %d', server.address().port);
});
describe('Testing base function:',function()
{
  it('Testing Extend Config',function(done){
    var web=new Web();
    web.initSettings(webConfig,webDefaultConfig)
    assert.ok(web.settings.test.a=correntWebConfigA);
    assert.ok(web.settings.test.b=correntWebConfigB);
    done()
  });
});
describe('Testing work with express:',function()
{
      it('Check web instanse',function(done){
	request('http://127.0.0.1:'+testport+'/showRuntime',function(error, response, body){
	  assert.ok(body==testText,'testText of web is wrong');
	  done()
	})
      });
});