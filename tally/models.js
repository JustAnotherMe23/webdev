"use strict";

var mongoose = require("mongoose");

var songSchema = new mongoose.Schema({artist: String, title: String, html: String, vote: Number});
var userSchema = new mongoose.Schema({
    userID: String,
    username: String,
    upvotes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Song"
        }],
    downvotes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Song"
        }],
    neutrals: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Song"
        }],
});

module.exports.song = mongoose.model("Song", songSchema);
module.exports.user = mongoose.model("User", userSchema);