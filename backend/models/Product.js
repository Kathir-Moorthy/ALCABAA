const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  subCategory: { type: String },
  versions: [
    {
      version: { type: String },
      initialPrice: { type: Number },
      offerPrice: { type: Number },
    },
  ],
  rating: { type: Number },
  reviews: { type: Number },
  description: { type: String },
  image: { type: String, required: true }, // Cloudinary image URL
  imagePublicId: { type: String, required: true }, // Cloudinary image public ID for deletion
});

module.exports = mongoose.model("Product", productSchema);