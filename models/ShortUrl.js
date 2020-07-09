const mongoose = require("mongoose");
const User = require("./User");

var Schema = mongoose.Schema;

var shortUrlSchema = new Schema({
  url: { type: String, required: true }
  //short: { type: Number, required: true }
});

var ShortUrl = mongoose.model("ShortUrl", shortUrlSchema);

module.exports = mongoose.model("ShortUrl", shortUrlSchema);
