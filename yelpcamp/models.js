var mongoose = require("mongoose");

var campSchema = new mongoose.Schema({name: String,
    image: String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }]
});



var commentSchema = new mongoose.Schema({text: String, author: String});

module.exports.comment = mongoose.model("Comment", commentSchema);
module.exports.campground = mongoose.model("Campground", campSchema);