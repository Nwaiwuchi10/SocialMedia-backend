const User = require("../models/User");
const asyncHandler = require("express-async-handler");

///////
//@desc Fetch all products
//@route Get/api/products
//@acess Fetch Public

const getMyUsers = asyncHandler(async (req, res) => {
  const pageSize = 20;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  const count = await User.countDocuments({ ...keyword });

  const users = await User.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  res.json({ users, page, pages: Math.ceil(count / pageSize) });
});
///////

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (user) {
    res.status.json({
      id: user.id,
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
//@desc Update user profile
//@route PUT/api/users/profile
//@acess Private

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.profilePicture = req.body.profilePicture || user.profilePicture;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
    user.desc = req.body.desc || user.desc;
    user.city = req.body.city || user.city;
    user.country = req.body.country || user.country;
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.json({
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      profilePicture: updatedUser.profilePicture,
      isAdmin: updatedUser.isAdmin,
      phoneNumber: updatedUser.phoneNumber,
      desc: updatedUser.desc,
      city: updatedUser.city,
      country: updatedUser.country,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
//@desc Get user by ID
//@route GET/api/users/:id
//@acess Private/Admin

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserById,
};
