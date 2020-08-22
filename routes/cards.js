const router = require("express").Router();
const verify = require("./verifytoken");
const Card = require("../model/Card");

router.get("/:id", verify, async (req, res) => {
  const id = req.params.id;
  const cards = await Card.find({ parent_collection: id });
  res.send(cards);
});

module.exports = router;
