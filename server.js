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

app.listen(3000);
