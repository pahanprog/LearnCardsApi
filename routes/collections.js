const router = require("express").Router();
const verify = require("./verifytoken");
const Collection = require("../model/Collection");
const Card = require("../model/Card");

router.get("/", verify, async (req, res) => {
  const id = req.user._id;
  const collections = await Collection.find({ createdBy: id });
  res.send(collections);
});

router.get("/:id", verify, async (req, res) => {
  const id = req.params.id;
  try {
    const collection = await Collection.findOne({
      createdBy: req.user._id,
      _id: id,
    });
    if (collection) res.send(collection);
    else
      res.status(400).send(
        JSON.stringify({
          message:
            "cant find collection with id: " +
            id +
            "  created by: " +
            req.user._id,
        })
      );
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/", verify, async (req, res) => {
  //Get user id
  const id = req.user._id;

  //Check if collection with this title and creater exists
  const titleExists = await Collection.findOne({
    title: req.body.title,
    createdBy: id,
  });
  if (titleExists)
    return res
      .status(400)
      .send(JSON.stringify({ message: "Title should be unique" }));

  //Save new collection
  const coll = new Collection({
    title: req.body.title,
    description: req.body.description,
    createdBy: id,
  });
  try {
    const savedCollection = await coll.save();
    if (savedCollection) {
      const c_id = savedCollection._id;
      req.body.questions.map(async (value, index) => {
        const card = new Card({
          question: value.question,
          answer: value.answer,
          parent_collection: c_id,
        });
        try {
          const savedCard = await card.save();
        } catch (err) {
          res
            .status(400)
            .send(JSON.stringify({ message: `question # &{index} error!` }));
          return;
        }
      });
    }
    res.send(savedCollection);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/delete", verify, async (req, res) => {
  try {
    const deletedCollection = await Collection.findByIdAndDelete(
      req.body.collectionId
    );
    const deletedCards = await Card.find({
      parent_collection: req.body.collectionId,
    });
    deletedCards.map(async (value, index) => {
      const deletedCard = await Card.find({
        _id: value._id,
      }).deleteOne();
    });
    res.send({ deletedCollection, deletedCards });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/update/info", verify, async (req, res) => {
  const collection = await Collection.findById(req.body._id);
  collection.title = req.body.title;
  collection.description = req.body.description;
  try {
    const EditedCollection = await collection.save();
    res.send(EditedCollection);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
    return;
  }
});

router.post("/update/cards", verify, async (req, res) => {
  var savedCards = [];
  req.body.questions.map(async (value, index) => {
    if (value._id) {
      const card = await Card.findById(value._id);
      card.question = value.question;
      card.answer = value.answer;
      try {
        const savedCard = await card.save();
        savedCards.push(savedCard);
      } catch (err) {
        res.status(400).send(err);
        return;
      }
    } else {
      const card = new Card({
        question: value.question,
        answer: value.answer,
        parent_collection: req.body._id,
      });
      try {
        const savedCard = await card.save();
        savedCards.push(savedCard);
      } catch (err) {
        console.log(err);
        res
          .status(400)
          .send(JSON.stringify({ message: `question # &{index} error!` }));
        return;
      }
    }
  });
  const deletedCards = [];
  req.body.delete.map(async (value, index) => {
    try {
      const deletedCard = await Card.findByIdAndDelete(value._id);
      deletedCards.push(deletedCard);
    } catch (err) {
      res.status(400).send({ message: "Error while deleting cards" });
      return;
    }
  });
  res.send({ savedCards, deletedCards });
});

module.exports = router;
