const ClothingItem = require("../models/clothingitem");

// GET /items — get all clothing items
const getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch(() => res.status(500).send({ message: "Server error" }));
};

// GET /items/:itemId — get item by id
const getClothingItemById = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Clothing item not found" });
      }
      return res.send(item);
    })
    .catch(() => res.status(400).send({ message: "Invalid item ID" }));
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
    .catch((err) => res.status(400).send({ message: err.message }));
};

// DELETE /items/:itemId — delete item by id
const deleteClothingItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Clothing item not found" });
      }
      return res.send(item);
    })
    .catch(() => res.status(400).send({ message: "Invalid item ID" }));
};
// PUT /items/:itemId/likes — like an item
const likeClothingItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } }, // add only if not already there
    { new: true } // return updated document
  )
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Clothing item not found" });
      }
      return res.send(item);
    })
    .catch(() => res.status(400).send({ message: "Invalid item ID" }));
};

// DELETE /items/:itemId/likes — unlike an item
const unlikeClothingItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
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
    .catch(() => res.status(400).send({ message: "Invalid item ID" }));
};

module.exports = {
  getClothingItems,
  getClothingItemById,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  unlikeClothingItem
};
