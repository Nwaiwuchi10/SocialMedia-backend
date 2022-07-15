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

/////create new post
router.post("/", upload.single("image"), async (req, res) => {
  try {
    //create new user
    const newPost = new Post({
      desc: req.body.desc,
      image: req.body.image,

      // image: req.file.originalname,
      user: req.body.user,
    });

    //save post and respond
    const post = await newPost.save();
    res.status(200).send("File Uploaded Successfully");
    res.status(200).json({
      _id: post._id,
      desc: post.desc,
      image: post.image,
      user: post.user,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//update a post

router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.user === req.body.user) {
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

// router.delete("/:id", async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);
//     if (post.user === req.body.user) {
//       await post.deleteOne();
//       res.status(200).json("the post has been deleted");
//     } else {
//       res.status(403).json("you can delete only your post");
//     }
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });
/////delete a post
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { userId } = req.body;
    const post = await PostModel.findById(id);
    if (post.userId === userId) {
      await post.remove()();
      res.status(200).json("Post deleted.");
    } else {
      res.status(403).json("you can delete only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

/////
//@desc Delete a product
//@route DELETE/api/products/:id
//@acess Fetch Public

router.delete("/puyol/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post) {
      await post.remove();
      res.json({ message: "Product removed" });
    }
  } catch (error) {
    res.status(500).json(err);
  }
});

// like / dislike a post
///excellent working
router.put("/like/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.user)) {
      await post.updateOne({ $push: { likes: req.body.user } });
      res.status(200).json("The post has been liked");
      const savedlikes = await newLikes.save();
      res.status(200).json(savedlikes);
    } else {
      await post.updateOne({ $pull: { likes: req.body.user } });
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
    if (!post.favourites.includes(req.body.user)) {
      await post.updateOne({ $push: { favourites: req.body.user } });
      res.status(200).json("The post has been favourite");
    } else {
      await post.updateOne({ $pull: { favourites: req.body.user } });
      res.status(200).json("The post has been unfavourited");
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
      user: req.body.user,
    };

    const post = await Post.findById(req.params.id);

    if (!post.comments.includes(req.body.user)) {
      await post
        .updateOne({
          $push: {
            comments: comment,
          },
        })
        .populate("comments.user", "_id username");

      res.status(200).json("The post has been commented Sucessfully");

      res.status(200).json(savedcomments);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

////get my post
router.get("/mypost", async (req, res) => {
  try {
    const user = user.req.body;

    // const user = await User.findOne({ user: req.params._id });
    const post = await Post.find({ user: req.user._id }).populate(
      "user",
      "_id username"
    );
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get a post

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("user");
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get timeline posts

router.get("/timeline/all", async (req, res) => {
  try {
    const currentUser = await User.findById(req.body.user);
    const userPosts = await Post.find({ user: currentUser._id });
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

router.get("/profile/:id", async (req, res) => {
  try {
    const user = await User.findOne({ user: req.params._id });
    const posts = await Post.find({ user: user._id }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});
//get user's all posts

router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ user: user._id });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

////to get post by latest
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .populate("user", ["profilePicture", "username", "Verified", "isAdmin"]);

    res.json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

////@ROUTE PUT/api/posts/like/:id ["profilePicture", "username", "Verified", "isAdmin"]
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
