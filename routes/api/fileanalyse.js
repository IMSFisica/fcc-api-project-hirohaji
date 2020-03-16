const fs = require("fs");
const express = require("express");
var multiparty = require("multiparty");
var format = require("util").format;
var mime = require('mime-types');

const router = express.Router();

var formData = {
  //my_field: "my_value",
  //my_file: fs.createReadStream(__dirname + "/img1.jpg")
};

router.post("/", (req, res, next) => {
  // create a form to begin parsing
  var form = new multiparty.Form();
  var upfile;
  var title;

  form.on("error", next);
  form.on("close", function() {
    res.json({
      name: upfile.filename,
      type: mime.lookup(upfile.filename) || 'application/octet-stream',
      size: upfile.size | 0
    });
  });

  // listen on field event for title
  form.on("field", function(name, val) {
    if (name !== "title") return;
    title = val;
  });

  // listen on part event for image file
  form.on("part", function(part) {
    if (!part.filename) return;
    //if (part.name !== "image") return part.resume();
    upfile = {};
    upfile.filename = part.filename;
    upfile.size = 0;
    part.on("data", function(buf) {
      upfile.size += buf.length;
    });
  });

  // parse the form
  form.parse(req);
});

router.use("/", (req, res) => {
  return res.json({ error: "invalid URL" });
});

module.exports = router;

function fileType(name) {
  
  return
}