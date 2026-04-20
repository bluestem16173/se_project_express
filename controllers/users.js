
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const BadRequestError = require("../utils/errors/BadRequestError");
const NotFoundError = require("../utils/errors/NotFoundError");
const ConflictError = require("../utils/errors/ConflictError");
const UnauthorizedError = require("../utils/errors/UnauthorizedError");

const { JWT_SECRET = "super-strong-secret" } = process.env;

// GET /users/me
const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError("User not found"));
      }
      return res.send(user);
    })
    .catch(next);
};

// POST /users (signup)
const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Email and password are required"));
  }
  return User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return next(
          new ConflictError("User from this email already exists")
        );
      }
      return bcrypt
        .hash(password, 10)
        .then((hashedPassword) =>
          User.create({
            name,
            avatar,
            email,
            password: hashedPassword,
          })
        )
        .then((user) => {
          const userObj = user.toObject();
          delete userObj.password;
          res.status(201).send(userObj);
        })
        .catch((err) => {
          if (err.name === "ValidationError") {
            return next(new BadRequestError("Invalid data"));
          }
          if (err.code === 11000) {
            return next(new ConflictError("User from this email already exists"));
          }
          return next(err);
        });
    })
    .catch(next);
};

// POST /login (signin)
const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Email and password are required"));
  }

  return User.findOne({ email }).select("+password")
    .then((user) => {
      if (!user) {
        // Return 401 Unauthorized for incorrect email / password
        return next(new UnauthorizedError("Incorrect email or password"));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return next(new UnauthorizedError("Incorrect email or password"));
        }

        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });

        return res.send({ token });
      });
    })
    .catch(next);
};

// PATCH /users/me
const updateUser = (req, res, next) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return next(new NotFoundError("User not found"));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        return next(new BadRequestError("Invalid data"));
      }
      return next(err);
    });
};

module.exports = {
  getCurrentUser,
  createUser,
  login,
  updateUser,
};
