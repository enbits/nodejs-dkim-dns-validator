//parses TXT record into an array
var buildItemsArray = (item) => {
  var splittedItem = item.trim().split('=');
  var itemKey = splittedItem[0];
  var itemValue = splittedItem[1];
  return { [itemKey]: itemValue };
};

exports.validate = (response) => {
  //validation rules
  var validationRules = { v: 'DKIM1', g: '*', k: 'rsa', p: /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/};

  //get DKIM TXT record from result
  var dkimData = response[0][0].split(';');

  //parse it into an array
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
      if (validationRules.p.test(value) === false) {
        validationsErrors.p = {found: value, message: 'Invalid public key'};
      }
    }
  });

  if (Object.keys(validationsErrors).length === 0) {
    return {
      result: true,
      dkimData: itemsArray
    };
  } else {
    return {
      result: false,
      dkimData: itemsArray,
      validationsErrors: validationsErrors
    };
  }
};
