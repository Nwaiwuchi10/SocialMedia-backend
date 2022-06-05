const User = require("../models/User");
const asyncHandler = require("express-async-handler");

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (user) {
    res.status.json({
      Id: user.Id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      username: user.username,
      profilePicture: user.profilePicture,
      coverPicture: user.coverPicture,
      followers: user.followers,
      followings: user.followings,
      desc: user.desc,
      from: user.from,
      city: user.city,
      relationship: user.relationship,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

module.exports = {
  getUserProfile,
};
