/**
 * A regular certificate thumbprint is a hex encode string of the binary certificate
 * hash. For some reason the x5t value in a JWT is a url save base64 encoded string
 * instead. This function does the conversion.
 * @param  {string} thumbprint A hex encoded certificate thumbprint.
 * @return {string} A url safe base64 encoded certificate thumbprint.
 */
var safeBase64EncodedThumbprint = function(thumbprint) {
  var numCharIn128BitHexString = 128/8*2;
  var numCharIn160BitHexString = 160/8*2;
  var thumbprintSizes  = {};
  thumbprintSizes[numCharIn128BitHexString] = true;
  thumbprintSizes[numCharIn160BitHexString] = true;
  var thumbprintRegExp = /^[a-f\d]*$/;

  var hexString = thumbprint.toLowerCase().replace(/:/g, '').replace(/ /g, '');

  if (!thumbprintSizes[hexString.length] || !thumbprintRegExp.test(hexString)) {
    throw 'The thumbprint does not match a known format';
  }

  var base64 = (Buffer.from(hexString, 'hex')).toString('base64');
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');;
};

//openssl x509 -fingerprint -in certificates/certificate.pem -noout
//SHA1 Fingerprint=53:D7:03:93:B1:FC:09:05:98:08:47:34:58:C9:E2:85:85:B7:1F:8D
//remover os :
let x5t = safeBase64EncodedThumbprint('53D70393B1FC09059808473458C9E28585B71F8D')
console.log("x5t:", x5t);

const iat = Math.floor(Date.now() / 1000) - 60 //data atual
const nbf = iat
const exp = (iat+(365*24*60*60)) //adiciona 1 ano a data atual
//convert a number in epoch format to datetime format
var date = new Date(1546108200 * 1000);

//jti é um GUID que pode ser gerado com uma ferramenta qualquer
//sub = iss = GUID application ID = ClientID

console.log("iat", iat);

console.log("nbf", nbf);

console.log("exp", exp);