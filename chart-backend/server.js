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
const statusRoute = require("./routes/status");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const uploadRoutes = require("./routes/uploadRoutes");
const fileRoutes = require("./routes/file-upload-routes");
const mediaRoutes = require("./routes/media");

const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");
const router = express.Router();
const cors = require("cors");
const path = require("path");
var bodyParser = require("body-parser");
const config = require("config");
const cookieSession = require("cookie-session");
const passport = require("passport");
const passportSetup = require("./passport");
const authPassport = require("./routes/authpassport");
////init app
const app = express();
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(
  cors({
    origin: "*",
  })
);
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
app.use(
  cookieSession({
    name: "session",
    keys: ["lama"],
    maxAge: 24 * 60 * 60 * 100,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoute);
app.use("/auth", authPassport);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/status", statusRoute);
app.use("/api/upload", uploadRoutes);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.use("/api/vl/media", mediaRoutes);
// app.use("/public", express.static(path.join(__dirname, "public")));
app.use("./uploadsfile", express.static(path.join(__dirname, "./uploadsfile")));

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
////// handle unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`ERROR:${err.message}`);
  console.log("Shutting down the server due Unhandled promise rejection");

  server.close(() => {
    process.exit(1);
  });
});
