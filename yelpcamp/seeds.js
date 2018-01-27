"use strict";

var mongoose = require("mongoose");
var models = require("./models.js");

var campgrounds = [{name: "Place", image: "http://www.sjp.asia/~/media/Images/S/SJP-Asia/signpost-images/singapore.jpg?h=307&la=en&w=767", description: "What"},
    {name: "Spirits' Sourpatch", image: "https://www.nhstateparks.org/uploads/images/Dry-River_Campground_02.jpg", description: "Is"},
    {name: "Bobby Ray's", image: "http://www.fondulacpark.com/wp-content/uploads/2015/01/campground-pic-1.jpg", description: "Happening"}];

function seedDB() {
    models.campground.remove({}, function(err) {
        models.comment.remove({}, function(err) {
            if(err) {
                console.log("Database not destroyed");
                throw err;
            }
            
            for(var i = 0; i < campgrounds.length; i++) {
                models.campground.create(campgrounds[i], function(err, campground) {
                    models.comment.create({text: "This is great", author: "Who Caters"}, function(err, comment) {
                        campground.comments.push(comment);
                        campground.save();
                    });
                });
            }
        });
    });
    
    
}

module.exports = seedDB;