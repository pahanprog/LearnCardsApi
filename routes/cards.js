const router = require("express").Router();
const verify = require("./verifytoken");
const Card = require("../model/Card");
const Collection = require("../model/Collection");
const User = require("../model/User");

router.get("/:id", verify, async (req, res) => {
  const id = req.params.id;
  try {
    const collection_creator = await (await Collection.findById(id)).toObject()
      .createdBy;
    if (req.user._id !== collection_creator) {
      res.status(400).send({ message: "Access denied" });
      return;
    }
    const cards = await Card.find({ parent_collection: id });
    res.send(cards);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

module.exports = router;
