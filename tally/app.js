"use strict";

var express = require("express");
var app = express();
var http = require("http");
var server = http.createServer(app);
var io = require('socket.io')(server);

io.on('connection', function(socket){
    console.log("Socket connection added");
    socket.on("disconnect", function() {
        console.log("Disconnected user");
    });
    
    socket.on("make_comment", function(object) {
        console.log(object);
        io.emit("add_comment", object);
    })
    
    socket.on("make_vote", function(object) {
        console.log(object);
    })
});

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