const express = require("express");
const mongoose = require("mongoose");

const ShortUrl = require("../../models/ShortUrl");

const router = express.Router();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

router.use(express.urlencoded({ extended: true }));

router.post("/new", (req, res) => {
  var re = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
  if (re.test(req.body.url)) {
    ShortUrl.findOne({ url: req.body.url }, (err, doc) => {
      if (err) {
        console.error("post ShortUrl.find > " + err);
        return res.json({ error: "No short url found for given input" });
      }

      if (doc == null) {
        var newShortUrl = new ShortUrl({
          url: req.body.url
        });

        newShortUrl.save(function(err, doc) {
          if (err) console.error("newShortUrl.save > Error:" + err);
        });

        console.log("newShortUrl:" + JSON.stringify(newShortUrl));

        return res.json({
          original_url: newShortUrl.url,
          short_url: newShortUrl._id
        });
      } else {
        return res.json({
          original_url: doc.url,
          short_url: doc._id
        });
      }
    });
  } else {
    return res.json({ error: "invalid URL" });
  }
});

router.get("/:url_id", (req, res) => {
  ShortUrl.findOne({ _id: req.params.url_id }, (err, doc) => {
    if (err) {
      console.error("get ShortUrl.find > " + err);
      return res.json({ error: "No short url found for given input" });
    }
    if (doc == null) {
      return res.json({ error: "No short url found for given input" });
    } else {
      return res.redirect(302, doc.url);
    }
  });
});

router.use("/", (req, res) => {
  return res.json({ error: "invalid URL" });
});

module.exports = router;

function findUrl(body_url) {
  ShortUrl.find({ url: body_url }, (err, data) => {
    if (err) {
      console.log("findUrl > Error:" + err);
      return err;
    } else {
      console.log("OK:" + data);
      return data;
    }
  });
}

