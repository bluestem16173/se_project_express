const router = require("express").Router();
const {
  getUsers,
  getUserById,
  createUser,
} = require("../controllers/users");

// ✅ FIX: ping FIRST
router.get("/ping", (req, res) => {
  res.send({ message: "users router is working" });
});

// GET /users
router.get("/", getUsers);

// ❗ dynamic param LAST
router.get("/:userId", getUserById);

// POST /users
router.post("/", createUser);

module.exports = router;
