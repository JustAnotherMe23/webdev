"use strict";

var mongoose = require("mongoose");

var songSchema = new mongoose.Schema({artist: String, title: String, html: String, votes: Number});
var roomSchema = new mongoose.Schema({name: String,
    html: String,
    duration: Number,
    startTime: Number,
    votes: [{
        songID: String,
        userIDs: [String]
    }]
});

var userSchema = new mongoose.Schema({
    userID: String,
    username: String,
    upvoteIDs: [String],
    downvoteIDs: [String],
    neutralIDs: [String]
});

module.exports.song = mongoose.model("Song", songSchema);
module.exports.room = mongoose.model("Room", roomSchema);
module.exports.user = mongoose.model("User", userSchema);