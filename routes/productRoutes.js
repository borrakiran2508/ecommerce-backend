const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware");
const {authorizeRoles} = require("../middleware/roleMiddleware");

router.get("/", getAllProducts);
router.get("/:id", getProductById);

router.post("/", protect, authorizeRoles("seller", "admin"), createProduct);
router.put("/:id", protect, authorizeRoles("seller", "admin"), updateProduct);
router.delete("/:id", protect, authorizeRoles("seller", "admin"), deleteProduct);

module.exports = router;