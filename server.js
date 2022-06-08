var express = require('express');
const cors = require('cors');
const https = require('https');
const ejs = require('ejs');
const localStorage = require("localStorage");
const fs = require('fs');
const axios = require('axios');
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
  localStorage.setItem("access_token", 'EaA4A61....kwraq4W1vZ1Al2fOFtJqPu4PvGpienaUT5rgMLda6FoV4yL0phM0HbZgZjTqFhC58Cern35ozyeDVlgU2qXQYzU1Xm1XS5DjCNS1rl8UojzDy6u01iKJfv4R52D31a+2cM7zrN9BOiMbbJ5UdnER2CdlLnPagdLKrnjnqghVHnymR9hi/sBF38Qyj9nybBANsS607yazwMAwgJagqcFWzowInLhF9fU+PfZY7PZtqOmRrQLJPm8GbRSQEYWN28SUbzBD8y1MH9STtqxRy/M+WFEubY..uklb3jB2avv2zzZi4p026w6ZOPGXYfW6yp3RT6wHzw8q90SCSVxCA/rhMq6SJlottVLPHC5mJdlmUMECle4qJ3PvJhFAQkrcTCLmrEf1isvKKZLubz3t4N1YIMPocLK0FeAl6Yxzg+bhbccVe3sfa4NhT6ZbetXfaDVNq/YHFQW198Ok5bHVh...OP4XnEXZx5zpSwI=');
  res.render('main', { hastoken: true });
});

app.get('/logoff', (req, res) => {
  localStorage.setItem("access_token", '');
  res.render('main', { hastoken: false });
});

app.get('/', function (req, res) {
  let hastoken = localStorage.getItem("access_token") ? true : false;
  res.render('main', { hastoken: hastoken });
});

app.get('/webapp', async function (req, res) {
  let result = '';
  if (res.req.query.code) {
    let authCode = res.req.query.code;
    result = await starter(authCode);
    localStorage.setItem("access_token", result.access_token);
  }
  res.render('main', { hastoken: true });
});

app.post('/code', (req, res) => {
  localStorage.setItem("codeVerifier", req.body.codeVerifier);
  res.render('main', { hastoken: false });
});

app.get('/listdrive', (req, res) => {
  let token = localStorage.getItem('access_token')
  var options = {
    hostname: 'graph.microsoft.com',
    port: 443,
    path: '/v1.0/me/drive/root:/Apps/most-common-words-list/1001-2000.zip:/content',
    method: 'GET',
    headers: {
      'Authorization': `bearer ${token}`
    }
  };
  let data = [];
  var req = https.request(options, (res) => {
    console.log('statusCode:', res.statusCode);
    res.on('data', (d) => {
      data.push(d);
    });
    res.on('end', () => {
      let b = Buffer.concat(data)
      fs.writeFile("./test.txt", b, "binary", function (err) { });
    });
  });

  req.on('error', (e) => {
    console.log(e);
  });

  req.write('');
  req.end();

  res.render('main', { hastoken: true });
});


