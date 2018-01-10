var mongo = require("mongodb");
var MongoClient = mongo.MongoClient;
var url = "mongodb://localhost:27017/yelpcamp";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var myquery = {};
  db.collection("campground").remove(myquery, function(err, obj) {
    if (err) throw err;
    console.log(obj.result.n + " document(s) deleted");
    db.close();
  });
});

setTimeout(function() {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    //Exclude the _id field from the result:
    db.collection("campground").find({name: "stuff"}, {}).toArray(function(err, result) {
      if (err) throw err;
      console.log(result[0]["name"]); 
      db.close();
    });
  });
}, 2000);

setTimeout(function() {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var myobj = {name: "Salmon Creek", image: "https://www.fs.usda.gov/Internet/FSE_MEDIA/stelprdb5115421.jpg"};
    db.collection("campground").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  });
}, 1000);