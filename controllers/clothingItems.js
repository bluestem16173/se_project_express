const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingitem");

// GET /items — get all clothing items
const getClothingItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch(next);
};

// GET /items/:itemId — get item by id
const getClothingItemById = (req, res, next) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(400).send({ message: "Invalid item id" });
  }

  return ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Clothing item not found" });
      }
      return res.send(item);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid item id" });
      }
      return next(err);
    });
};

// POST /items — create clothing item
const createClothingItem = (req, res) => {
  const {
    name,
    weather,
    imageUrl,
  } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: "Invalid data" });
      }

      return res.status(500).send({ message: "An error has occurred on the server" });
    });
};

// DELETE /items/:itemId — delete item by id
const deleteClothingItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(400).send({ message: "Invalid item id" });
  }

  return ClothingItem.findByIdAndDelete(itemId)
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }
      return res.send({ message: "Item deleted" });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid item id" });
      }
      return next(err);
    });
};
// PUT /items/:itemId/likes — like an item
const likeClothingItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(400).send({ message: "Invalid item id" });
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } }, // add only if not already there
    { new: true } // return updated document
  )
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }
      return res.send(item);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid item id" });
      }
      return next(err);
    });
};

// DELETE /items/:itemId/likes — unlike an item
const unlikeClothingItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(400).send({ message: "Invalid item id" });
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } }, // remove user id from likes
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Clothing item not found" });
      }
      return res.send(item);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid item id" });
      }

      return next(err);
    });
};

module.exports = {
  getClothingItems,
  getClothingItemById,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  unlikeClothingItem
};
