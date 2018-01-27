"use strict";

var mongoose = require("mongoose");
var models = require("./models");

function seedDB() {
    models.user.remove({}, function(err) {
        if(err) console.log(err);
        models.song.remove({}, function(err) {
            if(err) console.log(err);
            
            /*
            models.user.create({userID: "521833454863655", username: "Jason"}, function(err, user) {
                models.song.create({url: "https://soundcloud.com/modestep/sets/higher"}, function(err, song) {
                    if(err) console.log(err);
                    console.log(song);
                    user.upvotes.push(song);
                    user.save();
                    console.log("process complete");
                       
                });
            });
            */
        })
    });
}

module.exports = seedDB;

//521833454863655