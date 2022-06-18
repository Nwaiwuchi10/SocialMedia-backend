const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      max: 500,
    },
    singleFile: {
      type: Array,
      default: [],
      max: 10,
    },
    image: {
      type: String,
      default: "",
      // default: [],
      // max: 10,
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
        userId: {
          type: String,
        },
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
