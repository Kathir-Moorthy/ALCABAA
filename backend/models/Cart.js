const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  version: { type: String, required: true },
  offerPrice: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
});

const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, // Firebase UID
  items: [cartItemSchema],
  totalCost: { type: Number, default: 0 },
});

module.exports = mongoose.model("Cart", cartSchema);