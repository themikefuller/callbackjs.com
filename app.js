'use strict';

const starbase = Starbase();

const cryptic = starbase.Cryptic();
const encryption = starbase.Encryption(cryptic);
const topics = starbase.Topics();

const database = starbase.Database('app');
const db = starbase.Channels(database);

const serverURL = "https://api.themike.org/callbackjs";
const auth = starbase.Auth(starbase.Client(serverURL + "/auth"), db);
const admin = starbase.Admin(starbase.Client(serverURL + "/admin"), auth);
const profiles = starbase.Profiles(starbase.Client(serverURL + "/profiles"), auth);
const files = starbase.Files(serverURL + "files/", auth);
const online = async () => {
  return fetch(serverURL + "online", {"method":"POST"}).then(response=>{
    return response.json();
  }).catch(err=>{
    return {"online":false};
  });
};

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

const showInstallButton = (install) => {
  let installButton = document.createElement('a');
  installButton.href = "";
  installButton.innerText = "📱 Install";
  if (document.querySelector('nav .navMenu')) {
    document.querySelector('nav .navMenu').appendChild(installButton);
  }
  installButton.onclick = async (e) => {
    e.preventDefault();
    await install().then(result=>{
      installButton.remove();
    });
  };
};

const pwa = starbase.PWA().app('/sw.js', showInstallButton, showUpdateButton, showUpdateButton, 'app');

const Menu = () => {
  let x = document.getElementById("navMenu");
  if (x.className === "navMenu") {
    x.className += " responsive";
  } else {
    x.className = "navMenu";
  }
};

console.log('ready');
