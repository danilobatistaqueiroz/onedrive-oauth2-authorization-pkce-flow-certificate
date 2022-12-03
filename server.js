var express = require('express');
const cors = require('cors');
const https = require('https');
const localStorage = require("localStorage");
const fs = require('fs');
const bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.set('view engine', 'ejs')
app.use(express.static('dist'));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
  app.use(cors());
  next();
});

app.get('/set', (req, res) => {
  localStorage.setItem("access_token", 'EwB4A8l6BAAUkj1NuJYtTVha+Mogk+HEiPbQo04AAVN/E1w0ed6bdJvvo70r2ZlSP3zGsvXpMlJJQMxDZpvzMsVQuqcuV0X2vsVAzVFcQbBxflxyrxfqSpE7oTbHHiGgxr+J+QQ9ZdUPkRF+mlyaKe8fKmJo8W7LNFt5FpHamP2a01n2fLtWPsoRLgUDl6jiO2iGfvm0iH/S/CKjrLDXw9KlC4+gHLjEgJfofm7rEKoNxw2FczA/LXKZtF3fFHWeVsFw52lV4hoh+3pGjD+ywCERcQRpH9I4mKtzy0D91BSfLL0nvmnf2InRZyTyr3CQTHuDp+0qG442BPTRCv/XYqXYWxABwQ6X13OZkWHNjeYahE30+HoPxLhxXjE69pEDZgAACA3/3juhq7KESAK9zUBWbgKuGct0oL6MectM1J8oHsYytLK2bx5mqgcoxsh2MJllt2UihqFhQhk09ol2x+tDqGcHeZcgGjH7ZGBQQfvhIPz7Ur1BTKlumlrL8l3N1WEpv0Vp9VmAV7tRyiOkI1+rsQtDg/ECT5VxVfVqfmoFwCSggfv6H1p8JnfGM9sfCnbRxyYMr9SDYXPyO9GeuTfLsoe3Sy2lxTTWjFyjXg/9lLjNdGye2neICD3DJVKqlk72Mxq7tNmEZ+e85eG9hGBj8QftpE32QuRJF+i7ErKg3ii8KxsQY7crVc6Ci2scP6B6MZ2qCBvVEQftg91VEBCKTG/EGNfJEEvXO6feB2D+875A3zRi+lUwJP2CTu2dYiABNlS36t14pVFonpub5onHBeTn/OEj0CtyLNTUrqSP68llh7Xtv31A26qbg5c0OY/GE2+x3c0OE0tvCvrOu5T2wFdefraS7StGRyiO69eVLdPNXav6lSWLTch2z3wNzmE/F/L2U1GnEE9p2zeBDHkQImz2P56u9NHVNh+lODSiOV4SbClNAXsqaWMVZ3LRZsfKErkLZQVN6C2TEbcclHHhcnJLxW2WWlyGeOpZDLMHb9eA/naHntPq/iPjaY0a21CfGbQkCuyiktITQvcBLq97IcF+2uT7Ams9tpz+DflQdORsHwS2jHZoqGRHl0Bb0y2O2qrPN+ppN6pxpc5NPpzZuSmRgMKul17FL51oMdFp7kVUSKuCaakkih4pfxOEQOnTQbn1g/UeW2JExPeWOG3De//5rpcC');
  res.render('main', { authCode: '', hastoken: true });
});

app.get('/logoff', (req, res) => {
  localStorage.setItem("access_token", '');
  res.render('main', { authCode: '', hastoken: false });
});

app.get('/', function (req, res) {
  let hastoken = localStorage.getItem("access_token") ? true : false;
  res.render('main', { authCode: '', hastoken: hastoken });
});

app.get('/webapp', async function (req, res) {
  if (res.req.query.code) {
    let authCode = res.req.query.code;
    res.render('main', { authCode: authCode });
  } else {
    res.render('main', { authCode: '' });
  }
});

app.post('/code', (req, res) => {
  localStorage.setItem("codeVerifier", req.body.codeVerifier);
  res.render('main', { authCode: '', hastoken: false });
});

app.get('/listdrives', (req, res) => {
  let token = localStorage.getItem('access_token')
  var options = {
    hostname: 'graph.microsoft.com',
    port: 443,
    path: '/v1.0/me/drives',
    method: 'GET',
    headers: {
      'Authorization': `bearer ${token}`
    }
  };
  let data = [];
  var req = https.request(options, (res) => {
    res.on('data', (d) => {
      data.push(d);
    });
    res.on('end', () => {
      let b = Buffer.concat(data)
      fs.writeFile("./tests.json", b, "binary", function (err) { });
    });
  });

  req.on('error', (e) => {
    console.err(e);
  });

  req.write('');
  req.end();

  res.render('main', { authCode: '', hastoken: true });
});

app.get('/listdrive', (req, res) => {
  let token = localStorage.getItem('access_token')
  var options = {
    hostname: 'graph.microsoft.com',
    port: 443,
    path: '/v1.0/me/drives/8d708a9b80ebb4b7/root/children/1-1000.zip',
    method: 'GET',
    headers: {
      'Authorization': `bearer ${token}`
    }
  };
  let data = [];
  var req = https.request(options, (res) => {
    res.on('data', (d) => {
      data.push(d);
    });
    res.on('end', () => {
      let b = Buffer.concat(data)
      fs.writeFile("./test.txt", b, "binary", function (err) { });
    });
  });

  req.on('error', (e) => {
    console.err(e);
  });

  req.write('');
  req.end();

  res.render('main', { authCode: '', hastoken: true });
});



app.listen(3000);
