const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    // userId: {
    //   type: String,
    //   required: true,
    // },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    desc: {
      type: String,
      max: 500,
    },

    image: {
      type: Array,

      default: [],
      max: 10,
    },
    videos: {
      type: Array,
      default: [],
    },

    likes: {
      type: Array,
      default: [],
    },
    comments: [
      {
        text: String,
        user: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "User",
        },
        // userId: {
        //   type: String,
        // },
      },
    ],
    favourites: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtual: true,
    },
    toObject: {
      virtual: true,
    },
  }
);

module.exports = mongoose.model("Post", PostSchema);
