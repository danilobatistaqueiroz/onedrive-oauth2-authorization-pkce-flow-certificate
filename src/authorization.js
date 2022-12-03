import pkceChallenge from 'pkce-challenge'
import axios from 'axios';

async function authorize() {
  let challenge = pkceChallenge();
  localforage.setItem('codeVerifier',challenge.code_verifier);
  localforage.setItem('codeChallenge',challenge.code_challenge);
  $.post('http://localhost:3000/code', {codeVerifier:challenge.code_verifier},(data=>console.log(data)),'json');
  let opt = {
    client_id: '5ca13223-4cf7-4bf3-9ba9-a8b7fe9ccdd6',
    response_type: 'code',
    code_challenge: challenge.code_challenge,
    code_challenge_method: 'S256',
    scope: 'Files.Read Files.ReadWrite Files.ReadWrite.All Files.ReadWrite.AppFolder',
    redirect_uri: 'http://localhost:3000/webapp',
    state: '123'
  }
  let query = new URLSearchParams(opt)
  window.location.href = `https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize?${query}`;
}

async function getToken(authCode) {
  let codeVerifier = await localforage.getItem('codeVerifier');
  let opt = {
    client_id: '5ca13223-4cf7-4bf3-9ba9-a8b7fe9ccdd6',
    scope: 'Files.Read Files.ReadWrite Files.ReadWrite.All Files.ReadWrite.AppFolder',
    code: authCode,
    redirect_uri: 'http://localhost:3000/webapp',
    grant_type: 'authorization_code',
    code_verifier: codeVerifier,
    client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
  }
  let postData = new URLSearchParams(opt)
  return new Promise(function (resolve, reject) {

    let headers = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    axios.post("https://login.microsoftonline.com/consumers/oauth2/v2.0/token",postData,headers).then(d => {
      resolve(d.data);
    })

  });
}

export {authorize, getToken}