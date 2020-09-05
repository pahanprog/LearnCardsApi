const jwt = require("jsonwebtoken");

module.exports = async function auth(req, res, next) {
  const token = req.cookies.token;
  if (!token || token == null) {
    return res.status(401).send({ message: "Access denied" });
  }

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: "Invalid Token" });
  }
};
