const express = require("express");
const upload = require("../config/multer");
const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const router = express.Router();

router.post("/create", upload.single("image"), createProduct);
router.get("/", getProducts);
router.put("/:id", upload.single("image"), updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;