"use strict";

var mongoose = require("mongoose");
var models = require("./models");
mongoose.connect("mongodb://localhost/tally");

models.user.find({userID: "521833454863655"}, function(err, user) {
    user[0].username = 'Bobby';
    user[0].save(function(err) {
      if(err) {
        console.log(err);
      } else {
        console.log('Success');
      }
    });
});