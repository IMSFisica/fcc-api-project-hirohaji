const express = require("express");

const User = require("../../models/User");
const Exercise = require("../../models/Exercise");

const router = express.Router();
router.use(express.urlencoded({ extended: true }));

router.post("/new-user", async (req, res) => {
  let result = await User.createUser(req.body.username);
  if (result.created) {
    return res.json({ username: result.name, _id: result._id });
  } else {
    return res.json(result.msg);
  }
});
/*
router.post("/add", async (req, res) => {
  let result = await Exercise.createExercise(req.body.userId, req.body.description, req.body.duration, req.body.date);  
  return res.send(result);
});
*/

router.post("/add", async (req, res) => {
  let newUser;
  try {
    newUser = await User.findById(req.body.userId)
      .select("name")
      .exec();
  } catch (e) {
    //console.error(e);
    return res.send("unknown _id");
  }
  if (newUser === null) {
    return res.send("unknown _id");
  } else {
    // required field: "Path `*` is required."
    if (req.body.description === "")
      return res.send("Path `description` is required.");
    if (req.body.duration === "")
      return res.send("Path `duration` is required.");

    // without date (current date): {"username":"hirohaji1","description":"run","duration":10,"_id":"SyMEDzAOB","date":"Fri Oct 11 2019"}
    if (req.body.date === "") {
      let time = new Date();
      req.body.date =
        time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate();
    }

    const exercise = new Exercise({
      ref: req.body.userId,
      description: req.body.description,
      duration: req.body.duration,
      date: req.body.date
    });

    // with date: {"username":"hirohaji1","description":"run","duration":10,"_id":"SyMEDzAOB","date":"Fri Oct 11 2019"}
    var result = await exercise.save();

    return res.json({
      username: newUser.name,
      description: result.description,
      duration: result.duration,
      _id: newUser._id,
      date: displayDate(result.date)
    });
  }
  return res.send(result);
});

router.get("/log", async (req, res) => {
  //{userId}[&from][&to][&limit]

  // whithout userId: "unknown userId" (required field)
  let user, count, log;
  try {
    user = await User.findById(req.query.userId);
  } catch (e) {
    console.error(e);
    return res.send("unknown userId");
  }

  // Exercise count
  try {
    if (req.query.from == undefined && req.query.to == undefined) {
      count = await Exercise.countDocuments({
        ref: user._id
      }).exec();
    } else if (req.query.from == undefined) {
      count = await Exercise.countDocuments({
        ref: user._id,
        date: { $lte: new Date(req.query.to) }
      }).exec();
    } else if (req.query.to == undefined) {
      count = await Exercise.countDocuments({
        ref: user._id,
        date: { $gte: new Date(req.query.from) }
      }).exec();
    } else {
      count = await Exercise.countDocuments({
        ref: user._id,
        date: { $gte: new Date(req.query.from), $lte: new Date(req.query.to) }
      }).exec();
    }
  } catch (e) {
    //console.error(e);
    return res.send("error on log count");
  }

  // Exercise log {"created_on": {"$gte": new Date(2012, 7, 14), "$lt": new Date(2012, 7, 15)}}
  // {"_id":"SyMEDzAOB","username":"hirohaji1","count":1,"log":[{"description":"run","duration":10,"date":"Fri Oct 11 2019"}]}
  try {
    if (req.query.from == undefined && req.query.to == undefined) {
      log = await Exercise.find({
        ref: user._id
      })
        .select("description duration date -_id")
        .limit(Number(req.query.limit))
        .sort("date")
        .exec((err, results) => {
          return res.json({
            _id: user._id,
            username: user.name,
            count: count,
            log: displayLog(results)
          });
        });
    } else if (req.query.from == undefined) {
      log = await Exercise.find({
        ref: user._id,
        date: { $lte: new Date(req.query.to) }
      })
        .select("description duration date -_id")
        .limit(Number(req.query.limit))
        .sort("date")
        .exec((err, results) => {
          return res.json({
            _id: user._id,
            username: user.name,
            count: count,
            log: displayLog(results)
          });
        });
    } else if (req.query.to == undefined) {
      log = await Exercise.find({
        ref: user._id,
        date: { $gte: new Date(req.query.from) }
      })
        .select("description duration date -_id")
        .limit(Number(req.query.limit))
        .sort("date")
        .exec((err, results) => {
          return res.json({
            _id: user._id,
            username: user.name,
            count: count,
            log: displayLog(results)
          });
        });
    } else {
      log = await Exercise.find({
        ref: user._id,
        date: { $gte: new Date(req.query.from), $lte: new Date(req.query.to) }
      })
        .select("description duration date -_id")
        .limit(Number(req.query.limit))
        .sort("date")
        .exec((err, results) => {
          return res.json({
            _id: user._id,
            username: user.name,
            count: count,
            log: displayLog(results)
          });
        });
    }
  } catch (e) {
    //console.error(e);
    return res.send("error receiving the log");
  }
});

router.use("/", (req, res) => {
  return res.json({ error: "invalid URL" });
});

module.exports = router;

function displayLog(results) {
  let result = [];
  results.forEach((r, i) => {
    result[i] = {
      description: r.description,
      duration: r.duration,
      date: displayDate(r.date)
    };
  });
  return result;
}

function displayDate(date) {
  date = new Date(date);
  var options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric"
  };

  // Thu Feb 14 2019
  return date.toLocaleString("en-US", options).replace(/,/g, "");
}
