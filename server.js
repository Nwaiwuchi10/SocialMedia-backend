const express = require("express");
// const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const colors = require("colors");
const http = require("http");
const helmet = require("helmet");
const morgan = require("morgan");

const multer = require("multer");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const fileRoutes = require("./routes/file-upload-routes");
const mediaRoutes = require("./routes/media");

const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");
const router = express.Router();
const cors = require("cors");
const path = require("path");
const config = require("config");

////init app
const app = express();
app.use(cors());
// const dotenv = require("dotenv");

// dotenv.config();
dotenv.config({ path: "./config.env" });

///
const server = http.createServer(app);
//

////
if (process.env.NODE.ENV === "development") {
  app.use(morgan("dev"));
}
//
// Db config
const db = config.get("mongoURI");

// Connect to MongoDB
mongoose
  .connect(db, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,
  })
  .then(() => console.log(`MongoDb Connected`))
  .catch((err) => console.log(err));

// mongoose.connect(
//   process.env.MONGO_URL,
//   { useNewUrlParser: true, useUnifiedTopology: true },
//   () => {
//     console.log("Connected to MongoDB");
//   }
// );

// app.use("/images", express.static(path.join(__dirname, "public/images")));

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

// const storage = multer.diskStorage({
//   destination: path.join(__dirname, "../public_html/uploads", "uploads"),
//   filename: function (req, file, cb) {
//     //null as first argument means no error
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// app.post("/api/imageupload", async (req, res) => {
//   try {
//     let upload = multer({ storage: storage }).single("avatar");
//     ////avatar is the name of our file input field in html form
//     upload(req, res, function (err) {
//       if (!req.file) {
//         return res.send("Please select an image to upload");
//       } else if (err instanceof multer.MulterError) {
//         return res.send(err);
//       }
//     });
//   } catch (error) {
//     console.log(err);
//   }
// });

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/images");
//   },
//   filename: (req, file, cb) => {
//     cb(null, req.body.name);
//   },
// });

// const upload = multer({ storage: storage });
// app.post("/api/upload", upload.single("file"), (req, res) => {
//   try {
//     return res.status(200).json("File uploded successfully");
//   } catch (error) {
//     console.error(error);
//   }
// });

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);

app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.use("/api/vl/media", mediaRoutes);
app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/api", fileRoutes.routes);

// const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, "/build")));
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "build/index.html"))
);

const PORT = process.env.PORT || 5000;

server.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