async function starter(authCode) {
  let codeVerifier = localStorage.getItem('codeVerifier');
  let opt = {
    client_id: '411a3ba2-ee66-441d-a429-801c4e228d33',
    scope: 'https://graph.microsoft.com/.default offline_access',
    code: authCode,
    redirect_uri: 'http://localhost:3000/webapp',
    grant_type: 'authorization_code',
    code_verifier: codeVerifier,
    client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
    client_assertion: 'eyAhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsIng1dCI6IlVrRGUxUFNYTXhnSFBLUWNyWC1sSmNCZnd4TSJ9.eyJhdAQiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vY29uc3VtZXJzL29hdXRoMi92Mi4wL3Rva2VuIiwiZXhwIjoiMTY4NjIzODAzMiIsImlzcyI6IjQ4MWEzYmEyLWVlNjYtNDQxZC1hNDI5LTgwMWM0ZTIyOGQzMyIsImp0aSI6IjAwOWRhZjFkLWYyYzItNGM3Yy1hNjA1LTg0ODg2M2MxNjgwMSIsIm5iZiI6IjE2NTQ3MDIwMzIiLCJzdWIiOiI0ODFhM2JhMi1lZTY2LTQ0MWQtYTQyOS04MDFjNGUyMjhkMzMiLCJpYXQiOiIxNjU0NzAyMDMyIn0.l-w0Pq0E-GmhEIViDiS7FCiCd45XmF9QvKTCw7WOi9RDKVxucBnPocp1_5nSniVa02YN9yZ3UMbckRyAwU3JCPX3Y2CXTT13oqzSVeHVoe8-oXeu9TLflItYJIKgp5SoURxdW3vXIDGCYTSb7kNH1-zVreBXM9jzUoi1QPwJVnQfr1W3MqxK_4UKXaW0jaB4Fggjt1Xn2KNc0HQ3VRwVgCQ1k0xftp3krIYxko1gfStPVUkPJNfG2SBQfoCFdS6BUJUJ3DBE73h51Ry_3E_yjMnjL3-5iTH8Y5SuYabPy9BLL2EpQw2gk5ZqgHfZOcDP1bE7BMvzVHGEviH2e--XQS6N6ne0JBRP1xEG5Mkb35dxoJJzzYxdWC2CzeL3E5gD1W9Oq9pUIJ8OdnepmHQH1C8K-qpgS3h2Pj9k38Qq3taEpMk7VgQvEK5jdcgrY4XI6KN599Kh_TsoH6Br1abZJL4LM_3tS9YP-PIkHZP4N5BKVX0gfF0mt0fRTDnHtL2bxm0G_Cht9cc9aiA9XjFKJpgty4N_CBhQXes6zsavwoE16-ArDF19OLQxIZMkefC7yJMP5sFzKWMY7lNYlItc4l7NfaJ1GriWDBqc2vRdwmdbzXvnUDuC8IRzuHNz55eILic4-DYJkimR3PbJ__Q1AoLml7maBw0jNj8vMCag2qs',
  }
  let postData = new URLSearchParams(opt)
  return new Promise(function (resolve, reject) {
    var options = {
      hostname: 'login.microsoftonline.com',
      port: 443,
      path: '/consumers/oauth2/v2.0/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.toString().length
      }
    };
    let data = [];
    var req = https.request(options, (res) => {
      console.log('statusCode:', res.statusCode);
      res.on('data', (d) => {
        data.push(d);
      });
      res.on('end', () => {
        console.log('end:',data);
        resolve(JSON.parse(Buffer.concat(data).toString()));
      });
    });
    req.on('error', (e) => {
      reject(e);
    });
    req.write(postData.toString());
    req.end();
  });
}

const httpsGetBody = (url,token,type) => {
  return new Promise((resolve, reject) => {
    https.get(url,{headers:{'Authorization':`Bearer ${token}`}}, res => {
      if(type=='text')res.setEncoding('utf8');
      const body = [];
      res.on('data', chunk => body.push(chunk));
      res.on('end', () => {
        if(type=='text')
          resolve(body.join(''))
        else if(type=='binary')
          resolve(Buffer.concat(body))
        else if(type=='json')
          resolve(JSON.parse(body.join('')))
      });
    }).on('error', reject);
  });
};

const httpsGetResp = (url,token) => {
  return new Promise((resolve, reject) => {
    https.get(url,{headers:{'Authorization':`Bearer ${token}`}}, res => {
      resolve(res);
    }).on('error', reject);
  });
};

app.get('/download', async (req, res) => {
  let token = localStorage.getItem('access_token')
  try{
    let url = `https://graph.microsoft.com/v1.0/me/drive/root:/Apps/most-common-words-list/1001-2000.zip:/content`
    let resp = await httpsGetResp(url,token);
    let respUrl = resp.headers['location'];
    //let body = await httpsGet('https://api.onedrive.com/v1.0/drive/special/approot:/1001-2000.zip',token,'json');
    //let respUrl = body["@content.downloadUrl"]
    //let name = body["name"]
    let name = '1001-2000.zip'
    let buffer = await httpsGetBody(respUrl,token,'binary');
    fs.writeFile(`./${name}`, buffer, "binary", function (err) { });
  } catch(err){
    console.log('erro',err);
  }
  res.render('main', { hastoken: true });
});

app.listen(3000);
