const router = require("express").Router();
const verify = require("./verifytoken");
const Collection = require("../model/Collection");
const Card = require("../model/Card");

router.get("/:id", verify, async (req, res) => {
  const id = req.params.id;
  try {
    const collection = await Collection.findOne({ _id: id });
    const collectionWithoutCreatorId = collection.toObject();
    delete collectionWithoutCreatorId.createdBy;
    delete collectionWithoutCreatorId.__v;
    if (collection) {
      const cards = await Card.find({ parent_collection: collection._id });
      res.send({ collection: collectionWithoutCreatorId, cards });
    } else {
      res
        .status(400)
        .send(
          JSON.stringify({ message: "cant find collection with id: " + id })
        );
    }
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

module.exports = router;
