const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  getCurrentUser,
  updateUser,
} = require("../controllers/users");

// Protect all user routes
router.use(auth);

// ✅ FIX: ping FIRST
router.get("/ping", (req, res) => {
  res.send({ message: "users router is working" });
});

// GET /users/me
router.get("/me", getCurrentUser);

// PATCH /users/me
router.patch("/me", updateUser);

module.exports = router;
