const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotEnv = require("dotenv");
const authRoute = require("./routes/auth");
const collectionRoute = require("./routes/collections");
const cardsRoute = require("./routes/cards");
const shareRoute = require("./routes/share");
const app = express();

dotEnv.config();

var corsOptions = {
  origin: process.env.ORIGIN || "http://localhost:3000",
  optionsSuccessStatus: 200,
  credentials: true,
};

//Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

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
app.use("/api/share", shareRoute);

app.listen(process.env.PORT || 3030, () => {
  console.log("Server running at http::/localhost:3030");
});
