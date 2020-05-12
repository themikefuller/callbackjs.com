'use strict';

const Menu = () => {
  let x = document.getElementById("navMenu");
  if (x.className === "navMenu") {
    x.className += " responsive";
  } else {
    x.className = "navMenu";
  }
};

console.log('ready');
