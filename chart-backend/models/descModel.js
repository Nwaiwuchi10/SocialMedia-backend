const mongoose = require("mongoose");

const descSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Desc", descSchema);
