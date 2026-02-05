const mongoose = require("mongoose");
const User = require("../models/user");

// GET /users
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

// GET /users/:userId
const getUserById = (req, res, next) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).send({ message: "Invalid data" });
  }

  return User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid data" });
      }
      return next(err);
    });
};

// POST /users
const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: "Invalid data" });
      }

      return res.status(500).send({ message: "An error has occurred on the server" });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
};
