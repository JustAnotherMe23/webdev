var express = require("express");
var app = express();
var request = require("request");
app.set("view engine", "ejs");

app.get("/", function(req, res) {
    res.render("search");
});

app.get("/results", function(req, res) {
    search = req.query.search;
    httpU = "http://www.omdbapi.com/?s=" + search.replace(" ", "+") + "&apikey=thewdb";
    http = httpU.toLowerCase();
    request(http, function(error, response, body) {
        if(!error && response.statusCode == 200) {
            var parsedData = JSON.parse(body);
            res.render("result", {data: parsedData});
        } else {
            res.send("something bad happed\n");
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server started on port " + process.env.PORT + "...");
});