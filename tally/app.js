"use strict";

var express = require("express");
var app = express();
var http = require("http");
var server = http.createServer(app);

app.use("/tally",express.static(__dirname));

app.get("/", function(req, res) {
    res.render("showMusic.ejs");
});

app.get("/login", function(req, res) {
    res.render("login.ejs");
});

server.listen(process.env.PORT, process.env.IP, function() {
    console.log("Radio broadcasting from " + process.env.IP + " on port " + process.env.PORT);
});