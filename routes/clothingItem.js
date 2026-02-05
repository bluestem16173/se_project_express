const router = require("express").Router();
const {
  getClothingItems,
  getClothingItemById,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  unlikeClothingItem,
} = require("../controllers/clothingItems");

// ✅ FIX: ping FIRST
router.get("/ping", (req, res) => {
  res.send({ message: "clothing items router is working" });
});

// GET /items
router.get("/", getClothingItems);

// POST /items
router.post("/", createClothingItem);

// Like / Unlike must come BEFORE "/:itemId"
router.put("/:itemId/likes", likeClothingItem);
router.delete("/:itemId/likes", unlikeClothingItem);

// ❗ dynamic param LAST
router.get("/:itemId", getClothingItemById);
router.delete("/:itemId", deleteClothingItem);


module.exports = router;
