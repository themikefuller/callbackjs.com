'use strict';

const starbase = Starbase();

const database = starbase.Database('app');
const db = starbase.Channels(database);

const serverURL = "https://us-central1-mike-project-9000.cloudfunctions.net/";
const auth = starbase.Auth(starbase.Client(serverURL + "auth"), db);
const admin = starbase.Admin(starbase.Client(serverURL + "admin"), auth);
const profiles = starbase.Profiles(starbase.Client(serverURL + "profiles"), auth);

const topics = starbase.Topics();
auth.onStateChange(state=>{
  topics.to('auth', state);
});

const showUpdateButton = () => {
  if (!document.getElementById('updateButton')) {
    let updateButton = document.createElement('button');
    updateButton.id = "updateButton";
    updateButton.style.zIndex = 10;
    updateButton.append("Update App Now");
    const container = document.createElement('div');
    container.style.zIndex = 10;
    container.appendChild(updateButton);
    document.getElementById('app').prepend(container);
    updateButton.onclick = (e) => {location.reload()};
  }
};

navigator.serviceWorker.addEventListener('message', event => {
  if (event.data.msg && event.data.msg === 'refresh') {
    if (event.data && event.data.url && location.href === event.data.url) {
      showUpdateButton();
    }
  }
});

navigator.serviceWorker.getRegistration().then(reg=>{
  if (reg) {
    reg.addEventListener('updatefound', ()=>{
      showUpdateButton();
    });
  }
});

window.addEventListener('beforeinstallprompt', function (e) {

  let installButton = document.createElement('a');
  installButton.href = "";
  installButton.innerText = "Install";
  if (document.querySelector('nav .navMenu')) {
    document.querySelector('nav .navMenu').appendChild(installButton);
  }

  let install = async (cb) => {
    e.prompt();
    e.userChoice.then(result => {
      if (cb && typeof cb === 'function') {
        cb(result);
      }
    });
  };

  installButton.onclick = async (e) => {
    e.preventDefault();
    await install().then(result=>{
      installButton.remove();
    });
  };

});

const Menu = () => {
  let x = document.getElementById("navMenu");
  if (x.className === "navMenu") {
    x.className += " responsive";
  } else {
    x.className = "navMenu";
  }
};

console.log('ready');
