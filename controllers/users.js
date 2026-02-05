const User = require("../models/user");

// GET /users
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: "Server error" }));
};

// GET /users/:userId
const getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      res.send(user);
    })
    .catch(() => res.status(400).send({ message: "Invalid user ID" }));
};

// POST /users
const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => res.status(400).send({ message: err.message }));
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
};
