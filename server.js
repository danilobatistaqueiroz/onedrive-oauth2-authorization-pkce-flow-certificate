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
  console.log('/set')
  localStorage.setItem("access_token", 'EwCAA8l6BAAUkj1NuJYtTVha+Mogk+HEiPbQo04AASl9Zznewsuilydi6ffMFSJ1qFbzrxobgH4eP4GnuqQdS3mnGOlTduUwynOESLs4j5BeY1fqvGntLaduWgzOOGENtqthAShfq73z/4sVnRquNVOO4zRmRBI+cYwuw9GFDx2O4sW3OYjlRTVe/YkYRPFRUklQDB8szJkp051o0i/38OMH3t1yvpzjNZw9Z4S2xjinh4/KATLa8e+SZ2CyWPwZYxxyksyqAhHLM/CiKQhfesbnHtJBEX6VccxAbCEkvWEMzOTFxAN2vpiZ1VLt8qF8oiMj8QzhLGoVK6pCNwtRmk865jlE3JcUBvpTsHxlZ/TJrFduiX4YXyr738YFNRoDZgAACLDQ5BSQ1ryNUAKAv9h5xxrd1+JrO3s7lrtR+ClkUQeWrZJYa4/kAGD8Y4o+qrjFdAbCDP2OUGzsLkgbXMunLk5DFw5Xto7fv7CCaLaEJN689+hkNXtiWW5jazU11gdh+6fLK6fTHXrpLM6R+XWypVwBtyzevr+jeK4HAeyjEkl+M2i4jf+VXcWcmCyUdUuVGQGVk2alVwsiPsOGxvCEmVfvR1JnbZgqSfv0XDSwtkCTmOjH00nXzHoti6EhC3py8vvkoTh9mwaPRsgvxT60EigsXY6sjixVifzWFhAhvQHUuG9PhvKxjN3eysuDveh6ncbHQutYbk38/D1QUUxJu4D0HDCi2Te/jofureLKHWeCPL1YqnEVtjUIxX+aCBSnuZYRKpbh7QVqENIAISaT5Xgp8VW0kYPnOjen1rHQ5YHsZ3cODuaKUP5reFiIdETj6TQtto1qfQAqS9KUT1NipoWE8hESAZqVIILLI7X0Jmft/JuQaEQ5cB9QW9XjrFz+tAoJdZWhr6uAXAluD7lJsc53ReLhv4OcflyMHdZ7MlQdQX1nSpmjAt12qSVJsCj0j7v+qD9VB3o81E2FsJos2E2SEHQuMTYRscza2qArhEdXhvS8rpvXW+W8cRnTckYvwhz3IADPY6BOUBwlcDNZspA3+dRuNLEMSU/vj5pU1TGnBVV6kU5XIhRtaVtydhk37xIzAlmf1im/2vTS22qObbbjSHa74si731KwOkCc3U32coKIfxX/Fk8QyaLqlspXQ0cLbJDQydWRsoaAX4Sm9C/WJBDs6JHQT7kflwI=');
  res.render('main', { hastoken: true });
});

app.get('/logoff', (req, res) => {
  console.log('/logoff')
  localStorage.setItem("access_token", '');
  res.render('main', { hastoken: false });
});

app.get('/', function (req, res) {
  console.log('/')
  let hastoken = localStorage.getItem("access_token") ? true : false;
  res.render('main', { hastoken: hastoken });
});

app.get('/webapp', async function (req, res) {
  console.log('/webapp')
  let result = '';
  if (res.req.query.code) {
    let authCode = res.req.query.code;
    console.log('authCode:'+authCode)
    result = await starter(authCode);
    console.log('result', result)
    localStorage.setItem('access_token', result.access_token);
    localStorage.setItem("hastoken", result.hastoken);
    res.render('main', { hastoken: true });
  } else {
    res.render('main', { hastoken: false });
  }
});

