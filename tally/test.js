"use strict";

var request = require("request");
var url = "http://soundcloud.com/the-game-podcast/no-sympathy-for-silva-as";
request(url, function(err, res, body) {
    if(err) console.log(err);
    console.log(res);
});