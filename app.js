const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

const cors = require("cors");

const config = require("./config");

const auth = require("./routes/authRoute");
const generators = require("./routes/generatorRoute");
const collections = require("./routes/collectionRoute");
const templates = require("./routes/templateRoute");

const MONGODB_URL = config.MONGODB_URL;
const PORT = config.PORT;

mongoose.connect(MONGODB_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB on ", MONGODB_URL);
});
mongoose.connection.on("error", (error) => {
  console.log(error);
});

let app = express();

app.use(cors());
// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "client/build")));
app.use(
  "/assets/images",
  express.static(path.join(__dirname, "assets/images"))
);
app.use(
  "/generated-pdf",
  express.static(path.join(__dirname, "assets/generated/pdf"))
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use("/api/auth", auth);
app.use("/api/generator", generators);
app.use("/api/collection", collections);
app.use("/api/template", templates);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/build/index.html"));
});

app.listen(PORT, () => {
  console.log("Server started on port", PORT);
});
