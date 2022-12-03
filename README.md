# RUNNING THE APPLICATION

`npx webpack --watch`  

`nodemon server.js`  



# A nodejs server accessing Onedrive via Oauth2 using authorization flow - pkce with certificate


Nodejs using ejs, server side localstorage, rest end points



```javascript
const iat = Math.floor(Date.now() / 1000) - 60 //data atual
const nbf = iat
const exp = (iat+(365*24*60*60)) //adiciona 1 ano a data atual
//convert a number in epoch format to datetime format
var date = new Date(1546108200 * 1000);
//jti = é um GUID que pode ser gerado com uma ferramenta qualquer
//sub = iss = GUID application ID = ClientID
```

x5t = Base64url-encoded SHA-1 thumbprint 

```javascript
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

//openssl x509 -fingerprint -in certificate.pem -noout
//remover os :
let x5t = safeBase64EncodedThumbprint('53D70393B1FC09059808473458C9E28585B71F8D')
```

```json
{
  "alg": "RS256",
  "typ": "JWT",
  "x5t": "Kje1tFr-iSBLd6Mw55t1-7zQa0w"
}

  //"aud": "https://login.microsoftonline.com/consumers/V2.0/token",
{
  //"aud": "https://login.microsoftonline.com/consumers/oauth2/v2.0/token",
  "aud": "https://login.microsoftonline.com/f8cdef31-a31e-4b4a-93e4-5f571e91255a/oauth2/v2.0/token",
  "exp": "1686238032",
  "iss": "181a3ba2-ee66-441d-a429-801c4e228d33",
  "jti": "009daf1d-f2c2-4c7c-a605-848863c16801",
  "nbf": "1654702032",
  "sub": "181a3ba2-ee66-441d-a429-801c4e228d33",
  "iat": "1654702032"
}
```

```bsh
//gera um encrypted private key
openssl genrsa -des3 -passout pass:x -out keypair.key 2048

//gera um private key
openssl rsa -passin pass:x -in keypair.key -out ./private.key

//gera o certificado
openssl req -newkey rsa:4096  -x509  -sha512  -days 365 -nodes -out certificate.pem -keyout privatekey.pem

//imprimir a public key
openssl x509 -pubkey -noout -in certificate.pem

//convert a private key to an RSA private key?
openssl rsa -in privatekey.pem -out rsa_private.key

//if you have a PKCS1 key and want PKCS8:
openssl pkcs8 -topk8 -nocrypt -in privkey.pem

//Generate a Base64-Encoded SHA256 Hash of SubjectPublicKeyInfo of an X.509 Certificate
openssl x509 -in certificate.pem -pubkey -noout | openssl pkey -pubin -outform der | openssl dgst -sha256 -binary | openssl enc -base64

//convert pem to der format:
openssl x509 -outform der -in certificate.pem -out certificate.der
```

tenant:
hover the mouse cursor over the name in the top right side

client id:
portal.azure.com -> home -> <<application>> -> Overview


client secret:

secret id:


https://developer.pingidentity.com/en/tools/jwt-encoder.html
https://jwt.io/
https://currentmillis.com/
https://www.uuidgenerator.net/
https://www.base64url.com/
https://www.samltool.com/fingerprint.php
https://datatracker.ietf.org/doc/html/rfc7519#section-4.1.5


https://docs.microsoft.com/en-us/azure/active-directory/develop/scenario-spa-app-registration#redirect-uri-msaljs-20-with-auth-code-flow
https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow
https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-client-creds-grant-flow
https://dzone.com/articles/getting-access-token-for-microsoft-graph-using-oau
https://docs.microsoft.com/en-us/onedrive/developer/rest-api/getting-started/graph-oauth?view=odsp-graph-online
https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-certificate-credentials#assertion-format
https://docs.microsoft.com/en-us/onedrive/developer/rest-api/concepts/special-folders-appfolder?view=odsp-graph-online
https://docs.microsoft.com/en-us/azure/active-directory/develop/reply-url

https://stackoverflow.com/questions/52839055/enabling-cors-on-azure-active-directory
https://stackoverflow.com/questions/53526121/use-a-tenant-specific-endpoint-or-configure-the-application-to-be-multi-tenant
https://stackoverflow.com/questions/68275394/microsoft-graph-how-to-get-access-token-with-certificate-in-client-credentials


converte o certificado em DER e tira print do SHA-1 fingerprint do certificado:
`openssl x509 -in certificate.pem -outform DER | sha1sum`

imprime o sha1 fingerprint:
`openssl x509 -fingerprint -in certificate.pem -noout`
example sha1 fingerprint:
52:40:DE:D4:F4:97:13:18:07:3C:A4:1C:AD:7F:A5:25:C0:5F:C3:13


example sha1 fingerprint base64:
NTI0MARlZDRmNDk3MzMxODA3M2NhNDFjYWQ3ZmE1MjVjMDVmYzMxMw==

example thumbprint sha1 certificate:
5240ded4f4971318073ca41cad7fa525c05fc313

example thumbprint base64 encode:
NTI0MARlZARmNDk3MzMxODA3M2NhNDFjYWQ3ZmE1MjVjMDVmYzMxMw==

`https://base64.guru/standards/base64url/encode`
example thumbprint base64url encoded:
NTI0MGRlZDAmNDk3MzMxODA3M2NhNDFjYWQ3ZmE1MjVjMDVmYzMxMw



# Para verificar se está usando a Private Key correta

Run the following command to view the modulus of the certificate.  
`openssl x509 -noout -modulus -in server.crt | openssl md5`  
Now you will receive the modulus something like a77c7953ea5283056a0c9ad75b274b96  

Run the following command to view the modulus of the private key.  
`openssl rsa -noout -modulus -in myserver.key | openssl md5`  
Now you should get the modulus as same as certificate modulus above. i.e a77c7953ea5283056a0c9ad75b274b96  

If the modulus of the certificate and the modulus of the private key do not match, then you're not using the right private key.  
You can either create a brand new key and CSR and send contact support or do a search for all private keys on the system and compare their modulus.  
