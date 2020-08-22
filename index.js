const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotEnv = require("dotenv");
const authRoute = require("./routes/auth");
const collectionRoute = require("./routes/collections");
const cardsRoute = require("./routes/cards");
const app = express();

dotEnv.config();

//Middleware
app.use(express.json());
app.use(cors());
app.use(function (req, res, next) {
  console.log("incoming req");
  req.header("Access-Control-Allow-Origin", "*");
  req.header("Access-Control-Allow-Credentials", true);
  req.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  req.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json,auth-token"
  );
  next();
});

//Connect to db
try {
  mongoose.connect(
    process.env.DB_CONNECT,
    { useUnifiedTopology: true, useNewUrlParser: true },
    () => {
      console.log("Connected to db!");
    }
  );
} catch (err) {
  console.log(err);
}

//Route middleware
app.use("/api/user", authRoute);
app.use("/api/collections", collectionRoute);
app.use("/api/cards", cardsRoute);

app.listen(process.env.PORT || 3030, () => {
  console.log("Server running at http::/localhost:3030");
});
