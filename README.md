# NodeJS DKIM DNS Validator

A simple DKIM DNS validator for NodeJS.

## Usage:

### Using index.js from node console:

```javascript

node index.js {selector} {domain}

```

### Use the function directly in your own code:


```javascript

var dns = require('dns');
var dkimValidator = require('./dkimValidator');

//build host based on selector and domain
var selector = 'selector';
var domain = 'example.com';
var host = selector + '._domainkey.' + domain;

dns.resolveTxt(host, function(err, response) {

  if (err) {
    //do something
    return;
  }

  var result = dkimValidator.validate(response);
  console.log(result);
});

```

This is a work in progress. Issue reporting, pull requests and feedback is much appreciated.
