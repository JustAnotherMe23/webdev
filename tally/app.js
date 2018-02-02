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

engine.registerDefaultProviders();

mongoose.connect("mongodb://localhost/tally");
seedDB();

app.use("/tally",express.static(__dirname));

//------Setup Complete-------//

app.get("/", function(req, res) {
    res.render("showMusic.ejs");
});

io.on('connection', function(socket) {
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
                            var remainder = object.upvote.slice(object.upvote.indexOf('soundcloud.com/') + 15);
                            var artist = remainder.slice(0, remainder.indexOf('/'));
                            var title = remainder.slice(remainder.indexOf('/') + 1);
                            models.song.create({
                                artist: artist,
                                title: title,
                                html: embed.data.html,
                                votes: 0
                            }, function(err, song) {
                                if(err) console.log(err);
                                models.user.find({userID: object.userID}, function(err, user) {
                                    if(err) console.log(err);
                                    var UU = false;
                                    if(user.length > 0) {
                                        user[0].upvoteIDs.push(song._id);
                                        user[0].save();
                                        roomVote(object.room, song._id, object.userID);
                                    } else {
                                        console.log("Unregistered user: voting");
                                    }
                                });
                            });
                        } else {
                            models.user.find({userID: object.userID}, function(err, user) {
                                if(err) console.log(err);
                                if(user.length > 0) {
                                    var valid = true;
                                    for(var i = 0; i < user[0].upvoteIDs.length; i++) {
                                        if(user[0].upvoteIDs[i] == song[0]._id) {
                                            valid = false;
                                        }
                                    }
                                    
                                    if(valid) {
                                        user[0].upvoteIDs.push(song[0]._id);
                                        user[0].save();
                                    }
                                    roomVote(object.room, song[0]._id, object.userID);
                                } else {
                                    console.log("Unregistered user: voting");
                                }
                            });
                        }
                    });
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
        models.room.find({name: object.room}, function(err, room) {
            if(err) console.log(err);
            if(room.length > 0) {
                if(room[0].duration == null) {
                    room[0].startTime = Date.now();
                    room[0].duration = object.duration;
                    room[0].save();
                    setTimeout(function() {
                        room[0].startTime = null;
                        room[0].duration = null;
                        room[0].save();
                        
                        var max = 0;
                        var favorites = [];
                        for(var i; i < room[0].votes.length; i++) {
                            if(room[0].votes[i].userID.length > max) {
                                favorites = room[0].votes[i].songID;
                                max = room[0].votes[i].userID.length;
                            } else if(room[0].votes[i].userID.length == max) {
                                favorites.push(room[0].votes[i].songID);
                            }
                        }
                        
                        if(favorites.length == 0) {
                            room[0].html = "<iframe width=\"100%\" height=\"400\" scrolling=\"no\" frameborder=\"no\" src=\"https://w.soundcloud.com/player/?visual=true&url=http%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F366242291&show_artwork=true\"></iframe>";
                        } else {
                            var song_pick = Math.floor(Math.random() * favorites.length);
                            models.song.findById(favorites[song_pick], function(err, song) {
                                if(err) console.log(err);
                                room[0].html = song.html;
                                console.log(room[0].html);
                                room[0].save();
                            })
                        }
                        io.emit('refresh', {});
                    }, 5000);
                }
                socket.emit('play', {seek: Math.abs(Date.now() - room[0].startTime - 200)});
            } else {
                console.log("ERROR: room not found");
            }
        });
    });
});

server.listen(process.env.PORT, process.env.IP, function() {
    console.log("Radio broadcasting from " + process.env.IP + " on port " + process.env.PORT);
});

// 'https://soundcloud.com/childish-gambino/redbone';
//Start of user defined functions

var roomVote = function(roomName, songID, userID) {
    models.room.find({name: roomName}, function(err, room) {
        if(err) console.log(err);
        var valid = true;
        var spot = -1;
        for(var i = 0; i < room[0].votes.length; i++) {
            for(var j = 0; j < room[0].votes[i].userIDs.length; j++) {
                room[0].votes[i].userIDs = room[0].votes[i].userIDs.filter(function(el) {
                    return el != userID;
                });
            }
            
            if(room[0].votes[i].songID == songID) {
                valid = false;
                spot = i;
            }
        }
        
        if(valid) {
            room[0].votes.push({songID: songID, userIDs: userID});
        } else {
            room[0].votes[spot].userIDs.push(userID);
        }
        
        room[0].save();
    });
};

//https://soundcloud.com/childish-gambino/redbone
//https://soundcloud.com/heyamine/caroline
//https://soundcloud.com/bigsean-1/bounce-back
//https://soundcloud.com/bigsean-1/sets/i-decided-3