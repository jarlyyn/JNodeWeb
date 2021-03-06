var path=require('path');
var fs = require('fs');
var libs=require('../lib/JsLib');
var fse=libs.fse;
var help=function()
{
  console.log('useage:nodejs install.js installpath');
}
var main=function()
{
  var codePath=__dirname+'/../';
  var targetPath=process.argv[2];  
  if (null==targetPath){
    help();
    return;
  }
  if (!fs.existsSync(targetPath))
  {
    console.log('Path"'+targetPath+'" not exists.');
    return;
  }
  var stat=fs.statSync(targetPath);
  if (!stat.isDirectory())
  {
    console.log('Path"'+targetPath+'" is not a directory.');
    return;
  }
  var filesInDir=fs.readdirSync(targetPath);
  if (filesInDir.length==0){
    console.log('Creating lib directory');
    fs.mkdirSync(targetPath+'/lib');
  }else{
    if (!fs.existsSync(targetPath+'/lib/')){return;}
    if (fs.existsSync(targetPath+'/lib/JNodeWeb')){fse.removeSync(targetPath+'/lib/JNodeWeb')}
  }
  fse.copySync(codePath,targetPath+'/lib/JNodeWeb');
  fse.removeSync(targetPath+'/lib/JNodeWeb/.git');
  console.log(codePath);
}

main();
