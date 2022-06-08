import * as jsZip from 'jszip';
import localforage from 'localforage';
const { Howl, Howler } = require('howler');
import {load} from './authorization.js';

//## https://blog.ropnop.com/storing-tokens-in-browser/ ##//

async function authorize(){
  console.log('authorize');
  let url = await load();
  window.location.href = url;
}

function logoff(){
  localStorage.removeItem('token');
  window.document.location.reload();
}

let selfs = this

async function downloader(res,self){
  jsZip.loadAsync(res.responseText).then((zip) => {
    const numberOfCallbacks = Object.keys(zip.files).length - 1;
    let counter = 0;
    let o='arraybuffer';
    zip.forEach(function (relativePath, zipEntry) {
      zip.files[zipEntry.name].async(o).then((data)=>{
        localforage.set(zipEntry.name,data);
        self.lstFiles.push(zipEntry.name);
        counter++;
        if (counter === numberOfCallbacks) {
          localforage.set("/1-1000.zip",self.lstFiles.filter(f => f.indexOf('.mp3')>0).join(','));
        }
      });
    });
  });
}

function download() {
  window.location.href="/download"
}
function fndownload(data){
  downloader(data,selfs);
}

function listDrive() {
  console.log('href');
  window.location.href="http://localhost:3000/listdrive"
}

window.listDrive = listDrive
window.logoff = logoff
window.download = download
window.authorize = authorize
window.localforage = localforage