var assert=require('assert');
var Web=require('../code');
var express=Web.libs.express;
var request=Web.libs.request;
var app=express();
var testport=23823;
var testText='runtimeTest';
var web=new Web();
web.testText=testText;
app.use(web.connect());
app.get('/showRuntime',function(req,res){
  var runtime=web.getRuntime(req);
  runtime.http.send(runtime.web.testText);
});
var server = app.listen(testport, function() {
  console.log('Listening on port %d', server.address().port);
});      
describe('Testing work with express:',function()
{
      it('Check web instanse',function(){
	request('http://127.0.0.1:'+testport+'/showRuntime',function(error, response, body){
	  console.log(body);
	  assert.ok(body==testText,'testText of web is wrong');
	})
      });
});