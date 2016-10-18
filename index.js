/***
NodeJS function to validate a DKIM TXT DNS record
Usage: nodejs index {selector} {domain}
****/

var dns = require('dns');

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

//validation rules
var validationRules = { v: 'DKIM1', g: '*', k: 'rsa', p: /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/};

//validation function
var validateDkim = (err, result) => {

  if (err) {
    console.error(err);
    return;
  }

  var dkimData = result[0][0].split(';');
  var itemsArray = dkimData.map(buildItemsArray);
  var validationsErrors = {};

  itemsArray.forEach((item) => {
    var key = Object.keys(item)[0];
    var value = item[key];

    if (key !== 'p') {
      if (value !== validationRules[key]) {
        validationsErrors[key] = {found: value, shouldBe: validationRules[key]};
      }
    } else {
      //public key regexp test
      if (validationRules['p'].test(value) === false) {
        validationsErrors['p'] = {found: value, message: 'Invalid public key'};
      }
    }
  });

  if (Object.keys(validationsErrors).length == 0) {
    process.stdout.write('DKIM Validation Sucess!!');
  } else {
    console.error(validationsErrors);
  }
}

//parses TXT record into an array
var buildItemsArray = (item) => {
  var splittedItem = item.trim().split('=');
  var itemKey = splittedItem[0];
  var itemValue = splittedItem[1];
  return { [itemKey]: itemValue};
};

//dig it!
process.stdout.write('Fetching... ');
dns.resolveTxt(host, validateDkim);
