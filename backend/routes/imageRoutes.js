const express = require("express");
const upload = require("../config/multer");
const {
  uploadImage,
  getImages,
  deleteImage,
  updateOrder,
} = require("../controllers/imageController");

const router = express.Router();

router.post("/upload", upload.single("image"), uploadImage);
router.get("/", getImages);
router.delete("/:id", deleteImage);
router.put("/order", updateOrder);

module.exports = router;