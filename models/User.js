const mongoose = require("mongoose");
const Exercise = require("./Exercise");

var Schema = mongoose.Schema;

var userSchema = new Schema({
  name: { type: String, required: true }
});

userSchema.statics.createUser = async function (name) {
  return await User.findOne({ name: name })
    .exec()
    .then(async (found, err) => {
      if (err) return { created: false, msg: err };
      if (found == null) {
        const user = new User({
          name
        });
        var result = await user.save();
        result["created"] = true;
        return result;
      } else {
        return { created: false, msg: "username already taken" };
      }
    });
};

/*userSchema.statics.findUserById = async function (id) {
  return await User.findById(id)
    .select("name")
    .exec();
};*/


/*
userSchema.statics.readExercises = async function (userId="", from="", to="", limit="") {
  // whithout userId: "unknown userId" (required field)
  console.log("readExercises",userId, from, to, limit)
  
  let user;
  try {
    user = await User.findUserById(mongoose.Types.ObjectId(userId));
  } catch (e) {
    //console.error(e);
    return "unknown userId";
  }

  // whithout from:
  
  
  // whithout to:
  // whithout limit:

  // userId
  // {"_id":"SyMEDzAOB","username":"hirohaji1","count":1,"log":[{"description":"run","duration":10,"date":"Fri Oct 11 2019"}]}
  return {
    _id: user._id,
    username: user.name,
    count: await Exercise.countDocuments({ref: user._id}).exec(),
    log: await Exercise.find({ref: user._id}).select("description duration date -_id").exec(),
  };
};
*/


var User = mongoose.model("User", userSchema);
module.exports = mongoose.model("User", userSchema);
