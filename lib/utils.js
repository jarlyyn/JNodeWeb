var utils=module.exports;
var crypto = require('crypto');  
utils.randomBase64=function(len)
{
  return crypto.randomBytes(Math.ceil(len * 3 / 4))
        .toString('base64')   // convert to base64 format
        .slice(0, len)        // return required number of characters
}
