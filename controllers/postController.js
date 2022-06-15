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

//@desc Fetch single Post
//@route Get/api/Posts/category
//@acess Fetch Public
const getPostByCartegory = asyncHandler(async (req, res) => {
  let posts;
  if (req.params.desc == "Latest") {
    posts = await Post.find({}).sort({ createdAt: -1 }).limit(30);
  } else {
    posts = await Post.find({ posts: req.params.postId }).limit(30);
  }

  res.json({
    posts,
    message: "vendors found",
  });
});

module.exports = {
  getPostByLatest,
  getPostByCartegory,
};
