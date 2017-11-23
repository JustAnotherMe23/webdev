var express = require("express");
var app = express();
var http = require('http');
var server = http.createServer(app);
var parser = require("body-parser");
var mongo = require("mongodb");
var MongoClient = mongo.MongoClient;
var url = "mongodb://localhost:27017/yelpcamp";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  //Exclude the _id field from the result:
  db.collection("campground").find({}, {}).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    db.close();
  });
});

app.use(parser.urlencoded({extended: true}));


var campgrounds = [
    {name: "Salmon Creek", image: "https://www.fs.usda.gov/Internet/FSE_MEDIA/stelprdb5115421.jpg"},
    {name: "Scallop Cove", image: "https://www.fs.usda.gov/Internet/FSE_MEDIA/stelprdb5338277.jpg"},
    {name: "Tuna Turnpike", image: "https://img.hipcamp.com/image/upload/c_limit,f_auto,h_1200,q_60,w_1920/v1440478008/campground-photos/csnhvxn0qcki2id5vxnc.jpg"}
    ]

app.get("/", function(req, res) {
    res.render("landing.ejs");
})

app.get("/campgrounds", function(req, res) {
        res.render("campgrounds.ejs", {campgrounds: campgrounds});
});

app.post("/campgrounds", function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image};
    campgrounds.push(newCampground);
    
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res) {
    res.render("new.ejs");
})

server.listen(3000, 'localhost');
server.on('listening', function() {
    console.log('Express server started on port %s at %s', server.address().port, server.address().address);
});