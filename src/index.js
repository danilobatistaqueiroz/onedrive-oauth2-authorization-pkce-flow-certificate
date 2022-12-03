import * as jsZip from 'jszip';
import localforage from 'localforage';
const { Howl, Howler } = require('howler');
import {authorize, getToken} from './authorization.js';

//## https://blog.ropnop.com/storing-tokens-in-browser/ ##//

function logoff(){
  window.document.location.reload();
}

async function play() {
  let arrayBufferView = new Uint8Array(await localforage.getItem('1-1000/thesaurus/1-1000-thesaurus-tough.mp3')).buffer;
  let blob2 = new Blob( [ arrayBufferView ], { type: 'music/mp3' } )
  let howlSource = URL.createObjectURL(blob2)
  const sound = new Howl({
    src: [howlSource],
    preload: true,
    format: ['ogg'],
    onloaderror: (id, msg) => console.error(id, msg),
    onplayerror: (id, msg) => console.error(id, msg),
    onend: () => { console.log('played'); }
  });
  sound.play();
}

async function downloader(data){
  jsZip.loadAsync(data).then((zip) => {
    const numberOfCallbacks = Object.keys(zip.files).length - 1;
    let counter = 0;
    let o='arraybuffer';
    let lstFiles = [];
    zip.forEach(function (relativePath, zipEntry) {
      zip.files[zipEntry.name].async(o).then((data)=>{
        localforage.setItem(zipEntry.name,data);
        lstFiles.push(zipEntry.name);
        counter++;
        if (counter === numberOfCallbacks) {
          localforage.setItem("/1-1000.zip",lstFiles.filter(f => f.indexOf('.mp3')>0).join(','));
        }
      });
    });
  });
}

async function download() {
  localforage.getItem('token').then(t => console.log(t));
  var oReq = new XMLHttpRequest();
  oReq.open("GET", "https://graph.microsoft.com/v1.0/me/drives/8d708a9b80ebb4b7/root/children/1-1000.zip/content", true);
  let token = await localforage.getItem('token');
  oReq.setRequestHeader('Authorization',`Bearer ${token}`);
  oReq.responseType = "arraybuffer";
  oReq.onload = function(oEvent) {
    var arrayBuffer = oReq.response;
    var blob = new Blob([arrayBuffer], {type: "application/zip"});
    downloader(blob);
  };
  oReq.send();
}

function listDrive() {
  window.location.href="http://localhost:3000/listdrive"
}


window.listDrive = listDrive
window.logoff = logoff
window.download = download
window.play = play
window.authorize = authorize
window.localforage = localforage
window.getToken = getToken