import pkceChallenge from 'pkce-challenge'

function sha256(plain) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest("SHA-256", data);
}
function base64urlencode(a) {
  var str = "";
  var bytes = new Uint8Array(a);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    str += String.fromCharCode(bytes[i]);
  }
  return btoa(str)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}
async function generateCodeChallengeFromVerifier(v) {
  var hashed = await sha256(v);
  var base64encoded = base64urlencode(hashed);
  return base64encoded;
}
function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}
function dec2hex(dec) {
  return ("0" + dec.toString(16)).substr(-2);
}
function generateCodeVerifier() {
  var array = new Uint32Array(56 / 2);
  window.crypto.getRandomValues(array);
  return Array.from(array, dec2hex).join("");
}

async function load() {
  //let codeVerifier = generateCodeVerifier();
  //let codeChallenge = await generateCodeChallengeFromVerifier(codeVerifier);
  let challenge = pkceChallenge();
  localStorage.setItem('codeVerifier',challenge.code_verifier);
  localStorage.setItem('codeChallenge',challenge.code_challenge);
  $.post('http://localhost:3000/code', {codeVerifier:challenge.code_verifier},(data=>console.log(data)),'json');
  let opt = {
    client_id: '481a3ba2-ee66-441d-a429-801c4e228d33',
    response_type: 'code',
    code_challenge: challenge.code_challenge,
    code_challenge_method: 'S256',
    scope: 'onedrive.appfolder',
    redirect_uri: 'http://localhost:3000/webapp',
    state: '123'
  }
  let query = new URLSearchParams(opt)
  return `https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize?${query}`
  //return `https://login.live.com/oauth20_authorize.srf?${query}`
}

export {load}