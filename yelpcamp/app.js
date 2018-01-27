"use strict";

var express = require("express");
var app = express();
var http = require('http');
var server = http.createServer(app);
var parser = require("body-parser");
var mongoose = require("mongoose");
var models = require("./models.js")
var campground = models.campground;
var comment = models.comment;
var seedDB = require("./seeds.js");

seedDB();

mongoose.connect("mongodb://localhost/yelpcamp", {useMongoClient: true});

app.use(parser.urlencoded({extended: true}));

app.get("/", function(req, res) {
    res.render("landing.ejs");
})

app.get("/campgrounds", function(req, res) {
    campground.find({}, function(err, campgrounds) {
        if(err) console.log(err);
        res.render("index.ejs", {campgrounds: campgrounds});
    });
});

app.post("/campgrounds", function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    campground.create({name: name, image: image, description: description}, function(err, campground) {
        if(err) {
            console.log(err);
        } else {
            console.log(campground);
        }
    });
    
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res) {
    res.render("new.ejs");
})

app.get("/campgrounds/:id", function(req, res) {
    campground.findById(req.params.id).populate("comments").exec(function(err, campground) {
        if(err) {
            console.log(err);
        } else if(campground == null) {
            res.redirect("/campgrounds");
        } else {
            res.render("show.ejs", {campground: campground});
        }
    });
});

app.post("/campgrounds/:id/comment", function(req, res) {
    comment.create({author:"Cain", text:req.body.comment}, function(err, comment) {
        if(err) console.log(err);
        campground.findById(req.params.id, function(err, campground) {
            if(err) console.log(err);
            campground.comments.push(comment);
            campground.save(function(err) {
                if(err) console.log(err);
                console.log("Comment added to campground " + campground.name);
            });
        });
    });
    res.redirect("/campgrounds/" + req.params.id);
})

server.listen(process.env.PORT, process.env.IP, function() {
    console.log('Express server started on port %s at %s', process.env.PORT, process.env.IP);
});