"use strict";

var mongoose = require("mongoose");
var models = require("./models");

function seedDB() {
    models.user.remove({}, function(err) {
        if(err) console.log(err);
        models.song.remove({}, function(err) {
            if(err) console.log(err);
            models.room.remove({}, function(err) {
                if(err) console.log(err);
                models.room.create({name: "general",
                    html: '<iframe id="player" width="100%" height="400" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?visual=true&url=http%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F291270561&show_artwork=true"></iframe>',
                    duration: null,
                    startTime: null
                })
            });
        });
    });
}

module.exports = seedDB;

//521833454863655