app.post('/code', (req, res) => {
  console.log('/code')
  localStorage.setItem("codeVerifier", req.body.codeVerifier);
  res.render('main', { hastoken: false });
});

app.get('/listdrives', (req, res) => {
  console.log('/listdrives')
  let token = localStorage.getItem('access_token')
  console.log('token:'+token)
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
    console.log('statusCode:', res.statusCode);
    res.on('data', (d) => {
      data.push(d);
    });
    res.on('end', () => {
      let b = Buffer.concat(data)
      fs.writeFile("./tests.txt", b, "binary", function (err) { });
    });
  });

  req.on('error', (e) => {
    console.log(e);
  });

  req.write('');
  req.end();

  res.render('main', { hastoken: true });
});

app.get('/listdrive', (req, res) => {
  console.log('/listdrive')
  let token = localStorage.getItem('access_token')
  //let token = 'EwB4A8l6BAAUkj1NuJYtTVha+Mogk+HEiPbQo04AATmodh+fnAgwV8krtvjZiHn8HQOvdXs1WhlGbpjmSeIk0UvlX3v0ENTqdN+H3zYGMkpZ48VDXcszNPt20Jmvv0eOcp93Q8axpvjXM7uLtLqr9DRlhguHtS/fg/S0Be5+ZmRQdXBZ2+y2aLL3MjYUjPcOim8P00K2qg8tYJDLLHzBfMoDXND756vSY5mDGwGY0gJVc/gXITGa6DNkA77Ppt4L7unx7HS8alLWJTSUjpEMSfGePbR6Xrk7kgWr5EKGoHySmn7fkbjCaDleaPhYCGYSfmy3/P4H75hUHqn9JAovbG4X8jdPQGoauIUyRN1gazzrEL8Ote5H/n2UoxsAmVcDZgAACP0c5oH0ui+5SALyr7XxEN+b3N4xzTFrwLc+J0kRKz1qTORvwk3G14PQJkS8fp8naLzNJ/TykAAPfyvMPDws5wp02u8bCIarRMppWOAePTtuzKbq6vRvMjSXg+nO0nX8/7bKYPL6qvy9uX38LkXpX9JzYDHJmavyfF7h/yVHHqteQSV5drLE/E/4GD7gtCAQIb/ZTBRdRv5grw8GyO0iwTX/hA3qQ3qX4Xtvqdp2UCJ3JWo3FzzXwt+7+PAsG7oRrf6UBPg7RmzNGMpAuzkVAfm5OtzL6gfBsHeDVPyY8d7WE/u3PbykOt3cdWrHsr91hk1+w7zPVSiR9jfgJ1kV9z20Snvbuo7Rr6idhrKTkuIHCsagMlLbQ5nr5jmfKMGOxIFFs7oDJXzWnDvDeXzQEiA5QRL7EQjlH/zxI2xGV74/EFa+W7PX1tHWdvmYIUPkY6nyrao0j71K0ahLYs16QKq98P5XqYX9Z27Y27igVQGZxm/FCxHv3LeLDCNFlMJJgcx+LRC0kfk661ll2g9Empr2R9ugiwwsN0vsSU/9qXuDSbxkd9v+UZArTCVyrMbh+eNNUXKuNj7SzaQzstYMrtPeg+tOKV7q9riSihRyEOvZVxy7lBEhWv2C9KElMthjNIy7xkFb+LONrF3Y14IyGhm9lk74G81pVYmusMkN/Q5BHSJ9pCJ9ntMKa+YWGZJAbZA5h/bxx1Wad97CZ5AVgn3mIWTny9Mz0zDlIUfkErBtyJKK73Xw55NGFCwBc1j+bTnLnyUjqJEvN5aI1eb9MjgbvJcC'
  console.log('token:'+token)
  var options = {
    hostname: 'graph.microsoft.com',
    port: 443,
    //path: '/v1.0/me/drives/8d708a9b80ebb4b7/root/children',
    path: '/v1.0/me/drives/8d708a9b80ebb4b7/root/children/1-1000.zip',
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
  console.log('starter')
  let codeVerifier = localStorage.getItem('codeVerifier');
  let opt = {
    client_id: '5ca13223-4cf7-4bf3-9ba9-a8b7fe9ccdd6',
    scope: 'Files.Read Files.ReadWrite Files.ReadWrite.All Files.ReadWrite.AppFolder',
    code: authCode,
    redirect_uri: 'http://localhost:3000/webapp',
    grant_type: 'authorization_code',
    code_verifier: codeVerifier,
    client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
    //client_assertion: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsIng1dCI6IlU5Y0RrN0g4Q1FXWUNFYzBXTW5paFlXM0g0MCJ9.eyJpYXQiOjE2Njk5MjgyNjgsImV4cCI6MTcwMTQ2NDI2OCwiYXVkIjoiaHR0cHM6Ly9sb2dpbi5taWNyb3NvZnRvbmxpbmUuY29tL2NvbnN1bWVycy9vYXV0aDIvdjIuMC90b2tlbiIsImlzcyI6IjVjYTEzMjIzLTRjZjctNGJmMy05YmE5LWE4YjdmZTljY2RkNiIsImp0aSI6IjIyYjNiYjI2LWUwNDYtNDJkZi05Yzk2LTY1ZGJkNzJjMWM4MSIsIm5iZiI6MTY2OTkyODI2OCwic3ViIjoiNWNhMTMyMjMtNGNmNy00YmYzLTliYTktYThiN2ZlOWNjZGQ2In0.Sf_iIpoLv7fqRcywghJRa7nO11yq6pr2SAl807cGZr0BCKzQQ9gidZhRVAu95jRd9F9a64WUtpIBknSO7wR-I_70J38lZkssNmTl2H-DMk0KZ-fPYUjjkEJEKHUKQNND4qluT-rOd3j4UCkPXJ6fYMHfgR5Dmu0cB4kVHnz7kUPe3nrg9xEPKDKUxWcxtunYUFgh8ef0qFHFrVJvilZyIat10aKuuN9MfKpiSPkRBRBStaERx5NVQIqYjRUkhYdjGnA3qYR_x_txuNpbZCnynolyNO-sECNVZ7gQ9kNWj5YZRYm8ft4r6bKYQ0VvKKgBJgPIJvsxLZJ0Sbtq2y3g6sHKUJq_hr1LFR6D8rMBXpTBFbCgSNjzeFusEDkQYARNv6J8o0ioME493wZCWPTPARSYCIUfYNeL5BiNQh5UmZgvKpl0dDOh4bzrWcnFSFKa8-WtQOVxcuKyPNe9RmTL-Id6KbiS252M31HJHvh4CrBvZbRzZTkFEr3XNC0mIeCcrpIr22u40BBGGHalNoyNi_tQjV87ASt_UfawIz3tdiufM3qlHq4LNsJciTF0vz9WIutGxx57j-etUvK9dHM3ApOUWXNELJLb-5M_GUkMNOjvkcJHQ1Hx32jEXe4iW5e4V7i49aXTN_saxZ23rI0frj7xBU24UTL8u6GiV0wk3z0',
  }
  let postData = new URLSearchParams(opt)
  console.log('opt', opt);
  return new Promise(function (resolve, reject) {
    var options = {
      hostname: 'login.microsoftonline.com',
      port: 443,
      path: '/consumers/oauth2/v2.0/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.toString().length,
        'Origin': 'http://localhost'
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
        console.log('##################');
        console.log('json data', JSON.parse(Buffer.concat(data).toString()));
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
    console.log('url',url);
    https.get(url,{headers:{'Authorization':`Bearer ${token}`}}, res => {
      resolve(res);
    }).on('error', reject);
  });
};

app.get('/download', async (req, res) => {
  console.log('/download')
  let token = localStorage.getItem('access_token')
  //let token = 'EwBwA8l6BAAUkj1NuJYtTVha+Mogk+HEiPbQo04AAX32s6IUbwBPOmsImjZf7O6WxPrtTHrSK6Js3w4RLYsVQKfgRBo/IxRRvu+KtPw3Q7OsK7UlGWzhuyFPMlS7VlRs0f6MuBIoNr/GF/IMgXCtmyAcEFGYPW1aavSbAlZYuM7U+laMdDw+17JjrNTc0z5XgruG+BO2d1uLAUlRI8J7z2DlsbNojRhpwhf4l+2bd4xf9P6SR5jqaTgTGXO6d+LMv39e42bqRs1vZtVSfZwMm7h2WlTVSequx6eGbtcAaQjHVtQ1EGE8u4HMjwqweYFhJY2B4mU0znnXJFftSSi4+eY5HAR6Ux3oQDxo9V2yH0GlsZqzwoxJSsSJ0hgNNUYDZgAACHUbKa3oiqlNQALFxQgzPwlgqxC+Q0uMhJwR41DA/37Hx7ZhgwyEiqa5dUtUcc+bAAB9z6L6WHwn1bS6wECWVJArEkGjtA3BBOo9dJgYM8XhSPA240rHfbdeZIuyGiOnYONcF8TYXue1zslMsgafFTKqj+/ZsTNRNzaTULYjO+/5K4o40o5IIBmjmvFCL678STCeOfzKE3CGBPHcnBijSIesiKVsi2lGdalKQJZoOtswhLnL41q0T5KsshqScCWEx0eYi1AdxMQGAgMfPpN+8XErZRTrxm6EDKvjR1lDu2LVVJUFeM7V8wzWcb/uC2LKGA5qnGldp6LJAROzPNiymbR/YwgNaIS8NjEMAUyaC/x/ccQd/a7kJwxZ2ga71nn8TxU+STl/BrRkh+U7H3myJOAeuBkWCoFxT9fUIDzC+GesZ8eltXtCRApBUdVL/aXAv6bS7pxjOoUqKJk69tckC9LEJ5Oz+0dVNo48o7NroGk9jX9kgJgFzTDCPdpekG2a2yAruBMTcZcUBZQo1yrU0xTITh/bsD9YWwYy7eT0lemumuVGtB7882s0Rbj+Bnzdo3WkyVYaouFQvjPGqCaur4EoZ97C6N8RKMpLJGxoONMWJvyw73Bu0oS+PXGkEDH1TPF9mrjGO3e6lz+s6h0lH5LkFgP6pLb0v1z83Eg9brevJV6sowj8onNN2bN6OG9rWEXgfcRbf6ylrLVmYrQAuOldUjDLR9L15AvMokpHctlvWlRGfWKRogUCadvcAVUl15soBZr/dnC/lsuLAg=='
  console.log('token:'+token)
  try{
    //let url = `https://graph.microsoft.com/v1.0/me/drive/root/children/1-100.zip`
    let url = 'https://graph.microsoft.com/v1.0/me/drives/8d708a9b80ebb4b7/root/children/1-1000.zip/content'
    //let url = `https://graph.microsoft.com/v1.0/me/drive/root:/Apps/most-common-words-list/1-100.zip:/content`
    //let url = 'https://api.onedrive.com/v1.0/drive/special/approot:/1-100.zip'
    let resp = await httpsGetResp(url,token);
    console.log(resp)
    let respUrl = resp.headers['location'];
    console.log('response url', respUrl)
    //let body = await httpsGet('https://api.onedrive.com/v1.0/drive/special/approot:/1-100.zip',token,'json');
    //let respUrl = body["@content.downloadUrl"]
    //let name = body["name"]
    let name = '1-100.zip'
    let buffer = await httpsGetBody(respUrl,token,'binary');
    fs.writeFile(`./${name}`, buffer, "binary", function (err) { });
  } catch(err){
    console.log('erro',err);
  }
  res.render('main', { hastoken: true });
});

app.listen(3000);
