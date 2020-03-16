const mongoose = require("mongoose");
let User = require("./User");
let ShortUrl = require("./ShortUrl");

var Schema = mongoose.Schema;

var exerciseSchema = new Schema({
  ref: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: {
    type: Date
  }
});

var Exercise = mongoose.model("Exercise", exerciseSchema);
module.exports = mongoose.model("Exercise", exerciseSchema);

function formatDate(date) {
  try {
    date = new Date(date);
  } catch (e) {
    console.error(e);
  }
  // let date = new Date(this.date);
  var options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric"
  };
  // Thu Feb 14 2019
  console.log("exercise formatDate", date);
  return date.toLocaleString("en-US", options).replace(/,/g, "");
}
