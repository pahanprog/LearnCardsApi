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
app.use(cookieParser());
app.use(cors());

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
