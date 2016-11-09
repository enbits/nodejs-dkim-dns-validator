/***
NodeJS function to validate a DKIM TXT DNS record
Usage: nodejs index {selector} {domain}
****/

var dns = require('dns');
var dkimValidator = require('./dkimValidator');

// PARAMETERS //

//dkim selector
var selector = process.argv[2];

//domain
var domain = process.argv[3];

// END PARAMETERS //

//return home early
if (selector === undefined || domain === undefined) {
  process.stdout.write('Usage: node index.js {selector} {domain}');
  return;
}

//build host based on selector and domain
var host = selector + '._domainkey.' + domain;

//dig it!
process.stdout.write('Fetching... ');
dns.resolveTxt(host, function(err, response) {
  var result = dkimValidator.validate(response);
  console.log(result);
});
