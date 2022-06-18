const router = require("express").Router();
const multer = require("multer");
const {
  getPostByLatest,
  getPostByCartegory,
} = require("../controllers/postController");
const Post = require("../models/Post");
const User = require("../models/User");

/////multer storage

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./public/uploads");
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

//create a post

// router.post(
//   "/",
//   upload.single("image"),

//   async (req, res) => {
//     const newPost = new Post({
//       desc: req.body.desc,
//       image: req.file.image,
//       userId: req.body.userId,
//     });
//     try {
//       const savedPost = await newPost.save();
//       res.status(200).json(savedPost);
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   }
// );

/////create new post
router.post("/", upload.single("image"), async (req, res) => {
  try {
    //create new user
    const newPost = new Post({
      desc: req.body.desc,
      image: req.file.originalname,
      userId: req.body.userId,
    });

    //save post and respond
    const post = await newPost.save();
    res.status(200).send("File Uploaded Successfully");
    // res.status(200).json({
    //   _id: post._id,
    //   desc: post.desc,
    //   // image: post.image,
    //   userId: post.userId,
    // });
  } catch (err) {
    res.status(500).json(err);
  }
});

//update a post

router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("the post has been updated");
    } else {
      res.status(403).json("you can update only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete a post

router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json("the post has been deleted");
    } else {
      res.status(403).json("you can delete only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
// like / dislike a post
///excellent working
router.put("/like/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been liked");
      const savedlikes = await newLikes.save();
      res.status(200).json(savedlikes);
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// const savedlikes = await newLikes.save();
// res.status(200).json(savedlikes);

// favourite / unfavourite a post
///excellent working
router.put("/:id/favourite", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.favourites.includes(req.body.userId)) {
      await post.updateOne({ $push: { favourites: req.body.userId } });
      res.status(200).json("The post has been favourite");
    } else {
      await post.updateOne({ $pull: { favourites: req.body.userId } });
      res.status(200).json("The post has been unfavourite");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

////to comment a post
// like / dislike a post
///excellent working
router.put("/comment/:id", async (req, res) => {
  try {
    const comment = {
      text: req.body.text,
      userId: req.body.userId,
    };

    const post = await Post.findById(req.params.id);
    if (!post.comments.includes(req.body.userId)) {
      await post.updateOne({ $push: { comments: comment } });
      res.status(200).json("The post has been commented");

      res.status(200).json(savedcomments);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//get a post

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("userId", [
      "username",
      "profilePicture",
    ]);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get timeline posts

router.get("/timeline/:userId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.status(200).json(userPosts.concat(...friendPosts));
  } catch (err) {
    res.status(500).json(err);
  }
});

//get user's all posts

router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ userId: user._id });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

//// get all post

// .populate("user", [
//   "name",
//   "profilePicture",
// ]);
// router.get("/", async (req, res) => {
//   try {
//     const posts = await Post.find({}).populate("userId", [
//       "username, profilePicture",
//     ]);
//     res.json(posts);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

////to get post by latest
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate("userId", ["username", "profilePicture"])
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

///latest post

/////get latest post
router.route("/desc/desc").get(getPostByLatest);

/////get latest post
router.route("/latest/:id").get(getPostByCartegory);

////@ROUTE PUT/api/posts/like/:id
///Like a post
router.put("/like/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    /// Check if the post has already been liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.json(400).json({ msg: "Post already liked" });
    }
    post.likes.unshift({ user: req.user.id });

    await post.save();

    res.json(post.likes);
  } catch (error) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
