const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const { registerValidation, loginValidation } = require("../validation");

//REGISTER
router.post("/register", async (req, res) => {
  //Validation data from user
  const { error } = registerValidation(req.body.data);
  if (error) return res.status(400).send(error.details[0].message);

  //validation if user is already registered
  const emailExists = await User.findOne({ email: req.body.data.email });
  if (emailExists) return res.status(400).send("Email already exists");

  //Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.data.password, salt);

  //check if user wants to remember
  const remember = req.body.data.remember;

  const user = new User({
    name: req.body.data.name,
    email: req.body.data.email,
    password: hashedPassword,
  });
  try {
    const savedUser = await user.save();
    const token = jwt.sign({ _id: savedUser._id }, process.env.TOKEN_SECRET);
    if (remember) {
      var hour = 3600000;
      res.cookie("token", token, {
        maxAge: 14 * 24 * hour,
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      res.cookie("username", req.body.data.name, {
        maxAge: 14 * 24 * hour,
        httpOnly: false,
        secure: true,
        sameSite: "none",
      });
    } else {
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      }).expires = false;
      res.cookie("username", req.body.data.name, {
        httpOnly: false,
        secure: true,
        sameSite: "none",
      }).expires = false;
    }
    res.send("");
  } catch (err) {
    res.status(400).send(err);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  //validation before login
  const { error } = loginValidation(req.body.data);
  if (error) return res.status(400).send(error.details[0].message);

  //Check if user exists
  const user = await User.findOne({ email: req.body.data.email });
  if (!user) return res.status(400).send("User doesn't exist");

  //check if password is correct
  const validPass = await bcrypt.compare(req.body.data.password, user.password);
  if (!validPass) return res.status(400).send("Invalid password");

  //check if user wants to remember
  const remember = req.body.data.remember;

  //Loged in!
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  const username = user.name;
  if (remember) {
    var hour = 3600000;
    res.cookie("token", token, {
      maxAge: 14 * 24 * hour,
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.cookie("username", username, {
      maxAge: 14 * 24 * hour,
      httpOnly: false,
      secure: false,
    });
  } else {
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    }).expires = false;
    res.cookie("username", username, {
      httpOnly: false,
      secure: false,
    }).expires = false;
  }
  res.send("");
});

//LOGOUT
router.get("/signout", async (req, res) => {
  res.clearCookie("username", { secure: true, sameSite: "none" });
  res.clearCookie("token", { secure: true, sameSite: "none" });
  res.send("");
});

module.exports = router;
