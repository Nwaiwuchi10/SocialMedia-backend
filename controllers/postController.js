const asyncHandler = require("express-async-handler");
const Post = require("../models/Post");

//@desc Fetch single vendor
//@route Get/api/vendors/category
//@acess Fetch Public
const getPostByLatest = asyncHandler(async (req, res) => {
  let posts;

  if (req.params.post == "Latest") {
    posts = await Post.find({}).sort({ createdAt: -1 }).limit(30);
  }

  res.json(posts);
});

module.exports = {
  getPostByLatest,
};
