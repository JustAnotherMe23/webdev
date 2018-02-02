"use strict";

var a = [1, 2, 3];
var b = a !== 1;
console.log(a.filter(function(el) {
  return el != 1;
}));