const mongoose = require("mongoose");

const StatusSchema = new mongoose.Schema(
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
    postedDate: {
      type: Date,
      default: Date.now,
    },
    message: [
      {
        text: String,
        userId: {
          type: String,
        },
      },
    ],
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

module.exports = mongoose.model("Status", StatusSchema);
