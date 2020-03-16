const express = require('express')
const router = express.Router()

//{"ipaddress":"159.20.14.100","language":"en-US,en;q=0.5",
//"software":"Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:50.0) Gecko/20100101 Firefox/50.0"}

router.get('/', (req, res) => {
  var r = Object.entries(req)
  console.log(r)
  res.json({
    "ipaddress" : req.connection.remoteAddress.replace(/^.*:/, ''),
    "language": req.headers['accept-language'],
    "software": req.headers['user-agent'],
  });
})

module.exports = router;
