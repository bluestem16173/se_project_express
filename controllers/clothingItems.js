const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingitem");
const BadRequestError = require("../utils/errors/BadRequestError");
const NotFoundError = require("../utils/errors/NotFoundError");
const ForbiddenError = require("../utils/errors/ForbiddenError");

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
    return next(new BadRequestError("Invalid item id"));
  }

  return ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        return next(new NotFoundError("Clothing item not found"));
      }
      return res.send(item);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item id"));
      }
      return next(err);
    });
};

// POST /items — create clothing item
const createClothingItem = (req, res, next) => {
  const {
    name,
    weather,
    imageUrl,
  } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data"));
      }

      return next(err);
    });
};

// DELETE /items/:itemId — delete item by id
const deleteClothingItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return next(new BadRequestError("Invalid item id"));
  }

  return ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        return next(new NotFoundError("Item not found"));
      }

      if (String(item.owner) !== String(req.user._id)) {
        return next(new ForbiddenError("You are not authorized to delete this item"));
      }

      return item.deleteOne()
        .then(() => res.send({ message: "Item deleted" }));
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item id"));
      }
      return next(err);
    });
};
// PUT /items/:itemId/likes — like an item
const likeClothingItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return next(new BadRequestError("Invalid item id"));
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } }, // add only if not already there
    { new: true } // return updated document
  )
    .then((item) => {
      if (!item) {
        return next(new NotFoundError("Item not found"));
      }
      return res.send(item);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item id"));
      }
      return next(err);
    });
};

// DELETE /items/:itemId/likes — unlike an item
const unlikeClothingItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return next(new BadRequestError("Invalid item id"));
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } }, // remove user id from likes
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return next(new NotFoundError("Clothing item not found"));
      }
      return res.send(item);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item id"));
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
