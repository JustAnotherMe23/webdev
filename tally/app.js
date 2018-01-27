"use strict";

var express = require("express");
var app = express();
var http = require("http");
var server = http.createServer(app);
var io = require('socket.io')(server);
var seedDB = require("./seeds.js");

//-----Following is MongoDB requirements only---------//

var mongoose = require("mongoose");
var models = require("./models.js");
var i = 0;

//-----Following is url-embed requirements only------//

let urlEmbed = require('url-embed');
let EmbedEngine = urlEmbed.EmbedEngine;
let Embed = urlEmbed.Embed;
 
let engine = new EmbedEngine({
  timeoutMs: 2000,
  referrer: 'www.example.com'
});

var html = '<iframe id="player" width="100%" height="400" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?visual=true&url=http%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F291270561&show_artwork=true"></iframe>';
var startTime = null;
var duration = null;

engine.registerDefaultProviders();

mongoose.connect("mongodb://localhost/tally");
seedDB();

app.use("/tally",express.static(__dirname));

//------Setup Complete-------//

app.get("/", function(req, res) {
    res.render("showMusic.ejs");
});

io.on('connection', function(socket){
    i = i + 1;
    console.log("Connections: " + i);
    socket.on("disconnect", function() {
        i = i - 1;
        console.log("Connections: " + i);
    });
    
    socket.on("request_username", function(object) {
        models.user.find({userID: object.userID}, function(err, user) {
            if(err) console.log(err);
            if(user.length === 0) {
                models.user.create({userID: object.userID}, function(err, user) {
                    if(err) console.log(err);
                });
            } else if(user[0].username !== undefined) {
                socket.emit("send_username", {username: user[0].username});
            }
        });
    });
    
    socket.on("make_comment", function(object) {
        io.emit("add_comment", object);
    });
    
    socket.on("make_vote", function(object) {
        let song = object.upvote + '';
        let embedArray = [new Embed(song)];
        engine.getMultipleEmbeds(embedArray, function (error, results) {
            if (error) console.log(error);
            for (let i = 0; i < results.length; i++) {
                let embed = results[i];
                if (!embed.error) {
                    models.song.find({html: embed.data.html}, function(err, song) {
                        if(err) console.log(err);
                        if(song.length ===0) {
                            var remainder = song.slice(song.indexOf('soundcloud.com/') + 15);
                            var artist = remainder.slice(0, remainder.indexOf('/'));
                            var title = remainder.slice(remainder.indexOf('/') + 1);
                            
                            models.song.create({
                                artist: artist,
                                title: title,
                                html: embed.data.html,
                                vote: 1
                            }, function(err, song) {
                                if(err) console.log(err);
                                models.user.find({userID: object.userID}, function(err, user) {
                                    if(err) console.log(err);
                                    user[0].upvotes.push(song);
                                    user[0].save();
                                });
                            });
                        } else {
                            song[0].vote = song[0].vote + 1;
                            song[0].save();
                        }
                    })
                    
                    
                }
            }
        });
    });
    
    socket.on("set_username", function(object) {
        models.user.findOneAndUpdate({userID: object.userID}, {username: object.username}, {new: true}, function(err, user) {
            if(err) console.log(err);
        });
    });
    
    socket.on('set_start', function(object) {
        if(startTime === null) {
            startTime = Date.now();
            duration = object.duration;
        }
        
        console.log(Date.now());
        console.log(startTime);
        socket.emit('play', {seek: Math.abs(Date.now() - startTime - 200)});
    });
});

server.listen(process.env.PORT, process.env.IP, function() {
    console.log("Radio broadcasting from " + process.env.IP + " on port " + process.env.PORT);
});

// 'https://soundcloud.com/childish-gambino/redbone';
// var ms = getTime() where ms is time is milliseconds since a time