const Status = require("../models/Status");
const User = require("../models/User");
const router = require("express").Router();

router.post("/", async (req, res) => {
  try {
    //create new user
    const newStatus = new Status(req.body);

    //save post and respond
    const status = await newStatus.save();
    res.status(200).send("Status created Successfully");
    res.status(200).json({
      _id: status._id,
      desc: status.desc,
      image: status.image,
      user: status.user,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

////to get all status by latest
router.get("/", async (req, res) => {
  try {
    const status = await Status.find({})
      .sort({ createdAt: -1 })
      .populate("user", [
        "profilePicture",
        "username",
        "Verified",
        "isAdmin",
        "createdAt",
      ]);

    res.json(status);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
