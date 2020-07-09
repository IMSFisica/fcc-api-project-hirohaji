const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  var dateObj = new Date()
  var utcString = dateObj.toUTCString()
  var parse = Date.parse(dateObj)
  
  return res.json({
    "unix": parse,
    "utc": utcString
  });
})

router.get('/:date_string', (req, res) => {
  
  var dateObj = new Date(req.params.date_string * 1);
  var utcString = dateObj.toUTCString();
  var parse = Date.parse(req.params.date_string)
  
  // timestamp 1450137600
  if (dateObj != "Invalid Date") {
    return res.json({
      "unix": req.params.date_string,
      "utc": utcString
    });
  } else if (parse) {
      dateObj = new Date(parse);
      utcString = dateObj.toUTCString();
      return res.json({
        "unix": parse,
        "utc": utcString
      });
    } else {
      return res.json({
        "error" : "Invalid Date"
      });
    }
   
})

module.exports = router;
